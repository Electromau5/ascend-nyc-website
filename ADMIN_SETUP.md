# Ascend NYC — Email capture + Admin (setup)

Every email submitted on the site is stored in our **own Postgres database**
(hosted inside the Vercel project — no third-party email service). View and
export the list at **`/admin`**, behind a password.

```
website form  →  /api/subscribe  →  Postgres (subscribers table)
                                          │
                 /admin (password)  →  /api/emails  →  reads the table
```

Files involved:
- `api/subscribe.js` — saves each signup (dedupes by email)
- `api/emails.js` — password-checked read endpoint for the admin page
- `admin.html` — the `/admin` dashboard (table + search + CSV export)
- `lib/db.js` — DB connection + table definition
- `vercel.json` — routes `/admin` → `admin.html`
- `package.json` — declares the `@vercel/postgres` dependency

---

## One-time setup (~5 min, in the Vercel dashboard)

### 1. Create the database
Vercel project → **Storage** → **Create Database** → **Postgres** → pick a
region → **Create**, then **Connect** it to this project.

This automatically adds the `POSTGRES_URL` connection env var to the project.
The `subscribers` table is created automatically on the first signup — nothing
to run by hand.

### 2. Set the admin password
Vercel project → **Settings** → **Environment Variables** → add:

| Name             | Value                          | Environments |
| ---------------- | ------------------------------ | ------------ |
| `ADMIN_PASSWORD` | *(a strong password you pick)* | Production (and Preview if you want) |

### 3. Redeploy
Deploy (or push to the connected Git branch). Vercel installs
`@vercel/postgres` and the API routes go live.

---

## Using it
- Go to `https://<your-domain>/admin`
- Enter `ADMIN_PASSWORD`
- See every subscriber, search, and **Export CSV**

The password is verified on the server (`api/emails.js`); the email list is
never sent to the browser until the correct password is provided.

## Notes
- **Local dev:** run `vercel dev` (so the `/api` routes execute) and either
  attach the Postgres store with `vercel env pull`, or test against the
  deployed Preview. Opening `index.html` directly won't hit the API.
- To pause saving while demoing without a database, set
  `SUBSCRIBE_ENABLED = false` at the top of `main.js`.
- Change the password anytime by editing the `ADMIN_PASSWORD` env var and
  redeploying.
