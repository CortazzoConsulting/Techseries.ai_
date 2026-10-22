// TechSeries.ai — Cloudflare Worker
// Handles email subscriptions via Resend API

// RESEND_API_KEY is provided as a Cloudflare secret and read from `env` per request.
// Set it once with:  wrangler secret put RESEND_API_KEY
const FROM_EMAIL = 'ethan@techseries.ai';
const FROM_NAME = 'TechSeries.ai';

// ── CORS headers ──
const CORS = {
  'Access-Control-Allow-Origin': 'https://techseries.ai',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);

    // ── POST /subscribe ──
    if (request.method === 'POST' && url.pathname === '/subscribe') {
      return handleSubscribe(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/speaker') {
      return handleIntake(request, env, 'speaker');
    }

    if (request.method === 'POST' && url.pathname === '/sponsor') {
      return handleIntake(request, env, 'sponsor');
    }

    return new Response('Not found', { status: 404 });
  }
};

async function handleSubscribe(request, env) {
  const RESEND_API_KEY = env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY secret is not set on this Worker');
    return json({ error: 'Email service is not configured' }, 500);
  }

  try {
    const body = await request.json();
    const { email, name = '', source = 'website' } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return json({ error: 'Valid email required' }, 400);
    }

    // ── 1. Add to Resend audience ──
    const audienceRes = await fetch('https://api.resend.com/audiences', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}` }
    });
    const audienceData = await audienceRes.json();

    // Get first audience or create one
    let audienceId;
    if (audienceData.data && audienceData.data.length > 0) {
      audienceId = audienceData.data[0].id;
    } else {
      // Create audience
      const createRes = await fetch('https://api.resend.com/audiences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'TechSeries.ai Community' })
      });
      const created = await createRes.json();
      audienceId = created.id;
    }

    // Add contact to audience
    const contactRes = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        first_name: name.split(' ')[0] || '',
        last_name: name.split(' ').slice(1).join(' ') || '',
        unsubscribed: false
      })
    });

    const contactData = await contactRes.json();
    if (!contactRes.ok && contactData.name !== 'validation_error') {
      console.error('Contact error:', contactData);
    }

    // ── 2. Send welcome email ──
    const welcomeRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: [email],
        subject: "You're in — TechSeries.ai 2026 Series",
        html: welcomeEmailHTML(name || 'there')
      })
    });

    const welcomeData = await welcomeRes.json();

    // Resend rejects sends for unverified domains, bad keys and sandbox-sender
    // restrictions. Surface that instead of reporting a success that never happened.
    if (!welcomeRes.ok) {
      console.error('Resend rejected the welcome email:', welcomeRes.status, JSON.stringify(welcomeData));
      return json({
        error: 'We could not send your welcome email. Please try again.',
        resend: { status: welcomeRes.status, message: welcomeData.message || welcomeData.name || null }
      }, 502);
    }

    // ── 3. Notify Ethan — a failure here must not fail the subscriber ──
    const notifyRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: ['ethan@techseries.ai'],
        subject: `New subscriber: ${email}`,
        html: `<p>New subscriber from <strong>${source}</strong>:</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Name:</strong> ${name || 'Not provided'}</p>`
      })
    });

    if (!notifyRes.ok) {
      const notifyData = await notifyRes.json().catch(() => ({}));
      console.error('Resend rejected the notification email:', notifyRes.status, JSON.stringify(notifyData));
    }

    return json({
      success: true,
      message: 'Subscribed successfully',
      id: welcomeData.id || null
    });

  } catch (err) {
    console.error(err);
    return json({ error: 'Something went wrong' }, 500);
  }
}

/**
 * Speaker and sponsor intake. Sends a branded confirmation to the applicant and
 * a notification to the team. A failed confirmation is reported; a failed
 * notification is logged but never fails the submission for the applicant.
 */
async function handleIntake(request, env, kind) {
  const RESEND_API_KEY = env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY secret is not set on this Worker');
    return json({ error: 'Our form is temporarily unavailable. Please email ethan@techseries.ai.' }, 500);
  }

  try {
    const body = await request.json();
    const firstName = String(body.firstName || '').trim();
    const lastName  = String(body.lastName  || '').trim();
    const email     = String(body.email     || '').trim();
    const company   = String(body.company   || '').trim();
    const interest  = String(body.interest  || '').trim();
    const message   = String(body.message   || '').trim();

    if (!firstName || !email || !email.includes('@')) {
      return json({ error: 'Please include your first name and a valid email address.' }, 400);
    }

    const isSpeaker = kind === 'speaker';
    const label = isSpeaker ? 'Speaker application' : 'Sponsorship inquiry';

    const confirmRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        reply_to: 'ethan@techseries.ai',
        to: [email],
        subject: isSpeaker
          ? 'Thanks for applying to speak — TechSeries.ai'
          : 'Thanks for your interest in sponsoring — TechSeries.ai',
        html: intakeEmailHTML(firstName, kind)
      })
    });
    const confirmData = await confirmRes.json();
    if (!confirmRes.ok) {
      console.error('Resend rejected the confirmation email:', confirmRes.status, JSON.stringify(confirmData));
      return json({
        error: 'We could not send your confirmation email. Please email ethan@techseries.ai.',
        resend: { status: confirmRes.status, message: confirmData.message || confirmData.name || null }
      }, 502);
    }

    const rows = [
      ['Name', `${firstName} ${lastName}`.trim()],
      ['Email', email],
      ['Company', company],
      ['Interested in', interest],
      ['Message', message]
    ].filter(function (r) { return r[1]; })
     .map(function (r) { return `<p><strong>${r[0]}:</strong> ${esc(r[1])}</p>`; })
     .join('');

    const notifyRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        reply_to: email,
        to: ['ethan@techseries.ai'],
        subject: `${label}: ${firstName} ${lastName}`.trim(),
        html: `<h2>${label}</h2>${rows}`
      })
    });
    if (!notifyRes.ok) {
      const notifyData = await notifyRes.json().catch(function () { return {}; });
      console.error('Resend rejected the notification email:', notifyRes.status, JSON.stringify(notifyData));
    }

    return json({ success: true, message: 'Submitted successfully', id: confirmData.id || null });

  } catch (err) {
    console.error(err);
    return json({ error: 'Something went wrong. Please email ethan@techseries.ai.' }, 500);
  }
}

// Submitted values are echoed into the notification email — escape them.
function esc(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' }
  });
}

function welcomeEmailHTML(firstName) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to TechSeries.ai</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;">
      <div style="font-size:32px;font-weight:900;color:#ffffff;letter-spacing:-1px;">
        TECH<span style="color:#1a3aff;">SERIES</span>.AI
      </div>
      <div style="font-size:11px;color:#666;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">
        Atlanta's AI Business Event Series
      </div>
    </div>

    <!-- Main card -->
    <div style="background:#111;border:1px solid #1a3aff33;border-radius:12px;padding:36px;margin-bottom:24px;">
      <div style="font-size:11px;color:#1a3aff;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px;">
        You're In
      </div>
      <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0 0 16px;">
        Welcome to TechSeries.ai, ${firstName}.
      </h1>
      <p style="color:#888;font-size:15px;line-height:1.7;margin:0 0 24px;">
        You're now connected to Atlanta's premier AI business event series — 
        curated evenings for founders, executives, and operators who are 
        actually building with AI.
      </p>
      <p style="color:#888;font-size:15px;line-height:1.7;margin:0 0 28px;">
        We'll keep you updated on upcoming events, speaker announcements, 
        and community highlights. No fluff. All execution.
      </p>
      <a href="https://techseries.ai" 
         style="display:inline-block;background:#1a3aff;color:#ffffff;text-decoration:none;
                padding:14px 28px;border-radius:6px;font-weight:700;font-size:14px;">
        View the 2026 Series →
      </a>
    </div>

    <!-- Next event -->
    <div style="background:#111;border:1px solid #e8192c33;border-radius:12px;padding:28px;margin-bottom:24px;">
      <div style="font-size:11px;color:#e8192c;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">
        ⚡ Next Event
      </div>
      <div style="font-size:20px;font-weight:900;color:#ffffff;margin-bottom:6px;">
        AI in Real Estate: From Leads to Deals
      </div>
      <div style="font-size:13px;color:#888;margin-bottom:16px;">
        How AI Agents &amp; Automation Are Reshaping Real Estate<br>
        📅 October 22, 2026 · 5:00–8:30 PM<br>
        📍 Life Time Work Sandy Springs<br>
        🎟 Early Bird $20 through Oct 12 · General Admission $30
      </div>
      <a href="https://app.getnetworked.com/event/-autonomous-business-systems-from-automation-to-ai-agents"
         style="display:inline-block;background:#e8192c;color:#ffffff;text-decoration:none;
                padding:12px 24px;border-radius:6px;font-weight:700;font-size:13px;">
        Get Tickets →
      </a>
    </div>

    <!-- Stats -->
    <div style="display:flex;gap:12px;margin-bottom:24px;">
      <div style="flex:1;background:#111;border:1px solid #222;border-radius:10px;padding:20px;text-align:center;">
        <div style="font-size:24px;font-weight:900;color:#ffffff;">800+</div>
        <div style="font-size:11px;color:#666;margin-top:4px;">Registrations</div>
      </div>
      <div style="flex:1;background:#111;border:1px solid #222;border-radius:10px;padding:20px;text-align:center;">
        <div style="font-size:24px;font-weight:900;color:#ffffff;">5</div>
        <div style="font-size:11px;color:#666;margin-top:4px;">Events in 2026</div>
      </div>
      <div style="flex:1;background:#111;border:1px solid #222;border-radius:10px;padding:20px;text-align:center;">
        <div style="font-size:24px;font-weight:900;color:#ffffff;">20+</div>
        <div style="font-size:11px;color:#666;margin-top:4px;">Speakers</div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid #1a1a2e;">
      <p style="color:#444;font-size:12px;margin:0 0 8px;">
        Powered by <a href="https://app.getnetworked.com/techseries.ai" style="color:#1a3aff;text-decoration:none;">Getnetworked</a> 
        · Life Time Work Sandy Springs · Atlanta, GA
      </p>
      <p style="color:#333;font-size:11px;margin:0;">
        You're receiving this because you subscribed at techseries.ai.<br>
        <a href="https://techseries.ai" style="color:#444;">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

function intakeEmailHTML(firstName, kind) {
  const isSpeaker = kind === 'speaker';
  const accent  = isSpeaker ? '#1a3aff' : '#c9a227';
  const eyebrow = isSpeaker ? 'Application Received' : 'Inquiry Received';
  const headline = isSpeaker ? 'You&rsquo;re on our radar.' : 'Let&rsquo;s build something together.';
  const intro = isSpeaker
    ? 'Thanks for applying to speak at Tech Series. We read every application ourselves &mdash; no auto-filter &mdash; and we&rsquo;ll follow up personally about fit, format, and which date makes sense.'
    : 'Thanks for your interest in partnering with Tech Series. We&rsquo;ll follow up personally to walk through packages, availability, and what actually makes sense for your goals.';
  const steps = isSpeaker
    ? [['01','We review','Our team reads your application and looks at topic fit for upcoming programs.'],
       ['02','We reach out','If there&rsquo;s a fit, we&rsquo;ll email you to talk through the session and format.'],
       ['03','We lock it in','Confirmed speakers get promotion across the series, the site, and the recap.']]
    : [['01','We review','Our team looks at your goals and which rooms put you in front of the right people.'],
       ['02','We reach out','You get tiers, booth options, and what&rsquo;s still available &mdash; not a generic deck.'],
       ['03','You go live','Logo on the flyer, booth staged, tickets issued, lead list delivered after.']];
  const proof = isSpeaker
    ? [['800+','Registrations'],['300+','In-Person'],['20+','Speakers']]
    : [['800+','Registrations'],['300+','In-Person'],['108K+','Organic Reach']];

  const stepRows = steps.map(function (st) {
    return '<tr>'
      + '<td width="44" valign="top" style="padding:0 0 18px;font-family:Courier New,Courier,monospace;font-size:12px;letter-spacing:2px;color:' + accent + ';">' + st[0] + '</td>'
      + '<td valign="top" style="padding:0 0 18px;">'
      +   '<div style="font-size:15px;font-weight:700;color:#ffffff;margin-bottom:3px;">' + st[1] + '</div>'
      +   '<div style="font-size:13px;line-height:1.6;color:#8a8a99;">' + st[2] + '</div>'
      + '</td></tr>';
  }).join('');

  const proofCells = proof.map(function (p) {
    return '<td width="32%" align="center" style="padding:14px 6px;background:#111118;border:1px solid #1e1e2a;border-radius:8px;">'
      + '<div style="font-size:22px;font-weight:900;color:#ffffff;">' + p[0] + '</div>'
      + '<div style="font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#6a6a7a;margin-top:3px;">' + p[1] + '</div></td>';
  }).join('<td width="10">&nbsp;</td>');

  const preheader = isSpeaker
    ? 'We received your speaker application &mdash; here&rsquo;s what happens next.'
    : 'We received your sponsorship inquiry &mdash; here&rsquo;s what happens next.';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="color-scheme" content="dark">
<title>TechSeries.ai</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0f;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0a0a0f;">
<tr><td align="center" style="padding:36px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;font-family:Arial,Helvetica,sans-serif;">

<tr><td align="center" style="padding-bottom:30px;">
  <div style="font-size:27px;font-weight:900;color:#ffffff;letter-spacing:-.5px;">TECH<span style="color:#1a3aff;">SERIES</span>.AI</div>
  <div style="font-family:Courier New,Courier,monospace;font-size:10px;color:#6a6a7a;letter-spacing:3px;text-transform:uppercase;margin-top:7px;">Atlanta&rsquo;s AI Business Event Series</div>
</td></tr>

<tr><td style="background:#111118;border:1px solid ${accent}44;border-radius:14px;padding:34px 30px;">
  <div style="font-family:Courier New,Courier,monospace;font-size:10px;color:${accent};letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;">${eyebrow}</div>
  <div style="font-size:27px;font-weight:900;color:#ffffff;line-height:1.2;margin-bottom:14px;">${headline}</div>
  <div style="font-size:15px;line-height:1.75;color:#9a9aa8;">Hi ${firstName} &mdash; ${intro}</div>
</td></tr>

<tr><td style="padding:28px 4px 8px;">
  <div style="font-family:Courier New,Courier,monospace;font-size:10px;color:#6a6a7a;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px;">What happens next</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${stepRows}</table>
</td></tr>

<tr><td style="padding:6px 0 24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${proofCells}</tr></table>
</td></tr>

<tr><td style="background:#111118;border:1px solid #c9a22744;border-radius:14px;padding:26px 30px;">
  <div style="font-family:Courier New,Courier,monospace;font-size:10px;color:#c9a227;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;">&#9733; Year-End Flagship</div>
  <div style="font-size:22px;font-weight:900;color:#ffffff;margin-bottom:4px;">Atlanta AI Day</div>
  <div style="font-size:14px;color:#c9a227;margin-bottom:12px;">The State of AI &mdash; Now &amp; Next</div>
  <div style="font-size:13px;line-height:1.75;color:#8a8a99;">
    Thursday, December 10, 2026 &middot; 9:00 AM&ndash;6:00 PM<br>
    Life Time Work Sandy Springs &middot; Atlanta, GA<br>
    One city. Every AI community. One day.
  </div>
  <div style="margin-top:18px;">
    <a href="https://techseries.ai/atlanta-ai-day/" style="display:inline-block;background:#c9a227;color:#0a0a0f;text-decoration:none;padding:12px 26px;border-radius:6px;font-weight:700;font-size:13px;">See the full day &rarr;</a>
  </div>
</td></tr>

<tr><td align="center" style="padding:28px 10px 0;">
  <div style="font-size:13px;line-height:1.7;color:#6a6a7a;">Questions? Just reply to this email &mdash; it reaches us directly.</div>
</td></tr>

<tr><td style="padding-top:22px;border-top:1px solid #1a1a2e;">
  <div align="center" style="font-family:Courier New,Courier,monospace;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:#4a4a58;padding-top:18px;">
    Powered by <a href="https://app.getnetworked.com/techseries.ai" style="color:#1a3aff;text-decoration:none;">Getnetworked</a> &middot; Atlanta, GA
  </div>
  <div align="center" style="font-size:11px;color:#3a3a46;margin-top:8px;">You received this because you submitted a form at techseries.ai.</div>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}
