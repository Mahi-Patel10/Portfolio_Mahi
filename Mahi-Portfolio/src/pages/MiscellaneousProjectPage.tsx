import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Maximize2, X, Layers, Hammer, Shapes, PenTool } from 'lucide-react';
import { CursorState, PageRoute } from '../types';
import { FEATURED_PROJECTS, wrapProjectIndex, projectIndexBySlug } from '../data/featuredProjects';

interface MiscellaneousProjectPageProps {
  onBack?: () => void;
  onNavigate?: (route: PageRoute) => void;
  onOpenProject?: (index: number) => void;
  onCursorChange?: (state: CursorState, text?: string) => void;
}

interface Shot {
  src: string;
  title: string;
  caption: string;
}

const DIR = '/projects/miscellaneous';

// 01 · Physical models, grouped by model
const MODEL_GROUPS: { title: string; note: string; cols: 2 | 3; shots: Shot[] }[] = [
  {
    title: 'Spatial Study Models',
    note: 'Small room studies in card, paint and found materials, photographed through a viewing frame.',
    cols: 3,
    shots: [
      {
        src: `${DIR}/model-01.jpg`,
        title: 'Colour-Block Bedroom',
        caption: 'Corrugated blue wardrobe doors, painted arch murals, a red shelf unit and a pink pouf.',
      },
      {
        src: `${DIR}/model-02.jpg`,
        title: 'Gallery Room',
        caption: 'Abstract artworks on white walls, plinths and scale figures, lit through a gridded window.',
      },
      {
        src: `${DIR}/model-03.jpg`,
        title: 'Terracotta Study',
        caption: 'A corrugated terracotta wall with organic cut-out shelving and a bench on sculpted legs.',
      },
    ],
  },
  {
    title: 'ROYCE’ Chocolate Store Model',
    note: 'The physical model of the ROYCE’ retail interior.',
    cols: 3,
    shots: [
      {
        src: `${DIR}/model-04.jpg`,
        title: 'Top View',
        caption: 'L-shaped counter, jute-wrapped display tables and wall shelving in plan.',
      },
      {
        src: `${DIR}/model-05.jpg`,
        title: 'Storefront',
        caption: 'Textured plaster façade with maroon-framed glazing and ROYCE’ signage.',
      },
      {
        src: `${DIR}/model-06.jpg`,
        title: 'Interior',
        caption: 'Stepped display shelving, a chocolate-bar feature wall and a dripping-chocolate counter.',
      },
    ],
  },
  {
    title: 'Woven Grid Model',
    note: 'Coloured strips woven through a white wire frame to test pattern, rhythm and transparency.',
    cols: 2,
    shots: [
      {
        src: `${DIR}/model-07.jpg`,
        title: 'Front Face',
        caption: 'Pink and blue strips woven in a stepped pattern, under checkerboard roof panels.',
      },
      {
        src: `${DIR}/model-08.jpg`,
        title: 'Corner View',
        caption: 'Purple and lime strips in a basket weave on the adjoining face.',
      },
    ],
  },
];

const PARTITION_MODELS: Shot[] = [
  {
    src: `${DIR}/partition-model-01.jpg`,
    title: 'Partition Wall — Model',
    caption: 'Bamboo poles and timber framing around a hanging ink landscape scroll.',
  },
  {
    src: `${DIR}/partition-model-02.jpg`,
    title: 'Partition Wall — Study Model',
    caption: 'Timber frame and linen panels around a plain scroll, before the bamboo was added.',
  },
];

const PARTITION_DRAWINGS: Shot = {
  src: `${DIR}/partition-drawings.jpg`,
  title: 'Partition Wall — Drawings',
  caption: 'Elevation, plan, two joinery details, side sections and an isometric view.',
};

const STAIR_RENDERS: Shot[] = [
  {
    src: `${DIR}/staircase-render-01-hd.jpg`,
    title: 'Lotus Pond Under the Landing',
    caption: 'Mosaic-tiled steps, hanging flower strings and a lotus pond with stones beneath the flight.',
  },
  {
    src: `${DIR}/staircase-render-02-hd.jpg`,
    title: 'Looking Up the Flight',
    caption: 'Strings of white flowers fall alongside the mosaic-clad treads.',
  },
];

const STAIR_DRAWINGS: Shot = {
  src: `${DIR}/staircase-drawings-hd.jpg`,
  title: 'Staircase — Drawings',
  caption: 'Elevation A, Section BB′ and plan at 1:30, with the tread detail at A at 1:2.',
};

const STAIR_LAYERS = ['30 mm marble tread, river finish', 'Cement mortar bed', '4 mm mosaic tile', 'Precast RCC steps'];

const WINDOW_DISPLAY: Shot = {
  src: `${DIR}/window-display-hd.jpg`,
  title: 'Window Display — Bath & Body Works',
  caption: 'Satin drapes, pearl strands and roses framing a new-arrival product on a draped plinth.',
};

const WORKS = [
  { id: 'misc-models', number: '01', title: 'Model Making', kind: 'Physical models' },
  { id: 'misc-partition', number: '02', title: 'Partition Wall', kind: 'Installation · drawings & model' },
  { id: 'misc-staircase', number: '03', title: 'Staircase Design', kind: 'Detailing · drawings & renders' },
  { id: 'misc-window', number: '04', title: 'Window Display', kind: 'Visual merchandising' },
];

export const MiscellaneousProjectPage: React.FC<MiscellaneousProjectPageProps> = ({
  onBack,
  onNavigate,
  onOpenProject,
  onCursorChange,
}) => {
  const [lightbox, setLightbox] = useState<Shot | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setLightbox(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleReturnToProjects = () => {
    if (onBack) onBack();
    else onNavigate?.({ name: 'work' });
  };

  const currentIdx = projectIndexBySlug('miscellaneous');
  const prevIdx = wrapProjectIndex(currentIdx - 1);
  const nextIdx = wrapProjectIndex(currentIdx + 1);
  const prevProject = FEATURED_PROJECTS[prevIdx];
  const nextProject = FEATURED_PROJECTS[nextIdx];
  const go = (i: number) => (onOpenProject ? onOpenProject(i) : onNavigate?.({ name: 'work' }));

  const linkCursor = {
    onMouseEnter: () => onCursorChange?.('link'),
    onMouseLeave: () => onCursorChange?.('default'),
  };
  const viewCursor = {
    onMouseEnter: () => onCursorChange?.('view'),
    onMouseLeave: () => onCursorChange?.('default'),
  };

  const scrollToWork = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /** A clickable photo tile with a caption underneath. */
  const renderShot = (s: Shot, aspect: string, fit: 'cover' | 'contain' = 'cover') => (
    <figure key={s.src} className="min-w-0">
      <button
        type="button"
        onClick={() => setLightbox(s)}
        {...viewCursor}
        aria-label={`Enlarge: ${s.title}`}
        className={`group relative block w-full ${aspect} overflow-hidden rounded-sm border border-[#E5E3DD] bg-[#F2F1ED] hover:border-[#9A773E] transition-colors`}
      >
        <img
          src={s.src}
          alt={s.title}
          loading="lazy"
          className={`absolute inset-0 h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain p-3 bg-[#FFFFFF]'} transition-transform duration-700 ease-out group-hover:scale-[1.02]`}
        />
        <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E3DD] bg-[#FFFFFF]/90 opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="h-3.5 w-3.5 text-[#9A773E]" />
        </span>
      </button>
      <figcaption className="mt-3 space-y-1">
        <span className="block font-display text-lg text-[#141413] leading-snug">{s.title}</span>
        <span className="block text-sm text-[#6E6C65] leading-relaxed">{s.caption}</span>
      </figcaption>
    </figure>
  );

  /** A drawing set shown whole on white, inside a framed card. */
  const renderDrawing = (s: Shot) => (
    <figure className="bg-[#FAF8F5] border border-[#E5E3DD] rounded-sm p-5 sm:p-8">
      <button
        type="button"
        onClick={() => setLightbox(s)}
        {...viewCursor}
        aria-label={`Enlarge: ${s.title}`}
        className="group relative block w-full bg-[#FFFFFF] border border-[#E5E3DD] rounded-sm p-4 sm:p-6 hover:border-[#9A773E] transition-colors"
      >
        <img src={s.src} alt={s.title} loading="lazy" className="mx-auto w-full max-w-3xl h-auto" />
        <span className="absolute top-4 right-4 flex items-center gap-2 bg-[#FFFFFF]/90 border border-[#E5E3DD] px-3 py-1.5 rounded-full text-[11px] font-mono-code text-[#7A7770] group-hover:text-[#141413] group-hover:border-[#9A773E] transition-colors">
          <Maximize2 className="w-3.5 h-3.5 text-[#9A773E]" />
          <span className="hidden sm:inline">Inspect Drawing</span>
        </span>
      </button>
      <figcaption className="mt-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
        <span className="font-display text-lg text-[#141413]">{s.title}</span>
        <span className="text-sm text-[#6E6C65]">{s.caption}</span>
      </figcaption>
    </figure>
  );

  const sectionHead = (number: string, eyebrow: string, title: string) => (
    <div className="space-y-3 max-w-4xl">
      <div className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-widest text-[#9A773E]">
        <span className="w-2 h-0.5 bg-[#9A773E]" />
        <span>
          {number} / {eyebrow}
        </span>
      </div>
      <h2 className="font-display font-light text-3xl sm:text-4xl text-[#141413]">{title}</h2>
    </div>
  );

  return (
    <article
      id="miscellaneous-project-case-study"
      className="relative min-h-screen bg-[#FFFFFF] text-[#141413] selection:bg-[#9A773E] selection:text-[#FFFFFF] overflow-x-hidden pt-28 sm:pt-32 pb-24"
    >
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-8 md:mb-12">
        <div className="flex items-center justify-between pb-6 border-b border-[#E5E3DD]">
          <button
            type="button"
            onClick={handleReturnToProjects}
            {...linkCursor}
            className="group inline-flex items-center gap-3 font-mono-code text-xs uppercase tracking-widest text-[#7A7770] hover:text-[#141413] transition-colors"
          >
            <span className="h-8 w-8 rounded-full border border-[#E5E3DD] flex items-center justify-center group-hover:border-[#9A773E] group-hover:bg-[#FAF8F5] transition-all">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-[#141413]" />
            </span>
            <span className="font-medium">Back to Projects</span>
          </button>
          <div className="flex items-center gap-4 text-xs font-mono-code tracking-widest text-[#7A7770]">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[#9A773E]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A773E]" />
              <span>Selected Works</span>
            </span>
            <span className="text-[#E5E3DD] hidden sm:inline">|</span>
            <span className="text-[#141413] font-medium">
              {FEATURED_PROJECTS[currentIdx].number} / {String(FEATURED_PROJECTS.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <header className="pb-10 md:pb-14 flex flex-col gap-10 md:gap-12">
          <div className="space-y-3">
            <h1 className="font-display font-light text-[clamp(1.9rem,8.5vw,3.75rem)] sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-[#141413] leading-[0.92] break-words">
              MISCELLANEOUS
            </h1>
            <p className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#9A773E] tracking-wide">
              Studio Works & Model Making
            </p>
            <p className="max-w-3xl text-base md:text-lg text-[#6E6C65] leading-relaxed pt-2">
              Smaller studio exercises that sit alongside the main projects: hand-built physical models, a
              Japanese-inspired partition wall, a staircase detail and a retail window display.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 bg-[#FAF8F5] border border-[#E5E3DD] p-6 sm:p-8 rounded-sm">
            {[
              { icon: Layers, label: 'Works', value: 'Four studies', note: 'Models, installation, detail, display' },
              { icon: Hammer, label: 'Craft', value: 'Physical Model Making', note: 'Card, timber, bamboo, wire & fabric' },
              { icon: PenTool, label: 'Drawing', value: 'Technical Detailing', note: 'Elevations, sections & joinery' },
              { icon: Shapes, label: 'Display', value: 'Visual Merchandising', note: 'Retail window styling' },
            ].map(({ icon: Icon, label, value, note }) => (
              <div key={label} className="space-y-1">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E] flex items-center gap-1.5 font-medium">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </span>
                <p className="font-display text-base sm:text-lg text-[#141413] leading-snug">{value}</p>
                <p className="font-mono-code text-xs text-[#7A7770]">{note}</p>
              </div>
            ))}
          </div>

          {/* Index of works */}
          <nav aria-label="Works on this page" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#E5E3DD]">
            {WORKS.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => scrollToWork(w.id)}
                {...linkCursor}
                className="group text-left py-5 pr-4 border-b border-[#E5E3DD] lg:border-b-0"
              >
                <span className="font-mono-code text-[11px] tracking-widest text-[#9A773E]">{w.number}</span>
                <span className="mt-1 block font-display text-xl text-[#141413] group-hover:text-[#9A773E] transition-colors">
                  {w.title}
                </span>
                <span className="block text-sm text-[#6E6C65]">{w.kind}</span>
              </button>
            ))}
          </nav>
        </header>
      </section>

      {/* 01 · Model making */}
      <section id="misc-models" className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-20 scroll-mt-24">
        <div className="pt-10 md:pt-14 border-t border-[#E5E3DD] flex flex-col gap-12 md:gap-16">
          {sectionHead('01', 'Physical Models', 'Model Making')}
          {MODEL_GROUPS.map((g) => (
            <div key={g.title} className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 pb-3 border-b border-[#E5E3DD]">
                <h3 className="font-display text-2xl text-[#141413]">{g.title}</h3>
                <p className="text-sm text-[#6E6C65] max-w-xl sm:text-right">{g.note}</p>
              </div>
              <div className={`grid grid-cols-1 sm:grid-cols-2 ${g.cols === 3 ? 'lg:grid-cols-3' : ''} gap-6 md:gap-8`}>
                {g.shots.map((s) => renderShot(s, g.cols === 3 ? 'aspect-[4/5]' : 'aspect-square'))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 02 · Partition wall */}
      <section id="misc-partition" className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-20 scroll-mt-24">
        <div className="pt-10 md:pt-14 border-t border-[#E5E3DD] flex flex-col gap-10">
          {sectionHead('02', 'Installation', 'Partition Wall')}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <p className="font-serif italic text-lg sm:text-xl leading-relaxed text-[#2C2926]">
                Inspired by Japanese design, the installation combines natural bamboo, wooden framing, and a hanging
                landscape artwork to create a calm, balanced composition.
              </p>
              <div className="w-12 h-px bg-[#9A773E]" />
              <p className="text-base sm:text-lg leading-relaxed text-[#5C5751]">
                The use of natural materials, vertical lines, and simplicity reflects harmony between nature and
                architecture, creating a sense of tranquillity and connection with the outdoors.
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {PARTITION_MODELS.map((s) => renderShot(s, 'aspect-[4/5]'))}
            </div>
          </div>
          {renderDrawing(PARTITION_DRAWINGS)}
        </div>
      </section>

      {/* 03 · Staircase */}
      <section id="misc-staircase" className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-20 scroll-mt-24">
        <div className="pt-10 md:pt-14 border-t border-[#E5E3DD] flex flex-col gap-10">
          {sectionHead('03', 'Detailing', 'Staircase Design')}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <p className="font-serif italic text-lg sm:text-xl leading-relaxed text-[#2C2926]">
                A three-flight staircase of 19 risers at 150 mm, clad in blue mosaic, with strings of white flowers
                hanging beside the flights and a lotus pond set into the space beneath the landing.
              </p>
              <div className="w-12 h-px bg-[#9A773E]" />
              <div className="space-y-3">
                <span className="font-mono-code text-[11px] uppercase tracking-widest text-[#9A773E]">
                  Tread build-up · Detail at A
                </span>
                <p className="text-sm text-[#6E6C65]">Landings at +1050 mm and +1925 mm finish level.</p>
                <ol className="space-y-2">
                  {STAIR_LAYERS.map((layer, i) => (
                    <li key={layer} className="flex items-baseline gap-3 text-base text-[#141413]">
                      <span className="font-mono-code text-xs text-[#9A773E] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      {layer}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 gap-6">
              {STAIR_RENDERS.map((s) => renderShot(s, 'aspect-[16/9]'))}
            </div>
          </div>
          {renderDrawing(STAIR_DRAWINGS)}
        </div>
      </section>

      {/* 04 · Window display */}
      <section id="misc-window" className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-20 scroll-mt-24">
        <div className="pt-10 md:pt-14 border-t border-[#E5E3DD] flex flex-col gap-10">
          {sectionHead('04', 'Visual Merchandising', 'Window Display')}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <p className="font-serif italic text-lg sm:text-xl leading-relaxed text-[#2C2926]">
                The display combines flowing satin drapes, pearl accents, and floral arrangements to create a
                luxurious, romantic look that highlights the product and reflects the brand’s premium identity.
              </p>
              <div className="w-12 h-px bg-[#9A773E]" />
              <ul className="space-y-2 text-base text-[#141413]">
                {['Cream & crimson satin drapes', 'Pearl strands around the plinth', 'Roses & eucalyptus', 'New-arrival signage'].map((t) => (
                  <li key={t} className="flex items-baseline gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9A773E] translate-y-[-2px]" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 max-w-md w-full mx-auto lg:mx-0">
              {renderShot(WINDOW_DISPLAY, 'aspect-[3/4]')}
            </div>
          </div>
        </div>
      </section>

      {/* Previous / next project */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-16 md:mt-24">
        <nav aria-label="Project navigation" className="grid grid-cols-2 border-t border-b border-[#E5E3DD]">
          <button
            type="button"
            onClick={() => go(prevIdx)}
            aria-label={`Open ${prevProject.name} project`}
            {...linkCursor}
            className="group text-left py-8 md:py-12 pr-4 sm:pr-8 border-r border-[#E5E3DD]"
          >
            <span className="flex items-center gap-2 font-mono-code text-[10px] sm:text-xs tracking-widest uppercase text-[#7A7770] group-hover:text-[#9A773E] transition-colors">
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Previous Project · {prevProject.number}</span>
            </span>
            <span className="mt-3 block font-display text-xl sm:text-2xl md:text-3xl font-light text-[#141413] group-hover:text-[#9A773E] transition-colors">
              {prevProject.name}
            </span>
            <span className="mt-1 block font-mono-code text-xs text-[#7A7770]">{prevProject.type}</span>
          </button>
          <button
            type="button"
            onClick={() => go(nextIdx)}
            aria-label={`Open ${nextProject.name} project`}
            {...linkCursor}
            className="group text-right py-8 md:py-12 pl-4 sm:pl-8"
          >
            <span className="flex items-center justify-end gap-2 font-mono-code text-[10px] sm:text-xs tracking-widest uppercase text-[#7A7770] group-hover:text-[#9A773E] transition-colors">
              <span>Next Project · {nextProject.number}</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="mt-3 block font-display text-xl sm:text-2xl md:text-3xl font-light text-[#141413] group-hover:text-[#9A773E] transition-colors">
              {nextProject.name}
            </span>
            <span className="mt-1 block font-mono-code text-xs text-[#7A7770]">{nextProject.type}</span>
          </button>
        </nav>
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={handleReturnToProjects}
            {...linkCursor}
            className="px-8 py-3.5 rounded-full border border-[#141413] text-xs font-mono-code tracking-widest uppercase text-[#141413] hover:bg-[#141413] hover:text-[#FFFFFF] transition-all flex items-center gap-2.5"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Projects</span>
          </button>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-[#141413]/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between gap-4 text-[#FFFFFF] pb-4 border-b border-[#FFFFFF]/15"
            >
              <div className="min-w-0">
                <h4 className="font-display text-lg sm:text-xl font-light text-[#FFFFFF]">{lightbox.title}</h4>
                <p className="text-xs sm:text-sm text-[#A09E96]">{lightbox.caption}</p>
              </div>
              <button
                type="button"
                onClick={() => setLightbox(null)}
                className="shrink-0 p-2 rounded-full border border-[#FFFFFF]/20 hover:border-[#FFFFFF] hover:bg-[#FFFFFF]/10 text-[#FFFFFF] transition-colors"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-auto"
            >
              <img
                src={lightbox.src}
                alt={lightbox.title}
                className="max-h-[80vh] max-w-full object-contain rounded-xs shadow-2xl bg-[#FFFFFF]"
              />
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              className="text-[11px] font-mono-code text-[#A09E96] pt-3 border-t border-[#FFFFFF]/15"
            >
              Press ESC or click anywhere outside to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
};
