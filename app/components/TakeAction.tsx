'use client';

import { useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
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
  LockIcon,
  TrophyIcon,
  CalendarIcon,
} from './Icons';

type Category = 'all' | 'home' | 'transit' | 'community';
type Cadence = 'all' | 'daily' | 'weekly';

interface ActionItem {
  id: string;
  category: 'home' | 'transit' | 'community';
  cadence: 'daily' | 'weekly';
  title: string;
  desc: string;
  impact: string;
  paramBoostLabel: string;
  IconComponent: React.ComponentType<{ className?: string }>;
}

const ACTION_ITEMS: ActionItem[] = [
  // At Home (2 Daily, 2 Weekly)
  {
    id: 'home-1',
    category: 'home',
    cadence: 'daily',
    title: 'Switch to High-Efficiency LED & Sensor Controls',
    desc: 'Reduces residential lighting energy consumption by up to 80% while extending bulb lifespans by 15x.',
    impact: '-180kg CO₂/yr',
    paramBoostLabel: '+3% Renewable Energy Efficiency',
    IconComponent: LightbulbIcon,
  },
  {
    id: 'home-2',
    category: 'home',
    cadence: 'daily',
    title: 'Reduce Domestic Water Waste & Install Aerators',
    desc: 'Equip taps and showers with low-flow aerators to save thousands of gallons of treated water annually.',
    impact: '-12,000L H₂O/yr',
    paramBoostLabel: '+4% Water Conservation',
    IconComponent: DropletIcon,
  },
  {
    id: 'home-3',
    category: 'home',
    cadence: 'weekly',
    title: 'Initiate Organic Waste Composting',
    desc: 'Diverts kitchen scraps from municipal dumps, producing rich bio-compost for urban agriculture.',
    impact: '-95kg Methane/yr',
    paramBoostLabel: '+4% Circular Waste Recovery',
    IconComponent: SproutIcon,
  },
  {
    id: 'home-4',
    category: 'home',
    cadence: 'weekly',
    title: 'Install Heat Pump & Smart Thermal Schedules',
    desc: 'Replaces fossil gas boilers with ultra-efficient ambient thermodynamic heating and cooling cycles.',
    impact: '-1.2t CO₂/yr',
    paramBoostLabel: '+4% Clean Energy Systems',
    IconComponent: ThermometerIcon,
  },

  // In Transit (2 Daily, 2 Weekly)
  {
    id: 'transit-1',
    category: 'transit',
    cadence: 'daily',
    title: 'Replace 2 Weekly Car Commutes with Transit / Water Metro',
    desc: 'Leverages mass rapid buses, light rail or electric water metro networks to alleviate road congestion.',
    impact: '-320kg CO₂/yr',
    paramBoostLabel: '+4% Sustainable Transport',
    IconComponent: TrainIcon,
  },
  {
    id: 'transit-2',
    category: 'transit',
    cadence: 'daily',
    title: 'Walk or Cycle for All Micro-Trips (< 3 km)',
    desc: 'Eliminates high-emission cold-engine starts while boosting personal cardiovascular fitness.',
    impact: '-150kg CO₂/yr',
    paramBoostLabel: '+3% Transport, +1% Green Corridor',
    IconComponent: BikeIcon,
  },
  {
    id: 'transit-3',
    category: 'transit',
    cadence: 'weekly',
    title: 'Establish Neighborhood Rideshare Hubs',
    desc: 'Increases vehicle passenger load factors from standard 1.2 to 3+ commuters per vehicle.',
    impact: '-450kg CO₂/yr',
    paramBoostLabel: '+3% Sustainable Transport',
    IconComponent: CarIcon,
  },
  {
    id: 'transit-4',
    category: 'transit',
    cadence: 'weekly',
    title: 'Adopt Shared Electric Mobility for Longer Journeys',
    desc: 'Transition personal transit demand toward zero-tailpipe fleet operators powered by clean grids.',
    impact: '-800kg CO₂/yr',
    paramBoostLabel: '+4% Transport, +1% Energy',
    IconComponent: ZapIcon,
  },

  // In Community (2 Daily, 2 Weekly)
  {
    id: 'comm-1',
    category: 'community',
    cadence: 'weekly',
    title: 'Join Local Urban Micro-Rewilding Drives',
    desc: 'Plant native pollen and fruit-bearing flora to preserve regional biodiversity corridors.',
    impact: '+Biodiversity',
    paramBoostLabel: '+5% Green Urban Coverage',
    IconComponent: TreeIcon,
  },
  {
    id: 'comm-2',
    category: 'community',
    cadence: 'daily',
    title: 'Source From Local Regenerative Farmers',
    desc: 'Cuts food-mile emissions and supports agricultural methods that actively restore soil carbon.',
    impact: '-250kg CO₂/yr',
    paramBoostLabel: '+3% Waste, +2% Water Efficiency',
    IconComponent: LeafIcon,
  },
  {
    id: 'comm-3',
    category: 'community',
    cadence: 'weekly',
    title: 'Advocate for Safe Pedestrian & Cycling Zones',
    desc: 'Participate in town-hall urban planning to convert vehicular lanes into green active corridors.',
    impact: '+Public Health',
    paramBoostLabel: '+3% Transport, +2% Green Coverage',
    IconComponent: WalkIcon,
  },
  {
    id: 'comm-4',
    category: 'community',
    cadence: 'daily',
    title: 'Complete Single-Use Plastic Elimination',
    desc: 'Demand circular packaging at local retailers and carry reusable durable alternatives everywhere.',
    impact: '-45kg Waste/yr',
    paramBoostLabel: '+5% Circular Waste Recovery',
    IconComponent: RecycleIcon,
  },
];

interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  criteriaLabel: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  isUnlocked: boolean;
  progress: number;
  total: number;
}

export default function TakeAction() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedCadence, setSelectedCadence] = useState<Cadence>('all');
  const [showBadges, setShowBadges] = useState(false);
  const [lastToggledId, setLastToggledId] = useState<string | null>(null);

  const {
    completedActions,
    toggleAction,
    baseSimulation,
    simulation,
    actionBoosts,
  } = useCity();

  const handleActionToggle = (id: string) => {
    setLastToggledId(id);
    toggleAction(id);
    setTimeout(() => {
      setLastToggledId(null);
    }, 1200);
  };

  const completedCount = Object.values(completedActions).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / ACTION_ITEMS.length) * 100);

  // Daily & Weekly counts
  const dailyItems = useMemo(() => ACTION_ITEMS.filter((i) => i.cadence === 'daily'), []);
  const weeklyItems = useMemo(() => ACTION_ITEMS.filter((i) => i.cadence === 'weekly'), []);

  const completedDailyCount = useMemo(() => {
    return dailyItems.filter((i) => !!completedActions[i.id]).length;
  }, [dailyItems, completedActions]);

  const completedWeeklyCount = useMemo(() => {
    return weeklyItems.filter((i) => !!completedActions[i.id]).length;
  }, [weeklyItems, completedActions]);

  const dailyPercent = Math.round((completedDailyCount / dailyItems.length) * 100);
  const weeklyPercent = Math.round((completedWeeklyCount / weeklyItems.length) * 100);

  const baseIndex = baseSimulation.sustainabilityIndex;
  const activeIndex = simulation.sustainabilityIndex;
  const indexDelta = activeIndex - baseIndex;

  // 4-5 Achievement Badges evaluated against actual state
  const badges: AchievementBadge[] = useMemo(() => {
    const homeCompleted = ACTION_ITEMS.filter((i) => i.category === 'home' && !!completedActions[i.id]).length;
    const transitCompleted = ACTION_ITEMS.filter((i) => i.category === 'transit' && !!completedActions[i.id]).length;
    const communityCompleted = ACTION_ITEMS.filter((i) => i.category === 'community' && !!completedActions[i.id]).length;

    return [
      {
        id: 'first-spark',
        name: 'First Spark',
        description: 'Initiate your sustainability journey with your first verified action.',
        criteriaLabel: 'Complete 1 action',
        IconComponent: SparklesIcon,
        isUnlocked: completedCount >= 1,
        progress: Math.min(1, completedCount),
        total: 1,
      },
      {
        id: 'energy-steward',
        name: 'Clean Energy Steward',
        description: 'Deploy household conservation & thermodynamic thermal efficiency.',
        criteriaLabel: 'Complete 2 Home actions',
        IconComponent: ZapIcon,
        isUnlocked: homeCompleted >= 2,
        progress: Math.min(2, homeCompleted),
        total: 2,
      },
      {
        id: 'transit-ranger',
        name: 'Zero-Emission Commuter',
        description: 'Shift everyday journeys to walking, cycling, or electric water metro transit.',
        criteriaLabel: 'Complete 2 Transit actions',
        IconComponent: BikeIcon,
        isUnlocked: transitCompleted >= 2,
        progress: Math.min(2, transitCompleted),
        total: 2,
      },
      {
        id: 'biome-guardian',
        name: 'Kerala Biome Steward',
        description: 'Champion urban rewilding, decentralized composting, and circular foodways.',
        criteriaLabel: 'Complete 2 Community actions',
        IconComponent: TreeIcon,
        isUnlocked: communityCompleted >= 2,
        progress: Math.min(2, communityCompleted),
        total: 2,
      },
      {
        id: 'earth-architect',
        name: 'Earth Architect 2040',
        description: 'Mobilize systemic urban transformation across all ecological pillars.',
        criteriaLabel: 'Complete 8 or more actions',
        IconComponent: TrophyIcon,
        isUnlocked: completedCount >= 8,
        progress: Math.min(8, completedCount),
        total: 8,
      },
    ];
  }, [completedActions, completedCount]);

  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  // Filtered action items based on both Category and Cadence
  const filteredItems = useMemo(() => {
    return ACTION_ITEMS.filter((item) => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchCadence = selectedCadence === 'all' || item.cadence === selectedCadence;
      return matchCategory && matchCadence;
    });
  }, [selectedCategory, selectedCadence]);

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
            Every action below directly feeds into your simulated city parameters. Log daily routines and weekly milestones to unlock ecological distinctions and accelerate index growth.
          </p>
        </motion.div>

        {/* Live Impact Scorecard Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-3xl bg-white border border-[#1A1A1A]/10 p-5 sm:p-8 shadow-xl shadow-black/5 mb-8 max-w-4xl mx-auto"
        >
          {/* Top Row: Score & Real Index Shift */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#059669]">
                  Live Citizen Scorecard
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#059669]/10 text-[#059669] font-bold">
                  {progressPercent}% Complete
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0A1F0A] mt-1">
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
              <p className="text-[10px] sm:text-xs text-[#1A1A1A]/50 font-mono mt-0.5">Live City Model Shift</p>
            </div>
          </div>

          {/* Primary Overall Progress Bar */}
          <div className="space-y-1 mb-5">
            <div className="flex justify-between text-xs font-mono text-[#1A1A1A]/60">
              <span>Overall Mobilization</span>
              <span className="font-bold text-[#0A1F0A]">{completedCount} / {ACTION_ITEMS.length}</span>
            </div>
            <div className="h-3 w-full bg-[#E8E5E0] rounded-full overflow-hidden p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#84CC16]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Dual Cadence Progress (Daily vs Weekly) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F5F5F0]/70 border border-[#1A1A1A]/5 mb-4">
            {/* Daily Habits Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 font-semibold text-[#0A1F0A]">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Daily Habits</span>
                </span>
                <span className="font-bold text-[#059669]">
                  {completedDailyCount} / {dailyItems.length} ({dailyPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-[#E8E5E0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#059669] transition-all duration-500"
                  style={{ width: `${dailyPercent}%` }}
                />
              </div>
            </div>

            {/* Weekly Goals Progress */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 font-semibold text-[#0A1F0A]">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>Weekly Milestones</span>
                </span>
                <span className="font-bold text-[#84CC16]">
                  {completedWeeklyCount} / {weeklyItems.length} ({weeklyPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-[#E8E5E0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#84CC16] transition-all duration-500"
                  style={{ width: `${weeklyPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Active Boosts & Badges Quick-toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono border-t border-[#1A1A1A]/5 pt-4">
            <span className="font-semibold text-[#059669] text-[11px] sm:text-xs">
              Live City Boosts: Energy +{actionBoosts.renewableEnergy}%, Green +{actionBoosts.greenCoverage}%, Transit +{actionBoosts.sustainableTransport}%
            </span>

            {/* Achievement Badge Status Toggle */}
            <button
              onClick={() => setShowBadges(!showBadges)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1F0A] hover:text-[#059669] transition-colors self-start sm:self-auto cursor-pointer"
            >
              <TrophyIcon className="w-4 h-4 text-[#84CC16]" />
              <span>Badges: {unlockedBadgesCount} / {badges.length} Unlocked</span>
              <span className="text-[10px] text-[#059669] underline ml-0.5">
                {showBadges ? '(Hide Badges)' : '(View Badges)'}
              </span>
            </button>
          </div>
        </motion.div>

        {/* ── ACHIEVEMENT BADGES DRAWER / SECTION ── */}
        <AnimatePresence>
          {showBadges && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden mb-10 max-w-4xl mx-auto"
            >
              <div className="rounded-3xl border border-[#059669]/30 bg-[#0A1F0A] p-5 sm:p-7 text-[#F5F5F0] shadow-xl">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div>
                    <h4 className="text-base sm:text-lg font-bold text-[#F5F5F0] flex items-center gap-2">
                      <TrophyIcon className="w-5 h-5 text-[#D4FF00]" />
                      <span>Sustainability Achievement Badges</span>
                    </h4>
                    <p className="text-xs text-[#E8E5E0]/60 font-mono mt-0.5">
                      Earn real ecological distinctions as your personal routines compound.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#D4FF00] px-2.5 py-1 rounded-full bg-white/5 border border-white/10">
                    {unlockedBadgesCount} / {badges.length} Unlocked
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                  {badges.map((badge) => {
                    const BadgeIcon = badge.IconComponent;
                    return (
                      <div
                        key={badge.id}
                        className={`rounded-2xl p-4 border transition-all ${
                          badge.isUnlocked
                            ? 'bg-[#0D1B0D] border-[#10B981]/50 shadow-md shadow-[#10B981]/10'
                            : 'bg-white/[0.02] border-white/10 opacity-70'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${
                            badge.isUnlocked ? 'bg-[#10B981]/20 text-[#34D399]' : 'bg-white/5 text-white/40'
                          }`}>
                            <BadgeIcon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className="text-sm font-bold text-[#F5F5F0] truncate">{badge.name}</h5>
                              {badge.isUnlocked ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-[#34D399] uppercase px-1.5 py-0.5 rounded bg-[#10B981]/20">
                                  <CheckIcon className="w-2.5 h-2.5" />
                                  <span>Earned</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-white/40 uppercase px-1.5 py-0.5 rounded bg-white/5">
                                  <LockIcon className="w-2.5 h-2.5" />
                                  <span>Locked</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#E8E5E0]/60 mt-1 leading-snug">{badge.description}</p>
                            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-[#E8E5E0]/40">
                              <span>{badge.criteriaLabel}</span>
                              <span className={badge.isUnlocked ? 'text-[#34D399] font-bold' : ''}>
                                {badge.progress}/{badge.total}
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  badge.isUnlocked ? 'bg-[#34D399]' : 'bg-white/20'
                                }`}
                                style={{ width: `${(badge.progress / badge.total) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FILTERING CONTROLS (Inspired by ECOVERSE Habit Filters) ── */}
        <div className="flex flex-col items-center justify-center gap-3.5 mb-8 sm:mb-10 px-1">
          {/* Cadence Filter (All Habits vs Daily vs Weekly) */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#E8E5E0] border border-[#1A1A1A]/10 shadow-inner">
            {[
              { id: 'all' as const, label: `All Habits (${ACTION_ITEMS.length})`, icon: null },
              { id: 'daily' as const, label: `Daily Habits (${dailyItems.length})`, icon: CalendarIcon },
              { id: 'weekly' as const, label: `Weekly Goals (${weeklyItems.length})`, icon: SparklesIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedCadence === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCadence(tab.id)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0A1F0A] text-[#D4FF00] shadow-md'
                      : 'text-[#1A1A1A]/70 hover:text-[#0A1F0A]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all' as const, label: 'All Sectors', icon: null },
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
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#059669] text-white shadow-sm'
                      : 'bg-white border border-[#1A1A1A]/10 text-[#1A1A1A]/70 hover:bg-[#E8E5E0]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ACTION ITEMS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {filteredItems.map((item, idx) => {
            const isDone = !!completedActions[item.id];
            const Icon = item.IconComponent;
            const isJustToggled = lastToggledId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.04 * (idx % 6) }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleActionToggle(item.id)}
                onKeyDown={(event) => {
                  if (event.key === ' ' || event.key === 'Enter') {
                    event.preventDefault();
                    handleActionToggle(item.id);
                  }
                }}
                role="checkbox"
                aria-checked={isDone}
                aria-label={item.title}
                tabIndex={0}
                className={`relative group cursor-pointer rounded-2xl p-4 sm:p-6 transition-all border ${
                  isDone
                    ? 'bg-[#E8E5E0]/70 border-[#059669]/60 shadow-md shadow-[#059669]/10'
                    : 'bg-white border-[#1A1A1A]/10 hover:border-[#059669]/40 hover:shadow-lg'
                } ${isJustToggled ? 'ring-2 ring-[#059669] ring-offset-2' : ''}`}
              >
                {/* Subtle Floating Feedback on action toggle (Item 5) */}
                <AnimatePresence>
                  {isJustToggled && (
                    <motion.div
                      initial={{ opacity: 0, y: 0, scale: 0.8 }}
                      animate={{ opacity: 1, y: -20, scale: 1 }}
                      exit={{ opacity: 0, y: -30 }}
                      transition={{ duration: 0.6 }}
                      className="pointer-events-none absolute -top-2 right-4 z-20 flex items-center gap-1 rounded-full bg-[#059669] px-2.5 py-1 text-[10px] font-mono font-bold text-white shadow-lg"
                    >
                      <SparklesIcon className="w-3 h-3" />
                      <span>{isDone ? '+Action Active!' : 'Action Removed'}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                    isDone ? 'bg-[#059669]/15 text-[#059669]' : 'bg-[#F5F5F0] text-[#0A1F0A]'
                  }`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                          item.cadence === 'daily'
                            ? 'bg-[#059669]/10 text-[#059669]'
                            : 'bg-[#84CC16]/15 text-[#65A30D]'
                        }`}>
                          {item.cadence}
                        </span>
                        <span className="text-[9px] font-mono text-[#1A1A1A]/40 uppercase">
                          {item.category}
                        </span>
                      </div>

                      {/* Interactive checkbox with micro-animation */}
                      <motion.div
                        animate={isDone ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                          isDone
                            ? 'bg-[#059669] border-[#059669] text-white'
                            : 'border-[#1A1A1A]/20 group-hover:border-[#059669]'
                        }`}
                        aria-hidden="true"
                      >
                        {isDone && <CheckIcon className="h-3.5 w-3.5 text-white" />}
                      </motion.div>
                    </div>

                    <h4 className={`text-sm sm:text-base font-bold transition-colors leading-snug break-words ${
                      isDone ? 'line-through text-[#1A1A1A]/50' : 'text-[#0A1F0A]'
                    }`}>
                      {item.title}
                    </h4>

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
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded transition-colors ${
                        isDone ? 'bg-[#059669]/10 text-[#059669]' : 'bg-[#1A1A1A]/5 text-[#1A1A1A]/50'
                      }`}>
                        {isDone ? '✓ Logged' : 'Tap to Activate'}
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
