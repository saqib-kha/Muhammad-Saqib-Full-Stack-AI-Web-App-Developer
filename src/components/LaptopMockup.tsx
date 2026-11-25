import { PROFILE } from '../data/portfolioData';

interface LaptopMockupProps {
  portraitSrc: string;
}

export default function LaptopMockup({ portraitSrc }: LaptopMockupProps) {
  return (
    <div
      aria-label="Laptop preview displaying Muhammad Saqib's portfolio website"
      className="relative mx-auto flex w-full max-w-[460px] items-end justify-center pt-4 pb-6 select-none"
    >
      {/* Subtle crimson studio reflection beneath laptop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-2 left-1/2 h-24 w-4/5 -translate-x-1/2 rounded-full bg-[#B9151C]/20 blur-2xl"
      />

      {/* Matte-black ceramic mug silhouette on left matching reference composition */}
      <div
        aria-hidden="true"
        className="relative z-10 -mr-5 mb-2 hidden sm:flex flex-col items-center shrink-0"
      >
        <div className="relative flex h-[74px] w-[58px] items-center justify-center rounded-b-lg rounded-t-[3px] border border-white/10 bg-gradient-to-br from-[#1C1C1F] via-[#101012] to-[#070708] shadow-[0_14px_24px_rgba(0,0,0,0.85)]">
          {/* Mug top rim */}
          <div className="absolute -top-1 inset-x-0 h-2 rounded-full border border-white/10 bg-[#17171A]" />
          {/* Mug handle */}
          <div className="absolute top-3 -left-3.5 h-9 w-4 rounded-l-full border-2 border-r-0 border-[#222226]" />
          <span className="font-display text-lg tracking-wider text-white/25">S</span>
        </div>
      </div>

      {/* Realistic Sleek Dark Laptop Frame */}
      <div className="relative z-20 w-full max-w-[390px]">
        {/* Laptop Display Lid */}
        <div className="relative rounded-t-xl border border-white/15 bg-[#0C0C0E] p-2 pb-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          {/* Top bezel webcam dot */}
          <div
            aria-hidden="true"
            className="mx-auto mb-1.5 h-1 w-1 rounded-full bg-neutral-700"
          />

          {/* Live Miniature Render of Muhammad Saqib's Portfolio */}
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[4px] border border-white/10 bg-[#060606]">
            {/* Mini Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
              <div className="leading-none">
                <p className="text-[5px] font-semibold tracking-[0.16em] text-[#D91C24] uppercase">
                  FULL STACK DEVELOPER
                </p>
                <p className="mt-0.5 text-[4.5px] tracking-[0.16em] text-neutral-400 uppercase">
                  DIGITAL CREATOR
                </p>
              </div>
              <p className="text-[4.5px] tracking-[0.14em] text-neutral-400 uppercase">
                AVAILABLE FOR OPPORTUNITIES
              </p>
            </div>

            {/* Mini Hero Area */}
            <div className="relative px-3 pt-2 pb-2.5 overflow-hidden">
              {/* Oversized red SAQIB inside screen */}
              <div
                aria-hidden="true"
                className="pointer-events-none text-center font-display text-[56px] sm:text-[62px] font-bold leading-[0.82] tracking-tight hero-backdrop-word"
              >
                SAQIB
              </div>

              <div className="relative z-10 -mt-11 grid grid-cols-12 items-end gap-1">
                <div className="col-span-5 pb-1">
                  <p className="font-script text-[10px] leading-none text-white/90">
                    Hello, I&apos;m
                  </p>
                  <p className="font-display text-[13px] font-bold leading-[0.9] text-white uppercase">
                    MUHAMMAD
                    <br />
                    SAQIB
                  </p>
                  <p className="mt-1 text-[4.5px] font-semibold tracking-[0.1em] text-[#D91C24] uppercase">
                    AI WEB APP DEVELOPER
                  </p>
                </div>

                <div className="col-span-4 flex justify-center">
                  <img
                    src={portraitSrc}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="h-[76px] w-[68px] object-contain object-bottom brightness-[0.94] contrast-[1.05]"
                  />
                </div>

                <div className="col-span-3 pb-1 text-right">
                  <p className="text-[4.5px] leading-tight text-neutral-300">
                    {PROFILE.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Mini Selected Projects Bar */}
            <div className="border-t border-white/10 bg-[#08080A] px-3 py-2">
              <div className="flex items-center justify-between">
                <span className="text-[5px] font-semibold tracking-[0.14em] text-white uppercase">
                  SELECTED PROJECTS
                </span>
                <span className="text-[4.5px] text-[#D91C24]">01 · 02 · 03</span>
              </div>
              <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                <div className="h-7 rounded-[2px] border border-white/10 bg-gradient-to-br from-[#1A090B] to-[#0B0B0D] p-1">
                  <span className="block text-[4px] font-semibold text-[#D91C24]">01</span>
                  <span className="block truncate text-[4px] text-neutral-300">
                    AI Web App
                  </span>
                </div>
                <div className="h-7 rounded-[2px] border border-white/10 bg-gradient-to-br from-[#232326] to-[#111113] p-1">
                  <span className="block text-[4px] font-semibold text-[#D91C24]">02</span>
                  <span className="block truncate text-[4px] text-neutral-300">
                    E-Commerce
                  </span>
                </div>
                <div className="h-7 rounded-[2px] border border-white/10 bg-gradient-to-br from-[#190A0C] to-[#0D0D0F] p-1">
                  <span className="block text-[4px] font-semibold text-[#D91C24]">03</span>
                  <span className="block truncate text-[4px] text-neutral-300">
                    WordPress
                  </span>
                </div>
              </div>
            </div>

            {/* Subtle glass screen sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.06]"
            />
          </div>
        </div>

        {/* Laptop Hinge & Metallic Chassis Base */}
        <div className="relative mx-auto h-3.5 w-[108%] -ml-[4%] rounded-b-xl border-x border-b border-white/15 bg-gradient-to-b from-[#2A2A2E] via-[#17171A] to-[#0B0B0C] shadow-[0_18px_36px_rgba(0,0,0,0.95)]">
          {/* Center thumb notch */}
          <div className="mx-auto h-1 w-14 rounded-b-md bg-[#0A0A0C]" />
        </div>
      </div>
    </div>
  );
}
