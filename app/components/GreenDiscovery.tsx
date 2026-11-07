'use client';

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface SolutionItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  borderColor: string;
  span: string;
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
    title: 'Clean Energy',
    description:
      'Harnessing solar, wind, and green hydrogen to power cities with zero-emission energy sources that scale sustainably.',
    icon: (
      <SolutionIcon>
        {/* Sun icon */}
        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <line x1="24" y1="4" x2="24" y2="10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="38" x2="24" y2="44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="38" y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="9.86" y1="9.86" x2="14.1" y2="14.1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33.9" y1="33.9" x2="38.14" y2="38.14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="9.86" y1="38.14" x2="14.1" y2="33.9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="33.9" y1="14.1" x2="38.14" y2="9.86" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </SolutionIcon>
    ),
    color: 'text-[#D4FF00]',
    hoverColor: 'group-hover:bg-[#D4FF00]/10',
    borderColor: 'border-[#D4FF00]/20 hover:border-[#D4FF00]/40',
    span: 'md:col-span-2',
  },
  {
    title: 'Water Conservation',
    description:
      'Smart water systems using IoT sensors, rainwater harvesting, and AI-driven leak detection to protect every drop.',
    icon: (
      <SolutionIcon>
        {/* Droplet icon */}
        <path
          d="M24 6C24 6 10 22 10 30C10 37.732 16.268 44 24 44C31.732 44 38 37.732 38 30C38 22 24 6 24 6Z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <path
          d="M18 32C18 28 22 22 24 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </SolutionIcon>
    ),
    color: 'text-[#34D399]',
    hoverColor: 'group-hover:bg-[#34D399]/10',
    borderColor: 'border-[#34D399]/20 hover:border-[#34D399]/40',
    span: 'md:col-span-1',
  },
  {
    title: 'Sustainable Transport',
    description:
      'Integrated public transit networks, EV corridors, cycling infrastructure, and walkable city design cutting commuter emissions.',
    icon: (
      <SolutionIcon>
        {/* Bicycle / train hybrid icon */}
        <circle cx="14" cy="34" r="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <circle cx="38" cy="34" r="7" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path
          d="M14 34L22 16H32L38 34"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <line x1="22" y1="16" x2="18" y2="16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="26" y1="34" x2="26" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </SolutionIcon>
    ),
    color: 'text-[#10B981]',
    hoverColor: 'group-hover:bg-[#10B981]/10',
    borderColor: 'border-[#10B981]/20 hover:border-[#10B981]/40',
    span: 'md:col-span-1',
  },
  {
    title: 'Circular Economy',
    description:
      'Zero-waste manufacturing loops, product-as-a-service models, and composting networks that eliminate landfill dependence.',
    icon: (
      <SolutionIcon>
        {/* Recycle arrows icon */}
        <path
          d="M24 8L30 18H18L24 8Z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <path
          d="M30 18L40 36H24"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M18 18L8 36H24"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Arrow tips */}
        <polygon points="24,8 28,14 20,14" fill="currentColor" opacity="0.3" />
        <polygon points="40,36 34,32 34,38" fill="currentColor" opacity="0.3" />
        <polygon points="8,36 14,32 14,38" fill="currentColor" opacity="0.3" />
      </SolutionIcon>
    ),
    color: 'text-[#A3E635]',
    hoverColor: 'group-hover:bg-[#A3E635]/10',
    borderColor: 'border-[#A3E635]/20 hover:border-[#A3E635]/40',
    span: 'md:col-span-1',
  },
  {
    title: 'Biodiversity',
    description:
      'Urban ecology corridors, rooftop habitats, pollinator highways, and native planting programs that bring nature back to the city.',
    icon: (
      <SolutionIcon>
        {/* Leaf / tree icon */}
        <path
          d="M24 42V24"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M24 24C24 24 8 24 8 14C8 6 16 4 24 4C32 4 40 6 40 14C40 24 24 24 24 24Z"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
          strokeLinejoin="round"
        />
        <path
          d="M24 24C20 20 18 14 24 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M16 32C16 32 18 28 24 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />
      </SolutionIcon>
    ),
    color: 'text-[#059669]',
    hoverColor: 'group-hover:bg-[#059669]/10',
    borderColor: 'border-[#059669]/20 hover:border-[#059669]/40',
    span: 'md:col-span-1',
  },
  {
    title: 'Green Infrastructure',
    description:
      'Net-zero buildings with living walls, passive cooling, smart energy grids, and biophilic design that fuses architecture with nature.',
    icon: (
      <SolutionIcon>
        {/* Building with plant icon */}
        <rect x="12" y="16" width="24" height="28" stroke="currentColor" strokeWidth="2.5" fill="none" rx="1" />
        <rect x="18" y="22" width="5" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="27" y="22" width="5" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="18" y="32" width="5" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <rect x="27" y="32" width="5" height="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
        {/* Plant on top */}
        <line x1="24" y1="16" x2="24" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M24 12C20 10 18 6 20 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 10C28 8 32 6 30 4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </SolutionIcon>
    ),
    color: 'text-[#84CC16]',
    hoverColor: 'group-hover:bg-[#84CC16]/10',
    borderColor: 'border-[#84CC16]/20 hover:border-[#84CC16]/40',
    span: 'md:col-span-2',
  },
];

function SolutionCard({
  item,
  index,
}: {
  item: SolutionItem;
  index: number;
}) {
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
        className={`relative h-full overflow-hidden rounded-2xl border ${item.borderColor} bg-[#0A1F0A] p-6 transition-all duration-300 hover:scale-[1.02] md:p-8`}
      >
        {/* Hover background glow */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 ${item.hoverColor}`}
        />

        <div className="relative z-10 flex flex-col gap-4">
          {/* Icon */}
          <div className={`${item.color}`}>{item.icon}</div>

          {/* Content */}
          <div>
            <h3
              className={`text-lg font-semibold tracking-tight ${item.color} md:text-xl`}
            >
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#F5F5F0]/60 md:text-base">
              {item.description}
            </p>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div
          className={`pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100`}
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
            opacity: 0.08,
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
      className="relative overflow-hidden bg-[#0A1F0A] py-24 md:py-32"
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

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-16 max-w-2xl text-center md:mb-20"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#F5F5F0] sm:text-4xl md:text-5xl">
            Green Discovery
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#F5F5F0]/50">
            Explore proven sustainability solutions shaping tomorrow&apos;s cities
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
          className="mt-16 text-center text-sm text-[#F5F5F0]/30"
        >
          Every solution is interconnected — sustainable cities require all of them working
          together.
        </motion.p>
      </div>
    </section>
  );
}
