import React, { useEffect, useState } from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Check, Copy, Download, FileText, MessageCircle, Phone, Send } from 'lucide-react';
import { smoothScrollTo } from '../lib/motion';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

export const CONTACT_EMAIL = 'mahipatel1329@gmail.com';
export const CONTACT_PHONE = '+91 97371 58840';
const PHONE_DIGITS = '919737158840';
const CV_HREF = '/Mahi_Patel_CV.pdf';

/** Set by links elsewhere on the site (e.g. the footer) to land directly on the contact details. */
export const SCROLL_TO_DETAILS_KEY = 'mahi_scroll_to_contact_details';
export const CONTACT_DETAILS_ID = 'contact-details';

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-3 font-mono-code text-[11px] text-[#9A773E] uppercase tracking-[0.2em]">
    <span className="h-px w-8 bg-[#9A773E]" />
    <span>{children}</span>
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770]">{children}</div>
);

/** Small outlined action next to a contact detail (Write, Call, Copy…). */
const actionClass =
  'group inline-flex items-center gap-2 rounded-full border border-[#E5E3DD] px-4 py-2 text-sm text-[#141413] hover:border-[#141413] hover:bg-[#141413] hover:text-[#FFFFFF] transition-colors duration-300';

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate, onCursorChange }) => {
  const [copied, setCopied] = useState<'email' | 'phone' | null>(null);

  const hover = {
    onMouseEnter: () => onCursorChange?.('link'),
    onMouseLeave: () => onCursorChange?.('default'),
  };
  const copyHover = {
    onMouseEnter: () => onCursorChange?.('copy'),
    onMouseLeave: () => onCursorChange?.('default'),
  };

  // Arriving from a "Start a conversation" link → scroll straight to the details
  useEffect(() => {
    let wanted = false;
    try {
      wanted = sessionStorage.getItem(SCROLL_TO_DETAILS_KEY) === '1';
      sessionStorage.removeItem(SCROLL_TO_DETAILS_KEY);
    } catch {}
    if (!wanted) return;
    const t = setTimeout(() => smoothScrollTo(document.getElementById(CONTACT_DETAILS_ID)), 120);
    return () => clearTimeout(t);
  }, []);

  const copy = async (what: 'email' | 'phone') => {
    try {
      await navigator.clipboard.writeText(what === 'email' ? CONTACT_EMAIL : CONTACT_PHONE);
      setCopied(what);
      setTimeout(() => setCopied((c) => (c === what ? null : c)), 2200);
    } catch {}
  };

  const CopyButton: React.FC<{ what: 'email' | 'phone' }> = ({ what }) => (
    <button type="button" onClick={() => copy(what)} {...copyHover} className={actionClass} aria-label={`Copy ${what}`}>
      {copied === what ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied === what ? 'Copied' : 'Copy'}
    </button>
  );

  /** One row of the contact sheet: label · large value · actions. */
  const Row: React.FC<{ label: string; children: React.ReactNode; actions?: React.ReactNode; note?: React.ReactNode }> = ({
    label,
    children,
    actions,
    note,
  }) => (
    <div className="py-6 border-b border-[#E5E3DD]">
      <Label>{label}</Label>
      <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <div className="font-display text-xl sm:text-[1.6rem] leading-snug text-[#141413]">{children}</div>
          {note && <div className="mt-1 text-sm text-[#6E6C65]">{note}</div>}
        </div>
        {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );

  return (
    <div id="contact-page" className="relative min-h-screen bg-[#FFFFFF] text-[#141413] pt-28 md:pt-32 pb-24">
      {/* Hero */}
      <section data-reveal className="px-6 md:px-14 max-w-6xl mx-auto">
        <Eyebrow>Contact</Eyebrow>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:items-end">
          <h1 className="md:col-span-8 font-display font-light text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight">
            Let’s create something
            <br />
            <span className="italic text-[#9A773E]">meaningful together.</span>
          </h1>
          <p className="md:col-span-4 text-base leading-relaxed text-[#55534D]">
            Whether it’s an internship, a new interior project or a creative collaboration, I’d love to hear about it.
            Write or call me directly and I’ll get back to you personally.
          </p>
        </div>
      </section>

      {/* Contact sheet + side panel */}
      <section
        data-reveal
        data-reveal-delay="120"
        className="px-6 md:px-14 max-w-6xl mx-auto mt-16 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-14"
      >
        <div id={CONTACT_DETAILS_ID} className="lg:col-span-8 border-t border-[#141413] scroll-mt-28">
          <Row
            label="Email"
            actions={
              <>
                <a href={`mailto:${CONTACT_EMAIL}`} {...hover} className={actionClass}>
                  <Send className="h-3.5 w-3.5" /> Write
                </a>
                <CopyButton what="email" />
              </>
            }
          >
            <a href={`mailto:${CONTACT_EMAIL}`} {...hover} className="hover:text-[#9A773E] transition-colors whitespace-nowrap">
              {CONTACT_EMAIL}
            </a>
          </Row>

          <Row
            label="Phone"
            note="Calls and WhatsApp messages welcome"
            actions={
              <>
                <a href={`tel:+${PHONE_DIGITS}`} {...hover} className={actionClass}>
                  <Phone className="h-3.5 w-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/${PHONE_DIGITS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...hover}
                  className={actionClass}
                >
                  <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                </a>
                <CopyButton what="phone" />
              </>
            }
          >
            <a href={`tel:+${PHONE_DIGITS}`} {...hover} className="hover:text-[#9A773E] transition-colors tabular-nums whitespace-nowrap">
              {CONTACT_PHONE}
            </a>
          </Row>

          <Row label="Based in">
            Ahmedabad, Gujarat, India
          </Row>

          <Row
            label="Availability"
            note="B. Interior Design · Indus Design School, Indus University · graduating 2027"
          >
            <span className="inline-flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[#9A773E] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#9A773E]" />
              </span>
              Open to internships &amp; collaborations
            </span>
          </Row>

          <Row
            label="Curriculum Vitae"
            note="PDF · 251 KB"
            actions={
              <a href={CV_HREF} download="Mahi_Patel_CV.pdf" target="_blank" rel="noopener noreferrer" {...hover} className={actionClass}>
                <Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" /> Download
              </a>
            }
          >
            <a
              href={CV_HREF}
              download="Mahi_Patel_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              {...hover}
              className="inline-flex items-center gap-3 hover:text-[#9A773E] transition-colors"
            >
              <FileText className="h-6 w-6 text-[#9A773E]" strokeWidth={1.5} />
              Mahi Patel — CV
            </a>
          </Row>
        </div>

        <aside className="lg:col-span-4 space-y-10 lg:pt-8">
          <div className="bg-[#FAF8F5] border border-[#E5E3DD] rounded-sm p-6 sm:p-8 space-y-5">
            <Label>Open to</Label>
            <ul className="space-y-4">
              {[
                ['Internships', 'Interior design studios and architecture practices.'],
                ['Project commissions', 'Residential, retail and hospitality interiors.'],
                ['Collaborations', 'Installations, exhibitions and model making.'],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#9A773E]" />
                  <div>
                    <div className="text-[#141413]">{t}</div>
                    <div className="text-sm text-[#6E6C65]">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <Label>How it works</Label>
            <ol className="space-y-5">
              {[
                ['Share your brief', 'Tell me about the role, space or idea.'],
                ['Conversation', 'I’ll reply to discuss scope, timeline and fit.'],
                ['Design begins', 'From concept to drawings, together.'],
              ].map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[2rem_1fr]">
                  <span className="font-mono-code text-xs text-[#9A773E] pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <div className="text-[#141413]">{t}</div>
                    <div className="text-sm text-[#6E6C65]">{d}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </section>

      {/* Closing links */}
      <section
        data-reveal
        className="px-6 md:px-14 max-w-6xl mx-auto mt-24 pt-10 border-t border-[#E5E3DD] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <p className="font-display font-light text-2xl text-[#141413]">Not ready to write yet?</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <a
            href={CV_HREF}
            download="Mahi_Patel_CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            {...hover}
            className="group inline-flex items-center gap-2 text-sm text-[#141413] hover:text-[#9A773E] transition-colors"
          >
            Download my CV
            <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </a>
          <button
            type="button"
            onClick={() => onNavigate({ name: 'work' })}
            {...hover}
            className="group inline-flex items-center gap-2 text-sm text-[#141413] hover:text-[#9A773E] transition-colors"
          >
            Explore the projects
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
