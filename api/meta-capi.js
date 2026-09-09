/* =============================================================
   Meta Conversions API relay (Vercel serverless function)

   The browser posts a minimal event here; this route adds the
   server-derived match keys, hashes PII and forwards to Meta.
   META_CAPI_TOKEN is read from the environment and never leaves
   the server.
   ============================================================= */

const crypto = require('crypto');

const GRAPH_VERSION = 'v21.0';
const ALLOWED_EVENTS = new Set(['PageView', 'Lead']);
const MAX_EVENT_AGE_SECONDS = 7 * 24 * 60 * 60; // Meta rejects events older than 7 days
const CLOCK_SKEW_SECONDS = 120;

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

/* Meta wants a trimmed, lowercased address hashed with SHA-256. */
function normalizeEmail(raw) {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return null;
  return email;
}

/* Meta wants digits only, including country code. */
function normalizePhone(raw) {
  if (typeof raw !== 'string') return null;
  let digits = raw.replace(/\D/g, '');
  if (digits.length === 10) digits = '1' + digits; // US national -> E.164 digits
  if (digits.length < 11 || digits.length > 15) return null;
  return digits;
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (typeof raw === 'string' && raw.trim()) return raw.split(',')[0].trim();
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim();
  return (req.socket && req.socket.remoteAddress) || undefined;
}

function readBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch (err) {
      return null;
    }
  }
  if (req.body && typeof req.body === 'object') return req.body;
  return null;
}

function httpsUrl(value) {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  } catch (err) {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_TOKEN;
  if (!pixelId || !accessToken) {
    console.error('Meta CAPI is not configured (missing META_PIXEL_ID or META_CAPI_TOKEN)');
    return res.status(500).json({ error: 'Not configured' });
  }

  const body = readBody(req);
  if (!body) return res.status(400).json({ error: 'Invalid body' });

  const eventName = body.event_name;
  if (!ALLOWED_EVENTS.has(eventName)) return res.status(400).json({ error: 'Unsupported event' });

  const eventId = body.event_id;
  if (typeof eventId !== 'string' || eventId.length < 8 || eventId.length > 128) {
    return res.status(400).json({ error: 'Invalid event_id' });
  }

  const eventTime = Number(body.event_time);
  const now = Math.floor(Date.now() / 1000);
  if (
    !Number.isInteger(eventTime) ||
    eventTime > now + CLOCK_SKEW_SECONDS ||
    eventTime < now - MAX_EVENT_AGE_SECONDS
  ) {
    return res.status(400).json({ error: 'Invalid event_time' });
  }

  const incoming = body.user_data && typeof body.user_data === 'object' ? body.user_data : {};
  const userData = {
    client_ip_address: clientIp(req),
    client_user_agent: req.headers['user-agent']
  };

  if (typeof incoming.fbp === 'string' && /^fb\.\d\.\d+\.\d+$/.test(incoming.fbp)) {
    userData.fbp = incoming.fbp;
  }
  if (typeof incoming.fbc === 'string' && /^fb\.\d\.\d+\.[\w.-]+$/.test(incoming.fbc)) {
    userData.fbc = incoming.fbc;
  }

  const email = normalizeEmail(incoming.em);
  if (email) userData.em = [sha256(email)];

  const phone = normalizePhone(incoming.ph);
  if (phone) userData.ph = [sha256(phone)];

  const event = {
    event_name: eventName,
    event_time: eventTime,
    event_id: eventId,
    action_source: 'website',
    user_data: userData
  };

  const sourceUrl = httpsUrl(body.event_source_url) || httpsUrl(req.headers.referer);
  if (sourceUrl) event.event_source_url = sourceUrl;

  const payload = { data: [event], access_token: accessToken };
  if (process.env.META_TEST_EVENT_CODE) payload.test_event_code = process.env.META_TEST_EVENT_CODE;

  try {
    const response = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Status and event name only — the response body can echo back user data.
      console.error('Meta CAPI rejected event', { event_name: eventName, status: response.status });
      return res.status(502).json({ error: 'Upstream rejected event' });
    }

    return res.status(202).json({ ok: true });
  } catch (err) {
    console.error('Meta CAPI request failed', { event_name: eventName, message: err && err.message });
    return res.status(502).json({ error: 'Upstream request failed' });
  }
};
