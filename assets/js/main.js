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
   3. FORM_ENDPOINT       Optional. Paste a form service endpoint
                          (Formspree, Netlify Forms, Basin, etc.).
                          While left as null, the estimate forms
                          open the visitor's email app with the
                          details pre-filled and send to the
                          business inbox.
   ------------------------------------------------------------- */
const SITE_CONFIG = {
  GOOGLE_REVIEWS_URL: 'https://www.google.com/search?q=Master+Flooring+and+Painting+Long+Island+Reviews',
  GOOGLE_REVIEW_COUNT: '47',
  FORM_ENDPOINT: null,
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
  const SERVICE_LABELS = {
    'interior-painting': 'Interior Painting',
    'exterior-painting': 'Exterior Painting',
    'residential-painting': 'Residential Painting',
    'commercial-painting': 'Commercial Painting',
    'cabinet-painting': 'Cabinet & Trim Painting',
    'deck-fence-staining': 'Deck & Fence Staining',
    'flooring-installation': 'Flooring Installation',
    'flooring-removal': 'Flooring Removal',
    'power-washing': 'Power Washing',
    'multiple': 'Multiple Services / Not Sure'
  };

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

  function buildMailto(data) {
    const lines = [
      'Name: ' + data.name,
      'Phone: ' + data.phone,
      'Email: ' + (data.email || '—'),
      'Town / ZIP: ' + (data.location || '—'),
      'Service: ' + (SERVICE_LABELS[data.service] || data.service || '—'),
      'Property type: ' + (data.property || '—'),
      '',
      'Project details:',
      data.details || '—'
    ];
    return (
      'mailto:' + SITE_CONFIG.EMAIL +
      '?subject=' + encodeURIComponent('Estimate request — ' + (SERVICE_LABELS[data.service] || 'Painting') + ' — ' + data.name) +
      '&body=' + encodeURIComponent(lines.join('\n'))
    );
  }

  function initForms() {
    $$('form[data-estimate-form]').forEach((form) => {
      const status = $('.form-status', form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.innerHTML : '';

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

        // Honeypot
        const trap = form.querySelector('input[name="company_website"]');
        if (trap && trap.value) return;

        const fields = $$('.field', form);
        let firstInvalid = null;
        fields.forEach((field) => {
          if (!validateField(field) && !firstInvalid) firstInvalid = field;
        });

        const consent = form.querySelector('input[name="consent"]');

        if (firstInvalid) {
          const input = firstInvalid.querySelector('input, select, textarea');
          if (input) input.focus();
          showStatus(status, 'err', 'Check the highlighted fields', 'A few details are missing or incomplete.');
          return;
        }

        if (consent && !consent.checked) {
          consent.focus();
          showStatus(status, 'err', 'Almost there', 'Please check the consent box so we know how to reach you.');
          return;
        }

        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());

        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Sending…';
        }

        const finish = (ok) => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalLabel;
          }
          if (ok) {
            form.reset();
            showStatus(
              status,
              'ok',
              'Request received',
              'Thanks — we have your details and will get back to you shortly. Need to talk sooner? Call ' +
                SITE_CONFIG.PHONE_DISPLAY + '.'
            );
          }
        };

        if (SITE_CONFIG.FORM_ENDPOINT) {
          fetch(SITE_CONFIG.FORM_ENDPOINT, {
            method: 'POST',
            body: fd,
            headers: { Accept: 'application/json' }
          })
            .then((res) => {
              if (!res.ok) throw new Error('Request failed');
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
        } else {
          window.location.href = buildMailto(data);
          setTimeout(() => {
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = originalLabel;
            }
            showStatus(
              status,
              'ok',
              'Your email is ready to send',
              'We opened your email app with the details filled in — press send and we will get right back to you. ' +
                'Prefer to talk? Call ' + SITE_CONFIG.PHONE_DISPLAY + '.'
            );
          }, 600);
        }
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
