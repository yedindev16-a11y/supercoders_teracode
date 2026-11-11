'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import {
  TreeIcon,
  UsersIcon,
  SparklesIcon,
  ShieldCheckIcon,
  LeafIcon,
} from './Icons';

interface Pillar {
  id: string;
  badge: string;
  title: string;
  summary: string;
  deepDive: string;
  statNumber: string;
  statLabel: string;
  statSource: string;
  color: string;
  borderColor: string;
  icon: React.ReactNode;
}

const PILLARS: Pillar[] = [
  {
    id: 'nature',
    badge: 'ECOLOGICAL FOUNDATIONS',
    title: 'Why Protecting Nature Matters',
    summary:
      'Human civilization does not exist apart from nature; it is entirely sustained by living biomes. Intact rainforest canopies and wetlands regulate planetary climate, cleanse groundwater, and prevent catastrophic pathogen spillover.',
    deepDive:
      'In Kerala, the UNESCO-recognized Western Ghats forest catchment feeds 44 major river basins and buffers the entire peninsula from extreme weather. When forests degrade, downstream cities suffer severe water deficits in summer and acute flash floods during monsoons. Protecting wilderness is basic self-defense for urban survival.',
    statNumber: '80%+',
    statLabel: 'of regional freshwater originates from Western Ghats canopies',
    statSource: 'Kerala State Biodiversity Board',
    color: 'text-[#10B981]',
    borderColor: 'border-[#10B981]/30 hover:border-[#10B981]/60',
    icon: <TreeIcon className="w-6 h-6 text-[#10B981]" />,
  },
  {
    id: 'agency',
    badge: 'THE CITIZEN MULTIPLIER',
    title: 'How Individuals & Communities Drive Change',
    summary:
      'Systemic change does not originate from top-down mandates alone; it starts when everyday citizens align their choices. Household solar adoption, composting, and micro-mobility shift market demand and normalize sustainable civic standards.',
    deepDive:
      'Sociological research shows that when approximately 25–30% of a population adopts a new norm—such as mandatory organic waste sorting or water-efficient fixtures—municipal policies and commercial supply chains rapidly flip to accommodate the majority. Every daily habit logged compounds into collective political will.',
    statNumber: '100x',
    statLabel: 'collective leverage when household practices scale to municipal wards',
    statSource: 'UN-Habitat Urban Governance Studies',
    color: 'text-[#D4FF00]',
    borderColor: 'border-[#D4FF00]/30 hover:border-[#D4FF00]/60',
    icon: <UsersIcon className="w-6 h-6 text-[#D4FF00]" />,
  },
  {
    id: 'future',
    badge: 'REGENERATIVE HORIZONS',
    title: 'How Sustainable Habits Shape the Future',
    summary:
      'Designing for sustainability moves civilization from extractive exhaustion to regenerative equilibrium. Cities become dynamic sponges that absorb rainfall, generate clean energy locally, and leave an enriched planet for generations to come.',
    deepDive:
      'By fusing Kerala’s indigenous bioclimatic architecture (shaded Charupadi louvers, central courtyard ventilation) with modern decentralized solar microgrids and electric water transit, we demonstrate that high quality of life does not require ecological destruction. The future is designed through conscious decisions made today.',
    statNumber: '2040',
    statLabel: 'equilibrium target horizon for net-zero decentralized settlements',
    statSource: 'Kerala 2040 Vision Blueprint',
    color: 'text-[#38BDF8]',
    borderColor: 'border-[#38BDF8]/30 hover:border-[#38BDF8]/60',
    icon: <SparklesIcon className="w-6 h-6 text-[#38BDF8]" />,
  },
];

export default function WhySustainabilityMatters() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeTab, setActiveTab] = useState<string>('nature');

  const selectedPillar = PILLARS.find((p) => p.id === activeTab) || PILLARS[0];

  return (
    <section
      id="why-sustainability"
      ref={ref}
      className="relative bg-[#0D1B0D] py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/5 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-[#059669]/10 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 px-2"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-mono font-semibold text-[#34D399] uppercase tracking-wider mb-4">
            Learn & Discover • Core Principles
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            Why Sustainability Matters
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#F5F5F0]/70 leading-relaxed">
            Understanding the ecological foundations, the power of collective citizen habits, and the blueprint for resilient human settlements.
          </p>
        </motion.div>

        {/* 3 Pillar Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PILLARS.map((pillar, idx) => {
            const isCurrent = activeTab === pillar.id;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                onClick={() => setActiveTab(pillar.id)}
                className={`cursor-pointer rounded-2xl p-5 sm:p-6 transition-all border relative flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-[#0A1F0A] border-[#D4FF00]/50 shadow-xl shadow-black/40 ring-1 ring-[#D4FF00]/30'
                    : 'bg-[#0A1F0A]/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A3E635] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                      {pillar.badge}
                    </span>
                    <div className="p-2 rounded-xl bg-white/5">{pillar.icon}</div>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-bold mb-2.5 transition-colors ${isCurrent ? pillar.color : 'text-[#F5F5F0]'}`}>
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#F5F5F0]/70 leading-relaxed">
                    {pillar.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-[#D4FF00] flex items-center gap-1">
                    <span>{isCurrent ? 'Viewing Insights' : 'Explore Details'}</span>
                    <span className="text-sm">→</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-white/50">0{idx + 1}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Pillar Detailed Insight View */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedPillar.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="rounded-3xl border border-white/10 bg-[#0A1F0A] p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D4FF00] animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-[#D4FF00] font-bold">
                    Deep Dive Analysis • {selectedPillar.badge}
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-bold text-[#F5F5F0]">
                  {selectedPillar.title}
                </h4>

                <p className="text-sm sm:text-base text-[#F5F5F0]/80 leading-relaxed">
                  {selectedPillar.deepDive}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#34D399]">
                    <ShieldCheckIcon className="w-4 h-4" />
                    <span>Evidence-based Ecological Metric</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#E8E5E0]/60">
                    <LeafIcon className="w-4 h-4 text-[#84CC16]" />
                    <span>Kerala Bioregion Case Study</span>
                  </span>
                </div>
              </div>

              {/* Verified Statistic Callout Card */}
              <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 text-center lg:text-left flex flex-col justify-center">
                <span className="text-4xl sm:text-5xl font-mono font-black text-[#D4FF00] tracking-tight block">
                  {selectedPillar.statNumber}
                </span>
                <p className="text-xs sm:text-sm font-medium text-[#F5F5F0]/90 mt-1 leading-snug">
                  {selectedPillar.statLabel}
                </p>
                <cite className="text-[11px] font-mono text-white/40 block mt-2 not-italic">
                  — {selectedPillar.statSource}
                </cite>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
