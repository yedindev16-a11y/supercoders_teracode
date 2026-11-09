'use client';

import { motion } from 'motion/react';

export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0A1F0A] px-6 text-center"
    >
      {/* Dynamic atmospheric radial background gradients */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="animate-pulse-glow absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#10B981]/15 blur-[140px]"
        />
        <div
          className="absolute -bottom-40 left-1/4 h-[500px] w-[500px] rounded-full bg-[#D4FF00]/10 blur-[130px]"
        />
        <div
          className="absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full bg-[#059669]/15 blur-[120px]"
        />
        {/* Subtle technical grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #D4FF00 1px, transparent 1px), linear-gradient(to bottom, #D4FF00 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center pt-20">
        {/* Competition Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#D4FF00]/30 bg-[#0D1B0D]/80 px-4 py-2 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D4FF00] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D4FF00]" />
          </span>
          <span className="text-xs font-mono font-semibold tracking-widest text-[#D4FF00] uppercase">
            TERRACODE 2026 • GREEN TOMORROW
          </span>
        </motion.div>

        {/* Brand Headline */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl font-black tracking-[0.2em] sm:text-7xl md:text-8xl lg:text-9xl font-mono text-[#F5F5F0]"
        >
          ECO<span className="text-[#D4FF00] drop-shadow-[0_0_35px_rgba(212,255,0,0.4)]">TERRA</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 text-xl font-medium tracking-tight text-[#A3E635] sm:text-2xl md:text-3xl font-sans"
        >
          The future isn&apos;t inherited. It&apos;s designed.
        </motion.p>

        {/* Concise Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-[#F5F5F0]/70 sm:text-lg"
        >
          An interactive sustainability platform exploring how urban centers can transition toward a resilient,
          carbon-neutral tomorrow. Simulate real-time eco-parameters, visualize living city dynamics, and discover practical solutions.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <button
            onClick={() => scrollTo('challenge')}
            className="group relative inline-flex h-13 items-center justify-center gap-3 overflow-hidden rounded-full bg-[#D4FF00] px-8 text-base font-bold text-[#0A1F0A] transition-all duration-300 hover:bg-[#A3E635] hover:shadow-[0_0_30px_rgba(212,255,0,0.5)] active:scale-95"
          >
            <span>Explore the Future</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <button
            onClick={() => scrollTo('city-lab')}
            className="group inline-flex h-13 items-center justify-center gap-2 rounded-full border border-[#D4FF00]/40 bg-[#0D1B0D]/50 px-8 text-base font-semibold text-[#F5F5F0] backdrop-blur-sm transition-all duration-300 hover:border-[#D4FF00] hover:bg-[#D4FF00]/10 hover:text-[#D4FF00] active:scale-95"
          >
            <svg className="h-5 w-5 text-[#D4FF00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            <span>Design Your City</span>
          </button>
        </motion.div>

        {/* Quick Highlights Metric Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-8 sm:grid-cols-4"
        >
          <div>
            <div className="text-2xl font-bold font-mono text-[#D4FF00]">5 Systems</div>
            <div className="text-xs uppercase tracking-wider text-[#F5F5F0]/50 mt-1">Simulated Live</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#34D399]">100% Client</div>
            <div className="text-xs uppercase tracking-wider text-[#F5F5F0]/50 mt-1">Reactive Engine</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#A3E635]">6 Indicators</div>
            <div className="text-xs uppercase tracking-wider text-[#F5F5F0]/50 mt-1">Environmental Impact</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-[#10B981]">SDG Aligned</div>
            <div className="text-xs uppercase tracking-wider text-[#F5F5F0]/50 mt-1">UN Urban Goals</div>
          </div>
        </motion.div>
      </div>

      {/* Animated Bouncing Scroll-down indicator */}
      <motion.button
        onClick={() => scrollTo('challenge')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#F5F5F0]/40 transition-colors hover:text-[#D4FF00] focus:outline-none"
        aria-label="Scroll down to the challenge"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase font-mono tracking-widest">Explore</span>
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.button>
    </section>
  );
}
