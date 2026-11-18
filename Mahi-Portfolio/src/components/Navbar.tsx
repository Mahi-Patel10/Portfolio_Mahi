import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { DisciplineMode, PageRoute } from '../types';

interface NavbarProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  mode: DisciplineMode;
  onModeToggle: (newMode: DisciplineMode) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Editorial header: serif name on the left, three links and a "Let's talk" button
 * on the right. Transparent over the top of the page, a soft white bar once
 * scrolled, and it slides away while scrolling down.
 */
export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate, onCursorChange }) => {
  const isHome = currentRoute.name === 'home';
  const links: { label: string; route: PageRoute; active: boolean }[] = [
    {
      label: 'Projects',
      route: { name: 'work' },
      active: currentRoute.name === 'work' || currentRoute.name === 'work-detail' || currentRoute.name === 'royce',
    },
    { label: 'About', route: { name: 'about' }, active: currentRoute.name === 'about' },
    { label: 'Contact', route: { name: 'contact' }, active: currentRoute.name === 'contact' },
  ];

  // Phone menu
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [currentRoute]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Scroll state: `scrolled` turns the bar solid; `navHidden` slides it away on scroll down
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  useEffect(() => {
    setNavHidden(false);
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - lastY;
      setScrolled(y > 24);
      if (y < 80) setNavHidden(false);
      else if (delta > 6) setNavHidden(true);
      else if (delta < -6) setNavHidden(false);
      if (Math.abs(delta) > 6 || y < 80) lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [currentRoute]);
  const hideNav = navHidden && !menuOpen;
  const solid = scrolled || menuOpen;

  // Let sticky page elements follow the header (see --sticky-top in index.css)
  useEffect(() => {
    document.documentElement.toggleAttribute('data-nav-hidden', hideNav);
  }, [hideNav]);

  const go = (route: PageRoute) => {
    setMenuOpen(false);
    onNavigate(route);
  };
  const hover = {
    onMouseEnter: () => onCursorChange?.('link'),
    onMouseLeave: () => onCursorChange?.('default'),
  };

  return (
    <header
      id="main-nav-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-[translate,background-color,border-color,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-b ${
        solid
          ? 'bg-[#FFFFFF]/85 backdrop-blur-md border-[#E5E3DD] py-3 md:py-3'
          : 'bg-transparent border-transparent py-4 md:py-5'
      } ${hideNav ? '-translate-y-full' : ''}`}
    >
      <div className="relative z-10 flex items-center justify-between gap-6 px-5 sm:px-6 md:px-12">
        {/* Name: always returns Home (also closes a project opened inside Home) */}
        <button
          id="nav-logo-btn"
          type="button"
          onClick={() => go({ name: 'home' })}
          aria-label="Mahi Patel, go to home page"
          aria-current={isHome ? 'page' : undefined}
          {...hover}
          className="group flex flex-col items-start text-left leading-none"
        >
          <span className="font-display text-[1.6rem] md:text-[1.75rem] text-[#141413] group-hover:text-[#9A773E] transition-colors whitespace-nowrap">
            Mahi Patel
          </span>
          <span className="mt-1.5 font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770] whitespace-nowrap">
            Interior &amp; Spatial Design
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          <nav aria-label="Main" className="flex items-center gap-9">
            {links.map((l) => (
              <button
                key={l.label}
                type="button"
                onClick={() => go(l.route)}
                aria-current={l.active ? 'page' : undefined}
                {...hover}
                className={`group relative py-1.5 font-sans text-[0.95rem] tracking-[0.03em] transition-colors ${
                  l.active ? 'text-[#141413]' : 'text-[#6E6C65] hover:text-[#141413]'
                }`}
              >
                {l.label}
                {/* hover hairline */}
                {!l.active && (
                  <span className="absolute left-0 right-0 -bottom-0.5 h-px bg-[#141413]/40 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                )}
                {/* active marker slides between links */}
                {l.active && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ duration: 0.5, ease: EASE }}
                    className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-[#9A773E]"
                  />
                )}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => go({ name: 'contact' })}
            {...hover}
            className="group inline-flex items-center gap-2 rounded-full border border-[#141413]/25 px-5 py-2.5 font-sans text-[0.9rem] tracking-[0.02em] text-[#141413] hover:bg-[#141413] hover:border-[#141413] hover:text-[#FFFFFF] transition-colors duration-300"
          >
            Let&rsquo;s talk
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        {/* Phone: menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="md:hidden relative -mr-2 h-11 w-11 shrink-0 inline-flex items-center justify-center"
        >
          <span className="relative block h-3 w-6">
            <span
              className={`absolute left-0 h-[1.5px] w-6 bg-[#141413] transition-all duration-500 ${
                menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 h-[1.5px] bg-[#141413] transition-all duration-500 ${
                menuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45 w-6' : 'bottom-0 w-4'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Phone menu: full-height sheet under the bar */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="md:hidden fixed top-0 left-0 right-0 h-[100dvh] bg-[#FFFFFF] flex flex-col px-6 pt-28 pb-10"
          >
            <nav aria-label="Mobile" className="flex-1">
              <ul className="divide-y divide-[#E5E3DD] border-y border-[#E5E3DD]">
                {[{ label: 'Home', route: { name: 'home' } as PageRoute, active: isHome }, ...links].map((l, i) => (
                  <motion.li
                    key={l.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 + i * 0.06, duration: 0.5, ease: EASE }}
                  >
                    <button
                      type="button"
                      onClick={() => go(l.route)}
                      aria-current={l.active ? 'page' : undefined}
                      className="w-full flex items-baseline justify-between py-5 text-left"
                    >
                      <span className={`font-display text-4xl ${l.active ? 'text-[#9A773E]' : 'text-[#141413]'}`}>
                        {l.label}
                      </span>
                      <span className="font-mono-code text-[11px] text-[#9A773E]">{String(i + 1).padStart(2, '0')}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-2 text-sm text-[#6E6C65]"
            >
              <a href="mailto:mahipatel1329@gmail.com" className="block text-[#141413]">
                mahipatel1329@gmail.com
              </a>
              <div>Ahmedabad, Gujarat, India</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
