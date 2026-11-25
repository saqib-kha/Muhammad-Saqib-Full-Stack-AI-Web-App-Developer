import { useState } from 'react';
import { ArrowRight, Layers } from 'lucide-react';
import type { ProjectItem } from '../data/portfolioData';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onOpenOverview: () => void;
}

function ProjectCardPreview({ project }: { project: ProjectItem }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#161618] via-[#0E0E10] to-[#1A0507] p-6 text-center">
        <Layers className="h-8 w-8 text-[#D91C24]" aria-hidden="true" />
        <p className="mt-3 font-display text-xl uppercase tracking-wider text-white">
          {project.title}
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-neutral-400">
          {project.category}
        </p>
      </div>
    );
  }

  return (
    <img
      src={project.image}
      alt={`${project.title} — ${project.category} preview`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
    />
  );
}

export default function ProjectsSection({
  projects,
  onSelectProject,
  onOpenOverview,
}: ProjectsSectionProps) {
  return (
    <section
      id="projects"
      aria-labelledby="selected-projects-heading"
      className="w-full bg-[#060606] border-b border-white/10"
    >
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        {/* Section Header Row matching reference */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2
            id="selected-projects-heading"
            className="text-lg sm:text-xl font-bold tracking-[0.12em] text-white uppercase"
          >
            SELECTED PROJECTS
          </h2>

          <button
            type="button"
            onClick={onOpenOverview}
            className="group inline-flex min-h-[40px] items-center gap-3 text-[11px] font-medium tracking-[0.16em] text-neutral-300 uppercase transition-colors hover:text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>VIEW ALL PROJECTS</span>
            <ArrowRight
              className="h-4 w-4 text-neutral-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#D91C24]"
              aria-hidden="true"
            />
          </button>
        </div>

        {/* Horizontal Premium Project Cards */}
        <div
          className={`mt-8 grid grid-cols-1 gap-7 ${
            projects.length >= 4
              ? 'md:grid-cols-2 lg:grid-cols-4 lg:gap-6'
              : 'md:grid-cols-3 lg:gap-8'
          }`}
        >
          {projects.map((project) => (
            <article key={project.id} className="group flex flex-col">
              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className="flex flex-col text-left focus-visible:outline-none cursor-pointer"
                aria-label={`Inspect ${project.title} (${project.category})`}
              >
                {/* Website Preview Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border border-white/12 bg-[#101012] transition-colors duration-200 group-hover:border-[#D91C24]/55">
                  <ProjectCardPreview project={project} />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-60 transition-opacity duration-200 group-hover:opacity-25"
                  />
                </div>

                {/* Card Footer Metadata matching reference: Red Number + Title/Category + Arrow */}
                <div className="mt-4 flex items-center justify-between gap-3 border-b border-white/[0.06] pb-4 transition-colors duration-200 group-hover:border-[#D91C24]/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-display text-3xl sm:text-[2rem] font-semibold leading-none text-[#D91C24] tabular-nums shrink-0">
                      {project.number}
                    </span>

                    <div className="min-w-0">
                      <h3 className="truncate text-xs sm:text-[13px] font-semibold tracking-[0.08em] text-white uppercase transition-colors group-hover:text-white">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 truncate text-[10px] sm:text-[11px] font-normal tracking-[0.12em] text-neutral-400 uppercase">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-neutral-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#D91C24]"
                    aria-hidden="true"
                  />
                </div>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
