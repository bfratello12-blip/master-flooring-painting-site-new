/* =============================================================
   Master Flooring & Painting — site scripts
   ============================================================= */

/* -------------------------------------------------------------
   >>> SITE CONFIG — EDIT THESE THREE VALUES <<<
   -------------------------------------------------------------
   1. GOOGLE_REVIEWS_URL  Paste the Google Business Profile /
                          "Write a review" or reviews link here.
   2. GOOGLE_REVIEW_COUNT Paste the current number of Google
                          reviews (digits only, e.g. "47").
   3. FORM_ENDPOINT       FormSubmit AJAX endpoint. Leads are
                          emailed to the address in the URL.
                          FormSubmit sends a one-time activation
                          email to that address on the very first
                          submission — the link in it must be
                          clicked before leads start arriving.
   ------------------------------------------------------------- */
const SITE_CONFIG = {
  GOOGLE_REVIEWS_URL: 'https://www.google.com/search?q=Master+Flooring+and+Painting+Long+Island+Reviews',
  GOOGLE_REVIEW_COUNT: '47',
  FORM_ENDPOINT: 'https://formsubmit.co/ajax/masterflooringandpainting@gmail.com',
  EMAIL: 'masterflooringandpainting@gmail.com',
  PHONE_DISPLAY: '(631) 620-9793',
  PHONE_LINK: 'tel:6316209793'
};

(function () {
  'use strict';

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Google review data injection
     --------------------------------------------------------- */
  function applyGoogleConfig() {
    $$('[data-google-link]').forEach((el) => {
      el.setAttribute('href', SITE_CONFIG.GOOGLE_REVIEWS_URL);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
    $$('[data-google-count]').forEach((el) => {
      el.textContent = SITE_CONFIG.GOOGLE_REVIEW_COUNT;
      if (/^\d+$/.test(String(SITE_CONFIG.GOOGLE_REVIEW_COUNT))) {
        el.classList.remove('rc-placeholder');
      }
    });
  }

  /* ---------------------------------------------------------
     Header: shadow on scroll + sticky mobile action bar
     --------------------------------------------------------- */
  function initHeader() {
    const header = $('.site-header');
    const bar = $('.mobile-bar');
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      if (header) header.classList.toggle('is-stuck', y > 8);
      if (bar) bar.classList.toggle('is-visible', y > 300);
      lastY = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     Desktop services dropdown
     --------------------------------------------------------- */
  function initDropdowns() {
    $$('.has-dropdown').forEach((item) => {
      const btn = $('button', item);
      const menu = $('.dropdown', item);
      if (!btn || !menu) return;
      let hoverTimer;

      const open = () => {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      };
      const close = () => {
        item.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      };

      btn.addEventListener('click', (e) => {
        e.preventDefault();
        item.classList.contains('is-open') ? close() : open();
      });

      item.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        if (window.matchMedia('(min-width: 1024px)').matches) open();
      });
      item.addEventListener('mouseleave', () => {
        hoverTimer = setTimeout(close, 120);
      });
      item.addEventListener('focusout', (e) => {
        if (!item.contains(e.relatedTarget)) close();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && item.classList.contains('is-open')) {
          close();
          btn.focus();
        }
      });
      document.addEventListener('click', (e) => {
        if (!item.contains(e.target)) close();
      });
    });
  }

  /* ---------------------------------------------------------
     Mobile navigation drawer
     --------------------------------------------------------- */
  function initMobileNav() {
    const toggle = $('.nav-toggle');
    const drawer = $('.mobile-nav');
    const closeBtn = $('.mobile-nav__close');
    if (!toggle || !drawer) return;

    const setOpen = (open) => {
      drawer.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('no-scroll', open);
      drawer.setAttribute('aria-hidden', String(!open));
      if (open) {
        const first = drawer.querySelector('a, button');
        if (first) first.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener('click', () => setOpen(!drawer.classList.contains('is-open')));
    if (closeBtn) closeBtn.addEventListener('click', () => { setOpen(false); toggle.focus(); });

    drawer.addEventListener('click', (e) => {
      if (e.target.closest('a[href]')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    // Collapsible sub-menus
    $$('.mobile-nav__list button[aria-controls]').forEach((btn) => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      if (!panel) return;
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        panel.setAttribute('data-open', String(!open));
      });
    });
  }

  /* ---------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------- */
  function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     FAQ accordion
     --------------------------------------------------------- */
  function initFaq() {
    $$('.faq__item').forEach((item) => {
      const btn = $('.faq__q', item);
      const panel = $('.faq__a', item);
      if (!btn || !panel) return;
      btn.addEventListener('click', () => {
        const open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        panel.setAttribute('aria-hidden', String(!open));
      });
    });
  }

  /* ---------------------------------------------------------
     Before / after sliders
     --------------------------------------------------------- */
  function initBeforeAfter() {
    $$('.ba').forEach((ba) => {
      const range = $('.ba__range', ba);
      if (!range) return;
      const update = () => ba.style.setProperty('--pos', range.value + '%');
      range.addEventListener('input', update);
      update();
    });
  }

  /* ---------------------------------------------------------
     Gallery filters
     --------------------------------------------------------- */
  function initFilters() {
    const chips = $$('[data-filter]');
    if (!chips.length) return;
    const items = $$('[data-category]');

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const filter = chip.getAttribute('data-filter');
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        items.forEach((item) => {
          const match = filter === 'all' || item.getAttribute('data-category') === filter;
          item.hidden = !match;
        });
      });
    });
  }

  /* ---------------------------------------------------------
     Estimate forms
     --------------------------------------------------------- */
  function preselectService() {
    const params = new URLSearchParams(window.location.search);
    const service = params.get('service');
    if (!service) return;
    $$('select[name="service"]').forEach((select) => {
      if (Array.from(select.options).some((o) => o.value === service)) {
        select.value = service;
      }
    });
  }

  function validateField(field) {
    const input = field.querySelector('input, select, textarea');
    if (!input || input.type === 'checkbox') return true;
    let valid = input.checkValidity();
    if (valid && input.type === 'tel') {
      valid = (input.value.replace(/\D/g, '').length >= 10);
    }
    field.classList.toggle('has-error', !valid);
    return valid;
  }

  function initForms() {
    $$('form[data-estimate-form]').forEach((form) => {
      const status = $('.form-status', form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.innerHTML : '';
      let submitting = false;

      form.querySelectorAll('.field input, .field select, .field textarea').forEach((input) => {
        input.addEventListener('blur', () => {
          if (input.value) validateField(input.closest('.field'));
        });
        input.addEventListener('input', () => {
          const field = input.closest('.field');
          if (field && field.classList.contains('has-error')) validateField(field);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Blocks a second lead from an Enter-key submit while a request is in flight.
        if (submitting) return;

        // Honeypot. Never fails silently — a dead button would look like a broken form.
        const trap = form.querySelector('input[name="_honey"]');
        if (trap && trap.value) {
          showStatus(
            status,
            'err',
            'That did not go through',
            'Please call ' + SITE_CONFIG.PHONE_DISPLAY + ' or email ' + SITE_CONFIG.EMAIL + ' and we will take care of it.'
          );
          return;
        }

        const fields = $$('.field', form);
        let firstInvalid = null;
        fields.forEach((field) => {
          if (!validateField(field) && !firstInvalid) firstInvalid = field;
        });

        if (firstInvalid) {
          const input = firstInvalid.querySelector('input, select, textarea');
          if (input) input.focus();
          showStatus(status, 'err', 'Check the highlighted fields', 'A few details are missing or incomplete.');
          return;
        }

        const payload = Object.fromEntries(new FormData(form).entries());
        payload._subject = 'New Website Estimate Request - Master Flooring & Painting';
        payload._captcha = 'false';

        submitting = true;
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Sending…';
        }

        const finish = (ok) => {
          if (ok) {
            form.reset();
            // Stays locked through navigation; thank-you.html handles Ads tracking.
            window.location.href = 'thank-you.html';
            return;
          }
          submitting = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalLabel;
          }
        };

        // FormSubmit's /ajax/ endpoint is documented for JSON, not multipart form data.
        fetch(SITE_CONFIG.FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload)
        })
          .then((res) => {
            if (!res.ok) throw new Error('Request failed');
            return res.json();
          })
          .then((body) => {
            // FormSubmit answers 200 with success:"false" when it has not accepted the lead.
            if (!body || String(body.success) !== 'true') throw new Error('Delivery not confirmed');
            trackMetaLead(payload);
            stashAdsUserData(payload);
            finish(true);
          })
          .catch(() => {
            finish(false);
            showStatus(
              status,
              'err',
              'That did not go through',
              'Please call ' + SITE_CONFIG.PHONE_DISPLAY + ' or email ' + SITE_CONFIG.EMAIL + ' and we will take care of it.'
            );
          });
      });
    });
  }

  function showStatus(el, type, title, message) {
    if (!el) return;
    el.className = 'form-status is-visible form-status--' + type;
    el.innerHTML = '<strong>' + title + '</strong>' + message;
    el.setAttribute('role', 'status');
  }

  /* ---------------------------------------------------------
     Google Ads enhanced conversions

     The conversion event fires in the <head> of thank-you.html,
     long before this file runs, so the match data has to be
     waiting for it in sessionStorage. Values are passed in the
     clear and hashed by the Google tag itself — never hash here.
     --------------------------------------------------------- */
  const ADS_USER_DATA_KEY = 'mfp_ads_user_data';

  /* Google requires E.164. Anything that is not a US 10/11-digit
     number is dropped rather than sent in a format it will reject. */
  function toE164(value) {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length === 10) return '+1' + digits;
    if (digits.length === 11 && digits.charAt(0) === '1') return '+' + digits;
    return '';
  }

  function stashAdsUserData(data) {
    try {
      const userData = {};
      const email = String(data.email || '').trim().toLowerCase();
      const phone = toE164(data.phone);
      const address = {};

      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) userData.email = email;
      if (phone) userData.phone_number = phone;

      const nameParts = String(data.name || '').trim().split(/\s+/).filter(Boolean);
      if (nameParts.length) {
        address.first_name = nameParts[0];
        if (nameParts.length > 1) address.last_name = nameParts[nameParts.length - 1];
      }
      // "Town or ZIP" is free text, so only a real 5-digit ZIP is usable.
      const location = String(data.location || '').trim();
      if (/^\d{5}$/.test(location)) address.postal_code = location;
      if (Object.keys(address).length) {
        address.country = 'US';
        userData.address = address;
      }

      if (!userData.email && !userData.phone_number) return;
      sessionStorage.setItem(ADS_USER_DATA_KEY, JSON.stringify(userData));
    } catch (err) {
      /* private mode: the conversion still fires, just unenhanced */
    }
  }

  /* ---------------------------------------------------------
     Meta Pixel + Conversions API

     The browser Pixel fires in the page <head>; this half sends
     the matching server event so Meta can deduplicate the pair
     on event_id. Everything here is best-effort and must never
     block rendering, navigation or a form submission.
     --------------------------------------------------------- */
  const META_LEAD_KEY = 'mfp_meta_lead_id';
  const META_CAPI_ENDPOINT = '/api/meta-capi';

  function readCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  function writeCookie(name, value, maxAgeSeconds) {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie =
      name + '=' + encodeURIComponent(value) + '; max-age=' + maxAgeSeconds + '; path=/; SameSite=Lax' + secure;
  }

  /* Keeps Meta click attribution through later navigation. Only a real
     fbclid produces an fbc — nothing is invented for organic visitors. */
  function captureFbc() {
    const existing = readCookie('_fbc');
    if (existing) return existing;
    const fbclid = new URLSearchParams(window.location.search).get('fbclid');
    if (!fbclid) return '';
    const fbc = 'fb.1.' + Date.now() + '.' + fbclid;
    writeCookie('_fbc', fbc, 90 * 24 * 60 * 60);
    return fbc;
  }

  function sendCapiEvent(eventName, eventId, matchKeys) {
    try {
      const userData = { fbp: readCookie('_fbp'), fbc: readCookie('_fbc') };
      if (matchKeys) {
        if (matchKeys.em) userData.em = matchKeys.em;
        if (matchKeys.ph) userData.ph = matchKeys.ph;
      }
      Object.keys(userData).forEach((key) => {
        if (!userData[key]) delete userData[key];
      });

      fetch(META_CAPI_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: eventName,
          event_id: eventId,
          event_time: Math.floor(Date.now() / 1000),
          event_source_url: window.location.href,
          user_data: userData
        }),
        // Survives the redirect that follows a successful lead.
        keepalive: true
      }).catch(() => {});
    } catch (err) {
      /* tracking must never surface to the visitor */
    }
  }

  /* fbevents.js writes _fbp asynchronously; give it a moment so the
     server event carries the same browser id, then send regardless. */
  function whenFbpReady(done) {
    let waited = 0;
    const poll = () => {
      if (readCookie('_fbp') || waited >= 1000) return done();
      waited += 200;
      setTimeout(poll, 200);
    };
    poll();
  }

  function trackMetaLead(data) {
    try {
      const meta = window.mfpMeta;
      if (!meta) return;
      const eventId = meta.uuid();
      // Handed to thank-you.html so the browser Lead reuses this exact id.
      try {
        sessionStorage.setItem(META_LEAD_KEY, eventId);
      } catch (err) {
        /* private mode: the server Lead still goes out */
      }
      sendCapiEvent('Lead', eventId, { em: data.email, ph: data.phone });
    } catch (err) {
      /* never let tracking fail a delivered lead */
    }
  }

  /* Only a confirmed submission leaves an id behind, so a refresh or a
     direct visit to thank-you.html cannot produce a second Lead. */
  function firePendingMetaLead() {
    if (!/\/thank-you(\.html)?$/.test(window.location.pathname)) return;
    let eventId = null;
    try {
      eventId = sessionStorage.getItem(META_LEAD_KEY);
      sessionStorage.removeItem(META_LEAD_KEY);
    } catch (err) {
      return;
    }
    if (eventId && typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {}, { eventID: eventId });
    }
  }

  function initMetaTracking() {
    if (!window.mfpMeta) return;
    captureFbc();
    firePendingMetaLead();
    whenFbpReady(() => sendCapiEvent('PageView', window.mfpMeta.pageViewId));
  }

  /* ---------------------------------------------------------
     Misc
     --------------------------------------------------------- */
  function initYear() {
    $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function boot() {
    applyGoogleConfig();
    initHeader();
    initDropdowns();
    initMobileNav();
    initReveal();
    initFaq();
    initBeforeAfter();
    initFilters();
    initForms();
    preselectService();
    initYear();
    initMetaTracking();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
