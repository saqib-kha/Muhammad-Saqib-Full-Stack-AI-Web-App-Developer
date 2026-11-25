function getInsForgeConfig(): { baseUrl: string; anonKey: string } {
  const baseUrl = (
    process.env.INSFORGE_URL ||
    process.env.VITE_INSFORGE_URL ||
    process.env.NEXT_PUBLIC_INSFORGE_URL ||
    ''
  )
    .trim()
    .replace(/\/+$/, '');

  const anonKey = (
    process.env.INSFORGE_ANON_KEY ||
    process.env.VITE_INSFORGE_ANON_KEY ||
    process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
    ''
  ).trim();

  return { baseUrl, anonKey };
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

  const { baseUrl, anonKey } = getInsForgeConfig();

  return new Response(
    JSON.stringify({
      ok: true,
      service: 'muhammad-saqib-portfolio-netlify-backend',
      databaseConfigured: Boolean(baseUrl && anonKey),
      timestamp: new Date().toISOString(),
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
