'use client';

import { useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { useCity } from '../context/CityContext';
import {
  LightbulbIcon,
  DropletIcon,
  SproutIcon,
  ThermometerIcon,
  TrainIcon,
  BikeIcon,
  CarIcon,
  ZapIcon,
  TreeIcon,
  LeafIcon,
  WalkIcon,
  RecycleIcon,
  HomeIcon,
  UsersIcon,
  SparklesIcon,
  CheckIcon,
} from './Icons';

type Category = 'all' | 'home' | 'transit' | 'community';

interface ActionItem {
  id: string;
  category: 'home' | 'transit' | 'community';
  title: string;
  desc: string;
  impact: string;
  paramBoostLabel: string;
  IconComponent: React.ComponentType<{ className?: string }>;
}

const ACTION_ITEMS: ActionItem[] = [
  // At Home
  {
    id: 'home-1',
    category: 'home',
    title: 'Switch to High-Efficiency LED & Sensor Controls',
    desc: 'Reduces residential lighting energy consumption by up to 80% while extending bulb lifespans by 15x.',
    impact: '-180kg CO₂/yr',
    paramBoostLabel: '+3% Renewable Energy Efficiency',
    IconComponent: LightbulbIcon,
  },
  {
    id: 'home-2',
    category: 'home',
    title: 'Reduce Domestic Water Waste & Install Aerators',
    desc: 'Equip taps and showers with low-flow aerators to save thousands of gallons of treated water annually.',
    impact: '-12,000L H₂O/yr',
    paramBoostLabel: '+4% Water Conservation',
    IconComponent: DropletIcon,
  },
  {
    id: 'home-3',
    category: 'home',
    title: 'Initiate Organic Waste Composting',
    desc: 'Diverts kitchen scraps from methane-producing municipal dumps and enriches regional topsoil biology.',
    impact: '-95kg Methane/yr',
    paramBoostLabel: '+4% Circular Waste Recovery',
    IconComponent: SproutIcon,
  },
  {
    id: 'home-4',
    category: 'home',
    title: 'Install Heat Pump & Smart Thermal Schedules',
    desc: 'Replaces fossil gas boilers with ultra-efficient ambient thermodynamic heating and cooling cycles.',
    impact: '-1.2t CO₂/yr',
    paramBoostLabel: '+4% Clean Energy Systems',
    IconComponent: ThermometerIcon,
  },

  // In Transit
  {
    id: 'transit-1',
    category: 'transit',
    title: 'Replace 2 Weekly Car Commutes with Transit / Water Metro',
    desc: 'Leverages mass rapid buses, light rail or electric water metro networks to alleviate road congestion.',
    impact: '-320kg CO₂/yr',
    paramBoostLabel: '+4% Sustainable Transport',
    IconComponent: TrainIcon,
  },
  {
    id: 'transit-2',
    category: 'transit',
    title: 'Walk or Cycle for All Micro-Trips (< 3 km)',
    desc: 'Eliminates high-emission cold-engine starts while boosting personal cardiovascular fitness.',
    impact: '-150kg CO₂/yr',
    paramBoostLabel: '+3% Transport, +1% Green Corridor',
    IconComponent: BikeIcon,
  },
  {
    id: 'transit-3',
    category: 'transit',
    title: 'Establish Neighborhood Rideshare Hubs',
    desc: 'Increases vehicle passenger load factors from standard 1.2 to 3+ commuters per vehicle.',
    impact: '-450kg CO₂/yr',
    paramBoostLabel: '+3% Sustainable Transport',
    IconComponent: CarIcon,
  },
  {
    id: 'transit-4',
    category: 'transit',
    title: 'Adopt Shared Electric Mobility for Longer Journeys',
    desc: 'Transition personal transit demand toward zero-tailpipe fleet operators powered by clean grids.',
    impact: '-800kg CO₂/yr',
    paramBoostLabel: '+4% Transport, +1% Energy',
    IconComponent: ZapIcon,
  },

  // In Community
  {
    id: 'comm-1',
    category: 'community',
    title: 'Join Local Urban Micro-Rewilding Drives',
    desc: 'Plant native pollen and fruit-bearing flora to preserve regional biodiversity corridors.',
    impact: '+Biodiversity',
    paramBoostLabel: '+5% Green Urban Coverage',
    IconComponent: TreeIcon,
  },
  {
    id: 'comm-2',
    category: 'community',
    title: 'Source From Local Regenerative Farmers',
    desc: 'Cuts food-mile emissions and supports agricultural methods that actively restore soil carbon.',
    impact: '-250kg CO₂/yr',
    paramBoostLabel: '+3% Waste, +2% Water Efficiency',
    IconComponent: LeafIcon,
  },
  {
    id: 'comm-3',
    category: 'community',
    title: 'Advocate for Safe Pedestrian & Cycling Zones',
    desc: 'Participate in town-hall urban planning to convert vehicular lanes into green active corridors.',
    impact: '+Public Health',
    paramBoostLabel: '+3% Transport, +2% Green Coverage',
    IconComponent: WalkIcon,
  },
  {
    id: 'comm-4',
    category: 'community',
    title: 'Complete Single-Use Plastic Elimination',
    desc: 'Demand circular packaging at local retailers and carry reusable durable alternatives everywhere.',
    impact: '-45kg Waste/yr',
    paramBoostLabel: '+5% Circular Waste Recovery',
    IconComponent: RecycleIcon,
  },
];

export default function TakeAction() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  const {
    completedActions,
    toggleAction,
    baseSimulation,
    simulation,
    actionBoosts,
  } = useCity();

  const completedCount = Object.values(completedActions).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / ACTION_ITEMS.length) * 100);

  const baseIndex = baseSimulation.sustainabilityIndex;
  const activeIndex = simulation.sustainabilityIndex;
  const indexDelta = activeIndex - baseIndex;

  const filteredItems = selectedCategory === 'all'
    ? ACTION_ITEMS
    : ACTION_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="action" ref={ref} className="relative bg-[#F5F5F0] text-[#1A1A1A] py-16 sm:py-28 px-4 sm:px-6">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-xs font-mono font-semibold text-[#059669] uppercase tracking-wider mb-4">
            Individual & Collective Agency
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0A1F0A]">
            Take Action Today
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-[#1A1A1A]/70 leading-relaxed">
            Every action below directly feeds into your simulated city parameters. See the real-time index increase as community habits compound.
          </p>
        </motion.div>

        {/* Live Impact Scorecard Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl bg-white border border-[#1A1A1A]/10 p-4 sm:p-8 shadow-xl shadow-black/5 mb-10 sm:mb-12 max-w-4xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#059669]">
                Live Citizen Scorecard
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#0A1F0A] mt-0.5">
                {completedCount} of {ACTION_ITEMS.length} Actions Activated
              </h3>
            </div>
            
            {/* Real Index Change Display */}
            <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-0 rounded-2xl bg-[#0A1F0A]/5 sm:bg-transparent">
              <div className="flex items-center gap-1.5 sm:gap-2 font-mono flex-wrap">
                <span className="text-xl sm:text-2xl font-bold text-[#1A1A1A]/60">{baseIndex}</span>
                <span className="text-base sm:text-lg text-[#059669] font-black">→</span>
                <span className="text-2xl sm:text-3xl font-black text-[#059669]">{activeIndex}</span>
                <span className="text-xs sm:text-sm font-bold text-[#059669] bg-[#059669]/10 px-2 py-0.5 rounded-full">
                  {indexDelta >= 0 ? `+${indexDelta}` : indexDelta} pts
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#1A1A1A]/50 font-mono mt-0.5">City Sustainability Index Shift</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 sm:h-3 w-full bg-[#E8E5E0] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#84CC16] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3.5 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-[#1A1A1A]/60">
            <span className="flex items-center gap-1.5">
              {completedCount === ACTION_ITEMS.length && (
                <SparklesIcon className="w-4 h-4 text-[#059669] shrink-0" />
              )}
              <span>
                {completedCount === 0
                  ? 'Check actions below to see your city index climb in real time.'
                  : completedCount === ACTION_ITEMS.length
                  ? 'Complete mobilization! All 12 collective actions activated.'
                  : `+${completedCount} community interventions boosting live city systems.`}
              </span>
            </span>
            <span className="font-semibold text-[#059669] text-[11px] sm:text-xs">
              Active Boosts: Energy +{actionBoosts.renewableEnergy}%, Green +{actionBoosts.greenCoverage}%, Transit +{actionBoosts.sustainableTransport}%
            </span>
          </div>
        </motion.div>

        {/* Category Filters - Responsive layout with SVG icons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 sm:mb-10 px-1">
          {[
            { id: 'all' as const, label: 'All Actions', icon: null },
            { id: 'home' as const, label: 'At Home', icon: HomeIcon },
            { id: 'transit' as const, label: 'Mobility & Transit', icon: BikeIcon },
            { id: 'community' as const, label: 'Community & Civic', icon: UsersIcon },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                aria-pressed={isSelected}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-[#0A1F0A] text-[#F5F5F0] shadow-md'
                    : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:bg-[#E8E5E0]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {filteredItems.map((item, idx) => {
            const isDone = !!completedActions[item.id];
            const Icon = item.IconComponent;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 * (idx % 6) }}
                onClick={() => toggleAction(item.id)}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault();
                    toggleAction(item.id);
                  }
                }}
                role="checkbox"
                aria-checked={isDone}
                aria-label={item.title}
                tabIndex={0}
                className={`group cursor-pointer rounded-2xl p-4 sm:p-6 transition-all border ${
                  isDone
                    ? 'bg-[#E8E5E0]/60 border-[#059669]/50 shadow-md'
                    : 'bg-white border-[#1A1A1A]/10 hover:border-[#059669]/30 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isDone ? 'bg-[#059669]/15 text-[#059669]' : 'bg-[#F5F5F0] text-[#0A1F0A]'
                  }`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm sm:text-base font-bold transition-colors leading-snug break-words ${
                        isDone ? 'line-through text-[#1A1A1A]/50' : 'text-[#0A1F0A]'
                      }`}>
                        {item.title}
                      </h4>
                      <div
                        className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                          isDone
                            ? 'bg-[#059669] border-[#059669] text-white'
                            : 'border-[#1A1A1A]/20 group-hover:border-[#059669]'
                        }`}
                        aria-hidden="true"
                      >
                        {isDone && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                      </div>
                    </div>
                    <p className="text-xs text-[#1A1A1A]/65 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                    {/* Live Parameter Boost Tag */}
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono px-2 py-0.5 rounded bg-[#10B981]/15 text-[#059669] font-bold">
                        <ZapIcon className="w-3 h-3 shrink-0" />
                        <span>{item.paramBoostLabel}</span>
                      </span>
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs font-mono gap-2 flex-wrap">
                      <span className="text-[#059669] font-bold text-xs">{item.impact}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        isDone ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/50'
                      }`}>
                        {isDone ? 'Active in City' : 'Click to Activate'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
