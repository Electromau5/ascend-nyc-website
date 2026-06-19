/* =====================================================================
   Ascend NYC — beehiiv subscribe proxy (Vercel serverless function)
   ---------------------------------------------------------------------
   Receives { email, company, industry, source } from the website forms
   and creates a subscriber in beehiiv. The API key lives ONLY here, in
   an environment variable — never in the browser.

   Required env vars (set in Vercel → Project → Settings → Environment
   Variables, NOT in code):
     BEEHIIV_API_KEY         your beehiiv API key
     BEEHIIV_PUBLICATION_ID  e.g. "pub_xxxxxxxx"

   "company" and "industry" map to beehiiv Custom Fields. Create those
   two custom fields in beehiiv first (Settings → Custom Fields), named
   exactly "Company" and "Industry", or the values are ignored.
   ===================================================================== */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    return res.status(500).json({ error: 'Subscribe service not configured' });
  }

  // Body may arrive parsed (Vercel) or as a raw string.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const { email, company, industry, source } = body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
    return res.status(400).json({ error: 'A valid email is required' });
  }

  const customFields = [];
  if (company)  customFields.push({ name: 'Company', value: String(company) });
  if (industry) customFields.push({ name: 'Industry', value: String(industry) });

  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: String(email).trim(),
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: source || 'website',
          custom_fields: customFields,
        }),
      }
    );

    if (!beehiivRes.ok) {
      const detail = await beehiivRes.text().catch(() => '');
      console.error('beehiiv error', beehiivRes.status, detail);
      return res.status(502).json({ error: 'Subscription provider rejected the request' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe handler error', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
