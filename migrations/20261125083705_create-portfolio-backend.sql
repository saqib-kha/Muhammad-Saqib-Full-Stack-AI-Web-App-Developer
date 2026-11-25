-- Portfolio backend tables for Muhammad Saqib's personal portfolio
-- 1. public.contact_messages: write-only for public visitors (anon/authenticated); readable only by project_admin
-- 2. public.portfolio_projects: publicly readable project showcase; managed by project_admin

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL CHECK (char_length(trim(name)) BETWEEN 2 AND 120),
  email TEXT NOT NULL CHECK (char_length(trim(email)) BETWEEN 5 AND 254 AND position('@' in email) > 1),
  project_type TEXT NOT NULL CHECK (char_length(trim(project_type)) BETWEEN 2 AND 120),
  message TEXT NOT NULL CHECK (char_length(trim(message)) BETWEEN 12 AND 4000),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at
  ON public.contact_messages (created_at DESC);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.contact_messages FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT (name, email, project_type, message) ON public.contact_messages TO anon, authenticated;

DROP POLICY IF EXISTS "Public visitors can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public visitors can submit contact messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) >= 2
    AND char_length(trim(email)) >= 5
    AND char_length(trim(message)) >= 12
  );

DROP TRIGGER IF EXISTS contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  number TEXT NOT NULL,
  title TEXT NOT NULL CHECK (char_length(trim(title)) BETWEEN 1 AND 120),
  category TEXT NOT NULL CHECK (char_length(trim(category)) BETWEEN 1 AND 120),
  summary TEXT NOT NULL CHECK (char_length(trim(summary)) BETWEEN 1 AND 2000),
  image_url TEXT NOT NULL,
  image_key TEXT,
  stack TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT NOT NULL DEFAULT '',
  repo_url TEXT NOT NULL DEFAULT '',
  is_placeholder BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_projects_display_order
  ON public.portfolio_projects (display_order ASC);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.portfolio_projects FROM anon, authenticated;
GRANT SELECT ON public.portfolio_projects TO anon, authenticated;

DROP POLICY IF EXISTS "Anyone can view portfolio projects" ON public.portfolio_projects;
CREATE POLICY "Anyone can view portfolio projects"
  ON public.portfolio_projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP TRIGGER IF EXISTS portfolio_projects_updated_at ON public.portfolio_projects;
CREATE TRIGGER portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

INSERT INTO public.portfolio_projects (
  slug,
  number,
  title,
  category,
  summary,
  image_url,
  stack,
  live_url,
  repo_url,
  is_placeholder,
  display_order
) VALUES
  (
    'ai-web-application',
    '01',
    'AI Web Application',
    'AI-POWERED WEB APP',
    'Editable project placeholder showcasing a responsive AI-powered web application combining clean front-end architecture with modern AI workflows.',
    '/src/assets/images/project_ai_webapp_1795505111667.jpg',
    ARRAY['JavaScript', 'Full Stack Development', 'Google AI Studio', 'Claude AI'],
    '',
    '',
    true,
    1
  ),
  (
    'ecommerce-website',
    '02',
    'E-Commerce Website',
    'FULL STACK STOREFRONT',
    'Editable project placeholder presenting a clean, conversion-focused e-commerce storefront with structured product browsing, database integration, and responsive UI.',
    '/src/assets/images/project_ecommerce_1795505111734.jpg',
    ARRAY['HTML', 'CSS', 'JavaScript', 'C#', 'MySQL', 'Bootstrap'],
    '',
    '',
    true,
    2
  ),
  (
    'wordpress-website',
    '03',
    'WordPress Website',
    'CUSTOM CMS & WEB DESIGN',
    'Editable project placeholder demonstrating a tailored WordPress business website engineered for clean visual hierarchy, easy content management, and fast load performance.',
    '/src/assets/images/project_wordpress_1795505111907.jpg',
    ARRAY['WordPress', 'HTML', 'CSS', 'Front-End Development'],
    '',
    '',
    true,
    3
  )
ON CONFLICT (slug) DO NOTHING;
