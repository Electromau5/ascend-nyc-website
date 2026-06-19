/* =====================================================================
   Ascend NYC — Sanity events integration
   ---------------------------------------------------------------------
   Fetches events from Sanity's public (read-only) CDN API and renders
   them into the existing markup:
     - status "past"     → #history  .history-grid
     - status "upcoming" → #events   .event-cards

   Safe for a static site: this only READS public content. No secret
   keys live here. Editing happens in Sanity Studio behind a login.

   SETUP: replace PROJECT_ID below with your Sanity project ID after
   you create the project (see SANITY_SETUP.md). Until then, the site
   keeps showing the hand-coded fallback cards already in index.html.
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- Config — EDIT THESE ---------- */
  const PROJECT_ID  = 'nsape9wf'; // Ascend NYC Events (Sanity)
  const DATASET     = 'production';
  const API_VERSION = 'v2024-01-01';

  // Not configured yet → leave the existing fallback cards untouched.
  if (!PROJECT_ID || PROJECT_ID === 'YOUR_SANITY_PROJECT_ID') return;

  /* ---------- GROQ query (both sections in one request) ---------- */
  const FIELDS = `{
    _id, title, subtitle, status, tier, volume, dateLabel, location,
    description, metaTags, capacity, approvalRequired, featured,
    rsvpUrl, ctaLabel,
    "heroUrl": heroImage.asset->url,
    stats[]{num, label}
  }`;
  const QUERY = `{
    "upcoming": *[_type=="event" && status=="upcoming"] | order(coalesce(date, _createdAt) asc) ${FIELDS},
    "past": *[_type=="event" && status=="past"] | order(volume desc) ${FIELDS}
  }`;

  const url =
    `https://${PROJECT_ID}.apicdn.sanity.io/${API_VERSION}/data/query/${DATASET}` +
    `?query=${encodeURIComponent(QUERY)}`;

  /* ---------- Helpers ---------- */
  const esc = (s) =>
    String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  // Sanity image URLs accept transform params — request a sized, optimized crop.
  const img = (base, w, h) =>
    !base ? '' : `${base}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=72`;

  const vol = (n) =>
    n == null ? '' : `Vol.&nbsp;${String(n).padStart(2, '0')}`;

  // Reused meta-row icons from the existing markup.
  const ICON_CLOCK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="8" cy="8" r="6.5"/><path d="M8 4.5v4l2.5 2"/></svg>';
  const ICON_PIN   = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6c0 3.5 4.5 8.5 4.5 8.5s4.5-5 4.5-8.5c0-2.5-2-4.5-4.5-4.5z"/><circle cx="8" cy="6" r="1.5"/></svg>';
  const ICON_ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2.5 13.5l11-11M8 2.5h5.5V8"/></svg>';

  // Static VibeMatch graphic block (right side of upcoming cards).
  const EVENT_GFX = `
    <div class="event-card__right" aria-hidden="true">
      <div class="event-card__gfx">
        <div class="event-gfx__ring"></div>
        <div class="event-gfx__ring event-gfx__ring--2"></div>
        <div class="event-gfx__center">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="24" cy="24" r="10" stroke-opacity="0.4"/>
            <circle cx="24" cy="14" r="3.5"/>
            <circle cx="35" cy="30" r="3.5"/>
            <circle cx="13" cy="30" r="3.5"/>
            <line x1="24" y1="17.5" x2="35" y2="27" stroke-opacity="0.5"/>
            <line x1="24" y1="17.5" x2="13" y2="27" stroke-opacity="0.5"/>
            <line x1="35" y1="30" x2="13" y2="30" stroke-opacity="0.5"/>
          </svg>
        </div>
        <span class="event-gfx__label">VibeMatch<br/>Matching</span>
      </div>
    </div>`;

  /* ---------- Renderers ---------- */
  function pastCard(ev, index) {
    const isVip = /vip|dinner/i.test(ev.tier || '');
    const featured = ev.featured ? ' history-card--featured' : '';
    // Fall back to one of the 3 gradient placeholders when no photo is set.
    const placeholder = `history-card__photo--${(index % 3) + 1}`;
    const photoStyle = ev.heroUrl
      ? ` style="background-image:url('${esc(img(ev.heroUrl, 720, ev.featured ? 600 : 440))}');background-size:cover;background-position:center;"`
      : '';

    const meta = (ev.metaTags || []).length
      ? (ev.metaTags || [])
          .map((t) => esc(t))
          .join('<span class="history-card__sep" aria-hidden="true"></span>')
      : esc(ev.location || '');

    const stats = (ev.stats || [])
      .slice(0, 3)
      .map(
        (s) => `
        <div class="history-stat">
          <span class="history-stat__num">${esc(s.num)}</span>
          <span class="history-stat__label">${esc(s.label)}</span>
        </div>`
      )
      .join('');

    return `
      <article class="history-card${featured} reveal">
        <div class="history-card__photo ${placeholder}"${photoStyle}>
          <span class="history-card__vol">${vol(ev.volume)}</span>
          <span class="history-card__format-badge${isVip ? ' history-card__format-badge--vip' : ''}">${esc(ev.tier || '')}</span>
        </div>
        <div class="history-card__body">
          <div class="history-card__meta">${meta}</div>
          <h3 class="history-card__title">${esc(ev.title)}</h3>
          <p class="history-card__desc">${esc(ev.description)}</p>
          ${stats ? `<div class="history-card__stats">${stats}</div>` : ''}
        </div>
      </article>`;
  }

  function upcomingCard(ev) {
    const dateText = ev.dateLabel
      ? esc(ev.dateLabel)
      : ev.date
      ? esc(new Date(ev.date).toLocaleDateString('en-US', {
          weekday: 'short', month: 'long', day: 'numeric',
        }))
      : 'Date &amp; venue revealed upon registration';

    const badge = ev.approvalRequired
      ? `<div class="event-card__badge"><span class="dot"></span> Approval Required</div>`
      : '';

    const cta = ev.rsvpUrl
      ? `<a href="${esc(ev.rsvpUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn--primary event-card__cta">${esc(ev.ctaLabel || 'Apply on Luma')} <span aria-hidden="true">→</span></a>`
      : '';

    return `
      <article class="event-card reveal">
        <div class="event-card__left">
          ${badge}
          <h3 class="event-card__title">${esc(ev.title)}</h3>
          ${ev.subtitle ? `<p class="event-card__subtitle">${esc(ev.subtitle)}</p>` : ''}
          <p class="event-card__desc">${esc(ev.description)}</p>
          <div class="event-card__meta">
            <span class="event-card__meta-item">${ICON_CLOCK} ${dateText}</span>
            <span class="event-card__meta-item">${ICON_PIN} ${esc(ev.location || 'New York City')}</span>
            ${ev.capacity ? `<span class="event-card__meta-item">${ICON_ARROW} ${esc(ev.capacity)}</span>` : ''}
          </div>
          ${cta}
        </div>
        ${EVENT_GFX}
      </article>`;
  }

  // Re-arm the existing scroll-reveal animation on freshly injected cards.
  function rearmReveal(container) {
    const items = container.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add('is-visible');
              obs.unobserve(e.target);
            }
          });
        },
        {threshold: 0.12}
      );
      items.forEach((el) => io.observe(el));
    } else {
      items.forEach((el) => el.classList.add('is-visible'));
    }
  }

  /* ---------- Fetch + mount ---------- */
  fetch(url, {headers: {Accept: 'application/json'}})
    .then((r) => (r.ok ? r.json() : Promise.reject(new Error('Sanity ' + r.status))))
    .then((data) => {
      const result = (data && data.result) || {};
      const past = Array.isArray(result.past) ? result.past : [];
      const upcoming = Array.isArray(result.upcoming) ? result.upcoming : [];

      // Only replace a section if Sanity actually has events for it,
      // so the site never goes blank during migration.
      const historyGrid = document.querySelector('#history .history-grid');
      if (historyGrid && past.length) {
        historyGrid.innerHTML = past.map(pastCard).join('');
        rearmReveal(historyGrid);
      }

      const eventCards = document.querySelector('#events .event-cards');
      if (eventCards && upcoming.length) {
        eventCards.innerHTML = upcoming.map(upcomingCard).join('');
        rearmReveal(eventCards);
      }
    })
    .catch((err) => {
      // Network/API failure → keep the existing hand-coded cards.
      console.warn('[Ascend events] Could not load events from Sanity:', err);
    });
})();
