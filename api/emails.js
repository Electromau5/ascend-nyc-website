/* =====================================================================
   Ascend NYC — admin email list endpoint (Vercel serverless function)
   ---------------------------------------------------------------------
   Returns every stored subscriber, but ONLY when the request carries the
   correct admin password. The password is checked here on the server and
   compared against the ADMIN_PASSWORD env var — it is never shipped to
   the browser, so the email list cannot be read without it.

   Used by /admin (admin.html). POST { password } → { subscribers: [...] }.
   ===================================================================== */
import crypto from 'crypto'
import {getPool, ensureSchema} from '../lib/db.js'

// Constant-time comparison so the password can't be guessed by timing.
function safeEqual(a, b) {
  const ab = Buffer.from(String(a))
  const bb = Buffer.from(String(b))
  if (ab.length !== bb.length) return false
  return crypto.timingSafeEqual(ab, bb)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({error: 'Method not allowed'})
  }

  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    return res.status(500).json({error: 'Admin access is not configured'})
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      body = {}
    }
  }
  const password = (body && body.password) || req.headers['x-admin-password']

  if (!password || !safeEqual(password, expected)) {
    return res.status(401).json({error: 'Incorrect password'})
  }

  try {
    await ensureSchema()
    const pool = getPool()
    const {rows} = await pool.sql`
      SELECT email, company, industry, source, created_at
      FROM subscribers
      ORDER BY created_at DESC
    `
    return res.status(200).json({ok: true, count: rows.length, subscribers: rows})
  } catch (err) {
    console.error('emails handler error', err)
    return res.status(500).json({error: 'Could not load emails'})
  }
}
