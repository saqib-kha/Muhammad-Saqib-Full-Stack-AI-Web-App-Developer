import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { ExternalLink, Pencil, RotateCcw, Upload, X } from 'lucide-react';
import type { ProjectItem } from '../data/portfolioData';
import { sanitizeExternalUrl } from '../lib/insforge';

interface ProjectModalProps {
  project: ProjectItem | null;
  allProjects: ProjectItem[];
  showAllMode: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
  onSaveProject: (updated: ProjectItem) => void;
  onResetProjects: () => void;
}

export default function ProjectModal({
  project,
  allProjects,
  showAllMode,
  onClose,
  onSelectProject,
  onSaveProject,
  onResetProjects,
}: ProjectModalProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProjectItem | null>(project);

  useEffect(() => {
    setDraft(project);
    setEditing(false);
  }, [project, showAllMode]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!project && !showAllMode) return null;

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !draft) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDraft({ ...draft, image: reader.result, isPlaceholder: false });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    onSaveProject({
      ...draft,
      liveUrl: sanitizeExternalUrl(draft.liveUrl),
      repoUrl: sanitizeExternalUrl(draft.repoUrl),
      isPlaceholder: false,
    });
    setEditing(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={showAllMode ? 'All selected projects' : project?.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-white/15 bg-[#0A0A0B] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-[#0A0A0B]/95 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3 min-w-0">
            {project && !showAllMode ? (
              <>
                <span className="font-display text-2xl font-semibold text-[#D91C24] tabular-nums">
                  {project.number}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold tracking-[0.1em] text-white uppercase">
                    {project.title}
                  </h3>
                  <p className="truncate text-[11px] tracking-[0.14em] text-neutral-400 uppercase">
                    {project.category}
                  </p>
                </div>
              </>
            ) : (
              <div>
                <h3 className="text-sm font-semibold tracking-[0.12em] text-white uppercase">
                  ALL SELECTED PROJECTS
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Select a project to inspect or customize its placeholder content.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 bg-white/[0.03] text-neutral-300 transition-colors hover:border-[#D91C24] hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* All Projects List View */}
        {showAllMode && (
          <div className="p-6 space-y-4">
            {allProjects.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 border border-white/10 bg-[#0F0F11] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="h-16 w-28 shrink-0 border border-white/10 object-cover object-top"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-display text-xl font-semibold text-[#D91C24] tabular-nums">
                        {item.number}
                      </span>
                      <h4 className="truncate text-sm font-semibold tracking-[0.06em] text-white uppercase">
                        {item.title}
                      </h4>
                    </div>
                    <p className="mt-0.5 text-[11px] tracking-[0.12em] text-neutral-400 uppercase">
                      {item.category}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-neutral-400">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectProject(item)}
                  className="min-h-[40px] shrink-0 border border-white/15 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:border-[#D91C24] hover:bg-[#D91C24] whitespace-nowrap cursor-pointer"
                >
                  Inspect / Edit
                </button>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onResetProjects}
                className="inline-flex min-h-[40px] items-center gap-2 text-xs font-medium text-neutral-400 transition-colors hover:text-white cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset Placeholders to Default</span>
              </button>
            </div>
          </div>
        )}

        {/* Single Project Detail / Edit View */}
        {project && !showAllMode && draft && (
          <div className="p-6">
            {!editing ? (
              <div>
                <div className="overflow-hidden border border-white/10 bg-[#111113]">
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    referrerPolicy="no-referrer"
                    className="aspect-[16/10] w-full object-cover object-top"
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-[#D91C24] uppercase">
                    {project.isPlaceholder ? 'Editable Project Placeholder' : 'Project Showcase'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="inline-flex min-h-[38px] items-center gap-2 border border-white/15 bg-white/[0.03] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.12em] text-neutral-200 uppercase transition-colors hover:border-[#D91C24] hover:text-white cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Edit Placeholder</span>
                  </button>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                  {project.summary}
                </p>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-neutral-400 uppercase">
                    Technologies Used
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-[3px] border border-white/15 bg-white/[0.02] px-2.5 py-1 text-[11px] tracking-[0.08em] text-neutral-200 uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {(sanitizeExternalUrl(project.liveUrl) ||
                  sanitizeExternalUrl(project.repoUrl)) && (
                  <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                    {sanitizeExternalUrl(project.liveUrl) && (
                      <a
                        href={sanitizeExternalUrl(project.liveUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[42px] items-center gap-2 border border-[#D91C24] bg-[#D91C24] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#B8141B]"
                      >
                        <span>Visit Live Site</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {sanitizeExternalUrl(project.repoUrl) && (
                      <a
                        href={sanitizeExternalUrl(project.repoUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[42px] items-center gap-2 border border-white/20 px-5 py-2 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:border-[#D91C24]"
                      >
                        <span>View Repository</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="edit-project-title"
                      className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase"
                    >
                      Project Title
                    </label>
                    <input
                      id="edit-project-title"
                      type="text"
                      required
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                      className="mt-1.5 w-full min-h-[42px] border border-white/15 bg-[#111113] px-3.5 text-sm text-white focus:border-[#D91C24] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-project-category"
                      className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase"
                    >
                      Category
                    </label>
                    <input
                      id="edit-project-category"
                      type="text"
                      required
                      value={draft.category}
                      onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                      className="mt-1.5 w-full min-h-[42px] border border-white/15 bg-[#111113] px-3.5 text-sm text-white focus:border-[#D91C24] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="edit-project-summary"
                    className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase"
                  >
                    Project Description
                  </label>
                  <textarea
                    id="edit-project-summary"
                    rows={3}
                    value={draft.summary}
                    onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                    className="mt-1.5 w-full border border-white/15 bg-[#111113] p-3 text-sm text-white focus:border-[#D91C24] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="edit-project-live"
                      className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase"
                    >
                      Live Website URL (Optional)
                    </label>
                    <input
                      id="edit-project-live"
                      type="url"
                      placeholder="https://example.com"
                      value={draft.liveUrl}
                      onChange={(e) => setDraft({ ...draft, liveUrl: e.target.value })}
                      className="mt-1.5 w-full min-h-[42px] border border-white/15 bg-[#111113] px-3.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#D91C24] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-project-repo"
                      className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase"
                    >
                      GitHub Repository URL (Optional)
                    </label>
                    <input
                      id="edit-project-repo"
                      type="url"
                      placeholder="https://github.com/..."
                      value={draft.repoUrl}
                      onChange={(e) => setDraft({ ...draft, repoUrl: e.target.value })}
                      className="mt-1.5 w-full min-h-[42px] border border-white/15 bg-[#111113] px-3.5 text-sm text-white placeholder:text-neutral-600 focus:border-[#D91C24] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] font-medium tracking-[0.14em] text-neutral-300 uppercase">
                    Replace Preview Screenshot
                  </span>
                  <label className="mt-1.5 flex min-h-[44px] cursor-pointer items-center justify-center gap-2 border border-dashed border-white/20 bg-[#111113] px-4 py-3 text-xs text-neutral-300 transition-colors hover:border-[#D91C24] hover:text-white">
                    <Upload className="h-4 w-4 text-[#D91C24]" aria-hidden="true" />
                    <span>Upload Project Image (PNG, JPG, WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="sr-only"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDraft(project);
                      setEditing(false);
                    }}
                    className="min-h-[42px] border border-white/15 px-4 py-2 text-xs font-medium tracking-[0.12em] text-neutral-300 uppercase hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="min-h-[42px] border border-[#D91C24] bg-[#D91C24] px-5 py-2 text-xs font-semibold tracking-[0.14em] text-white uppercase hover:bg-[#B8141B] cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
