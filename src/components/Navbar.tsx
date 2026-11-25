import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

const NAV_LINKS = [
  { label: 'Projects', href: '#projects' },
  { label: 'Education & Skills', href: '#skills' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
];

export function FourPointStar({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 1.5L14.4 9.6L22.5 12L14.4 14.4L12 22.5L9.6 14.4L1.5 12L9.6 9.6L12 1.5Z" />
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-200 ${
        scrolled
          ? 'bg-[#060606]/95 border-white/10 backdrop-blur-md'
          : 'bg-[#060606]/90 border-white/[0.08] backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-3.5 sm:px-8 lg:px-12">
        {/* Top-left stacked editorial role label matching reference */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileOpen(false);
          }}
          className="group flex flex-col leading-tight shrink-0 whitespace-nowrap"
          aria-label="Muhammad Saqib — Back to top"
        >
          <span className="text-[11px] font-semibold tracking-[0.16em] text-[#D91C24] uppercase transition-colors group-hover:text-[#F02A33]">
            {PROFILE.topLeftPrimary}
          </span>
          <span className="text-[11px] font-normal tracking-[0.16em] text-neutral-400 uppercase transition-colors group-hover:text-neutral-200">
            {PROFILE.topLeftSecondary}
          </span>
        </a>

        {/* Clean single-line center navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 lg:gap-9"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="relative text-xs font-medium tracking-[0.1em] text-neutral-300 uppercase transition-colors duration-200 hover:text-white whitespace-nowrap shrink-0 after:absolute after:-bottom-1 after:left-0 after:h-[1px] after:w-0 after:bg-[#D91C24] after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Top-right availability CTA matching reference + mobile menu toggle */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="group hidden sm:inline-flex items-center gap-2.5 text-[11px] font-medium tracking-[0.16em] text-neutral-200 uppercase transition-colors duration-200 hover:text-white whitespace-nowrap shrink-0"
          >
            <span>{PROFILE.availability}</span>
            <FourPointStar className="h-3.5 w-3.5 text-[#D91C24] transition-transform duration-200 group-hover:scale-125" />
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 bg-white/[0.03] text-neutral-200 transition-colors hover:border-[#D91C24]/60 hover:text-white md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          id="mobile-navigation-drawer"
          className="border-t border-white/10 bg-[#080808] px-5 py-5 md:hidden"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="flex min-h-[44px] items-center justify-between border-b border-white/[0.06] py-2.5 text-sm font-medium tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:text-[#D91C24]"
              >
                <span>{link.label}</span>
                <span className="text-[#D91C24]" aria-hidden="true">
                  →
                </span>
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="mt-4 flex min-h-[44px] items-center justify-center gap-2 border border-[#D91C24]/50 bg-[#D91C24]/15 px-4 py-2.5 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:bg-[#D91C24]"
          >
            <FourPointStar className="h-3.5 w-3.5 text-[#D91C24]" />
            <span>{PROFILE.availability}</span>
          </a>
        </div>
      )}
    </header>
  );
}
