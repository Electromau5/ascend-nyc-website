/* =========================================================
   Ascend NYC — main.js
   ========================================================= */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     Email capture → our own database
     ---------------------------------------------------------
     Both email forms (hero "Join the Community" and the
     "Request an Invite" form) send here. Submissions POST to a
     serverless endpoint (api/subscribe.js) that saves each
     email into our own Postgres database. Nothing goes to a
     third-party email service. View the list at /admin.

     SETUP: this requires the Postgres store + env vars to be
     configured in Vercel (see SANITY_SETUP.md / README). If you
     need to demo the site before the database is wired up, set
     SUBSCRIBE_ENABLED to false — forms then validate and show
     their success state without saving.
     ========================================================= */
  const SUBSCRIBE_ENABLED = true;           // ← set false only to demo without a database
  const SUBSCRIBE_ENDPOINT = '/api/subscribe';

  // Resolves on success, rejects on failure. When disabled it
  // resolves immediately without sending (demo/preview mode).
  async function subscribe(payload) {
    if (!SUBSCRIBE_ENABLED) return;
    const res = await fetch(SUBSCRIBE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Subscribe failed: ' + res.status);
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
  }

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Hero "Join the Community" email capture ---------- */
  const joinForm = document.getElementById('joinForm');
  const joinSuccess = document.getElementById('joinSuccess');
  if (joinForm) {
    const joinInput = joinForm.querySelector('input[type="email"]');
    const joinBtn = joinForm.querySelector('button[type="submit"]');
    if (joinInput) joinInput.addEventListener('input', () => joinInput.removeAttribute('aria-invalid'));

    joinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = joinInput ? joinInput.value.trim() : '';
      if (!isEmail(email)) {
        if (joinInput) { joinInput.setAttribute('aria-invalid', 'true'); joinInput.focus(); }
        return;
      }
      if (joinInput) joinInput.removeAttribute('aria-invalid');

      const label = joinBtn ? joinBtn.innerHTML : '';
      if (joinBtn) { joinBtn.disabled = true; joinBtn.textContent = 'Joining…'; }

      try {
        await subscribe({ email, source: 'hero' });
        joinForm.hidden = true;
        const proof = document.querySelector('.hero__join-proof');
        if (proof) proof.hidden = true;
        if (joinSuccess) joinSuccess.hidden = false;
      } catch (err) {
        console.warn('[Ascend waitlist]', err);
        if (joinInput) joinInput.setAttribute('aria-invalid', 'true');
        if (joinBtn) { joinBtn.disabled = false; joinBtn.innerHTML = label; }
      }
    });
  }

  /* ---------- Nav: scroll state + mobile toggle ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const open = navMobile.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Hero particle field ---------- */
  const canvas = document.getElementById('particles');
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let w = 0, h = 0;
    let particles = [];
    let raf = null;

    const config = {
      density: 0.00007,    // particles per pixel
      maxLink: 130,        // px distance to draw line
      speed: 0.18,         // base velocity
      color: '245, 165, 36'
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.max(40, Math.floor(w * h * config.density));
      particles = new Array(target).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * config.speed,
        vy: (Math.random() - 0.5) * config.speed,
        r: Math.random() * 1.4 + 0.4
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.color}, 0.85)`;
        ctx.fill();
      }

      // links
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < config.maxLink * config.maxLink) {
            const alpha = (1 - Math.sqrt(d2) / config.maxLink) * 0.35;
            ctx.strokeStyle = `rgba(${config.color}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(step);
    }

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => { resize(); }, 100);
    };

    resize();
    step();
    window.addEventListener('resize', onResize);

    // Pause when out of view to save CPU
    const heroSection = canvas.closest('.hero');
    if (heroSection && 'IntersectionObserver' in window) {
      const heroIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !raf) {
            step();
          } else if (!entry.isIntersecting && raf) {
            cancelAnimationFrame(raf);
            raf = null;
          }
        });
      }, { threshold: 0 });
      heroIO.observe(heroSection);
    }
  }

  /* ---------- Photo carousels (past-event cards) ---------- */
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const slides = Array.from(root.querySelectorAll('.carousel__slide'));
    if (slides.length < 2) return;

    const dotsWrap = root.querySelector('.carousel__dots');
    const prevBtn = root.querySelector('.carousel__btn--prev');
    const nextBtn = root.querySelector('.carousel__btn--next');
    let index = slides.findIndex((s) => s.classList.contains('is-active'));
    if (index < 0) index = 0;

    // Build dot indicators
    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel__dot' + (i === index ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Photo ${i + 1} of ${slides.length}`);
      dot.addEventListener('click', () => go(i, true));
      if (dotsWrap) dotsWrap.appendChild(dot);
      return dot;
    });

    function go(next, fromUser) {
      index = (next + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === index);
        d.setAttribute('aria-selected', String(i === index));
      });
      if (fromUser) restart();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => go(index - 1, true));
    if (nextBtn) nextBtn.addEventListener('click', () => go(index + 1, true));

    // Auto-advance, paused on hover/focus and when off-screen. Skips if user prefers reduced motion.
    let timer = null;
    const INTERVAL = 4500;
    function start() {
      if (prefersReducedMotion || timer) return;
      timer = setInterval(() => go(index + 1, false), INTERVAL);
    }
    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }
    function restart() { stop(); start(); }

    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => (e.isIntersecting ? start() : stop()));
      }, { threshold: 0.4 });
      io.observe(root);
    } else {
      start();
    }
  });

  /* ---------- "Request an Invite" form (email + company + industry) ---------- */
  const form = document.getElementById('inviteForm');
  const success = document.getElementById('formSuccess');

  function setError(field, message) {
    const wrapper = field.closest('.field');
    wrapper.classList.add('has-error');
    const errEl = wrapper.querySelector('.field__error');
    if (errEl) errEl.textContent = message;
  }

  function clearError(field) {
    const wrapper = field.closest('.field');
    wrapper.classList.remove('has-error');
    const errEl = wrapper.querySelector('.field__error');
    if (errEl) errEl.textContent = '';
  }

  function showInviteSuccess() {
    if (form) form.style.display = 'none';
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
    }
  }

  if (form) {
    // Live-clear errors as the user fixes fields
    form.querySelectorAll('input, select').forEach(el => {
      const evt = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, () => clearError(el));
    });

    const note = form.querySelector('.form__note');
    const noteDefault = note ? note.textContent : '';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const fields = {
        email:    form.querySelector('#email'),
        company:  form.querySelector('#company'),
        industry: form.querySelector('#industry'),
      };

      let hasError = false;
      Object.values(fields).forEach(clearError);

      if (!isEmail(fields.email.value)) {
        setError(fields.email, 'Please enter a valid email address.');
        hasError = true;
      }
      if (fields.company.value.trim().length < 1) {
        setError(fields.company, 'Please share your company.');
        hasError = true;
      }
      if (!fields.industry.value) {
        setError(fields.industry, 'Please select your industry.');
        hasError = true;
      }

      if (hasError) {
        const firstError = form.querySelector('.has-error input, .has-error select');
        if (firstError) firstError.focus();
        return;
      }

      const payload = {
        email: fields.email.value.trim(),
        company: fields.company.value.trim(),
        industry: fields.industry.value,
        source: 'invite',
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      const btnLabel = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Joining…'; }
      if (note) { note.textContent = noteDefault; note.classList.remove('form__note--error'); }

      try {
        await subscribe(payload);
        showInviteSuccess();
      } catch (err) {
        console.warn('[Ascend waitlist]', err);
        if (note) {
          note.textContent = 'Something went wrong — please try again.';
          note.classList.add('form__note--error');
        }
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = btnLabel; }
      }
    });
  }
})();
