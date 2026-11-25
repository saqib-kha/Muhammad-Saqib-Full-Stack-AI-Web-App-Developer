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
}

export async function submitContactMessage(
  payload: ContactSubmissionPayload
): Promise<{ ok: boolean; error?: string }> {
  if (!insforge) {
    return {
      ok: false,
      error: 'Backend connection is not configured. Please check environment settings.',
    };
  }

  const name = payload.name.trim();
  const email = payload.email.trim();
  const projectType = payload.projectType.trim();
  const message = payload.message.trim();

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
