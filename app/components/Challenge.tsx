'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useEffect, useState } from 'react';

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  source: string;
  delay: number;
}

function AnimatedCounter({ value, suffix, label, source, delay }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timeout = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000, ease: 'easeOut' }}
      className="border-l-2 border-lime-500/40 pl-5 py-2"
    >
      <span className="block text-4xl font-bold tracking-tight text-[#D4FF00] md:text-5xl">
        {count}
        {suffix}
      </span>
      <span className="mt-1 block text-base font-medium text-[#F5F5F0]/90 leading-snug">
        {label}
      </span>
      <cite className="mt-1 block text-xs font-normal not-italic text-[#F5F5F0]/40">
        — {source}
      </cite>
    </motion.div>
  );
}

function CitySkylineSVG() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.svg
      ref={ref}
      viewBox="0 0 800 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-lg mx-auto"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 1 }}
      role="img"
      aria-label="City skyline transitioning from polluted gray to sustainable green"
    >
      {/* Sky gradient backgrounds */}
      <defs>
        <linearGradient id="sky-polluted" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1F2937" />
        </linearGradient>
        <linearGradient id="sky-green" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#064E3B" />
          <stop offset="100%" stopColor="#0A1F0A" />
        </linearGradient>
        <clipPath id="left-half">
          <rect x="0" y="0" width="400" height="500" />
        </clipPath>
        <clipPath id="right-half">
          <rect x="400" y="0" width="400" height="500" />
        </clipPath>
        <linearGradient id="divider-glow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4FF00" stopOpacity="0" />
          <stop offset="50%" stopColor="#D4FF00" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#D4FF00" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ── LEFT HALF: Polluted City ── */}
      <g clipPath="url(#left-half)">
        <rect x="0" y="0" width="400" height="500" fill="url(#sky-polluted)" />

        {/* Smog layers */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <ellipse cx="120" cy="100" rx="160" ry="40" fill="#6B7280" opacity="0.3" />
          <ellipse cx="280" cy="140" rx="140" ry="35" fill="#6B7280" opacity="0.25" />
          <ellipse cx="200" cy="80" rx="120" ry="30" fill="#9CA3AF" opacity="0.2" />
        </motion.g>

        {/* Smokestacks */}
        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {/* Factory 1 */}
          <rect x="40" y="320" width="80" height="180" fill="#374151" />
          <rect x="55" y="280" width="14" height="60" fill="#4B5563" />
          <rect x="85" y="290" width="14" height="50" fill="#4B5563" />
          {/* Smoke */}
          <motion.g
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <circle cx="62" cy="265" r="10" fill="#9CA3AF" opacity="0.5" />
            <circle cx="55" cy="248" r="14" fill="#9CA3AF" opacity="0.35" />
            <circle cx="92" cy="275" r="9" fill="#9CA3AF" opacity="0.45" />
            <circle cx="88" cy="258" r="12" fill="#9CA3AF" opacity="0.3" />
          </motion.g>

          {/* Gray building 1 */}
          <rect x="140" y="250" width="60" height="250" fill="#4B5563" />
          <rect x="150" y="265" width="12" height="16" fill="#FCD34D" opacity="0.5" />
          <rect x="170" y="265" width="12" height="16" fill="#FCD34D" opacity="0.3" />
          <rect x="150" y="295" width="12" height="16" fill="#FCD34D" opacity="0.4" />
          <rect x="170" y="295" width="12" height="16" fill="#FCD34D" opacity="0.6" />
          <rect x="150" y="325" width="12" height="16" fill="#FCD34D" opacity="0.3" />
          <rect x="170" y="325" width="12" height="16" fill="#FCD34D" opacity="0.5" />
          <rect x="150" y="355" width="12" height="16" fill="#FCD34D" opacity="0.4" />
          <rect x="170" y="355" width="12" height="16" fill="#FCD34D" opacity="0.6" />

          {/* Gray building 2 - tall */}
          <rect x="220" y="200" width="50" height="300" fill="#374151" />
          <rect x="230" y="215" width="10" height="14" fill="#FCD34D" opacity="0.4" />
          <rect x="248" y="215" width="10" height="14" fill="#FCD34D" opacity="0.3" />
          <rect x="230" y="245" width="10" height="14" fill="#FCD34D" opacity="0.5" />
          <rect x="248" y="245" width="10" height="14" fill="#FCD34D" opacity="0.4" />
          <rect x="230" y="275" width="10" height="14" fill="#FCD34D" opacity="0.3" />
          <rect x="248" y="275" width="10" height="14" fill="#FCD34D" opacity="0.6" />
          <rect x="230" y="305" width="10" height="14" fill="#FCD34D" opacity="0.5" />

          {/* Gray building 3 */}
          <rect x="290" y="290" width="70" height="210" fill="#4B5563" />
          <rect x="300" y="305" width="14" height="18" fill="#FCD34D" opacity="0.4" />
          <rect x="325" y="305" width="14" height="18" fill="#FCD34D" opacity="0.5" />
          <rect x="300" y="340" width="14" height="18" fill="#FCD34D" opacity="0.3" />
          <rect x="325" y="340" width="14" height="18" fill="#FCD34D" opacity="0.6" />
          <rect x="300" y="375" width="14" height="18" fill="#FCD34D" opacity="0.5" />

          {/* Dirty road */}
          <rect x="0" y="470" width="400" height="30" fill="#1F2937" />
          <rect x="30" y="482" width="40" height="3" fill="#6B7280" opacity="0.3" />
          <rect x="120" y="482" width="40" height="3" fill="#6B7280" opacity="0.3" />
          <rect x="210" y="482" width="40" height="3" fill="#6B7280" opacity="0.3" />
          <rect x="300" y="482" width="40" height="3" fill="#6B7280" opacity="0.3" />
        </motion.g>
      </g>

      {/* ── RIGHT HALF: Green City ── */}
      <g clipPath="url(#right-half)">
        <rect x="400" y="0" width="400" height="500" fill="url(#sky-green)" />

        {/* Stars / clean sky dots */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 1.2 }}
        >
          <circle cx="450" cy="50" r="1.5" fill="#D4FF00" opacity="0.6" />
          <circle cx="550" cy="35" r="1" fill="#D4FF00" opacity="0.4" />
          <circle cx="650" cy="60" r="1.5" fill="#D4FF00" opacity="0.5" />
          <circle cx="720" cy="40" r="1" fill="#D4FF00" opacity="0.3" />
          <circle cx="500" cy="80" r="1" fill="#D4FF00" opacity="0.4" />
        </motion.g>

        {/* Sun */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <circle cx="680" cy="90" r="30" fill="#D4FF00" opacity="0.15" />
          <circle cx="680" cy="90" r="20" fill="#D4FF00" opacity="0.3" />
          <circle cx="680" cy="90" r="12" fill="#D4FF00" opacity="0.6" />
        </motion.g>

        <motion.g
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {/* Green building 1 — with rooftop garden */}
          <rect x="410" y="280" width="70" height="190" fill="#065F46" />
          <rect x="405" y="270" width="80" height="14" fill="#059669" rx="2" />
          {/* Windows */}
          <rect x="420" y="295" width="14" height="18" fill="#34D399" opacity="0.5" />
          <rect x="450" y="295" width="14" height="18" fill="#34D399" opacity="0.4" />
          <rect x="420" y="330" width="14" height="18" fill="#34D399" opacity="0.6" />
          <rect x="450" y="330" width="14" height="18" fill="#34D399" opacity="0.5" />
          <rect x="420" y="365" width="14" height="18" fill="#34D399" opacity="0.4" />
          <rect x="450" y="365" width="14" height="18" fill="#34D399" opacity="0.6" />
          {/* Rooftop plants */}
          <circle cx="425" cy="268" r="8" fill="#10B981" opacity="0.8" />
          <circle cx="445" cy="265" r="10" fill="#059669" opacity="0.7" />
          <circle cx="465" cy="268" r="7" fill="#34D399" opacity="0.7" />

          {/* Green building 2 — tall tower with vertical garden */}
          <rect x="500" y="200" width="55" height="270" fill="#047857" />
          {/* Vertical garden strips */}
          <rect x="497" y="220" width="4" height="240" fill="#10B981" opacity="0.6" />
          <rect x="558" y="220" width="4" height="240" fill="#10B981" opacity="0.6" />
          {/* Windows */}
          <rect x="510" y="220" width="10" height="14" fill="#34D399" opacity="0.4" />
          <rect x="530" y="220" width="10" height="14" fill="#34D399" opacity="0.5" />
          <rect x="510" y="250" width="10" height="14" fill="#34D399" opacity="0.5" />
          <rect x="530" y="250" width="10" height="14" fill="#34D399" opacity="0.4" />
          <rect x="510" y="280" width="10" height="14" fill="#34D399" opacity="0.6" />
          <rect x="530" y="280" width="10" height="14" fill="#34D399" opacity="0.5" />
          <rect x="510" y="310" width="10" height="14" fill="#34D399" opacity="0.4" />
          <rect x="530" y="310" width="10" height="14" fill="#34D399" opacity="0.5" />
          {/* Solar panel on roof */}
          <polygon points="505,200 550,200 555,190 500,190" fill="#84CC16" opacity="0.7" />

          {/* Green building 3 */}
          <rect x="575" y="310" width="65" height="160" fill="#065F46" />
          <rect x="585" y="325" width="14" height="18" fill="#34D399" opacity="0.5" />
          <rect x="612" y="325" width="14" height="18" fill="#34D399" opacity="0.4" />
          <rect x="585" y="360" width="14" height="18" fill="#34D399" opacity="0.6" />
          <rect x="612" y="360" width="14" height="18" fill="#34D399" opacity="0.5" />
          {/* Rooftop wind turbine */}
          <line x1="607" y1="310" x2="607" y2="280" stroke="#A3E635" strokeWidth="2" />
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            style={{ transformOrigin: '607px 280px' }}
          >
            <line x1="607" y1="280" x2="607" y2="260" stroke="#A3E635" strokeWidth="2" />
            <line x1="607" y1="280" x2="590" y2="292" stroke="#A3E635" strokeWidth="2" />
            <line x1="607" y1="280" x2="624" y2="292" stroke="#A3E635" strokeWidth="2" />
          </motion.g>

          {/* Small eco building */}
          <rect x="660" y="360" width="55" height="110" fill="#047857" />
          <rect x="670" y="375" width="12" height="16" fill="#34D399" opacity="0.5" />
          <rect x="690" y="375" width="12" height="16" fill="#34D399" opacity="0.4" />
          <rect x="670" y="405" width="12" height="16" fill="#34D399" opacity="0.6" />
          <rect x="690" y="405" width="12" height="16" fill="#34D399" opacity="0.5" />

          {/* Trees */}
          <rect x="738" y="400" width="6" height="70" fill="#065F46" />
          <circle cx="741" cy="390" r="18" fill="#10B981" opacity="0.7" />
          <circle cx="741" cy="378" r="14" fill="#059669" opacity="0.8" />

          <rect x="762" y="420" width="5" height="50" fill="#065F46" />
          <circle cx="765" cy="412" r="14" fill="#34D399" opacity="0.6" />
          <circle cx="765" cy="402" r="10" fill="#10B981" opacity="0.7" />

          {/* Green road with bike lane */}
          <rect x="400" y="470" width="400" height="30" fill="#064E3B" />
          <rect x="400" y="470" width="400" height="6" fill="#84CC16" opacity="0.3" />
          {/* Bike symbols */}
          <circle cx="460" cy="485" r="5" stroke="#34D399" strokeWidth="1.5" fill="none" opacity="0.5" />
          <circle cx="560" cy="485" r="5" stroke="#34D399" strokeWidth="1.5" fill="none" opacity="0.5" />
          <circle cx="660" cy="485" r="5" stroke="#34D399" strokeWidth="1.5" fill="none" opacity="0.5" />
        </motion.g>
      </g>

      {/* ── CENTER DIVIDER ── */}
      <motion.line
        x1="400"
        y1="0"
        x2="400"
        y2="500"
        stroke="url(#divider-glow)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ delay: 0.4, duration: 1.2 }}
      />

      {/* Labels */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <text
          x="200"
          y="490"
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
          fontWeight="500"
          letterSpacing="0.1em"
        >
          TODAY
        </text>
        <text
          x="600"
          y="490"
          textAnchor="middle"
          fill="#A3E635"
          fontSize="11"
          fontFamily="system-ui, sans-serif"
          fontWeight="500"
          letterSpacing="0.1em"
        >
          TOMORROW
        </text>
      </motion.g>
    </motion.svg>
  );
}

const stats: StatItemProps[] = [
  {
    value: 75,
    suffix: '%',
    label: 'of natural resources consumed by cities',
    source: 'UN Environment Programme',
    delay: 0,
  },
  {
    value: 70,
    suffix: '%',
    label: 'of global CO₂ emissions from urban areas',
    source: 'UN-Habitat',
    delay: 200,
  },
  {
    value: 68,
    suffix: '%',
    label: 'of world population in cities by 2050',
    source: 'United Nations DESA',
    delay: 400,
  },
  {
    value: 40,
    suffix: '%',
    label: 'of energy-related CO₂ from buildings',
    source: 'International Energy Agency',
    delay: 600,
  },
];

export default function Challenge() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="challenge"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0D1B0D] py-16 sm:py-24 md:py-32"
    >
      {/* Subtle background texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #F5F5F0 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-10 sm:mb-16 md:mb-20 px-1"
        >
          <div className="mb-4 h-1 w-16 rounded-full bg-[#84CC16]" />
          <h2 className="text-3xl font-bold tracking-tight text-[#F5F5F0] sm:text-4xl md:text-5xl">
            The Urban Challenge
          </h2>
          <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#F5F5F0]/60">
            Our cities are the engines of modern civilization — and the epicenter of its
            greatest environmental crisis.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left column — narrative + stats */}
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="space-y-5"
            >
              <p className="text-base leading-relaxed text-[#F5F5F0]/80 md:text-lg">
                The world&apos;s cities are expanding at an unprecedented rate. As concrete
                jungles stretch across every continent, they devour energy, water, and raw
                materials on a staggering scale — placing immense strain on the planet&apos;s
                finite resources.
              </p>
              <p className="text-base leading-relaxed text-[#F5F5F0]/70 md:text-lg">
                From the towers that consume vast amounts of energy to the sprawling road
                networks that lock in fossil-fuel dependence, urban design choices made today
                will determine whether future generations inherit a liveable world — or an
                unmanageable one.
              </p>
              <p className="text-base leading-relaxed text-[#F5F5F0]/70 md:text-lg">
                The numbers reveal an urgent reality that demands bold, systemic solutions —
                solutions that reimagine how we build, move, and live within our cities.
              </p>
            </motion.div>

            {/* Statistics */}
            <div className="grid gap-6 sm:grid-cols-2">
              {stats.map((stat) => (
                <AnimatedCounter key={stat.label} {...stat} />
              ))}
            </div>
          </div>

          {/* Right column — SVG illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-2xl border border-[#F5F5F0]/5 bg-[#0A1F0A] p-4 md:p-6">
              <CitySkylineSVG />
            </div>
            {/* Glow effect behind the illustration */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-[#059669]/5 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
