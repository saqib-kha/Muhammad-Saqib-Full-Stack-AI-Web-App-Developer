import { useState } from 'react';
import { Globe, User } from 'lucide-react';
import { PROFILE, PROFILE_HIGHLIGHTS } from '../data/portfolioData';
import { FourPointStar } from './Navbar';

interface HeroSectionProps {
  portraitSrc: string;
}

export default function HeroSection({ portraitSrc }: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative w-full overflow-hidden bg-[#060606] border-b border-white/10"
    >
      {/* Subtle dark crimson ambient lighting behind giant typography & portrait */}
      <div
        aria-hidden="true"
        className="hero-crimson-glow pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 pt-4 pb-10 sm:px-8 sm:pt-6 lg:px-12 lg:pt-4 lg:pb-0">
        {/* Oversized dark-red background name matching reference "PORTFOLIO" */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative z-0 flex w-full justify-center overflow-hidden select-none"
        >
          <span className="hero-backdrop-word font-display text-[36vw] sm:text-[31vw] lg:text-[26rem] xl:text-[29rem] font-bold uppercase leading-[0.84] tracking-[0.015em] whitespace-nowrap">
            {PROFILE.backdropName}
          </span>
        </div>

        {/* Main Hero Composition Grid overlapping the oversized dark-red backdrop */}
        <div className="relative z-10 -mt-[20vw] sm:-mt-[22vw] lg:-mt-[21.5rem] xl:-mt-[24.5rem] grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-4">
          {/* LEFT COLUMN: Editorial Introduction */}
          <div className="order-2 flex flex-col justify-end pb-2 lg:order-1 lg:col-span-4 lg:pb-12 xl:pb-14">
            <p className="font-script text-4xl sm:text-[2.75rem] leading-none text-white/95 -mb-1.5">
              Hello, I&apos;m
            </p>

            <h1 className="font-display text-6xl sm:text-7xl xl:text-[5.25rem] font-bold uppercase leading-[0.9] tracking-[0.01em] text-white">
              <span className="block">{PROFILE.firstName}</span>
              <span className="block">{PROFILE.lastName}</span>
            </h1>

            <div className="mt-4 space-y-0.5 text-sm sm:text-[15px] font-semibold tracking-[0.08em] text-[#D91C24] uppercase">
              <p>{PROFILE.roleLine1}</p>
              <p>{PROFILE.roleLine2}</p>
            </div>

            <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-neutral-300/90 font-normal">
              {PROFILE.bio}
            </p>

            <div className="mt-7 flex items-center gap-2.5 text-[11px] font-medium tracking-[0.16em] text-neutral-400 uppercase">
              <Globe className="h-4 w-4 text-[#D91C24] shrink-0" aria-hidden="true" />
              <span>{PROFILE.location}</span>
            </div>
          </div>

          {/* CENTER-RIGHT COLUMN: Cinematic Studio Portrait */}
          <div className="order-1 relative flex justify-center lg:order-2 lg:col-span-5 lg:justify-center">
            <div className="relative w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[500px] aspect-[3/4]">
              {/* Subtle red edge rim aura behind shoulders */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 top-12 bottom-6 rounded-full bg-[#B9151C]/20 blur-3xl"
              />

              {!imgError ? (
                <img
                  src={portraitSrc}
                  alt="Muhammad Saqib — Full Stack Developer and AI Web App Developer"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="relative z-10 h-full w-full object-contain object-bottom brightness-[0.94] contrast-[1.06] saturate-[0.95] drop-shadow-[0_0_28px_rgba(201,24,30,0.32)]"
                />
              ) : (
                <div className="relative z-10 flex h-full w-full flex-col items-center justify-center border border-white/10 bg-gradient-to-b from-[#160507] to-[#060606] text-center p-8">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D91C24]/40 bg-[#D91C24]/10 text-[#D91C24]">
                    <User className="h-9 w-9" />
                  </div>
                  <p className="mt-4 font-display text-2xl uppercase tracking-wider text-white">
                    {PROFILE.fullName}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-neutral-400">
                    {PROFILE.roleLine1}
                  </p>
                </div>
              )}

              {/* Smooth fade at portrait base into obsidian floor */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-28 bg-gradient-to-t from-[#060606] via-[#060606]/70 to-transparent"
              />
            </div>
          </div>

          {/* FAR-RIGHT COLUMN: Tagline Emblem & Factual Profile Markers (Zero Invented Stats) */}
          <div className="order-3 flex flex-col justify-between gap-10 pb-2 lg:col-span-3 lg:pb-12 xl:pb-14 lg:pl-4">
            {/* Tagline paired with circular crimson star matching reference right-middle */}
            <div className="flex items-start gap-3.5 lg:mb-16">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D91C24]/45 bg-[#D91C24]/10 text-white"
              >
                <FourPointStar className="h-3.5 w-3.5 text-white" />
              </span>
              <p className="max-w-[20ch] text-xs sm:text-[13px] leading-snug text-neutral-200/95 font-normal">
                {PROFILE.tagline}
              </p>
            </div>

            {/* 3 Factual Highlights preserving reference right-rail visual balance without invented numbers */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6 lg:grid-cols-1 lg:gap-0 lg:border-t-0 lg:pt-0">
              {PROFILE_HIGHLIGHTS.map((item, idx) => (
                <div
                  key={item.value}
                  className={`flex flex-col lg:flex-row lg:items-center lg:gap-4 py-3 ${
                    idx !== 0 ? 'lg:border-t lg:border-white/[0.08]' : ''
                  }`}
                >
                  <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#D91C24] whitespace-nowrap shrink-0 lg:min-w-[84px]">
                    {item.value}
                  </span>
                  <div className="mt-1 lg:mt-0 text-[10px] leading-tight tracking-[0.14em] text-neutral-400 uppercase">
                    <span className="block">{item.labelLine1}</span>
                    <span className="block">{item.labelLine2}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
