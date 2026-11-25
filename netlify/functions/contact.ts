const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 16_384;

function jsonResponse(body: Record<string, unknown>, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function getSafeInsForgeBaseUrl(): string {
  const raw = (
    process.env.INSFORGE_URL ||
    process.env.VITE_INSFORGE_URL ||
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
    ''
  )
    .trim()
    .replace(/\/+$/, '');

  if (!raw) return '';
  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== 'https:' || !parsed.hostname.endsWith('.insforge.app')) {
      return '';
    }
    return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, '');
  } catch {
    return '';
  }
}

function isSameOriginRequest(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true;
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host');
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function fetchWithColdStartRetry(url: string, init: RequestInit): Promise<Response> {
  const first = await fetch(url, init);
  if (first.status !== 503) return first;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return fetch(url, init);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'POST',
      },
    });
  }

  if (!isSameOriginRequest(req)) {
    return jsonResponse({ error: 'Cross-origin submission rejected.' }, 403);
  }

  const contentLength = Number(req.headers.get('content-length') || '0');
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'Request payload is too large.' }, 413);
  }

  let rawBody = '';
  try {
    rawBody = await req.text();
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400);
  }

  if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
    return jsonResponse({ error: 'Request payload is too large.' }, 413);
  }

  let payload: Record<string, unknown>;
  try {
    const parsed = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return jsonResponse({ error: 'Expected a JSON object.' }, 400);
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return jsonResponse({ error: 'Malformed JSON body.' }, 400);
  }

  // Honeypot anti-spam trap: silently accept without writing to DB
  if (typeof payload.website === 'string' && payload.website.trim().length > 0) {
    return jsonResponse({ ok: true }, 200);
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const projectType =
    typeof payload.projectType === 'string' ? payload.projectType.trim() : '';
  const message = typeof payload.message === 'string' ? payload.message.trim() : '';

  if (name.length < 2 || name.length > 120) {
    return jsonResponse({ error: 'Name must be between 2 and 120 characters.' }, 400);
  }
  if (email.length < 5 || email.length > 254 || !EMAIL_REGEX.test(email)) {
    return jsonResponse({ error: 'Please provide a valid email address.' }, 400);
  }
  if (projectType.length < 2 || projectType.length > 120) {
    return jsonResponse({ error: 'Please select a valid project type.' }, 400);
  }
  if (message.length < 12 || message.length > 4000) {
    return jsonResponse({ error: 'Message must be between 12 and 4000 characters.' }, 400);
  }

  const baseUrl = getSafeInsForgeBaseUrl();
  const anonKey = (
    process.env.INSFORGE_ANON_KEY ||
    process.env.VITE_INSFORGE_ANON_KEY ||
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
    ''
  ).trim();

  if (!baseUrl || !anonKey) {
    return jsonResponse(
      {
        error:
          'Server database environment variables (INSFORGE_URL, INSFORGE_ANON_KEY) are not configured on Netlify.',
      },
      503
    );
  }

  try {
    const dbRes = await fetchWithColdStartRetry(
      `${baseUrl}/api/database/records/contact_messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify([
          {
            name,
            email,
            project_type: projectType,
            message,
          },
        ]),
      }
    );

    if (!dbRes.ok) {
      return jsonResponse(
        { error: 'Unable to save your inquiry right now. Please try again shortly.' },
        502
      );
    }

    // Optional Resend email alert if configured in Netlify environment variables
    const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
    const contactToEmail = (process.env.CONTACT_TO_EMAIL || '').trim();
    const contactFromEmail = (
      process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>'
    ).trim();

    if (resendApiKey && contactToEmail && EMAIL_REGEX.test(contactToEmail)) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: contactFromEmail,
          to: [contactToEmail],
          reply_to: email,
          subject: `New Portfolio Inquiry: ${projectType} — ${name}`,
          html: `
            <h2>New Portfolio Contact Inquiry</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Project Type:</strong> ${escapeHtml(projectType)}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
          `,
        }),
      }).catch(() => {
        // Message is already durably saved in InsForge; do not fail user submission on email alert error
      });
    }

    return jsonResponse({ ok: true }, 201);
  } catch {
    return jsonResponse(
      { error: 'Unexpected server error while processing your message.' },
      500
    );
  }
}
