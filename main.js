/* =========================================================
   Ascend NYC — main.js
   ========================================================= */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* =========================================================
     Firebase Authentication
     ========================================================= */

  // Firebase Configuration - REPLACE WITH YOUR FIREBASE CONFIG
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };

  // Initialize Firebase (only if scripts loaded)
  let auth = null;
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    // Listen for auth state changes
    auth.onAuthStateChanged(updateUIForAuthState);
  }

  /* ---------- Auth UI State ---------- */
  function updateUIForAuthState(user) {
    const navSignIn = document.getElementById('navSignIn');
    const navInvite = document.getElementById('navInvite');
    const navUser = document.getElementById('navUser');
    const navUserEmail = document.getElementById('navUserEmail');
    const memberDashboard = document.getElementById('memberDashboard');
    const inviteSection = document.getElementById('invite');

    // Mobile nav elements
    const mobileSignIn = document.getElementById('mobileSignIn');
    const mobileInvite = document.getElementById('mobileInvite');
    const mobileUser = document.getElementById('mobileUser');
    const mobileUserEmail = document.getElementById('mobileUserEmail');

    if (user) {
      // User is signed in
      if (navSignIn) navSignIn.hidden = true;
      if (navInvite) navInvite.hidden = true;
      if (navUser) {
        navUser.hidden = false;
        if (navUserEmail) navUserEmail.textContent = user.email;
      }
      if (memberDashboard) {
        memberDashboard.hidden = false;
        // Trigger reveal animations
        memberDashboard.querySelectorAll('.reveal').forEach(el => {
          el.classList.add('is-visible');
        });
      }
      if (inviteSection) inviteSection.hidden = true;

      // Mobile nav
      if (mobileSignIn) mobileSignIn.hidden = true;
      if (mobileInvite) mobileInvite.hidden = true;
      if (mobileUser) {
        mobileUser.hidden = false;
        if (mobileUserEmail) mobileUserEmail.textContent = user.email;
      }
    } else {
      // User is signed out
      if (navSignIn) navSignIn.hidden = false;
      if (navInvite) navInvite.hidden = false;
      if (navUser) navUser.hidden = true;
      if (memberDashboard) memberDashboard.hidden = true;
      if (inviteSection) inviteSection.hidden = false;

      // Mobile nav
      if (mobileSignIn) mobileSignIn.hidden = false;
      if (mobileInvite) mobileInvite.hidden = false;
      if (mobileUser) mobileUser.hidden = true;
    }
  }

  /* ---------- Auth Modal ---------- */
  const authModal = document.getElementById('authModal');
  const authModalOverlay = document.getElementById('authModalOverlay');
  const authModalClose = document.getElementById('authModalClose');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const authToggle = document.getElementById('authToggle');
  const authToggleText = document.getElementById('authToggleText');
  const authModalTitle = document.getElementById('authModalTitle');
  const authModalSubtitle = document.getElementById('authModalSubtitle');

  let isLoginMode = true;

  function openAuthModal() {
    if (authModal) {
      authModal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAuthModal() {
    if (authModal) {
      authModal.hidden = true;
      document.body.style.overflow = '';
      resetAuthForms();
    }
  }

  function resetAuthForms() {
    if (loginForm) loginForm.reset();
    if (signupForm) signupForm.reset();
    hideAuthErrors();
  }

  function hideAuthErrors() {
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');
    if (loginError) loginError.hidden = true;
    if (signupError) signupError.hidden = true;

    // Clear field errors
    document.querySelectorAll('.auth-form .field').forEach(field => {
      field.classList.remove('has-error');
    });
  }

  function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    hideAuthErrors();

    if (isLoginMode) {
      if (loginForm) loginForm.hidden = false;
      if (signupForm) signupForm.hidden = true;
      if (authToggle) authToggle.textContent = 'Sign Up';
      if (authToggleText) authToggleText.textContent = "Don't have an account?";
      if (authModalTitle) authModalTitle.textContent = 'Welcome Back';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Sign in to access member-only content';
    } else {
      if (loginForm) loginForm.hidden = true;
      if (signupForm) signupForm.hidden = false;
      if (authToggle) authToggle.textContent = 'Sign In';
      if (authToggleText) authToggleText.textContent = 'Already have an account?';
      if (authModalTitle) authModalTitle.textContent = 'Create Account';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Join the Ascend NYC community';
    }
  }

  // Event listeners for modal
  if (authModalOverlay) authModalOverlay.addEventListener('click', closeAuthModal);
  if (authModalClose) authModalClose.addEventListener('click', closeAuthModal);
  if (authToggle) authToggle.addEventListener('click', toggleAuthMode);

  // Open modal from nav
  const navSignIn = document.getElementById('navSignIn');
  const mobileSignIn = document.getElementById('mobileSignIn');
  if (navSignIn) navSignIn.addEventListener('click', (e) => { e.preventDefault(); openAuthModal(); });
  if (mobileSignIn) mobileSignIn.addEventListener('click', (e) => { e.preventDefault(); openAuthModal(); });

  // Sign out buttons
  const navSignOut = document.getElementById('navSignOut');
  const mobileSignOut = document.getElementById('mobileSignOut');
  if (navSignOut) navSignOut.addEventListener('click', () => auth && auth.signOut());
  if (mobileSignOut) mobileSignOut.addEventListener('click', () => auth && auth.signOut());

  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal && !authModal.hidden) {
      closeAuthModal();
    }
  });

  /* ---------- Auth Error Messages ---------- */
  function getAuthErrorMessage(errorCode) {
    const messages = {
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    return messages[errorCode] || 'An error occurred. Please try again.';
  }

  /* ---------- Login Form Submit ---------- */
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const errorEl = document.getElementById('loginError');
      const submitBtn = loginForm.querySelector('button[type="submit"]');

      // Disable button during request
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';
      }

      try {
        await auth.signInWithEmailAndPassword(email, password);
        closeAuthModal();
      } catch (error) {
        if (errorEl) {
          errorEl.textContent = getAuthErrorMessage(error.code);
          errorEl.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In';
        }
      }
    });
  }

  /* ---------- Signup Form Submit ---------- */
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('signupEmail').value.trim();
      const password = document.getElementById('signupPassword').value;
      const passwordConfirm = document.getElementById('signupPasswordConfirm').value;
      const errorEl = document.getElementById('signupError');
      const submitBtn = signupForm.querySelector('button[type="submit"]');

      // Validate passwords match
      if (password !== passwordConfirm) {
        if (errorEl) {
          errorEl.textContent = 'Passwords do not match.';
          errorEl.hidden = false;
        }
        return;
      }

      // Disable button during request
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
      }

      try {
        await auth.createUserWithEmailAndPassword(email, password);
        closeAuthModal();
      } catch (error) {
        if (errorEl) {
          errorEl.textContent = getAuthErrorMessage(error.code);
          errorEl.hidden = false;
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Create Account';
        }
      }
    });
  }

  /* ---------- Password Reset ---------- */
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', async () => {
      const email = document.getElementById('loginEmail').value.trim();
      const errorEl = document.getElementById('loginError');

      if (!email) {
        if (errorEl) {
          errorEl.textContent = 'Please enter your email address first.';
          errorEl.hidden = false;
        }
        return;
      }

      try {
        await auth.sendPasswordResetEmail(email);
        if (errorEl) {
          errorEl.style.background = 'rgba(245, 165, 36, 0.1)';
          errorEl.style.borderColor = 'var(--accent-line)';
          errorEl.style.color = 'var(--accent-2)';
          errorEl.textContent = 'Password reset email sent! Check your inbox.';
          errorEl.hidden = false;
        }
      } catch (error) {
        if (errorEl) {
          errorEl.textContent = getAuthErrorMessage(error.code);
          errorEl.hidden = false;
        }
      }
    });
  }

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  /* ---------- Form validation + success state ---------- */
  const form = document.getElementById('inviteForm');
  const success = document.getElementById('formSuccess');
  const goalEl = document.getElementById('goal');
  const goalCount = document.getElementById('goalCount');

  if (goalEl && goalCount) {
    const updateCount = () => {
      goalCount.textContent = `${goalEl.value.length} / 500`;
    };
    goalEl.addEventListener('input', updateCount);
    updateCount();
  }

  function setError(field, message) {
    const wrapper = field.closest('.field');
    const errEl = wrapper.querySelector('.field__error');
    wrapper.classList.add('has-error');
    if (errEl) errEl.textContent = message;
  }

  function clearError(field) {
    const wrapper = field.closest('.field');
    wrapper.classList.remove('has-error');
    const errEl = wrapper.querySelector('.field__error');
    if (errEl) errEl.textContent = '';
  }

  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }

  function isUrl(v) {
    try {
      const u = new URL(v.trim());
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  }

  if (form) {
    // Live clear on input
    form.querySelectorAll('input, textarea').forEach(el => {
      el.addEventListener('input', () => clearError(el));
      el.addEventListener('blur', () => {
        if (el.value.trim() === '' && el.required) return; // wait for submit
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = {
        name:     form.querySelector('#name'),
        email:    form.querySelector('#email'),
        linkedin: form.querySelector('#linkedin'),
        role:     form.querySelector('#role'),
        company:  form.querySelector('#company'),
        goal:     form.querySelector('#goal'),
      };

      let hasError = false;
      Object.values(fields).forEach(clearError);

      if (fields.name.value.trim().length < 2) {
        setError(fields.name, 'Please enter your full name.');
        hasError = true;
      }
      if (!isEmail(fields.email.value)) {
        setError(fields.email, 'Please enter a valid email address.');
        hasError = true;
      }
      if (!isUrl(fields.linkedin.value) || !/linkedin\.com/i.test(fields.linkedin.value)) {
        setError(fields.linkedin, 'Please enter a valid LinkedIn URL.');
        hasError = true;
      }
      if (fields.role.value.trim().length < 2) {
        setError(fields.role, 'Please share your role or title.');
        hasError = true;
      }
      if (fields.company.value.trim().length < 1) {
        setError(fields.company, 'Please share your company.');
        hasError = true;
      }
      if (fields.goal.value.trim().length < 12) {
        setError(fields.goal, 'A sentence or two helps us review your application.');
        hasError = true;
      }

      if (hasError) {
        const firstError = form.querySelector('.has-error input, .has-error textarea');
        if (firstError) firstError.focus();
        return;
      }

      // Success: reveal success state, hide form
      form.style.display = 'none';
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
})();
