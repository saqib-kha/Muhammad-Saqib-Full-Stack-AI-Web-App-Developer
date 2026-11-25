import { Code2, Compass, PenTool, Search, Send } from 'lucide-react';
import {
  EDUCATION,
  PROFILE,
  SKILLS,
  WORK_PROCESS,
  type WorkProcessStep,
} from '../data/portfolioData';
import { FourPointStar } from './Navbar';

function ProcessIcon({ name }: { name: WorkProcessStep['iconName'] }) {
  const iconClass = 'h-4 w-4 text-neutral-200';
  switch (name) {
    case 'discover':
      return <Search className={iconClass} aria-hidden="true" />;
    case 'plan':
      return <Compass className={iconClass} aria-hidden="true" />;
    case 'design':
      return <PenTool className={iconClass} aria-hidden="true" />;
    case 'develop':
      return <Code2 className={iconClass} aria-hidden="true" />;
    case 'deliver':
      return <Send className={iconClass} aria-hidden="true" />;
  }
}

export default function EditorialBand() {
  return (
    <section
      aria-label="Education, Skills, Work Process, and Philosophy"
      className="w-full bg-[#060606] border-b border-white/10"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* SECTION 3 — EDUCATION & SKILLS (Left Column) */}
          <div
            id="skills"
            className="scroll-mt-20 py-14 lg:col-span-4 lg:py-16 lg:pr-10"
          >
            <h2 className="text-lg sm:text-xl font-bold tracking-[0.12em] text-white uppercase">
              EDUCATION &amp; SKILLS
            </h2>

            {/* Education Block */}
            <div className="mt-8">
              <h3 className="text-[11px] font-semibold tracking-[0.18em] text-[#D91C24] uppercase">
                EDUCATION
              </h3>

              <div className="mt-5 space-y-6">
                {EDUCATION.map((edu) => (
                  <div key={edu.degree} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm sm:text-[15px] font-semibold text-white">
                        {edu.degree}
                      </p>
                      <span className="text-xs font-medium text-[#D91C24] tabular-nums whitespace-nowrap shrink-0">
                        {edu.period}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-neutral-400">
                      {edu.field} · {edu.institution}
                    </p>

                    <p className="pt-0.5 text-xs font-medium tracking-[0.06em] text-neutral-300">
                      {edu.grade}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle Horizontal Hairline */}
            <div className="my-8 h-px w-full bg-white/10" />

            {/* Skills Block — Small outlined tags matching the reference image */}
            <div>
              <h3 className="text-[11px] font-semibold tracking-[0.18em] text-[#D91C24] uppercase">
                SKILLS
              </h3>

              <ul
                aria-label="Technical skills"
                className="mt-5 flex flex-wrap gap-2.5"
              >
                {SKILLS.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-[3px] border border-white/15 bg-white/[0.02] px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] text-neutral-200 uppercase transition-colors duration-200 hover:border-[#D91C24]/70 hover:bg-[#D91C24]/10 hover:text-white whitespace-nowrap"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION 4 — WORK PROCESS (Center Column) */}
          <div
            id="process"
            className="scroll-mt-20 border-t border-white/10 py-14 lg:col-span-5 lg:border-t-0 lg:border-l lg:border-white/10 lg:px-10 lg:py-16"
          >
            <h2 className="text-lg sm:text-xl font-bold tracking-[0.12em] text-white uppercase">
              WORK PROCESS
            </h2>

            <ol className="relative mt-8 space-y-7">
              {WORK_PROCESS.map((step, index) => {
                const isLast = index === WORK_PROCESS.length - 1;
                return (
                  <li key={step.number} className="relative flex items-start gap-4 sm:gap-5">
                    {/* Red condensed step number */}
                    <span className="w-7 pt-2 font-display text-xl font-semibold leading-none text-[#D91C24] tabular-nums shrink-0">
                      {step.number}
                    </span>

                    {/* Circular Icon Node + Thin Vertical Connecting Line */}
                    <div className="relative flex flex-col items-center shrink-0">
                      <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#D91C24]/45 bg-[#120607] shadow-[0_0_20px_rgba(217,28,36,0.12)]">
                        <ProcessIcon name={step.iconName} />
                      </span>
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className="mt-1.5 h-10 w-px bg-gradient-to-b from-[#D91C24]/55 via-white/15 to-[#D91C24]/35"
                        />
                      )}
                    </div>

                    {/* Step Title & Description */}
                    <div className="pt-0.5 min-w-0">
                      <h3 className="text-xs sm:text-[13px] font-semibold tracking-[0.14em] text-[#D91C24] uppercase">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-[13px] leading-relaxed text-neutral-300/85">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* SECTION 5 — QUOTE PANEL (Right Column, full-bleed dark-red editorial block) */}
          <aside
            aria-label="Personal design and engineering philosophy"
            className="quote-panel-bg relative flex flex-col justify-between overflow-hidden px-7 py-12 sm:px-9 lg:col-span-3 lg:px-8 lg:py-16"
          >
            {/* Subtle dark architectural shadow overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/35"
            />

            <div className="relative z-10">
              {/* Opening Quotation Mark matching reference */}
              <div
                aria-hidden="true"
                className="font-display text-7xl leading-none text-[#E5222A] select-none -mb-3"
              >
                &ldquo;
              </div>

              <blockquote className="text-lg sm:text-[1.15rem] font-normal leading-relaxed text-white/95">
                &ldquo;{PROFILE.quote}&rdquo;
              </blockquote>

              {/* Handwritten Signature matching reference */}
              <div className="mt-10">
                <p className="font-script text-4xl sm:text-[2.6rem] leading-none text-white">
                  {PROFILE.signature}
                </p>
                <svg
                  viewBox="0 0 180 12"
                  fill="none"
                  aria-hidden="true"
                  className="mt-1.5 h-3 w-36 text-white/45"
                >
                  <path
                    d="M2 8.5C44 3.5 112 2.5 178 6.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom Callout matching reference */}
            <div className="relative z-10 mt-12 pt-6 border-t border-white/10">
              <p className="text-[11px] font-medium leading-relaxed tracking-[0.16em] text-white/80 uppercase">
                LET&apos;S CREATE
                <br />
                SOMETHING GREAT
                <br />
                TOGETHER.
              </p>
              <FourPointStar className="mt-4 h-3.5 w-3.5 text-[#F02A33]" />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
