'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface SolutionItem {
  title: string;
  focus: string;
  description: string;
  keralaContext: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  borderColor: string;
  span: string;
  bgIllustration: React.ReactNode;
}

function SolutionIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 shrink-0 md:h-12 md:w-12"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const solutions: SolutionItem[] = [
  {
    title: 'Clean Energy Microgrids',
    focus: 'FOCUS • CIAL 100% SOLAR BENCHMARK',
    description:
      'Harnessing solar canals, floating dam photovoltaics, and decentralized rooftop microgrids to power cities with zero-emission energy.',
    keralaContext:
      'Modeled after Cochin International Airport (CIAL)—the world’s first 100% solar-powered airport—and Banasura Sagar floating arrays.',
    icon: (
      <SolutionIcon>
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <line x1="24" y1="4" x2="24" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="38" x2="24" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="9.86" y1="9.86" x2="14.1" y2="14.1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33.9" y1="33.9" x2="38.14" y2="38.14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </SolutionIcon>
    ),
    color: 'text-[#D4FF00]',
    hoverColor: 'group-hover:bg-[#D4FF00]/10',
    borderColor: 'border-[#D4FF00]/20 hover:border-[#D4FF00]/40',
    span: 'md:col-span-2',
    bgIllustration: (
      <svg viewBox="0 0 400 200" fill="none" className="w-full h-full opacity-15">
        {/* Kerala floating solar dam silhouette */}
        <polygon points="50,160 140,110 240,110 150,160" fill="#D4FF00" opacity="0.3" stroke="#D4FF00" strokeWidth="1" />
        <polygon points="160,160 250,110 350,110 260,160" fill="#D4FF00" opacity="0.25" stroke="#D4FF00" strokeWidth="1" />
        <line x1="95" y1="135" x2="195" y2="135" stroke="#D4FF00" strokeWidth="0.8" opacity="0.4" />
        <line x1="205" y1="135" x2="305" y2="135" stroke="#D4FF00" strokeWidth="0.8" opacity="0.4" />
        {/* Palm tree on bank */}
        <path d="M 360 190 Q 365 140 370 100" stroke="#84CC16" strokeWidth="2.5" />
        <path d="M 370 100 Q 345 85 330 95" stroke="#84CC16" strokeWidth="1.8" />
        <path d="M 370 100 Q 395 85 410 95" stroke="#84CC16" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    title: 'Backwater Hydrology',
    focus: 'FOCUS • KUTTANAD & VEMBANAD KAYAL',
    description:
      'Smart bioswales, decentralized rainwater cisterns, and natural wetland sponge buffers protecting urban settlements from monsoon inundation.',
    keralaContext:
      'Inspired by Kuttanad bio-saline hydrology and Pokkali wetland conservation to buffer coastal storm surges.',
    icon: (
      <SolutionIcon>
        <path
          d="M24 6C24 6 10 22 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 22 24 6 24 6Z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <path d="M18 32C18 28 22 22 24 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </SolutionIcon>
    ),
    color: 'text-[#34D399]',
    hoverColor: 'group-hover:bg-[#34D399]/10',
    borderColor: 'border-[#34D399]/20 hover:border-[#34D399]/40',
    span: 'md:col-span-1',
    bgIllustration: (
      <svg viewBox="0 0 250 200" fill="none" className="w-full h-full opacity-15">
        {/* Winding backwater canal curves */}
        <path d="M 0 170 Q 70 130 130 150 T 250 120" stroke="#34D399" strokeWidth="8" opacity="0.3" fill="none" />
        <path d="M 30 185 Q 80 180 120 185" stroke="#34D399" strokeWidth="2" strokeDasharray="4 4" fill="none" />
        <ellipse cx="140" cy="80" rx="40" ry="12" fill="#34D399" opacity="0.1" />
      </svg>
    ),
  },
  {
    title: 'Electric Water Metro & Trams',
    focus: 'FOCUS • KOCHI WATER METRO NETWORK',
    description:
      'Integrated solar-electric passenger catamaran networks, light rail corridors, and dedicated active-mobility paths cutting commuter emissions.',
    keralaContext:
      'Based on the Kochi Water Metro—Asia’s first integrated urban battery-electric water transit network connecting 10 islands.',
    icon: (
      <SolutionIcon>
        <circle cx="14" cy="34" r="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <circle cx="38" cy="34" r="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M14 34L22 16H32L38 34" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <line x1="22" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </SolutionIcon>
    ),
    color: 'text-[#10B981]',
    hoverColor: 'group-hover:bg-[#10B981]/10',
    borderColor: 'border-[#10B981]/20 hover:border-[#10B981]/40',
    span: 'md:col-span-1',
    bgIllustration: (
      <svg viewBox="0 0 250 200" fill="none" className="w-full h-full opacity-15">
        {/* Catamaran ferry silhouette */}
        <path d="M 40 145 L 80 145 L 190 145 L 210 135 L 50 135 Z" fill="#10B981" opacity="0.3" />
        <rect x="70" y="120" width="100" height="15" rx="3" fill="#10B981" opacity="0.25" />
        <line x1="20" y1="152" x2="230" y2="152" stroke="#10B981" strokeWidth="2" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: 'Circular Waste Recovery',
    focus: 'FOCUS • HARITHA ZERO-WASTE LOOPS',
    description:
      'Decentralized community aerobic composting, municipal segregation loops, and single-use packaging eradication preserving landfill ecosystems.',
    keralaContext:
      'Leveraging Kerala’s Haritha Karma Sena civic model—diverting thousands of tons of organic scrap into high-yield compost.',
    icon: (
      <SolutionIcon>
        <path d="M24 8L30 18H18L24 8Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
        <path d="M30 18L40 36H24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M18 18L8 36H24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </SolutionIcon>
    ),
    color: 'text-[#A3E635]',
    hoverColor: 'group-hover:bg-[#A3E635]/10',
    borderColor: 'border-[#A3E635]/20 hover:border-[#A3E635]/40',
    span: 'md:col-span-1',
    bgIllustration: (
      <svg viewBox="0 0 250 200" fill="none" className="w-full h-full opacity-15">
        {/* Interlocking circular recycling gears */}
        <circle cx="125" cy="110" r="50" stroke="#A3E635" strokeWidth="2.5" strokeDasharray="8 6" fill="none" />
        <circle cx="125" cy="110" r="25" fill="#A3E635" opacity="0.1" />
      </svg>
    ),
  },
  {
    title: 'Western Ghats Biodiversity',
    focus: 'FOCUS • SILENT VALLEY BIOSPHERE',
    description:
      'Urban wildlife corridors, tropical mangrove bio-shields, and native flowering canopies restoring endemic pollinator migration pathways.',
    keralaContext:
      'Safeguarding the UNESCO Western Ghats biodiversity hotspot, home to over 5,000 vascular plants and endemic fauna.',
    icon: (
      <SolutionIcon>
        <path d="M24 42V24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 24C24 24 8 24 8 14C8 6 16 4 24 4C32 4 40 6 40 14C40 24 24 24 24 24Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      </SolutionIcon>
    ),
    color: 'text-[#059669]',
    hoverColor: 'group-hover:bg-[#059669]/10',
    borderColor: 'border-[#059669]/20 hover:border-[#059669]/40',
    span: 'md:col-span-1',
    bgIllustration: (
      <svg viewBox="0 0 250 200" fill="none" className="w-full h-full opacity-15">
        {/* Dense tropical forest canopy silhouette */}
        <circle cx="70" cy="90" r="45" fill="#059669" opacity="0.2" />
        <circle cx="140" cy="70" r="55" fill="#059669" opacity="0.25" />
        <circle cx="195" cy="100" r="40" fill="#059669" opacity="0.2" />
      </svg>
    ),
  },
  {
    title: 'Bioclimatic Green Architecture',
    focus: 'FOCUS • NALUKETTU PASSIVE COOLING',
    description:
      'Net-zero buildings engineered with courtyard thermal chimneys, shaded Charupadi verandas, living walls, and local clay-tile aesthetics.',
    keralaContext:
      'Blending traditional Kerala courtyard ventilation with solar rooftops and living vertical gardens for passive thermal regulation.',
    icon: (
      <SolutionIcon>
        <rect x="12" y="16" width="24" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" rx="1" />
        <rect x="18" y="22" width="5" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="27" y="22" width="5" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <line x1="24" y1="16" x2="24" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 10C28 8 32 6 30 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      </SolutionIcon>
    ),
    color: 'text-[#84CC16]',
    hoverColor: 'group-hover:bg-[#84CC16]/10',
    borderColor: 'border-[#84CC16]/20 hover:border-[#84CC16]/40',
    span: 'md:col-span-2',
    bgIllustration: (
      <svg viewBox="0 0 400 200" fill="none" className="w-full h-full opacity-15">
        {/* Kerala traditional roof gable with modern vertical garden structure */}
        <polygon points="120,60 200,20 280,60" fill="#84CC16" opacity="0.2" stroke="#84CC16" strokeWidth="1.5" />
        <rect x="140" y="60" width="120" height="90" fill="#84CC16" opacity="0.15" stroke="#84CC16" strokeWidth="1" />
        <line x1="160" y1="70" x2="160" y2="140" stroke="#84CC16" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="200" y1="70" x2="200" y2="140" stroke="#84CC16" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="240" y1="70" x2="240" y2="140" stroke="#84CC16" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    ),
  },
];

function SolutionCard({ item, index }: { item: SolutionItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      }}
      className={`group relative ${item.span}`}
    >
      <div
        className={`relative h-full overflow-hidden rounded-2xl border ${item.borderColor} bg-[#0A1F0A] p-5 sm:p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl md:p-8`}
      >
        {/* Atmospheric Environmental SVG Backdrop Imagery */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden transition-transform duration-700 ease-out group-hover:scale-105">
          {item.bgIllustration}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F0A] via-[#0A1F0A]/90 to-[#0A1F0A]/60" />
        </div>

        {/* Hover background glow */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ${item.hoverColor} z-0`}
        />

        <div className="relative z-10 flex flex-col justify-between h-full gap-4">
          <div>
            {/* Focus Tag Badge (inspired by cinematic environmental telemetry) */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider text-[#A3E635] uppercase px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                {item.focus}
              </span>
              <div className={`${item.color}`}>{item.icon}</div>
            </div>

            {/* Title & Description */}
            <h3 className={`text-lg font-bold tracking-tight ${item.color} md:text-xl`}>
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#F5F5F0]/75 md:text-base">
              {item.description}
            </p>
          </div>

          {/* Kerala Regional Implementation Benchmark Callout */}
          <div className="mt-2 rounded-xl bg-white/[0.03] border border-white/5 p-3 text-xs font-mono text-[#E8E5E0]/70 flex items-start gap-2">
            <span className="text-[#D4FF00] font-bold">↳</span>
            <span className="leading-snug">{item.keralaContext}</span>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div
          className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100"
          style={{
            backgroundColor:
              item.color === 'text-[#D4FF00]'
                ? '#D4FF00'
                : item.color === 'text-[#34D399]'
                ? '#34D399'
                : item.color === 'text-[#10B981]'
                ? '#10B981'
                : item.color === 'text-[#A3E635]'
                ? '#A3E635'
                : item.color === 'text-[#059669]'
                ? '#059669'
                : '#84CC16',
            opacity: 0.1,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function GreenDiscovery() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="discovery"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0A1F0A] py-16 sm:py-24 md:py-32"
    >
      {/* Background pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #F5F5F0 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-2xl text-center md:mb-16 px-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-mono font-semibold text-[#34D399] uppercase tracking-wider mb-4">
            Regional Environmental Architecture
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#F5F5F0] sm:text-4xl md:text-5xl">
            Green Discovery
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#F5F5F0]/60">
            Explore proven sustainability frameworks & Kerala-inspired environmental solutions shaping tomorrow&apos;s regenerative settlements.
          </p>
          <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-[#84CC16] to-[#059669]" />
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5 lg:gap-6">
          {solutions.map((item, index) => (
            <SolutionCard key={item.title} item={item} index={index} />
          ))}
        </div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-14 text-center text-xs sm:text-sm text-[#F5F5F0]/40 font-mono"
        >
          Every ecological pillar is interconnected — sustainable cities require all of them operating in unison.
        </motion.p>
      </div>
    </section>
  );
}
