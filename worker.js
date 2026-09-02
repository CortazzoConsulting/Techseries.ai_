// TechSeries.ai — Cloudflare Worker
// Handles email subscriptions via Resend API

// RESEND_API_KEY is provided as a Cloudflare secret and read from `env` per request.
// Set it once with:  wrangler secret put RESEND_API_KEY
const FROM_EMAIL = 'hello@techseries.ai';
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

    // ── 3. Notify Ethan ──
    await fetch('https://api.resend.com/emails', {
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

    return json({ success: true, message: 'Subscribed successfully' });

  } catch (err) {
    console.error(err);
    return json({ error: 'Something went wrong' }, 500);
  }
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
        Autonomous Business Systems
      </div>
      <div style="font-size:13px;color:#888;margin-bottom:16px;">
        From Automation to AI Agents<br>
        📅 October 22, 2026 · 5:00–7:30 PM<br>
        📍 Life Time Work Sandy Springs · Free Admission
      </div>
      <a href="https://app.getnetworked.com/event/-autonomous-business-systems-from-automation-to-ai-agents"
         style="display:inline-block;background:#e8192c;color:#ffffff;text-decoration:none;
                padding:12px 24px;border-radius:6px;font-weight:700;font-size:13px;">
        Register Free →
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
