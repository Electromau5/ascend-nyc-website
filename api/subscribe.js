/* =====================================================================
   Ascend NYC — subscribe endpoint (Vercel serverless function)
   ---------------------------------------------------------------------
   Receives { email, company, industry, source } from the website forms
   (hero "Join the Community" + "Request an Invite") and stores each
   signup as a row in our own Postgres database.

   Nothing is sent to any third-party email service — the data lives in
   the project's own database and is only readable through the
   password-protected /admin page (see api/emails.js).

   Duplicate emails are merged: re-submitting the same address keeps the
   original signup date and fills in any company/industry that was blank.
   ===================================================================== */
import {getPool, ensureSchema} from '../lib/db.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({error: 'Method not allowed'})
  }

  // Body may arrive parsed (Vercel) or as a raw string.
  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const {email, company, industry, source} = body || {}

  if (!email || !EMAIL_RE.test(String(email))) {
    return res.status(400).json({error: 'A valid email is required'})
  }

  const cleanEmail = String(email).trim().toLowerCase()
  const cleanCompany = company ? String(company).trim() : null
  const cleanIndustry = industry ? String(industry).trim() : null
  const cleanSource = source ? String(source).trim() : 'website'

  try {
    await ensureSchema()
    const pool = getPool()
    await pool.sql`
      INSERT INTO subscribers (email, company, industry, source)
      VALUES (${cleanEmail}, ${cleanCompany}, ${cleanIndustry}, ${cleanSource})
      ON CONFLICT (email) DO UPDATE SET
        company  = COALESCE(EXCLUDED.company,  subscribers.company),
        industry = COALESCE(EXCLUDED.industry, subscribers.industry)
    `
    return res.status(200).json({ok: true})
  } catch (err) {
    console.error('subscribe handler error', err)
    return res.status(500).json({error: 'Could not save email'})
  }
}
