interface PortfolioProjectRow {
  id: string;
  slug: string;
  number: string;
  title: string;
  category: string;
  summary: string;
  image_url: string;
  stack: string[] | null;
  live_url: string | null;
  repo_url: string | null;
  is_placeholder: boolean;
  display_order: number;
}

function sanitizeExternalUrl(rawUrl: string | null | undefined): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return '';
  } catch {
    return '';
  }
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

async function fetchWithColdStartRetry(url: string, init: RequestInit): Promise<Response> {
  const first = await fetch(url, init);
  if (first.status !== 503) return first;
  await new Promise((resolve) => setTimeout(resolve, 1200));
  return fetch(url, init);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'GET',
      },
    });
  }

  const baseUrl = getSafeInsForgeBaseUrl();
  const anonKey = (
    process.env.INSFORGE_ANON_KEY ||
    process.env.VITE_INSFORGE_ANON_KEY ||
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
    ''
  ).trim();

  if (!baseUrl || !anonKey) {
    return new Response(
      JSON.stringify({
        projects: null,
        source: 'unconfigured',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }

  const selectColumns =
    'id,slug,number,title,category,summary,image_url,stack,live_url,repo_url,is_placeholder,display_order';
  const endpoint = `${baseUrl}/api/database/records/portfolio_projects?select=${encodeURIComponent(
    selectColumns
  )}&order=display_order.asc,id.asc&limit=12`;

  try {
    const upstream = await fetchWithColdStartRetry(endpoint, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
      },
    });

    if (!upstream.ok) {
      return new Response(
        JSON.stringify({
          error: 'Failed to load portfolio projects from backend.',
        }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const rows = (await upstream.json()) as PortfolioProjectRow[];
    const projects = Array.isArray(rows)
      ? rows.map((row) => ({
          id: row.slug || row.id,
          number: row.number,
          title: row.title,
          category: row.category,
          summary: row.summary,
          image: row.image_url,
          stack: Array.isArray(row.stack) ? row.stack : [],
          liveUrl: sanitizeExternalUrl(row.live_url),
          repoUrl: sanitizeExternalUrl(row.repo_url),
          isPlaceholder: Boolean(row.is_placeholder),
        }))
      : [];

    return new Response(
      JSON.stringify({
        projects,
        source: 'insforge',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: 'Unexpected error while loading projects.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
