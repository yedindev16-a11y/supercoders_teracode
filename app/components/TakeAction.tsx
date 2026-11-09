'use client';

import { useState, useSyncExternalStore, useTransition } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

type Category = 'all' | 'home' | 'transit' | 'community';

interface ActionItem {
  id: string;
  category: 'home' | 'transit' | 'community';
  title: string;
  desc: string;
  impact: string;
  icon: string;
}

const ACTION_ITEMS: ActionItem[] = [
  // At Home
  {
    id: 'home-1',
    category: 'home',
    title: 'Switch to High-Efficiency LED & Sensor Controls',
    desc: 'Reduces residential lighting energy consumption by up to 80% while extending bulb lifespans by 15x.',
    impact: '-180kg CO₂/yr',
    icon: '💡',
  },
  {
    id: 'home-2',
    category: 'home',
    title: 'Reduce Domestic Water Waste & Install Aerators',
    desc: 'Equip taps and showers with low-flow aerators to save thousands of gallons of treated water annually.',
    impact: '-12,000L H₂O/yr',
    icon: '💧',
  },
  {
    id: 'home-3',
    category: 'home',
    title: 'Initiate Organic Waste Composting',
    desc: 'Diverts kitchen scraps from methane-producing municipal dumps and enriches regional topsoil biology.',
    impact: '-95kg Methane/yr',
    icon: '🌱',
  },
  {
    id: 'home-4',
    category: 'home',
    title: 'Install Heat Pump & Smart Thermal Schedules',
    desc: 'Replaces fossil gas boilers with ultra-efficient ambient thermodynamic heating and cooling cycles.',
    impact: '-1.2t CO₂/yr',
    icon: '🌡️',
  },

  // In Transit
  {
    id: 'transit-1',
    category: 'transit',
    title: 'Replace 2 Weekly Car Commutes with Transit',
    desc: 'Leverages mass rapid buses or light rail networks to alleviate rush-hour emissions and road gridlock.',
    impact: '-320kg CO₂/yr',
    icon: '🚆',
  },
  {
    id: 'transit-2',
    category: 'transit',
    title: 'Walk or Cycle for All Micro-Trips (< 3 km)',
    desc: 'Eliminates high-emission cold-engine starts while boosting personal cardiovascular fitness.',
    impact: '-150kg CO₂/yr',
    icon: '🚲',
  },
  {
    id: 'transit-3',
    category: 'transit',
    title: 'Establish Neighborhood Rideshare Hubs',
    desc: 'Increases vehicle passenger load factors from standard 1.2 to 3+ commuters per vehicle.',
    impact: '-450kg CO₂/yr',
    icon: '🚗',
  },
  {
    id: 'transit-4',
    category: 'transit',
    title: 'Adopt Shared Electric Mobility for Longer Journeys',
    desc: 'Transition personal transit demand toward zero-tailpipe fleet operators powered by renewables.',
    impact: '-800kg CO₂/yr',
    icon: '⚡',
  },

  // In Community
  {
    id: 'comm-1',
    category: 'community',
    title: 'Join Local Urban Micro-Rewilding Drives',
    desc: 'Plant native pollen and fruit-bearing flora to preserve regional biodiversity corridors.',
    impact: '+Biodiversity',
    icon: '🌳',
  },
  {
    id: 'comm-2',
    category: 'community',
    title: 'Source From Local Regenerative Farmers',
    desc: 'Cuts food-mile emissions and supports agricultural methods that actively restore soil carbon.',
    impact: '-250kg CO₂/yr',
    icon: '🥦',
  },
  {
    id: 'comm-3',
    category: 'community',
    title: 'Advocate for Safe Pedestrian & Cycling Zones',
    desc: 'Participate in town-hall urban planning to convert vehicular lanes into green active corridors.',
    impact: '+Public Health',
    icon: '🚶',
  },
  {
    id: 'comm-4',
    category: 'community',
    title: 'Complete Single-Use Plastic Elimination',
    desc: 'Demand circular packaging at local retailers and carry reusable durable alternatives everywhere.',
    impact: '-45kg Waste/yr',
    icon: '♻️',
  },
];

// React 19 storage subscriber to eliminate hydration warnings and cascading renders
const emptySnapshot = '{}';
function subscribeToStorage(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('ecoterra-action-update', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('ecoterra-action-update', callback);
  };
}

function getStoredSnapshot() {
  if (typeof window === 'undefined') return emptySnapshot;
  try {
    return localStorage.getItem('ecoterra-actions') || emptySnapshot;
  } catch {
    return emptySnapshot;
  }
}

function getServerSnapshot() {
  return emptySnapshot;
}

export default function TakeAction() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [, startTransition] = useTransition();

  const rawStorage = useSyncExternalStore(subscribeToStorage, getStoredSnapshot, getServerSnapshot);
  
  let completed: Record<string, boolean> = {};
  try {
    completed = JSON.parse(rawStorage);
  } catch {
    completed = {};
  }

  const toggleAction = (id: string) => {
    startTransition(() => {
      const next = { ...completed, [id]: !completed[id] };
      try {
        localStorage.setItem('ecoterra-actions', JSON.stringify(next));
        window.dispatchEvent(new Event('ecoterra-action-update'));
      } catch {
        // ignore
      }
    });
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / ACTION_ITEMS.length) * 100);

  const filteredItems = selectedCategory === 'all'
    ? ACTION_ITEMS
    : ACTION_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="action" ref={ref} className="relative bg-[#F5F5F0] text-[#1A1A1A] py-28 px-6 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-xs font-mono font-semibold text-[#059669] uppercase tracking-wider mb-4">
            Individual & Collective Agency
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#0A1F0A]">
            Take Action Today
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#1A1A1A]/70 leading-relaxed">
            Sustainable cities are not only constructed by planners — they are powered by the daily decisions of the people who inhabit them.
          </p>
        </motion.div>

        {/* Progress Tracker Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl bg-white border border-[#1A1A1A]/10 p-6 sm:p-8 shadow-xl shadow-black/5 mb-12 max-w-4xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#059669]">
                Your Sustainability Scorecard
              </span>
              <h3 className="text-xl font-bold text-[#0A1F0A] mt-0.5">
                {completedCount} of {ACTION_ITEMS.length} Actions Completed
              </h3>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black font-mono text-[#059669]">
                {progressPercent}%
              </span>
              <p className="text-xs text-[#1A1A1A]/50 font-mono">Personal Action Index</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full bg-[#E8E5E0] rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#84CC16]"
            />
          </div>

          <p className="text-xs text-[#1A1A1A]/50 mt-3 font-mono">
            {completedCount === 0
              ? 'Select the practices you currently implement or commit to adopting this season.'
              : completedCount === ACTION_ITEMS.length
              ? '🎉 Outstanding! You are an active regenerative city champion.'
              : 'Keep going! Every incremental habit builds cumulative municipal resilience.'}
          </p>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all' as const, label: 'All Actions' },
            { id: 'home' as const, label: '🏠 At Home' },
            { id: 'transit' as const, label: '🚲 Mobility & Transit' },
            { id: 'community' as const, label: '🤝 Community & Civic' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#0A1F0A] text-[#F5F5F0] shadow-md'
                  : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:bg-[#E8E5E0]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Action Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => {
            const isDone = !!completed[item.id];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 * (idx % 6) }}
                onClick={() => toggleAction(item.id)}
                className={`group cursor-pointer rounded-2xl p-6 transition-all border ${
                  isDone
                    ? 'bg-[#E8E5E0]/60 border-[#059669]/50 shadow-md'
                    : 'bg-white border-[#1A1A1A]/10 hover:border-[#059669]/30 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="text-2xl p-2 rounded-xl bg-[#F5F5F0] shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-base font-bold transition-colors ${
                        isDone ? 'line-through text-[#1A1A1A]/50' : 'text-[#0A1F0A]'
                      }`}>
                        {item.title}
                      </h4>
                      <div
                        className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                          isDone
                            ? 'bg-[#059669] border-[#059669] text-white'
                            : 'border-[#1A1A1A]/20 group-hover:border-[#059669]'
                        }`}
                      >
                        {isDone && (
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-[#1A1A1A]/65 mt-2 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#059669] font-bold">{item.impact}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        isDone ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/50'
                      }`}>
                        {isDone ? 'Adopted' : 'Click to Adopt'}
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
