/**
 * Static site builder for Master Flooring & Painting.
 *
 *   node build.js
 *
 * Reads page content from src/pages/*.html (each file starts with a JSON
 * meta block), wraps it in the shared layout below, and writes plain
 * static .html files to the project root. Also writes sitemap.xml.
 *
 * Edit content in src/pages/ — never the generated .html files at the root.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PAGES = path.join(SRC, 'pages');
const SITE_URL = 'https://www.masterflooringandpainting.com';

const PHONE_DISPLAY = '(631) 620-9793';
const PHONE_HREF = 'tel:6316209793';
const EMAIL = 'masterflooringandpainting@gmail.com';

const sprite = fs.readFileSync(path.join(SRC, 'partials', 'sprite.svg'), 'utf8').trim();

const icon = (name) => `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;

/* ----------------------------------------------------------------
   Shared business JSON-LD node
   ---------------------------------------------------------------- */
const businessNode = {
  '@type': ['HousePainter', 'LocalBusiness'],
  '@id': `${SITE_URL}/#business`,
  name: 'Master Flooring & Painting',
  alternateName: 'Master Flooring and Painting',
  url: `${SITE_URL}/`,
  telephone: '+1-631-620-9793',
  email: EMAIL,
  image: `${SITE_URL}/assets/img/logo/master-flooring-painting-logo.png`,
  logo: `${SITE_URL}/assets/img/logo/master-flooring-painting-logo.png`,
  description:
    'Father-and-son painting contractor serving Suffolk County, Nassau County and Long Island, New York. Interior painting, exterior painting, residential and commercial painting, flooring installation and removal, and power washing.',
  address: { '@type': 'PostalAddress', addressRegion: 'NY', addressCountry: 'US' },
  areaServed: [
    { '@type': 'AdministrativeArea', name: 'Suffolk County, New York' },
    { '@type': 'AdministrativeArea', name: 'Nassau County, New York' },
    { '@type': 'Place', name: 'Long Island, New York' }
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '18:00'
    },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '17:00' }
  ],
  sameAs: [
    'https://www.instagram.com/masterflooringandpainting/',
    'https://www.facebook.com/people/Master-Flooring-and-Painting/61564414535480/',
    'https://www.tiktok.com/@master.flooring.a',
    'https://www.angi.com/companylist/us/ny/medford/master-flooring-reviews-1.htm'
  ],
  award: 'Angi Super Service Award 2025',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Painting, Flooring & Power Washing Services',
    itemListElement: [
      ['Interior Painting', 'interior-painting.html'],
      ['Exterior Painting', 'exterior-painting.html'],
      ['Residential Painting', 'residential-painting.html'],
      ['Commercial Painting', 'commercial-painting.html'],
      ['Flooring Installation & Removal', 'flooring-installation.html'],
      ['Power Washing', 'power-washing.html']
    ].map(([name, url]) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name, url: `${SITE_URL}/${url}` }
    }))
  }
};

/* ----------------------------------------------------------------
   Navigation
   ---------------------------------------------------------------- */
const SERVICE_LINKS = [
  ['interior-painting.html', 'Interior Painting', 'Walls, ceilings, trim, doors and cabinets'],
  ['exterior-painting.html', 'Exterior Painting', 'Siding, trim, shutters, porches and decks'],
  ['residential-painting.html', 'Residential Painting', 'Whole-home repaints and single rooms'],
  ['commercial-painting.html', 'Commercial Painting', 'Offices, retail, rentals and common areas'],
  ['flooring-installation.html', 'Flooring Installation &amp; Removal', 'Vinyl plank, laminate and tile'],
  ['power-washing.html', 'Power Washing', 'Siding, decks, patios, walkways and fences'],
  ['services.html', 'All Services', 'Everything we do across Long Island']
];

const MAIN_LINKS = [
  ['our-work.html', 'Our Work', 'work'],
  ['service-areas.html', 'Service Areas', 'areas'],
  ['reviews.html', 'Reviews', 'reviews'],
  ['about.html', 'About', 'about'],
  ['contact.html', 'Contact', 'contact']
];

function header(nav) {
  const isServices = nav === 'services';
  return `<div class="topbar">
  <div class="container topbar__inner">
    <div class="topbar__left">
      <span class="topbar__item">${icon('map-pin')} Serving Suffolk &amp; Nassau County, NY</span>
      <span class="topbar__item">${icon('clock')} Mon–Fri 8am–6pm · Sat 9am–5pm</span>
    </div>
    <div class="topbar__right">
      <span class="topbar__item">${icon('mail')} <a href="mailto:${EMAIL}">${EMAIL}</a></span>
      <span class="topbar__socials">
        <a href="https://www.instagram.com/masterflooringandpainting/" target="_blank" rel="noopener" aria-label="Master Flooring &amp; Painting on Instagram">${icon('instagram')}</a>
        <a href="https://www.facebook.com/people/Master-Flooring-and-Painting/61564414535480/" target="_blank" rel="noopener" aria-label="Master Flooring &amp; Painting on Facebook">${icon('facebook')}</a>
        <a href="https://www.tiktok.com/@master.flooring.a" target="_blank" rel="noopener" aria-label="Master Flooring &amp; Painting on TikTok">${icon('tiktok')}</a>
      </span>
    </div>
  </div>
</div>

<header class="site-header">
  <div class="container header__inner">
    <a class="brand" href="index.html" aria-label="Master Flooring &amp; Painting — home">
      <img src="assets/img/logo/master-flooring-painting-logo.png" alt="Master Flooring &amp; Painting logo" width="250" height="54"${nav === 'home' ? ' fetchpriority="high"' : ''}>
    </a>

    <nav class="primary-nav" aria-label="Main">
      <ul>
        <li class="nav-item has-dropdown">
          <button type="button" aria-expanded="false"${isServices ? ' style="box-shadow:inset 0 -2px 0 var(--orange);border-radius:0"' : ''}>Services ${icon('chevron-down')}</button>
          <ul class="dropdown">
${SERVICE_LINKS.map(([href, label, desc]) => `            <li><a href="${href}"><strong>${label}</strong><span>${desc}</span></a></li>`).join('\n')}
          </ul>
        </li>
${MAIN_LINKS.map(([href, label, key]) => `        <li class="nav-item"><a href="${href}"${nav === key ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n')}
      </ul>
    </nav>

    <div class="header__actions">
      <a class="header__phone" href="${PHONE_HREF}">
        <span class="header__phone-icon">${icon('phone')}</span>
        <span class="header__phone-text"><small>Call or text</small><strong>${PHONE_DISPLAY}</strong></span>
        <span class="sr-only">Call Master Flooring &amp; Painting at ${PHONE_DISPLAY}</span>
      </a>
      <a class="btn btn--sm header__cta" href="contact.html">Free Estimate</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">
        <span class="nav-toggle__bars"><span></span><span></span><span></span></span>
      </button>
    </div>
  </div>
</header>

<div class="mobile-nav" id="mobile-nav" aria-hidden="true">
  <div class="container mobile-nav__top">
    <a class="brand" href="index.html"><img src="assets/img/logo/master-flooring-painting-logo.png" alt="Master Flooring &amp; Painting" width="200" height="46"></a>
    <button class="mobile-nav__close" type="button" aria-label="Close menu">${icon('x')}</button>
  </div>
  <div class="container mobile-nav__body">
    <ul class="mobile-nav__list">
      <li><a href="index.html"${nav === 'home' ? ' aria-current="page"' : ''}>Home</a></li>
      <li>
        <button type="button" aria-expanded="false" aria-controls="m-services">Services ${icon('chevron-down')}</button>
        <div class="mobile-sub" id="m-services" data-open="false"><div>
${SERVICE_LINKS.map(([href, label]) => `          <a href="${href}">${label}</a>`).join('\n')}
        </div></div>
      </li>
${MAIN_LINKS.map(([href, label, key]) => `      <li><a href="${href}"${nav === key ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n')}
    </ul>
  </div>
  <div class="mobile-nav__foot">
    <a class="btn btn--block" href="contact.html">${icon('clipboard')} Get a Free Estimate</a>
    <a class="btn btn--ghost btn--block" href="${PHONE_HREF}">${icon('phone')} ${PHONE_DISPLAY}</a>
  </div>
</div>`;
}

const GOOGLE_G = `<svg class="google-badge__logo" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/></svg>`;

function footer() {
  return `<footer class="site-footer">
  <div class="container footer__top">
    <div class="footer__brand">
      <img src="assets/img/logo/master-flooring-painting-logo-white.png" alt="Master Flooring &amp; Painting" width="250" height="58" loading="lazy">
      <p>A father-and-son contractor serving Suffolk County, Nassau County and Long Island, New York — interior and exterior painting, flooring installation and removal, and power washing.</p>
      <div class="footer__badges">
        <img src="assets/img/badges/angi-super-service-award-2025.webp" alt="Angi Super Service Award 2025" width="62" height="70" loading="lazy">
        <a class="google-badge google-badge--dark" href="${SITE_URL}/" data-google-link>
          ${GOOGLE_G}
          <span class="google-badge__body">
            <span class="google-badge__top">5.0 <span class="stars" aria-hidden="true"><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg><svg><use href="#i-star"/></svg></span></span>
            <span class="google-badge__sub"><span data-google-count>[REVIEW COUNT]</span> Google reviews</span>
          </span>
        </a>
      </div>
    </div>

    <div>
      <h3>Services</h3>
      <ul class="footer__list">
        <li><a href="interior-painting.html">Interior Painting</a></li>
        <li><a href="exterior-painting.html">Exterior Painting</a></li>
        <li><a href="residential-painting.html">Residential Painting</a></li>
        <li><a href="commercial-painting.html">Commercial Painting</a></li>
        <li><a href="flooring-installation.html">Flooring Installation &amp; Removal</a></li>
        <li><a href="power-washing.html">Power Washing</a></li>
        <li><a href="services.html">All Services</a></li>
      </ul>
    </div>

    <div>
      <h3>Company</h3>
      <ul class="footer__list">
        <li><a href="about.html">About Us</a></li>
        <li><a href="our-work.html">Our Work</a></li>
        <li><a href="reviews.html">Reviews</a></li>
        <li><a href="service-areas.html">Service Areas</a></li>
        <li><a href="painters-suffolk-county.html">Suffolk County</a></li>
        <li><a href="painters-nassau-county.html">Nassau County</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>

    <div>
      <h3>Get in touch</h3>
      <div class="footer__contact">
        <div><small>Phone</small><a href="${PHONE_HREF}">${PHONE_DISPLAY}</a></div>
        <div><small>Email</small><a href="mailto:${EMAIL}">${EMAIL}</a></div>
        <div><small>Hours</small>Mon–Fri 8:00am–6:00pm<br>Saturday 9:00am–5:00pm</div>
        <div><small>Follow</small>
          <span class="footer__socials">
            <a href="https://www.instagram.com/masterflooringandpainting/" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>
            <a href="https://www.facebook.com/people/Master-Flooring-and-Painting/61564414535480/" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>
            <a href="https://www.tiktok.com/@master.flooring.a" target="_blank" rel="noopener" aria-label="TikTok">${icon('tiktok')}</a>
          </span>
        </div>
      </div>
    </div>
  </div>

  <div class="container footer__areas">
    <strong>Serving Long Island:</strong>
    Smithtown · Huntington · Commack · Hauppauge · Islip · Bay Shore · Babylon · Patchogue · Medford · Ronkonkoma · Port Jefferson · Setauket · Riverhead · Sayville · Deer Park · Lindenhurst · Hicksville · Levittown · Massapequa · Bethpage · Plainview · Syosset · Garden City · Westbury · Mineola · Merrick · Wantagh · Farmingdale · Rockville Centre · Oceanside
  </div>

  <div class="container footer__bottom">
    <p>© <span data-year>2026</span> Master Flooring &amp; Painting. All rights reserved.</p>
    <nav aria-label="Legal">
      <a href="privacy-policy.html">Privacy Policy</a>
      <a href="accessibility.html">Accessibility</a>
      <a href="sitemap.xml">Sitemap</a>
    </nav>
  </div>
</footer>

<div class="mobile-bar">
  <a class="btn" href="${PHONE_HREF}">${icon('phone')} Call Now</a>
  <a class="btn btn--white" href="contact.html">Free Estimate</a>
</div>`;
}

/* ----------------------------------------------------------------
   Reusable content blocks — use {{NAME}} or {{NAME:arg}} in src/pages
   ---------------------------------------------------------------- */
const SERVICE_OPTIONS = `                <option value="">Choose one…</option>
                <option value="interior-painting">Interior Painting</option>
                <option value="exterior-painting">Exterior Painting</option>
                <option value="residential-painting">Residential Painting</option>
                <option value="commercial-painting">Commercial Painting</option>
                <option value="cabinet-painting">Cabinet &amp; Trim Painting</option>
                <option value="deck-fence-staining">Deck &amp; Fence Staining</option>
                <option value="flooring-installation">Flooring Installation</option>
                <option value="flooring-removal">Flooring Removal</option>
                <option value="power-washing">Power Washing</option>
                <option value="multiple">Multiple services / not sure</option>`;

const BLOCKS = {
  /* Hero background photo layer. Drop an <img> in place of the .ph placeholder. */
  HEROBG() {
    return `<div class="hero-bg" aria-hidden="true">
    <!-- Real photo goes here: <img src="assets/img/hero/your-photo.jpg" alt="" width="1920" height="1080"> -->
    <div class="ph ph--dark"></div>
  </div>
  <div class="hero-scrim" aria-hidden="true"></div>`;
  },

  /* Non-visual marker so hero images keep their numbering without rendering a note box. */
  HERONOTE(desc = '') {
    return `<!--HERONOTE:${desc}-->`;
  },

  /* Compact estimate form used in hero cards and sidebars */
  FORM(prefix = 'f') {
    return `<form data-estimate-form novalidate>
          <div class="form-grid form-grid--2">
            <div class="field">
              <label for="${prefix}-name">Name <span class="req">*</span></label>
              <input type="text" id="${prefix}-name" name="name" autocomplete="name" placeholder="Your name" required>
              <span class="error-msg">Please enter your name.</span>
            </div>
            <div class="field">
              <label for="${prefix}-phone">Phone <span class="req">*</span></label>
              <input type="tel" id="${prefix}-phone" name="phone" autocomplete="tel" placeholder="(631) 000-0000" required>
              <span class="error-msg">Please enter a 10-digit phone number.</span>
            </div>
            <div class="field">
              <label for="${prefix}-location">Town or ZIP <span class="req">*</span></label>
              <input type="text" id="${prefix}-location" name="location" autocomplete="address-level2" placeholder="e.g. Smithtown" required>
              <span class="error-msg">Please tell us where the project is.</span>
            </div>
            <div class="field">
              <label for="${prefix}-service">Service <span class="req">*</span></label>
              <select id="${prefix}-service" name="service" required>
${SERVICE_OPTIONS}
              </select>
              <span class="error-msg">Please choose a service.</span>
            </div>
            <div class="field field--full">
              <label for="${prefix}-details">Project details</label>
              <textarea id="${prefix}-details" name="details" rows="3" placeholder="Rooms, square footage, colors you're considering, timing…"></textarea>
            </div>
          </div>
          <div class="sr-only" aria-hidden="true">
            <label for="${prefix}-company">Company website</label>
            <input type="text" id="${prefix}-company" name="company_website" tabindex="-1" autocomplete="off">
          </div>
          <label class="consent" style="margin-top:.85rem">
            <input type="checkbox" name="consent" required>
            <span>It's OK to contact me about this request by phone, text or email.</span>
          </label>
          <button class="btn btn--lg btn--block" type="submit" style="margin-top:1.1rem">Request my free estimate ${icon('arrow-right')}</button>
          <div class="form-status" aria-live="polite"></div>
          <p class="quote-card__foot">Rather talk it through? Call <a href="${PHONE_HREF}">${PHONE_DISPLAY}</a></p>
        </form>`;
  },

  /* Sidebar quote card wrapper */
  QUOTECARD(prefix = 'side') {
    return `<div class="quote-card">
        <h2>Get a free estimate</h2>
        <p class="quote-card__note">Send a few details and we'll set up a time to come look at the project.</p>
        ${BLOCKS.FORM(prefix)}
      </div>`;
  },

  /* Google rating + Angi award panel */
  REVIEWPANEL() {
    return `<div class="review-hero" data-reveal>
      <div class="review-hero__score">
        <div class="num">5.0</div>
        <div class="stars stars--lg" role="img" aria-label="Rated 5 out of 5 stars">
          <svg aria-hidden="true"><use href="#i-star"/></svg><svg aria-hidden="true"><use href="#i-star"/></svg><svg aria-hidden="true"><use href="#i-star"/></svg><svg aria-hidden="true"><use href="#i-star"/></svg><svg aria-hidden="true"><use href="#i-star"/></svg>
        </div>
        <p style="font-size:.82rem;margin-top:.5rem;color:var(--slate-400)">Google rating</p>
      </div>
      <div class="review-hero__divider" aria-hidden="true"></div>
      <div>
        <h3 style="font-size:1.35rem;margin-bottom:.5rem">Rated 5.0 on Google</h3>
        <p style="font-size:.95rem">Based on <span class="rc-placeholder" data-google-count>[REVIEW COUNT]</span> Google reviews from homeowners and businesses across Suffolk and Nassau County.</p>
        <div class="btn-row" style="margin-top:1.15rem">
          <a class="btn btn--sm btn--ink" href="${SITE_URL}/" data-google-link>Read our Google reviews ${icon('arrow-right')}</a>
          <a class="btn btn--sm btn--ghost" href="reviews.html">All reviews</a>
        </div>
      </div>
      <div class="review-hero__badges">
        <a class="angi-badge" href="https://www.angi.com/companylist/us/ny/medford/master-flooring-reviews-1.htm" target="_blank" rel="noopener">
          <img src="assets/img/badges/angi-super-service-award-2025.webp" alt="Angi Super Service Award 2025 badge" width="46" height="52" loading="lazy">
          <span><strong>Angi Super Service<br>Award 2025</strong><span>See our Angi profile</span></span>
        </a>
      </div>
    </div>`;
  },

  /* Three real customer reviews */
  TESTIMONIALS() {
    const items = [
      ['I', 'Ingrid W.', '“Highly recommend, hired to paint my dining room and kitchen. Did such a wonderful job, great work, clean and kept to his timeline. Reasonable priced. Already discussed future projects.”'],
      ['A', 'Anita M.', '“The team was very friendly. They painted my whole house and deck. Power washed my ceiling. They listened to what I needed for this project and gave me some good advice. Completed the project on time with a great job. I will definitely hire them to do more projects for me.”'],
      ['M', 'Miguel M.', '“Excellent work and service. Everything is literally perfect. Changed an office to a bedroom and the work is immaculate. All new sheetrock and paint. On time, did what they said with beautiful results. Highly recommend.”']
    ];
    return `<div class="testimonials">
${items
  .map(
    ([initial, name, quote], i) => `      <figure class="testimonial" data-reveal${i ? ` data-delay="${i}"` : ''}>
        <span style="color:var(--orange)" aria-hidden="true"><svg style="width:26px;height:26px"><use href="#i-quote"/></svg></span>
        <blockquote>${quote}</blockquote>
        <figcaption class="testimonial__foot">
          <span class="testimonial__avatar" aria-hidden="true">${initial}</span>
          <span><span class="testimonial__name">${name}</span><span class="testimonial__meta">Verified customer review</span></span>
        </figcaption>
      </figure>`
  )
  .join('\n')}
    </div>`;
  },

  /* Closing call to action */
  CTA(headline = "Let's price out your project.") {
    return `<section class="cta-band">
  <div class="container cta-band__inner">
    <div data-reveal>
      <span class="eyebrow">Ready when you are</span>
      <h2>${headline}</h2>
      <p>Tell us what you're thinking and we'll come take a look, answer your questions and put a real number in writing. Free, and no pressure either way.</p>
    </div>
    <div class="btn-row" data-reveal data-delay="1">
      <a class="btn btn--lg" href="contact.html">${icon('clipboard')} Get my free estimate</a>
      <a class="btn btn--lg btn--outline-light" href="${PHONE_HREF}">${icon('phone')} Call ${PHONE_DISPLAY}</a>
      <a class="btn btn--lg btn--outline-light" href="mailto:${EMAIL}">${icon('mail')} Email us</a>
    </div>
  </div>
</section>`;
  }
};

function expandBlocks(html) {
  return html.replace(/\{\{([A-Z]+)(?::([^}]*))?\}\}/g, (match, name, arg) => {
    const fn = BLOCKS[name];
    if (!fn) {
      console.warn(`  ! unknown block ${match}`);
      return match;
    }
    return fn(arg === undefined ? undefined : arg.trim());
  });
}

/* ----------------------------------------------------------------
   Layout
   ---------------------------------------------------------------- */
function layout(meta, body) {
  const url = meta.slug === 'index' ? `${SITE_URL}/` : `${SITE_URL}/${meta.slug}.html`;
  const ogImage = `${SITE_URL}/assets/img/logo/master-flooring-painting-logo.png`;
  const graph = [businessNode, {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: 'Master Flooring & Painting',
    publisher: { '@id': `${SITE_URL}/#business` },
    inLanguage: 'en-US'
  }, {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#business` },
    inLanguage: 'en-US'
  }];

  if (meta.breadcrumbs && meta.breadcrumbs.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${url}#breadcrumbs`,
      itemListElement: meta.breadcrumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: `${SITE_URL}/${c.href === 'index.html' ? '' : c.href}`
      }))
    });
  }

  const extra = (meta.schema || []).map(
    (s) => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`
  );

  return `<!DOCTYPE html>
<!--
  ⚠ GENERATED FILE — do not edit directly.
  Source: src/pages/${meta.slug}.html   ·   Rebuild: node build.js
-->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-YEGWGZ6R3Z"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-YEGWGZ6R3Z');
</script>

<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<meta name="theme-color" content="#101215">
<meta name="geo.region" content="US-NY">
<meta name="geo.placename" content="Long Island, New York">

<meta property="og:type" content="website">
<meta property="og:site_name" content="Master Flooring &amp; Painting">
<meta property="og:title" content="${meta.ogTitle || meta.title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImage}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${meta.ogTitle || meta.title}">
<meta name="twitter:description" content="${meta.description}">
<meta name="twitter:image" content="${ogImage}">

<link rel="icon" href="assets/img/logo/master-flooring-painting-logo.png" type="image/png">
<link rel="apple-touch-icon" href="assets/img/logo/master-flooring-painting-logo.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="assets/css/style.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&amp;family=Inter:wght@400;500;600;700&amp;display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800&amp;family=Inter:wght@400;500;600;700&amp;display=swap"></noscript>

<script type="application/ld+json">
${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}
</script>
${extra.join('\n')}
</head>
<body>
<a class="skip-link" href="#main">Skip to main content</a>
${sprite}

${header(meta.nav || '')}

<main id="main">
${body.trim()}
</main>

${footer()}

<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

/* ----------------------------------------------------------------
   Image placeholder numbering
   Every placeholder gets a unique site-wide number so supplied photo
   files can be named 001.jpg, 002.jpg … and dropped straight in.
   Numbers follow the page order below, then document order.
   ---------------------------------------------------------------- */
const PAGE_ORDER = [
  'index',
  'services',
  'interior-painting',
  'exterior-painting',
  'residential-painting',
  'commercial-painting',
  'flooring-installation',
  'power-washing',
  'our-work',
  'about',
  'reviews',
  'service-areas',
  'painters-suffolk-county',
  'painters-nassau-county',
  'contact',
  'thank-you',
  'privacy-policy',
  'accessibility',
  '404'
];

const imageManifest = [];
let imageCount = 0;

const PHOTO_DIRS = [path.join(ROOT, 'assets', 'img', 'photos'), path.join(ROOT, 'images')];
const PHOTO_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif']);
const SLOT_HINTS = [
  ['before', ['before']],
  ['after', ['after']],
  ['hero', ['hero', 'background']],
  ['map', ['map']],
  ['review', ['review', 'reviews', 'google']],
  ['cabinet', ['cabinet', 'cabinets']],
  ['kitchen', ['kitchen']],
  ['interior', ['interior']],
  ['exterior', ['exterior']],
  ['power', ['power', 'washing', 'wash']],
  ['flooring', ['flooring', 'floor', 'vinyl', 'laminate', 'tile']],
  ['color', ['color', 'paint_chip', 'paint-chip', 'swatch', 'consultation']],
  ['sheetrock', ['sheetrock', 'drywall']],
  ['deck', ['deck', 'stain']],
  ['rental', ['rental']],
  ['hallway', ['hallway']],
  ['living', ['living_room', 'living-room', 'living']],
  ['bedroom', ['bedroom']],
  ['porch', ['porch', 'entry']],
  ['corporate', ['corporate', 'office']],
  ['house', ['house', 'home']]
];
const HERO_BG_PLACEHOLDER_RE = /<div class="hero-bg" aria-hidden="true">\s*<!--[\s\S]*?-->\s*<div class="ph ph--dark"><\/div>\s*<\/div>/;
const INLINE_PLACEHOLDER_RE = /<(figure|div) class="([^"]*\bph\b[^"]*)">\s*<div class="ph__inner">\s*(<span class="ph__icon">[\s\S]*?<\/span>)\s*<span class="ph__label">([\s\S]*?)<\/span>\s*<p class="ph__desc">([\s\S]*?)<\/p>\s*<\/div>\s*<\/\1>/g;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const toWebPath = (filePath) => path.relative(ROOT, filePath).split(path.sep).join('/');

function collectSuppliedPhotos() {
  const photos = new Map();

  for (const dir of PHOTO_DIRS) {
    if (!fs.existsSync(dir)) continue;

    for (const name of fs.readdirSync(dir)) {
      const fullPath = path.join(dir, name);
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) continue;

      const ext = path.extname(name).toLowerCase();
      if (!PHOTO_EXTENSIONS.has(ext)) continue;

      const match = path.parse(name).name.match(/(\d{3}(?:\.5)?)$/);
      if (!match) continue;

      const n = match[1];
      const photo = {
        name,
        src: toWebPath(fullPath),
        mtimeMs: stat.mtimeMs
      };

      const list = photos.get(n) || [];
      list.push(photo);
      photos.set(n, list);
    }
  }

  return photos;
}

const suppliedPhotos = collectSuppliedPhotos();

function scorePhotoCandidate(photo, contextText) {
  const name = photo.name.toLowerCase();
  const context = contextText.toLowerCase();
  let score = 0;

  for (const [token, hints] of SLOT_HINTS) {
    if (!context.includes(token)) continue;
    if (hints.some((hint) => name.includes(hint))) score += 5;
  }

  if (context.includes('before') && name.includes('after')) score -= 4;
  if (context.includes('after') && name.includes('before')) score -= 4;
  if (context.includes('hero') && (name.includes('before') || name.includes('after'))) score -= 2;

  return score;
}

function pickSuppliedPhoto(n, contextText = '') {
  const candidates = suppliedPhotos.get(n) || [];
  if (!candidates.length) return null;
  if (candidates.length === 1) return candidates[0];

  return [...candidates].sort((a, b) => {
    const scoreDiff = scorePhotoCandidate(b, contextText) - scorePhotoCandidate(a, contextText);
    if (scoreDiff) return scoreDiff;
    return b.mtimeMs - a.mtimeMs || a.name.localeCompare(b.name);
  })[0];
}

const plainText = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function numberPlaceholders(html, slug) {
  const tag = (n) => `<span class="ph__num">${n}</span>`;
  const file = (n) => `<span class="ph__file">Name this file <code>${n}.jpg</code></span>`;
  const heroSlots = [];

  // Hero background captions
  html = html.replace(
    /<!--HERONOTE:([\s\S]*?)-->/g,
    (m, desc) => {
      const n = String(++imageCount).padStart(3, '0');
      imageManifest.push({ n, slug, where: 'Hero background', desc: plainText(desc) });
      heroSlots.push({ n, photo: pickSuppliedPhoto(n, `hero background ${plainText(desc)}`) });

      return '';
    }
  );

  for (const slot of heroSlots) {
    if (!slot.photo) continue;

    html = html.replace(
      HERO_BG_PLACEHOLDER_RE,
      `<div class="hero-bg" aria-hidden="true">\n    <img src="${escapeHtml(slot.photo.src)}" alt="" loading="eager" decoding="async" fetchpriority="high">\n  </div>`
    );
  }

  // Inline placeholders (figure/div.ph with a label + description)
  html = html.replace(
    INLINE_PLACEHOLDER_RE,
    (m, el, classes, iconMarkup, label, desc) => {
      // ph--half shares the previous slot as "NNN.5" so later numbers don't shift.
      const isHalf = /\bph--half\b/.test(classes);
      const cls = classes.replace(/\bph--half\b/, '').replace(/\s+/g, ' ').trim();
      const n = isHalf
        ? `${String(imageCount).padStart(3, '0')}.5`
        : String(++imageCount).padStart(3, '0');
      imageManifest.push({ n, slug, where: plainText(label), desc: plainText(desc) });

      const photo = pickSuppliedPhoto(n, `${plainText(label)} ${plainText(desc)}`);
      if (photo) {
        return `<${el} class="${cls} ph--photo">\n  <img class="ph__img" src="${escapeHtml(photo.src)}" alt="${escapeHtml(plainText(desc))}" loading="lazy" decoding="async">\n</${el}>`;
      }

      return `<${el} class="${cls}">\n  <div class="ph__inner">\n    ${iconMarkup}\n    <span class="ph__label">${tag(n)} ${label}</span>\n    <p class="ph__desc">${desc}</p>\n    ${file(n)}\n  </div>\n</${el}>`;
    }
  );

  return html;
}

/* ----------------------------------------------------------------
   Build
   ---------------------------------------------------------------- */
const META_RE = /^<!--meta\s*([\s\S]*?)\s*meta-->/;

const files = fs
  .readdirSync(PAGES)
  .filter((f) => f.endsWith('.html'))
  .sort((a, b) => {
    const ia = PAGE_ORDER.indexOf(path.basename(a, '.html'));
    const ib = PAGE_ORDER.indexOf(path.basename(b, '.html'));
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib) || a.localeCompare(b);
  });
const built = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(PAGES, file), 'utf8');
  const match = raw.match(META_RE);
  if (!match) {
    console.error(`✗ ${file}: missing <!--meta ... meta--> block`);
    process.exitCode = 1;
    continue;
  }
  let meta;
  try {
    meta = JSON.parse(match[1]);
  } catch (err) {
    console.error(`✗ ${file}: invalid meta JSON — ${err.message}`);
    process.exitCode = 1;
    continue;
  }
  meta.slug = meta.slug || path.basename(file, '.html');
  const body = numberPlaceholders(expandBlocks(raw.slice(match[0].length)), meta.slug);
  fs.writeFileSync(path.join(ROOT, `${meta.slug}.html`), layout(meta, body), 'utf8');
  built.push(meta);
  console.log(`✓ ${meta.slug}.html`);
}

/* Sitemap */
const today = new Date().toISOString().slice(0, 10);
const urls = built
  .filter((m) => !m.noindex)
  .map((m) => {
    const loc = m.slug === 'index' ? `${SITE_URL}/` : `${SITE_URL}/${m.slug}.html`;
    const priority = m.slug === 'index' ? '1.0' : m.priority || '0.8';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${m.changefreq || 'monthly'}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

fs.writeFileSync(
  path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
  'utf8'
);
console.log(`✓ sitemap.xml (${built.filter((m) => !m.noindex).length} urls)`);

/* Image placeholder checklist */
const manifestLines = [
  'MASTER FLOORING & PAINTING — IMAGE PLACEHOLDER LIST',
  'Generated by build.js. Do not edit by hand.',
  '',
  `${imageManifest.length} images needed.`,
  '',
  'Name each photo with its number and drop it in assets/img/photos/',
  'or the top-level images/ folder (e.g. 001.jpg, kitchen_002.webp …).',
  'The same number is shown on the website',
  'inside every placeholder box.',
  '',
  '='.repeat(100),
  ''
];
let currentPage = null;
for (const item of imageManifest) {
  if (item.slug !== currentPage) {
    currentPage = item.slug;
    manifestLines.push('', `── ${item.slug}.html ${'─'.repeat(Math.max(0, 80 - item.slug.length))}`, '');
  }
  manifestLines.push(`${item.n}.jpg   [${item.where}]`);
  manifestLines.push(`         ${item.desc}`);
  manifestLines.push('');
}
fs.writeFileSync(path.join(ROOT, 'IMAGE-LIST.txt'), manifestLines.join('\n'), 'utf8');
console.log(`✓ IMAGE-LIST.txt (${imageManifest.length} image placeholders numbered)`);
console.log(`✓ ${suppliedPhotos.size} supplied photos found`);

console.log(`\nBuilt ${built.length} pages.`);
