import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ProjectsSection from './components/ProjectsSection';
import EditorialBand from './components/EditorialBand';
import ContactSection, { type ContactLinksState } from './components/ContactSection';
import ProjectModal from './components/ProjectModal';
import {
  DEFAULT_PROJECTS,
  PROFILE,
  type ProjectItem,
} from './data/portfolioData';
import { fetchPortfolioProjects } from './lib/insforge';

const STORAGE_PROJECTS_KEY = 'saqib_portfolio_projects_v1';

const DEFAULT_CONTACT_LINKS: ContactLinksState = {
  email: PROFILE.contactPlaceholders.email,
  linkedin: PROFILE.contactPlaceholders.linkedin,
  github: PROFILE.contactPlaceholders.github,
};

function loadStoredProjects(): ProjectItem[] | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_PROJECTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProjectItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

function mergeProjects(base: ProjectItem[], overrides: ProjectItem[] | null): ProjectItem[] {
  if (!overrides || overrides.length === 0) return base;
  const overrideById = new Map(overrides.map((item) => [item.id, item]));
  const merged = base.map((item) => overrideById.get(item.id) ?? item);
  for (const extra of overrides) {
    if (!base.some((item) => item.id === extra.id)) {
      merged.push(extra);
    }
  }
  return merged;
}

export default function App() {
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    mergeProjects(DEFAULT_PROJECTS, loadStoredProjects())
  );

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [showAllProjectsModal, setShowAllProjectsModal] = useState(false);

  useEffect(() => {
    let active = true;
    fetchPortfolioProjects()
      .then((remoteProjects) => {
        if (active && remoteProjects && remoteProjects.length > 0) {
          setProjects(mergeProjects(remoteProjects, loadStoredProjects()));
        }
      })
      .catch(() => {
        // Keep DEFAULT_PROJECTS fallback silently on network error
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSaveProject = (updated: ProjectItem) => {
    setProjects((prev) => {
      const next = prev.map((item) => (item.id === updated.id ? updated : item));
      try {
        window.localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }
      return next;
    });
    setSelectedProject(updated);
  };

  const handleResetProjects = () => {
    try {
      window.localStorage.removeItem(STORAGE_PROJECTS_KEY);
    } catch {
      // Ignore
    }
    setProjects(DEFAULT_PROJECTS);
    fetchPortfolioProjects()
      .then((remoteProjects) => {
        if (remoteProjects && remoteProjects.length > 0) {
          setProjects(remoteProjects);
        }
      })
      .catch(() => {
        // Keep defaults
      });
  };

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <Navbar />

      <main>
        {/* SECTION 1 — HERO */}
        <HeroSection portraitSrc={PROFILE.defaultPortrait} />

        {/* SECTION 2 — SELECTED PROJECTS */}
        <ProjectsSection
          projects={projects}
          onSelectProject={(project) => {
            setShowAllProjectsModal(false);
            setSelectedProject(project);
          }}
          onOpenOverview={() => {
            setSelectedProject(null);
            setShowAllProjectsModal(true);
          }}
        />

        {/* SECTIONS 3, 4 & 5 — EDUCATION & SKILLS, WORK PROCESS, QUOTE PANEL */}
        <EditorialBand />

        {/* SECTION 6 — CONTACT & LAPTOP MOCKUP */}
        <ContactSection
          portraitSrc={PROFILE.defaultPortrait}
          contactLinks={DEFAULT_CONTACT_LINKS}
        />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-white/10 bg-[#060606]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-neutral-500 sm:flex-row sm:px-8 lg:px-12">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {PROFILE.fullName} · {PROFILE.location}
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] text-neutral-400 uppercase transition-colors hover:text-white cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="h-3.5 w-3.5 text-[#D91C24]" aria-hidden="true" />
          </button>
        </div>
      </footer>

      {/* Project Inspection & Placeholder Editor Modal */}
      <ProjectModal
        project={selectedProject}
        allProjects={projects}
        showAllMode={showAllProjectsModal}
        onClose={() => {
          setSelectedProject(null);
          setShowAllProjectsModal(false);
        }}
        onSelectProject={(project) => {
          setShowAllProjectsModal(false);
          setSelectedProject(project);
        }}
        onSaveProject={handleSaveProject}
        onResetProjects={handleResetProjects}
      />
    </div>
  );
}
