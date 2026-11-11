'use client';

import { motion } from 'motion/react';

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer id="closing" className="relative w-full overflow-hidden">
      {/* ── PART 1: CLOSING CTA SECTION ── */}
      <div className="relative bg-[#0D1B0D] py-16 sm:py-28 px-4 sm:px-6 text-center border-t border-white/10">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-[#10B981]/10 blur-[140px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-2">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xl sm:text-3xl md:text-4xl font-serif italic text-[#F5F5F0] leading-relaxed"
          >
            &ldquo;We do not inherit the earth from our ancestors; we borrow it from our children.&rdquo;
          </motion.blockquote>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-xs sm:text-sm font-mono uppercase tracking-widest text-[#D4FF00]"
          >
            — Native American Proverb
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 sm:mt-12 flex flex-col items-center justify-center gap-5 sm:gap-6"
          >
            <p className="max-w-xl text-sm sm:text-base md:text-lg text-[#F5F5F0]/70 leading-relaxed">
              The blueprint for a regenerative tomorrow begins with active experimentation today.
              Dive back into the simulation and explore what is possible.
            </p>

            <button
              onClick={() => scrollTo('city-lab')}
              className="inline-flex items-center gap-2.5 sm:gap-3 rounded-full bg-[#D4FF00] px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-[#0A1F0A] transition-all hover:bg-[#A3E635] hover:shadow-[0_0_30px_rgba(212,255,0,0.4)] active:scale-95"
            >
              <span>Return to City Lab</span>
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* ── PART 2: FORMAL FOOTER ── */}
      <div className="bg-[#0A1F0A] py-12 sm:py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand & Organizers */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-[#D4FF00]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22L6.66 19.7C7.14 19.87 7.64 20 8 20C19 20 22 3 22 3C21 5 14 5.25 9 6.25C4 7.25 2 11.5 2 13.5C2 15.5 3.75 17.25 3.75 17.25C7 8 17 8 17 8Z" />
              </svg>
              <span className="text-xl font-mono font-bold tracking-widest text-[#F5F5F0]">
                ECO<span className="text-[#D4FF00]">TERRA</span>
              </span>
            </div>
            <p className="text-xs text-[#F5F5F0]/50 font-mono mt-2">
              TERRACODE 2026 — Theme: <span className="text-[#D4FF00]">GREEN TOMORROW</span>
            </p>
            <p className="text-xs text-[#F5F5F0]/40 mt-1">
              FOSS Club • Department of Computer Science & Engineering • MEA Engineering College
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono uppercase tracking-wider text-[#F5F5F0]/70">
            <button onClick={() => scrollTo('hero')} className="hover:text-[#D4FF00] transition-colors">
              Top
            </button>
            <button onClick={() => scrollTo('challenge')} className="hover:text-[#D4FF00] transition-colors">
              Challenge
            </button>
            <button onClick={() => scrollTo('city-lab')} className="hover:text-[#D4FF00] transition-colors">
              City Lab
            </button>
            <button onClick={() => scrollTo('observatory')} className="hover:text-[#D4FF00] transition-colors">
              Observatory
            </button>
            <button onClick={() => scrollTo('discovery')} className="hover:text-[#D4FF00] transition-colors">
              Discovery
            </button>
            <button onClick={() => scrollTo('action')} className="hover:text-[#D4FF00] transition-colors">
              Take Action
            </button>
          </div>

          {/* Credits & Disclaimers */}
          <div className="text-center md:text-right text-xs text-[#F5F5F0]/40 font-mono">
            <p className="text-[#A3E635] font-semibold">Engineered by SuperCoders</p>
            <p className="mt-1">All simulation data illustrative.</p>
            <p className="mt-1">Open-source under MIT License.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
