import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DisciplineMode, PageRoute, CursorState } from '../types';
import { HeroScene } from '../scene/HeroScene';
import { RotateCcw } from 'lucide-react';
import { WorkPage } from './WorkPage';

interface HomePageProps {
  mode?: DisciplineMode;
  onModeToggle?: (newMode: DisciplineMode) => void;
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: CursorState, text?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  mode = 'interior',
  onNavigate,
  onCursorChange,
}) => {
  const [colorProgress, setColorProgress] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [spinTrigger] = useState(0);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleResetColor = () => {
    setResetTrigger((prev) => prev + 1);
  };

  const pct = Math.round(colorProgress * 100);

  return (
    <div id="home-page" className="relative w-full bg-[#FFFFFF]">
      {/* ---------------------------------------------------- */}
      {/* 1. HERO 3D STAGE SECTION (hidden when viewing detail) */}
      {/* ---------------------------------------------------- */}
      {!isDetailOpen && (
        <section className="relative w-full h-[100svh] min-h-[560px] flex flex-col justify-between p-6 md:p-14 overflow-hidden">
          {/* 3D WebGL Canvas Layer (Click to rotate & animate material fill) */}
          <HeroScene
            mode={mode}
            onColorProgressChange={setColorProgress}
            resetTrigger={resetTrigger}
            spinTrigger={spinTrigger}
            onCursorChange={onCursorChange}
          />

          {/* Spacer under the header (keeps the name centred in the hero) */}
          <div className="relative z-10 pt-16 pointer-events-none" aria-hidden="true" />

          {/* Drawing annotation: a gold leader line onto the model, with the note on its shelf.
              Laptop: the model sits right of centre; phone: it sits low, below the copy. */}
          <div
            className="absolute z-10 pointer-events-none left-1/2 top-[72%] sm:left-[53%] sm:top-[66%]"
            aria-live="polite"
          >
            {/* the point on the model */}
            <span className="absolute -left-[5px] -top-[5px] h-[10px] w-[10px] rounded-full border border-[#9A773E] bg-[#FFFFFF]/80">
              <span className={`absolute inset-[2px] rounded-full bg-[#9A773E] ${pct === 0 ? 'animate-pulse' : ''}`} />
            </span>
            {/* phone: a short vertical leader up into the gap above the model */}
            <span
              aria-hidden="true"
              className="sm:hidden absolute left-0 bottom-[5px] h-[9px] w-px bg-[#9A773E] origin-bottom [animation:fade-up_0.6s_ease-out_0.6s_both]"
            />
            {/* laptop: a dog-leg leader out to the white space left of the model */}
            <svg
              aria-hidden="true"
              className="hidden sm:block absolute right-0 top-0 overflow-visible w-[250px] h-[64px]"
              viewBox="0 0 250 64"
              preserveAspectRatio="none"
            >
              <polyline
                points="246,4 186,60 0,60"
                fill="none"
                stroke="#9A773E"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                className="[stroke-dasharray:420] [animation:leader-draw_1.4s_cubic-bezier(0.22,1,0.36,1)_0.6s_both]"
              />
            </svg>
            <div className="absolute bottom-[15px] -translate-x-1/2 sm:translate-x-0 sm:bottom-auto sm:right-[70px] sm:top-[32px] whitespace-nowrap text-center sm:text-right [animation:fade-up_0.8s_ease-out_1.4s_both]">
              {pct === 0 ? (
                <span className="font-display italic text-base sm:text-xl text-[#141413]">
                  <span className="hidden sm:inline">click</span>
                  <span className="sm:hidden">tap</span> — clay to material
                </span>
              ) : pct < 95 ? (
                <span className="font-mono-code text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#9A773E] tabular-nums">
                  materialising · {pct}%
                </span>
              ) : (
                <span className="flex items-baseline gap-3">
                  <span className="font-display italic text-base sm:text-xl text-[#141413]">drag to turn it around</span>
                  <button
                    type="button"
                    onClick={handleResetColor}
                    onMouseEnter={() => onCursorChange?.('link')}
                    onMouseLeave={() => onCursorChange?.('default')}
                    className="pointer-events-auto inline-flex items-center gap-1 font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770] hover:text-[#9A773E] transition-colors"
                    title="Back to the clay study model"
                  >
                    <RotateCcw className="w-3 h-3" /> clay
                  </button>
                </span>
              )}
            </div>
          </div>

          {/* Left Column: Designer Name, Subtitle, Short Intro Statement & Minimal Navigation */}
          <div className="relative z-10 pointer-events-none max-w-xl my-auto">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[#141413]" />
                <span className="font-mono-code text-[11px] uppercase tracking-[0.24em] text-[#7A7770]">
                  INTERIOR & SPATIAL DESIGN STUDENT
                </span>
              </div>

              <motion.h1
                transition={{
                  type: 'spring',
                  stiffness: 95,
                  damping: 18,
                  mass: 0.9,
                }}
                className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-[#141413] leading-[0.92] origin-top-left"
              >
                Mahi Patel
              </motion.h1>

              <p className="font-sans text-sm md:text-base text-[#575550] font-light leading-relaxed max-w-md pt-1">
                Design portfolio documenting academic studio projects, technical working drawings, 3D spatial modeling, and material explorations.
              </p>
            </div>
          </div>

          {/* Bottom Bar: Minimal Scroll Prompt */}
          <div className="relative z-10 flex items-end justify-end pointer-events-none pb-2">
            {/* Minimal scroll prompt */}
            <div className="pointer-events-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('content-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                  }
                }}
                onMouseEnter={() => onCursorChange?.('link')}
                onMouseLeave={() => onCursorChange?.('default')}
                className="flex items-center gap-2 text-[#7A7770] hover:text-[#141413] transition-colors group"
              >
                <span className="font-mono-code text-[11px] tracking-widest uppercase">
                  SCROLL TO EXPLORE ↓
                </span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. CONTENT / SELECTED PROJECTS SHOWCASE SECTION       */}
      {/* ---------------------------------------------------- */}
      <section
        id="content-section"
        className={`relative z-20 ${isDetailOpen ? 'pt-4' : 'border-t border-[#E5E3DD]'} bg-[#FFFFFF] scroll-mt-20`}
      >
        <WorkPage
          onNavigate={onNavigate}
          onCursorChange={onCursorChange}
          onDetailChange={setIsDetailOpen}
        />
      </section>
    </div>
  );
};
