# Ascend NYC — Events CMS Setup (Sanity)

This connects the website's **Past Events** and **Upcoming Events** sections to a
[Sanity](https://www.sanity.io) headless CMS. After setup, you add an event in the
Sanity editor, hit **Publish**, and it appears on the live site automatically — no
code, no redeploy.

Already wired up in this repo:
- `sanity/schemas/event.js` — the event content model (the editor form fields)
- `events.js` — fetches events from Sanity and renders them into the site's design
- `index.html` — loads `events.js`

Until you finish the steps below, the site keeps showing the existing hand-coded
sample cards, so nothing breaks in the meantime.

---

## One-time setup (~15 min)

### 1. Create a free Sanity account + project
1. Go to <https://www.sanity.io> and sign up (Google/GitHub login is easiest).
2. In your terminal, in a **separate folder** (not this website folder), run:
   ```bash
   npm create sanity@latest -- --template clean --create-project "Ascend NYC Events" --dataset production
   ```
   - Choose **TypeScript: No** (or Yes — either works).
   - This creates your Sanity Studio (the editor app) and a project.
3. When it finishes, it prints your **Project ID** (also visible at
   <https://www.sanity.io/manage>). Copy it — you'll need it twice below.

### 2. Add the event schema
1. Copy `sanity/schemas/event.js` from this repo into your new Studio's
   `schemaTypes/` (or `schemas/`) folder.
2. Register it in `sanity.config.*` / `schemaTypes/index.*`:
   ```js
   import event from './event'
   export const schemaTypes = [event]
   ```
3. Start the Studio locally to confirm it works:
   ```bash
   npm run dev
   ```
   Open the local URL, and you should see **Event** in the editor. Add one or two
   events to test (set Status = Past or Upcoming, upload a hero image, fill stats).
4. Deploy the Studio so you/Sonny can edit from anywhere:
   ```bash
   npx sanity deploy
   ```
   Pick a name → your editor lives at `https://<name>.sanity.studio`.

### 3. Make the dataset readable by the website
The site reads events directly in the browser, so two settings must be open:

1. **Public dataset** — at <https://www.sanity.io/manage> → your project →
   **Datasets**, make sure `production` is **Public** (read-only public is fine;
   only public event content lives here).
2. **CORS origins** — same dashboard → **API** → **CORS origins** → **Add origin**.
   Add each site origin **without** credentials:
   - `http://localhost:3000` (or whatever you use locally)
   - your live domain, e.g. `https://ascendnyc.com`
   - the Vercel preview domain if you use one

> Only ever put **public** event info in this dataset (titles, photos, dates).
> Never member emails or private notes — those belong in beehiiv/Notion.

### 4. Point the website at your project
In `events.js` (this repo), edit the top config block:
```js
const PROJECT_ID = 'YOUR_SANITY_PROJECT_ID'; // ← paste the Project ID from step 1
const DATASET    = 'production';
```
Save, commit, deploy. Once events exist in Sanity, the site replaces the sample
cards with your real events.

---

## Day-to-day: adding an event
1. Open your Studio (`https://<name>.sanity.studio`) and sign in.
2. **Event → Create new.**
3. Fill in:
   - **Status** — Upcoming or Past (decides which section it shows in)
   - **Tier** — Flagship Mixer / Founders Panel / VIP Dinner (sets the badge)
   - **Volume** — the "Vol. 01" number (also orders past events)
   - **Hero image** + **gallery** — drag-and-drop; auto-resized for the site
   - **Description**, **meta tags** (e.g. "Invite Only"), **stats** (past events)
   - **RSVP / Apply link** — the Luma URL (upcoming events)
4. **Publish.** Refresh the site — it's live.

That's it. No deploys, no developer needed per event.

---

## How it stays safe
- The website only **reads** public content through Sanity's CDN. No secret key is
  in the site code.
- All editing happens in Sanity Studio behind a login, separate from the public site.
- Worst case exposure = your already-public event info is publicly readable, which
  is the point.

## Notes
- **Free tier:** comfortably covers an events site. Check current limits at
  <https://www.sanity.io/pricing>.
- **Image performance:** `events.js` requests sized, optimized crops via Sanity's
  image CDN automatically — upload full-res photos and the site serves fast versions.
- **Migration:** a section only switches to Sanity once it has at least one matching
  event, so the site never goes blank while you're filling it in.
