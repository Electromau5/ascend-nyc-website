/* =====================================================================
   Ascend NYC — internal email database (Vercel Postgres)
   ---------------------------------------------------------------------
   Shared helper for the serverless API routes. Holds the connection
   pool and the table definition in one place so /api/subscribe (writes)
   and /api/emails (reads) always agree on the schema.

   Connection string comes from the env var that Vercel injects when you
   attach a Postgres store to the project (Storage → Create → Postgres):
     POSTGRES_URL          (primary, set automatically)
     DATABASE_URL          (fallback some integrations use)
   Never hard-code credentials here.
   ===================================================================== */
import {createPool} from '@vercel/postgres'

let _pool

export function getPool() {
  if (!_pool) {
    const connectionString =
      process.env.POSTGRES_URL ||
      process.env.DATABASE_URL ||
      process.env.POSTGRES_PRISMA_URL
    if (!connectionString) {
      throw new Error('No Postgres connection string set (POSTGRES_URL).')
    }
    _pool = createPool({connectionString})
  }
  return _pool
}

let _ensured
// Creates the subscribers table on first use. Idempotent (IF NOT EXISTS),
// so it is safe to call on every request.
export async function ensureSchema() {
  if (_ensured) return
  const pool = getPool()
  await pool.sql`
    CREATE TABLE IF NOT EXISTS subscribers (
      id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      email       TEXT NOT NULL UNIQUE,
      company     TEXT,
      industry    TEXT,
      source      TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `
  _ensured = true
}
