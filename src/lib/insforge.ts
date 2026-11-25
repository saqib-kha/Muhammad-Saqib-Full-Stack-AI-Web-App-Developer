import { createClient } from '@insforge/sdk';
import type { ProjectItem } from '../data/portfolioData';

const baseUrl = (
  import.meta.env.VITE_INSFORGE_URL ||
  import.meta.env.NEXT_PUBLIC_INSFORGE_URL ||
  ''
)
  .trim()
  .replace(/\/+$/, '');

const anonKey = (
  import.meta.env.VITE_INSFORGE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
  ''
).trim();

export const isInsForgeConfigured = Boolean(baseUrl && anonKey);

export const insforge = isInsForgeConfigured
  ? createClient({
      baseUrl,
      anonKey,
    })
  : null;

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

export function sanitizeExternalUrl(rawUrl: string | null | undefined): string {
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

export async function fetchPortfolioProjects(): Promise<ProjectItem[] | null> {
  // Prefer Netlify Functions backend route (/api/projects) when deployed on Netlify
  try {
    const apiRes = await fetch('/api/projects', {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    const contentType = apiRes.headers.get('content-type') || '';
    if (apiRes.ok && contentType.includes('application/json')) {
      const payload = (await apiRes.json()) as { projects?: ProjectItem[] | null };
      if (Array.isArray(payload.projects) && payload.projects.length > 0) {
        return payload.projects.map((item) => ({
          ...item,
          liveUrl: sanitizeExternalUrl(item.liveUrl),
          repoUrl: sanitizeExternalUrl(item.repoUrl),
        }));
      }
    }
  } catch {
    // Fall through to direct InsForge client when running outside Netlify Functions
  }

  if (!insforge) return null;

  const { data, error } = await insforge.database
    .from('portfolio_projects')
    .select(
      'id, slug, number, title, category, summary, image_url, stack, live_url, repo_url, is_placeholder, display_order'
    )
    .order('display_order', { ascending: true })
    .order('id', { ascending: true })
    .limit(12);

  if (error || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (data as PortfolioProjectRow[]).map((row) => ({
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
  }));
}

export interface ContactSubmissionPayload {
  name: string;
  email: string;
  projectType: string;
  message: string;
  website?: string;
}

export async function submitContactMessage(
  payload: ContactSubmissionPayload
): Promise<{ ok: boolean; error?: string }> {
  const name = payload.name.trim();
  const email = payload.email.trim();
  const projectType = payload.projectType.trim();
  const message = payload.message.trim();
  const website = (payload.website || '').trim();

  // Prefer Netlify Functions backend route (/api/contact) when deployed on Netlify
  try {
    const apiRes = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        projectType,
        message,
        website,
      }),
    });

    const contentType = apiRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const result = (await apiRes.json()) as { ok?: boolean; error?: string };
      if (apiRes.ok && result.ok) {
        return { ok: true };
      }
      // Return real server validation/backend errors (400/403/413/502/503) directly
      if (apiRes.status !== 404) {
        return {
          ok: false,
          error:
            result.error ||
            'Unable to deliver your message right now. Please try again in a moment.',
        };
      }
    }
  } catch {
    // Fall through to direct InsForge client in local Vite dev preview
  }

  if (website.length > 0) {
    return { ok: true };
  }

  if (!insforge) {
    return {
      ok: false,
      error: 'Backend connection is not configured. Please check environment settings.',
    };
  }

  // Do not chain .select() here because public.contact_messages is write-only for anon/authenticated via RLS
  const { error } = await insforge.database.from('contact_messages').insert([
    {
      name,
      email,
      project_type: projectType,
      message,
    },
  ]);

  if (error) {
    return {
      ok: false,
      error: 'Unable to deliver your message right now. Please try again in a moment.',
    };
  }

  return { ok: true };
}
