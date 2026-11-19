import React, { useEffect, useRef, useState } from 'react';
import { PageRoute } from '../types';
import { FEATURED_PROJECTS } from '../data/featuredProjects';
import { CONTACT_DETAILS_ID, CONTACT_EMAIL, SCROLL_TO_DETAILS_KEY } from '../pages/ContactPage';
import { smoothScrollTo } from '../lib/motion';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  onReplayPreloader?: () => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

const CV_HREF = '/Mahi_Patel_CV.pdf';

/** Room hatch used on touch screens when the entrance is in view (mirrors the hover hatch). */
const HATCH_BG = '[background:repeating-linear-gradient(45deg,#EFE6D8_0_1px,transparent_1px_9px)]';

/** Title-case names for the plan (the project data stores some in capitals). */
const PROJECT_LABELS: Record<string, string> = {
  'urben-hatch': 'Urban Hatch',
  'royce-store': 'Royce’',
  villa: 'Villa',
  miscellaneous: 'Miscellaneous',
};

/**
 * "The Studio Plan" footer: a small floor plan drawn in the site's line language.
 * Each room is a page — Projects, About, the CV library — and Contact is the
 * entrance, whose door swings open on hover. The email runs along the dimension
 * line. On phones the rooms stack into a tall plan.
 */
export const Footer: React.FC<FooterProps> = ({ onNavigate, onCursorChange }) => {
  const [studioTime, setStudioTime] = useState('');

  useEffect(() => {
    const update = () =>
      setStudioTime(
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' })
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  // Touch screens have no hover: open the door (and hatch the entrance) when the
  // entrance scrolls into view, and close it again when it leaves.
  const entranceRef = useRef<HTMLButtonElement>(null);
  const [doorOpen, setDoorOpen] = useState(false);
  useEffect(() => {
    const el = entranceRef.current;
    if (!el || !window.matchMedia('(hover: none)').matches) return;
    let t: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(t);
        if (entry.isIntersecting) t = setTimeout(() => setDoorOpen(true), 250);
        else setDoorOpen(false);
      },
      { threshold: 0.7 }
    );
    io.observe(el);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, []);

  const hover = {
    onMouseEnter: () => onCursorChange?.('link'),
    onMouseLeave: () => onCursorChange?.('default'),
  };

  /** Scroll to the contact details if they're on screen, otherwise open the Contact page at them. */
  const goToContact = () => {
    const details = document.getElementById(CONTACT_DETAILS_ID);
    if (details) return smoothScrollTo(details);
    try {
      sessionStorage.setItem(SCROLL_TO_DETAILS_KEY, '1');
    } catch {}
    onNavigate({ name: 'contact' });
  };

  const openProject = (slug: string) =>
    slug === 'royce-store' ? onNavigate({ name: 'royce' }) : onNavigate({ name: 'work-detail', slug });

  // Shared room styling: hairline-weight walls come from the plan's borders; the
  // room fills with a 45° material hatch on hover / keyboard focus.
  const room =
    'group/room relative min-w-0 p-5 md:p-6 text-left transition-[background] duration-500 outline-none ' +
    'hover:[background:repeating-linear-gradient(45deg,#EFE6D8_0_1px,transparent_1px_9px)] ' +
    'focus-within:[background:repeating-linear-gradient(45deg,#EFE6D8_0_1px,transparent_1px_9px)]';
  const roomNo = 'block font-mono-code text-[10px] uppercase tracking-[0.22em] text-[#7A7770]';
  const roomName =
    'mt-2 block font-display text-3xl md:text-[2.1rem] leading-none text-[#141413] transition-colors duration-300 group-hover/room:text-[#9A773E]';
  const wall = 'border-[#2A2724]';

  return (
    <footer id="main-footer" className="relative z-20 bg-[#F6F2EB] text-[#141413] border-t border-[#E5E3DD]">
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-14 md:pt-16 pb-8">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="font-mono-code text-[10px] uppercase tracking-[0.22em] text-[#9A773E]">
              Internships · Commissions · Collaborations
            </p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl leading-[1.02] text-[#141413]">
              Come in, <span className="italic text-[#9A773E]">the door is open.</span>
            </h2>
          </div>
          <p className="font-mono-code text-[10px] uppercase tracking-[0.22em] text-[#7A7770]">
            Studio plan · Scale 1 : 50
          </p>
        </div>

        {/* The plan */}
        <nav
          aria-label="Footer"
          className={`relative grid grid-cols-1 md:grid-cols-12 border-[3px] ${wall} bg-[#FFFFFF]`}
        >
          {/* Room 01 · Projects (tall, left) */}
          <div className={`${room} md:col-span-5 md:row-span-2 border-b-2 md:border-b-0 md:border-r-2 ${wall}`}>
            <button type="button" onClick={() => onNavigate({ name: 'work' })} {...hover} className="block text-left outline-none">
              <span className={roomNo}>Room 01</span>
              <span className={roomName}>Projects</span>
            </button>
            <ul className="mt-6 space-y-2">
              {FEATURED_PROJECTS.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => openProject(p.slug)}
                    {...hover}
                    className="group/p inline-flex items-baseline gap-3 text-[0.95rem] text-[#55534D] hover:text-[#141413] transition-colors outline-none focus-visible:text-[#9A773E]"
                  >
                    <span className="font-mono-code text-[10px] text-[#9A773E] tabular-nums">{p.number}</span>
                    <span className="border-b border-transparent group-hover/p:border-[#141413]/40 transition-colors">
                      {PROJECT_LABELS[p.slug] ?? p.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {/* doorway into the hall (desktop) */}
            <span aria-hidden="true" className="hidden md:block absolute -right-[2px] bottom-14 h-12 w-[2px] bg-[#FFFFFF]" />
          </div>

          {/* Room 02 · About */}
          <button
            type="button"
            onClick={() => onNavigate({ name: 'about' })}
            {...hover}
            className={`${room} md:col-span-3 border-b-2 md:border-r-2 ${wall}`}
          >
            <span className={roomNo}>Room 02</span>
            <span className={roomName}>About</span>
            <span className="mt-3 block text-sm text-[#6E6C65]">Mahi Patel · Indus Design School, 2027</span>
          </button>

          {/* Room 03 · Library (CV) */}
          <a
            href={CV_HREF}
            download="Mahi_Patel_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            {...hover}
            className={`${room} md:col-span-4 border-b-2 ${wall}`}
          >
            <span className={roomNo}>Room 03 · Library</span>
            <span className={roomName}>Download CV</span>
            <span className="mt-3 block text-sm text-[#6E6C65]">PDF · 251 KB ↓</span>
          </a>

          {/* Entrance · Contact (door in the outer wall) */}
          <button
            ref={entranceRef}
            type="button"
            onClick={goToContact}
            {...hover}
            className={`${room} md:col-span-7 min-h-[150px] md:min-h-[170px] ${doorOpen ? HATCH_BG : ''}`}
            aria-label="Contact — open the contact details"
          >
            <span className={roomNo}>Entrance</span>
            <span className={roomName}>Contact</span>
            <span className="mt-3 block text-sm text-[#6E6C65]">Walk in for internships &amp; collaborations</span>

            {/* door opening in the bottom wall, with leaf + swing arc */}
            <span aria-hidden="true" className="absolute right-[18%] -bottom-[3px] h-[3px] w-16 bg-[#F6F2EB]" />
            <svg
              aria-hidden="true"
              viewBox="0 0 64 64"
              className="absolute right-[18%] -bottom-[1px] h-16 w-16 overflow-visible"
            >
              {/* swing arc centred on the hinge (bottom-left) */}
              <path d="M64 64 A64 64 0 0 0 0 0" fill="none" stroke="#9A773E" strokeWidth="1" strokeDasharray="3 4" />
              <line
                x1="0"
                y1="64"
                x2="64"
                y2="64"
                stroke="#9A773E"
                strokeWidth="3"
                className={`origin-[0px_64px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/room:-rotate-[80deg] group-focus-visible/room:-rotate-[80deg] ${
                  doorOpen ? '-rotate-[80deg]' : ''
                }`}
              />
            </svg>
          </button>
        </nav>

        {/* Dimension line carrying the email */}
        <div className="relative mt-5 flex items-center" aria-label="Email">
          <span className="h-3 w-px bg-[#9A773E]" aria-hidden="true" />
          <span className="h-px flex-1 bg-[#9A773E]" aria-hidden="true" />
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            {...hover}
            className="px-4 font-sans text-sm md:text-base text-[#141413] hover:text-[#9A773E] transition-colors whitespace-nowrap"
          >
            {CONTACT_EMAIL}
          </a>
          <span className="h-px flex-1 bg-[#9A773E]" aria-hidden="true" />
          <span className="h-3 w-px bg-[#9A773E]" aria-hidden="true" />
        </div>

        {/* Bottom line */}
        <div className="mt-10 pt-5 border-t border-[#E2DBCF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#6E6C65]">
          <span>© {new Date().getFullYear()} Mahi Patel · Interior &amp; Spatial Design</span>
          <span className="tabular-nums">
            Ahmedabad · {studioTime || '--:--'} IST
          </span>
          <button
            type="button"
            onClick={() => smoothScrollTo(document.body, 0)}
            {...hover}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 hover:text-[#141413] transition-colors"
          >
            Back to top <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
