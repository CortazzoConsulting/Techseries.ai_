/**
 * /executive-summit — serves the single-page app with summit-specific metadata.
 *
 * Why a Function instead of a second HTML file: index.html stays the one source of
 * truth. This rewrites <title>, the OG/Twitter tags and the canonical link on the fly
 * for this URL only, so LinkedIn, Facebook and iMessage show a summit card while the
 * site keeps its single-file architecture. Nothing is duplicated, so nothing can drift.
 *
 * Note: crawlers cannot read data: URIs, so og:image must point at a real file
 * (/og-summit.jpg). The site-wide og:image is still a data URI and does not render.
 */
const META = {
  title: 'AI Executive Summit 2027 Outlook | Atlanta | Tech Series AI',
  description:
    "Join Tech Series AI's flagship Executive Summit in Atlanta on December 9, 2026. " +
    'Discover AI business strategies, real-world innovation, and executive networking.',
  url: 'https://techseries.ai/executive-summit',
  image: 'https://techseries.ai/og-summit.jpg',
};

export async function onRequest(context) {
  const origin = new URL(context.request.url).origin;
  const asset = await context.env.ASSETS.fetch(origin + '/index.html');
  const html = new Response(asset.body, asset);

  return new HTMLRewriter()
    .on('title', { element: (e) => e.setInnerContent(META.title) })
    .on('meta', {
      element(e) {
        const key = e.getAttribute('property') || e.getAttribute('name');
        if (!key) return;
        if (key === 'og:title' || key === 'twitter:title') e.setAttribute('content', META.title);
        else if (key === 'og:description' || key === 'twitter:description' || key === 'description')
          e.setAttribute('content', META.description);
        else if (key === 'og:image' || key === 'twitter:image') e.setAttribute('content', META.image);
        else if (key === 'og:url' || key === 'twitter:url') e.setAttribute('content', META.url);
      },
    })
    .on('link[rel="canonical"]', { element: (e) => e.setAttribute('href', META.url) })
    .transform(html);
}
