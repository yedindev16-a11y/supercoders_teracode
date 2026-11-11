'use client';

import { useState, useEffect, useRef, useId, useCallback, startTransition } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { useCity } from '../context/CityContext';
import {
  TreeIcon,
  DropletIcon,
  SunIcon,
  SproutIcon,
  SparklesIcon,
  CheckCircleIcon,
  MapPinIcon,
  CalendarIcon,
  CameraIcon,
  ShieldCheckIcon,
  PlusIcon,
  LeafIcon,
  TrophyIcon,
} from './Icons';

// Growth stage definition for the 5 virtual stages
interface GrowthStage {
  id: number;
  name: string;
  botanicalLabel: string;
  minProgress: number;
  maxProgress: number;
  description: string;
  co2Rate: string;
}

const GROWTH_STAGES: GrowthStage[] = [
  {
    id: 0,
    name: 'Malabar Seed',
    botanicalLabel: 'Phase 1: Germination',
    minProgress: 0,
    maxProgress: 19,
    description: 'An indigenous Kerala heirloom seed nesting in fertile, vermicompost-enriched soil awaiting hydration.',
    co2Rate: '0.0 kg CO₂/yr',
  },
  {
    id: 1,
    name: 'Emerging Sprout',
    botanicalLabel: 'Phase 2: Cotyledon Emergence',
    minProgress: 20,
    maxProgress: 39,
    description: 'Tender dual green shoots piercing the earth surface, beginning active solar phototropism.',
    co2Rate: '0.8 kg CO₂/yr (est.)',
  },
  {
    id: 2,
    name: 'Hardy Sapling',
    botanicalLabel: 'Phase 3: Root Anchoring',
    minProgress: 40,
    maxProgress: 59,
    description: 'A resilient juvenile stem establishing deep hydrological roots to withstand tropical monsoon runoff.',
    co2Rate: '4.5 kg CO₂/yr (est.)',
  },
  {
    id: 3,
    name: 'Young Tree',
    botanicalLabel: 'Phase 4: Canopy Expansion',
    minProgress: 60,
    maxProgress: 79,
    description: 'Lush tropical fronds spreading outward, creating microclimate shade and localized evapotranspiration.',
    co2Rate: '12.0 kg CO₂/yr (est.)',
  },
  {
    id: 4,
    name: 'Mature Heritage Palm',
    botanicalLabel: 'Phase 5: Climax Biosphere Canopy',
    minProgress: 80,
    maxProgress: 100,
    description: 'A towering Kerala Coconut Palm (Kera) providing biodiversity refuge, coconuts, and maximum carbon capture.',
    co2Rate: '22.4 kg CO₂/yr (benchmark)',
  },
];

// Kerala Native Species for Real-World Logging
const KERALA_SPECIES = [
  { name: 'Coconut Palm (Thengu)', botanical: 'Cocos nucifera', category: 'Coastal & Agro' },
  { name: 'Jackfruit Tree (Plavu)', botanical: 'Artocarpus heterophyllus', category: 'State Fruit & Timber' },
  { name: 'Golden Shower (Kanikkonna)', botanical: 'Cassia fistula', category: 'State Flower & Pollinators' },
  { name: 'Nilambur Teak (Thekku)', botanical: 'Tectona grandis', category: 'Heritage Canopy' },
  { name: 'Country Mango (Mavu)', botanical: 'Mangifera indica', category: 'Biodiversity Keystone' },
  { name: 'Neem Tree (Aaryaveppu)', botanical: 'Azadirachta indica', category: 'Medicinal & Air Quality' },
  { name: 'Malabar Mahogany', botanical: 'Swietenia mahagoni', category: 'Long-term Carbon Sink' },
  { name: 'Other Native Species', botanical: 'Indigenous Flora', category: 'Community Choice' },
];

const KERALA_DISTRICTS = [
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Ernakulam (Kochi)',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod',
  'Other Global Location',
];

interface RealPlanting {
  id: string;
  species: string;
  botanical: string;
  district: string;
  date: string;
  notes: string;
  photoUrl?: string;
  reporterName: string;
  verifiedCitizen: boolean;
}

const DEFAULT_REAL_PLANTINGS: RealPlanting[] = [
  {
    id: 'rp-1',
    species: 'Jackfruit Tree (Plavu)',
    botanical: 'Artocarpus heterophyllus',
    district: 'Wayanad',
    date: '2026-03-12',
    notes: 'Planted on terraced coffee agroforestry slope to enhance soil retention during early monsoon rains.',
    reporterName: 'Aditi V., Meppadi',
    verifiedCitizen: true,
  },
  {
    id: 'rp-2',
    species: 'Golden Shower (Kanikkonna)',
    botanical: 'Cassia fistula',
    district: 'Ernakulam (Kochi)',
    date: '2026-03-24',
    notes: 'Planted in Edappally community public park border to attract native honeybees and Asian koels.',
    reporterName: 'Kochi Green Corps',
    verifiedCitizen: true,
  },
  {
    id: 'rp-3',
    species: 'Coconut Palm (Thengu)',
    botanical: 'Cocos nucifera',
    district: 'Alappuzha',
    date: '2026-04-02',
    notes: 'Planted alongside backwater canal bank to reinforce riparian embankment against soil erosion.',
    reporterName: 'Sunil K., Kuttanad',
    verifiedCitizen: true,
  },
];

export default function VirtualGarden() {
  const fileInputId = useId();
  const { completedActions } = useCity();
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  // Tab State: 'virtual' | 'real'
  const [activeTab, setActiveTab] = useState<'virtual' | 'real'>('virtual');

  // Virtual Garden Care State
  const [careWaterCount, setCareWaterCount] = useState<number>(0);
  const [careNutrientCount, setCareNutrientCount] = useState<number>(0);
  const [careSunCount, setCareSunCount] = useState<number>(0);
  const [maturedGroveCount, setMaturedGroveCount] = useState<number>(0);
  const [activeCareFeedback, setActiveCareFeedback] = useState<string | null>(null);

  // Real Plantings State
  const [realPlantings, setRealPlantings] = useState<RealPlanting[]>(DEFAULT_REAL_PLANTINGS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formSpecies, setFormSpecies] = useState(KERALA_SPECIES[0].name);
  const [formDistrict, setFormDistrict] = useState(KERALA_DISTRICTS[6]); // Ernakulam
  const [formDate, setFormDate] = useState('2026-04-15');
  const [maxDateStr, setMaxDateStr] = useState<string | undefined>(undefined);
  const [formNotes, setFormNotes] = useState('');
  const [formReporter, setFormReporter] = useState('');
  const [formPhoto, setFormPhoto] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedGarden = localStorage.getItem('ecoterra-virtual-garden');
      const savedReal = localStorage.getItem('ecoterra-real-plantings');

      startTransition(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        setFormDate(todayStr);
        setMaxDateStr(todayStr);

        if (savedGarden) {
          const parsed = JSON.parse(savedGarden);
          if (typeof parsed.water === 'number') setCareWaterCount(parsed.water);
          if (typeof parsed.nutrient === 'number') setCareNutrientCount(parsed.nutrient);
          if (typeof parsed.sun === 'number') setCareSunCount(parsed.sun);
          if (typeof parsed.grove === 'number') setMaturedGroveCount(parsed.grove);
        }

        if (savedReal) {
          const parsedReal = JSON.parse(savedReal);
          if (Array.isArray(parsedReal) && parsedReal.length > 0) {
            setRealPlantings(parsedReal);
          }
        }
      });
    } catch {
      // Ignore local storage parsing error
    }
  }, []);

  // Save Virtual Garden to localStorage
  const saveVirtualGardenState = useCallback(
    (water: number, nutrient: number, sun: number, grove: number) => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.setItem(
          'ecoterra-virtual-garden',
          JSON.stringify({ water, nutrient, sun, grove, updatedAt: Date.now() })
        );
      } catch {
        // Ignore local storage write error
      }
    },
    []
  );

  // Calculate Progress (0 - 100%)
  // 1. Actions contribution: each completed scorecard action gives +6% (up to 72%)
  const completedActionsCount = Object.values(completedActions).filter(Boolean).length;
  const actionsGrowth = completedActionsCount * 6;

  // 2. Direct Care contribution: each care action gives +4% (capped)
  const careGrowth = (careWaterCount + careNutrientCount + careSunCount) * 4;

  // Total Growth Progress (clamped 0 to 100)
  const totalGrowth = Math.min(100, actionsGrowth + careGrowth);

  // Current Growth Stage
  const currentStageIndex = GROWTH_STAGES.findIndex(
    (st) => totalGrowth >= st.minProgress && totalGrowth <= st.maxProgress
  );
  const activeStage = GROWTH_STAGES[currentStageIndex !== -1 ? currentStageIndex : 0];
  const isMatured = totalGrowth >= 100;

  // Interactive Care Handlers
  const handleWater = () => {
    const next = careWaterCount + 1;
    setCareWaterCount(next);
    saveVirtualGardenState(next, careNutrientCount, careSunCount, maturedGroveCount);
    setActiveCareFeedback('Hydrated with low-flow collected rainwater (+4% growth)');
    setTimeout(() => setActiveCareFeedback(null), 2500);
  };

  const handleNutrient = () => {
    const next = careNutrientCount + 1;
    setCareNutrientCount(next);
    saveVirtualGardenState(careWaterCount, next, careSunCount, maturedGroveCount);
    setActiveCareFeedback('Enriched with organic compost humus (+4% growth)');
    setTimeout(() => setActiveCareFeedback(null), 2500);
  };

  const handleSun = () => {
    const next = careSunCount + 1;
    setCareSunCount(next);
    saveVirtualGardenState(careWaterCount, careNutrientCount, next, maturedGroveCount);
    setActiveCareFeedback('Optimized tropical solar exposure (+4% growth)');
    setTimeout(() => setActiveCareFeedback(null), 2500);
  };

  // Plant another tree after reaching maturity
  const handlePlantAnotherTree = () => {
    const nextGrove = maturedGroveCount + 1;
    setMaturedGroveCount(nextGrove);
    setCareWaterCount(0);
    setCareNutrientCount(0);
    setCareSunCount(0);
    saveVirtualGardenState(0, 0, 0, nextGrove);
    setActiveCareFeedback('New seedling sown! Previous mature tree archived in your Grove.');
    setTimeout(() => setActiveCareFeedback(null), 3000);
  };

  // Real Planting Image Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Please choose an image under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Real Planting
  const handleSubmitRealPlanting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSpecies || !formDistrict || !formDate) return;

    const matchedSpec = KERALA_SPECIES.find((s) => s.name === formSpecies);
    const newPlanting: RealPlanting = {
      id: `rp-${Date.now()}`,
      species: formSpecies,
      botanical: matchedSpec ? matchedSpec.botanical : 'Indigenous Specimen',
      district: formDistrict,
      date: formDate,
      notes: formNotes || 'Planted with commitment to Kerala’s green bioclimatic canopy.',
      reporterName: formReporter || 'Anonymous Citizen Volunteer',
      photoUrl: formPhoto || undefined,
      verifiedCitizen: true,
    };

    const updated = [newPlanting, ...realPlantings];
    setRealPlantings(updated);
    try {
      localStorage.setItem('ecoterra-real-plantings', JSON.stringify(updated));
    } catch {
      // Ignore write errors
    }

    // Reset Form
    setFormNotes('');
    setFormReporter('');
    setFormPhoto(null);
    setIsFormOpen(false);
  };

  return (
    <section
      id="garden"
      ref={ref}
      className="relative bg-[#0A1F0A] py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/5 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-[#10B981]/10 blur-[160px]" />
        <div className="absolute bottom-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-[#D4FF00]/5 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 px-2"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] text-xs font-mono tracking-widest uppercase mb-4">
            <TreeIcon className="w-3.5 h-3.5" />
            <span>Regenerative Biosphere • Grow Your Future</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            Virtual Garden & Real-World Canopy
          </h2>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed">
            Nurture your interactive Kerala sapling through verified sustainability habits, or record tangible tree
            plantings across your community. Every action roots a greener tomorrow.
          </p>

          {/* Tab Selector: Virtual Simulation vs Real-World Impact */}
          <div className="mt-8 inline-flex items-center p-1.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md max-w-md w-full">
            <button
              onClick={() => setActiveTab('virtual')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === 'virtual'
                  ? 'bg-[#10B981] text-[#0A1F0A] shadow-lg shadow-[#10B981]/20 font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <SproutIcon className="w-4 h-4" />
              <span>Grow Your Future</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'virtual' ? 'bg-[#0A1F0A]/20 text-[#0A1F0A]' : 'bg-white/10 text-white/60'
                }`}
              >
                5 Stages
              </span>
            </button>

            <button
              onClick={() => setActiveTab('real')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                activeTab === 'real'
                  ? 'bg-[#D4FF00] text-[#0A1F0A] shadow-lg shadow-[#D4FF00]/20 font-bold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Citizen Registry</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === 'real' ? 'bg-[#0A1F0A]/20 text-[#0A1F0A]' : 'bg-white/10 text-white/60'
                }`}
              >
                Real Impact
              </span>
            </button>
          </div>
        </motion.div>

        {/* TAB 1: VIRTUAL GARDEN SIMULATOR */}
        {activeTab === 'virtual' && (
          <motion.div
            key="tab-virtual"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Simulation Status Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                <span className="text-xs sm:text-sm font-mono text-[#10B981]">
                  VIRTUAL TREE ENGINE • STAGE {activeStage.id + 1} OF 5: {activeStage.name.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/70 font-mono">
                <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  Virtual Grove: <strong className="text-[#D4FF00]">{maturedGroveCount}</strong> Matured Trees
                </span>
                <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                  Habit Link: <strong className="text-[#10B981]">{completedActionsCount}/12</strong> Actions (+{actionsGrowth}%)
                </span>
              </div>
            </div>

            {/* Tree Growth Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Interactive Botanical Canvas (7 cols) */}
              <div className="lg:col-span-7 relative rounded-3xl bg-gradient-to-b from-[#0D2310] via-[#081708] to-[#040C04] border border-white/15 p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col items-center justify-between min-h-[440px] sm:min-h-[500px]">
                {/* Microclimate Sky & Atmosphere SVG */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                  <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 400">
                    <defs>
                      <radialGradient id="sunGlow" cx="80%" cy="20%" r="50%">
                        <stop offset="0%" stopColor="#FDE047" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="400" height="400" fill="url(#sunGlow)" />
                    {/* Kerala Western Ghats Hill Contours */}
                    <path
                      d="M0,280 Q80,240 180,270 T400,250 L400,400 L0,400 Z"
                      fill="#06210A"
                      opacity="0.8"
                    />
                    <path
                      d="M0,310 Q120,290 260,320 T400,300 L400,400 L0,400 Z"
                      fill="#041506"
                      opacity="0.9"
                    />
                  </svg>
                </div>

                {/* Floating Metric Chips */}
                <div className="w-full flex items-center justify-between z-10">
                  <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                    <LeafIcon className="w-4 h-4 text-[#10B981]" />
                    <span className="text-xs font-mono text-white/90">
                      Carbon Absorption: <strong className="text-[#10B981]">{activeStage.co2Rate}</strong>
                    </span>
                  </div>

                  <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-[#D4FF00]" />
                    <span className="text-xs font-mono text-white/90">
                      Biosphere Vitality: <strong className="text-[#D4FF00]">{totalGrowth}%</strong>
                    </span>
                  </div>
                </div>

                {/* Dynamic Botanical SVG Growth Visual */}
                <div className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] h-[280px] sm:h-[320px] flex items-center justify-center my-auto">
                  <AnimatePresence mode="wait">
                    {/* STAGE 0: SEED */}
                    {activeStage.id === 0 && (
                      <motion.div
                        key="stage-0"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                      >
                        <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none">
                          {/* Soil Mound */}
                          <ellipse cx="100" cy="155" rx="70" ry="18" fill="#3D2817" />
                          <ellipse cx="100" cy="152" rx="60" ry="14" fill="#2E1C0C" />
                          {/* Seed Pod */}
                          <path
                            d="M90 148 C90 135 110 135 110 148 C110 158 90 158 90 148 Z"
                            fill="#854D0E"
                            stroke="#A16207"
                            strokeWidth="2"
                          />
                          {/* Tiny Root Sprout */}
                          <path
                            d="M100 156 Q100 168 106 174"
                            stroke="#84CC16"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          {/* Soil Nutrients Glow */}
                          <circle cx="100" cy="148" r="30" stroke="#10B981" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                        </svg>
                        <span className="mt-1 text-xs font-mono text-[#D4FF00] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                          Soil Moisture: Active
                        </span>
                      </motion.div>
                    )}

                    {/* STAGE 1: SPROUT */}
                    {activeStage.id === 1 && (
                      <motion.div
                        key="stage-1"
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                      >
                        <svg className="w-52 h-52" viewBox="0 0 200 200" fill="none">
                          {/* Soil Mound */}
                          <ellipse cx="100" cy="160" rx="65" ry="15" fill="#3D2817" />
                          {/* Emerging Stem */}
                          <path
                            d="M100 160 Q98 130 96 110"
                            stroke="#10B981"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          {/* Twin Cotyledon Leaves */}
                          <path
                            d="M96 110 C80 100 75 85 92 88 C96 95 96 105 96 110 Z"
                            fill="#22C55E"
                            stroke="#15803D"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M96 110 C112 100 117 85 100 88 C96 95 96 105 96 110 Z"
                            fill="#4ADE80"
                            stroke="#15803D"
                            strokeWidth="1.5"
                          />
                          {/* Dew Drop */}
                          <circle cx="85" cy="90" r="2.5" fill="#38BDF8" />
                        </svg>
                        <span className="mt-1 text-xs font-mono text-[#10B981] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                          Phototropism Active
                        </span>
                      </motion.div>
                    )}

                    {/* STAGE 2: SAPLING */}
                    {activeStage.id === 2 && (
                      <motion.div
                        key="stage-2"
                        initial={{ opacity: 0, scale: 0.85, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -15 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                      >
                        <svg className="w-56 h-56" viewBox="0 0 200 200" fill="none">
                          {/* Soil Mound */}
                          <ellipse cx="100" cy="165" rx="70" ry="16" fill="#2E1C0C" />
                          {/* Stem */}
                          <path
                            d="M100 165 Q102 120 98 80"
                            stroke="#047857"
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                          {/* Multiple Leaf Pairs */}
                          <path
                            d="M98 125 C80 120 70 105 88 112 C96 117 98 123 98 125 Z"
                            fill="#10B981"
                          />
                          <path
                            d="M99 110 C118 105 128 90 110 98 C102 103 99 108 99 110 Z"
                            fill="#22C55E"
                          />
                          <path
                            d="M98 80 C80 65 75 50 94 58 C98 68 98 75 98 80 Z"
                            fill="#4ADE80"
                          />
                          <path
                            d="M98 80 C116 65 121 50 102 58 C98 68 98 75 98 80 Z"
                            fill="#86EFAC"
                          />
                          {/* Terminal Bud */}
                          <circle cx="98" cy="76" r="3" fill="#D4FF00" />
                        </svg>
                        <span className="mt-1 text-xs font-mono text-[#D4FF00] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                          Root System Grounded
                        </span>
                      </motion.div>
                    )}

                    {/* STAGE 3: YOUNG TREE */}
                    {activeStage.id === 3 && (
                      <motion.div
                        key="stage-3"
                        initial={{ opacity: 0, scale: 0.9, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -15 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center"
                      >
                        <svg className="w-64 h-64" viewBox="0 0 200 200" fill="none">
                          {/* Soil Mound */}
                          <ellipse cx="100" cy="170" rx="75" ry="16" fill="#1C1917" />
                          {/* Growing Palm Trunk with Rings */}
                          <path
                            d="M97 170 Q94 110 102 65"
                            stroke="#78350F"
                            strokeWidth="8"
                            strokeLinecap="round"
                          />
                          {/* Trunk Ring Ridges */}
                          <line x1="94" y1="145" x2="101" y2="146" stroke="#92400E" strokeWidth="2" />
                          <line x1="95" y1="120" x2="102" y2="121" stroke="#92400E" strokeWidth="2" />
                          <line x1="97" y1="95" x2="103" y2="96" stroke="#92400E" strokeWidth="2" />

                          {/* Branching Tropical Fronds */}
                          <path
                            d="M102 65 Q70 50 45 65"
                            stroke="#059669"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <path
                            d="M102 65 Q135 48 160 62"
                            stroke="#10B981"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <path
                            d="M102 65 Q90 30 75 15"
                            stroke="#22C55E"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M102 65 Q115 30 130 18"
                            stroke="#4ADE80"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M102 65 Q102 25 102 10"
                            stroke="#86EFAC"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="mt-1 text-xs font-mono text-[#10B981] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                          Canopy Shading 4.5m²
                        </span>
                      </motion.div>
                    )}

                    {/* STAGE 4: MATURE TREE (KERALA COCONUT PALM) */}
                    {activeStage.id === 4 && (
                      <motion.div
                        key="stage-4"
                        initial={{ opacity: 0, scale: 0.92, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: -10 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center"
                      >
                        <svg className="w-72 h-72 sm:w-80 sm:h-80" viewBox="0 0 240 240" fill="none">
                          {/* Riparian Backwater Ground */}
                          <ellipse cx="120" cy="205" rx="90" ry="18" fill="#1C1917" />
                          <path
                            d="M30 215 Q120 200 210 215"
                            stroke="#0284C7"
                            strokeWidth="3"
                            opacity="0.6"
                          />

                          {/* Curved Kerala Coconut Trunk with Authentic Character */}
                          <path
                            d="M115 205 Q105 130 128 65"
                            stroke="#593213"
                            strokeWidth="10"
                            strokeLinecap="round"
                          />
                          {/* Trunk Growth Rings */}
                          {[180, 160, 140, 120, 100, 80].map((y, idx) => (
                            <line
                              key={idx}
                              x1="110"
                              y1={y}
                              x2="124"
                              y2={y + 1}
                              stroke="#78350F"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            />
                          ))}

                          {/* Coconut Fruit Cluster */}
                          <circle cx="122" cy="72" r="5" fill="#713F12" />
                          <circle cx="131" cy="73" r="5.5" fill="#854D0E" />
                          <circle cx="126" cy="78" r="5" fill="#593213" />

                          {/* Sweeping Kerala Feather Fronds (Arching outward) */}
                          {/* Frond 1: Left Downward Curve */}
                          <path
                            d="M128 65 Q70 60 30 95"
                            stroke="#065F46"
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M30 95 Q55 80 85 70"
                            stroke="#10B981"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          {/* Frond 2: Right Downward Curve */}
                          <path
                            d="M128 65 Q185 58 220 90"
                            stroke="#047857"
                            strokeWidth="5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M220 90 Q190 75 160 68"
                            stroke="#22C55E"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          {/* Frond 3: Upper Left Arch */}
                          <path
                            d="M128 65 Q80 25 45 42"
                            stroke="#059669"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                          />
                          {/* Frond 4: Upper Right Arch */}
                          <path
                            d="M128 65 Q175 22 205 38"
                            stroke="#10B981"
                            strokeWidth="4.5"
                            strokeLinecap="round"
                          />
                          {/* Frond 5: High Apex Frond */}
                          <path
                            d="M128 65 Q125 15 115 5"
                            stroke="#4ADE80"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />
                          <path
                            d="M128 65 Q138 18 145 6"
                            stroke="#86EFAC"
                            strokeWidth="4"
                            strokeLinecap="round"
                          />

                          {/* Ambient Pollinator / Sunbeam Sparkles */}
                          <circle cx="70" cy="50" r="2" fill="#D4FF00" className="animate-ping" />
                          <circle cx="180" cy="60" r="2" fill="#D4FF00" className="animate-ping" />
                        </svg>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-mono text-[#0A1F0A] bg-[#D4FF00] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                            Heritage Climax Tree
                          </span>
                          <span className="text-xs font-mono text-[#38BDF8] bg-black/40 px-2 py-0.5 rounded border border-white/10">
                            22.4 kg CO₂/yr
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Growth Feedback Toast */}
                <div className="h-8 flex items-center justify-center z-10 w-full">
                  <AnimatePresence>
                    {activeCareFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="bg-[#10B981]/20 border border-[#10B981]/50 text-[#10B981] px-3 py-1 rounded-full text-xs font-mono tracking-wide"
                      >
                        {activeCareFeedback}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Progress Bar & Stage Marker */}
                <div className="w-full z-10 space-y-2 mt-2">
                  <div className="flex justify-between items-center text-xs font-mono text-white/80">
                    <span className="text-white font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      Stage {activeStage.id + 1}: {activeStage.name}
                    </span>
                    <span className="text-[#D4FF00] font-bold">{totalGrowth}% Growth</span>
                  </div>

                  <div className="relative w-full h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#10B981] via-[#84CC16] to-[#D4FF00]"
                      style={{ width: `${totalGrowth}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* 5 Stage Indicators */}
                  <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] text-center text-white/50 font-mono">
                    {GROWTH_STAGES.map((st) => (
                      <div
                        key={st.id}
                        className={`truncate transition-colors ${
                          activeStage.id >= st.id ? 'text-[#10B981] font-semibold' : 'text-white/30'
                        }`}
                      >
                        {st.id + 1}. {st.name.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Growth Controls & Carbon Sequestration (5 cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* Stage Info Card */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 backdrop-blur-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#D4FF00] uppercase tracking-wider">
                      {activeStage.botanicalLabel}
                    </span>
                    <span className="text-xs font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5 text-white/80">
                      Phase {activeStage.id + 1} of 5
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">{activeStage.name}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{activeStage.description}</p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-white/60 font-mono">
                    <span>Carbon Capture Benchmark:</span>
                    <span className="text-[#10B981] font-semibold">{activeStage.co2Rate}</span>
                  </div>
                </div>

                {/* Interactive Care Actions */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 backdrop-blur-sm space-y-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-[#D4FF00]" />
                    <span>Direct Virtual Care Controls</span>
                  </h4>
                  <p className="text-xs text-white/60">
                    Interact directly with your sapling to supplement its growth alongside your real-life Scorecard habits.
                  </p>

                  <div className="grid grid-cols-3 gap-2.5 pt-1">
                    {/* Water Button */}
                    <button
                      onClick={handleWater}
                      className="group flex flex-col items-center justify-center p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/50 hover:bg-blue-500/20 active:scale-95 transition-all text-center"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 flex items-center justify-center mb-1.5 text-blue-400 group-hover:scale-110 transition-transform">
                        <DropletIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white">Water</span>
                      <span className="text-[10px] text-blue-400 font-mono">+4% ({careWaterCount})</span>
                    </button>

                    {/* Nutrients Button */}
                    <button
                      onClick={handleNutrient}
                      className="group flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/20 active:scale-95 transition-all text-center"
                    >
                      <div className="w-9 h-9 rounded-full bg-emerald-500/20 flex items-center justify-center mb-1.5 text-emerald-400 group-hover:scale-110 transition-transform">
                        <SproutIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white">Nutrients</span>
                      <span className="text-[10px] text-emerald-400 font-mono">+4% ({careNutrientCount})</span>
                    </button>

                    {/* Sunlight Button */}
                    <button
                      onClick={handleSun}
                      className="group flex flex-col items-center justify-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/50 hover:bg-amber-500/20 active:scale-95 transition-all text-center"
                    >
                      <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center mb-1.5 text-amber-400 group-hover:scale-110 transition-transform">
                        <SunIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-white">Sunlight</span>
                      <span className="text-[10px] text-amber-400 font-mono">+4% ({careSunCount})</span>
                    </button>
                  </div>
                </div>

                {/* Maturity Celebration & Plant Another Virtual Tree */}
                {isMatured ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl bg-gradient-to-br from-[#10B981]/20 via-[#D4FF00]/10 to-transparent border border-[#10B981]/40 p-5 backdrop-blur-md space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                        <TrophyIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Heritage Maturity Reached!</h4>
                        <p className="text-xs text-[#D4FF00] font-mono">Carbon Sink Active: 22.4 kg CO₂/yr</p>
                      </div>
                    </div>

                    <p className="text-xs text-white/70">
                      Your virtual Kerala palm has attained full ecological maturity through consistent sustainable
                      habits and dedicated care.
                    </p>

                    <button
                      onClick={handlePlantAnotherTree}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D4FF00] hover:bg-[#bce300] active:scale-[0.98] text-[#0A1F0A] font-bold text-xs sm:text-sm transition-all shadow-lg shadow-[#D4FF00]/20"
                    >
                      <PlusIcon className="w-4 h-4" />
                      <span>Plant Another Virtual Tree (+1 to Grove)</span>
                    </button>
                  </motion.div>
                ) : (
                  /* Habit Connection Tip */
                  <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[#10B981]/10 text-[#10B981] shrink-0 mt-0.5">
                      <CheckCircleIcon className="w-4 h-4" />
                    </div>
                    <div className="text-xs text-white/60 space-y-1">
                      <p className="font-semibold text-white/90">Linked to Scorecard Actions</p>
                      <p>
                        Each verified action checked off in the Scorecard below awards <strong>+6% growth</strong> to
                        your virtual tree. Complete all 12 to earn +72% natural vitality!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: REAL-WORLD IMPACT REGISTRY */}
        {activeTab === 'real' && (
          <motion.div
            key="tab-real"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {/* Real World Distinction Notice Banner */}
            <div className="rounded-2xl bg-emerald-950/40 border border-emerald-500/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-[#10B981]/20 text-[#10B981] shrink-0 mt-0.5">
                  <ShieldCheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Citizen Self-Reported Registry • Real-World Ground Impact</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                      Community Log
                    </span>
                  </h4>
                  <p className="text-xs text-white/70 mt-1 max-w-2xl leading-relaxed">
                    This public log records actual physical saplings planted by citizens in home compounds, educational
                    institutions, and public wards across Kerala. These are <strong>real physical trees</strong>,
                    independent of our digital simulations.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-[#0A1F0A] font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <PlusIcon className="w-4 h-4" />
                <span>{isFormOpen ? 'Close Form' : 'Log a Real Tree'}</span>
              </button>
            </div>

            {/* Planting Log Form Modal / Expandable Card */}
            <AnimatePresence>
              {isFormOpen && (
                <motion.form
                  onSubmit={handleSubmitRealPlanting}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/15 p-6 backdrop-blur-md space-y-5 overflow-hidden"
                >
                  <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white">Record Your Real-World Tree Planting</h3>
                      <p className="text-xs text-white/60">
                        Help map community bioclimatic canopy coverage across Kerala.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-[#D4FF00]">Voluntary Community Log</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Species Select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/80">Native Species</label>
                      <select
                        value={formSpecies}
                        onChange={(e) => setFormSpecies(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#10B981]"
                      >
                        {KERALA_SPECIES.map((s) => (
                          <option key={s.name} value={s.name} className="bg-[#0D1B0D] text-white">
                            {s.name} — {s.botanical}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District Select */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/80">Kerala District / Region</label>
                      <select
                        value={formDistrict}
                        onChange={(e) => setFormDistrict(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#10B981]"
                      >
                        {KERALA_DISTRICTS.map((d) => (
                          <option key={d} value={d} className="bg-[#0D1B0D] text-white">
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Planting Date */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/80">Planting Date</label>
                      <input
                        type="date"
                        value={formDate}
                        max={maxDateStr}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#10B981]"
                      />
                    </div>

                    {/* Planter Name / Group */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/80">Planted By / Community Group</label>
                      <input
                        type="text"
                        placeholder="e.g. Rahul M. or St. Teresa's Eco Club"
                        value={formReporter}
                        onChange={(e) => setFormReporter(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#10B981]"
                      />
                    </div>

                    {/* Photo Upload */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-medium text-white/80">Optional Sapling Photo</label>
                      <div className="flex items-center gap-3">
                        <label
                          htmlFor={fileInputId}
                          className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white/80 hover:bg-white/10 hover:border-white/25 transition-colors"
                        >
                          <CameraIcon className="w-4 h-4 text-[#10B981]" />
                          <span>{formPhoto ? 'Change Photo' : 'Select Photo'}</span>
                        </label>
                        <input
                          id={fileInputId}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="sr-only"
                        />
                        {formPhoto && (
                          <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={formPhoto}
                              alt="Sapling preview"
                              className="w-10 h-10 rounded-lg object-cover border border-[#10B981]/50"
                            />
                            <span className="text-[11px] text-[#10B981] font-mono">Photo attached</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dedication / Notes */}
                    <div className="space-y-1.5 sm:col-span-2 lg:col-span-3">
                      <label className="text-xs font-medium text-white/80">Notes / Dedication</label>
                      <input
                        type="text"
                        placeholder="e.g. Planted along canal bank to stabilize riparian embankment"
                        value={formNotes}
                        onChange={(e) => setFormNotes(e.target.value)}
                        className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#10B981]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 rounded-xl bg-white/5 text-white/70 hover:text-white text-xs font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-[#D4FF00] hover:bg-[#bce300] text-[#0A1F0A] font-bold text-xs sm:text-sm shadow-md transition-all"
                    >
                      Save Citizen Planting Entry
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3.5 text-center">
                <div className="text-2xl font-bold text-white">{realPlantings.length}</div>
                <div className="text-xs text-white/60 font-mono mt-0.5">Recorded Plantings</div>
              </div>
              <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3.5 text-center">
                <div className="text-2xl font-bold text-[#10B981]">
                  {(realPlantings.length * 22.4).toFixed(0)} <span className="text-sm font-normal">kg/yr</span>
                </div>
                <div className="text-xs text-white/60 font-mono mt-0.5">Maturity CO₂ Potential</div>
              </div>
              <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3.5 text-center">
                <div className="text-2xl font-bold text-[#D4FF00]">100%</div>
                <div className="text-xs text-white/60 font-mono mt-0.5">Native Bioclimatic Flora</div>
              </div>
              <div className="rounded-xl bg-white/[0.02] border border-white/10 p-3.5 text-center">
                <div className="text-2xl font-bold text-[#38BDF8]">
                  {new Set(realPlantings.map((p) => p.district)).size}
                </div>
                <div className="text-xs text-white/60 font-mono mt-0.5">Districts Engaged</div>
              </div>
            </div>

            {/* Plantings Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {realPlantings.map((planting) => (
                <div
                  key={planting.id}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 backdrop-blur-sm flex flex-col justify-between hover:border-white/20 transition-all space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] font-mono text-[11px] border border-[#10B981]/25">
                        <TreeIcon className="w-3 h-3" />
                        <span>{planting.species.split('(')[0]}</span>
                      </span>

                      <span className="flex items-center gap-1 text-white/50 text-[11px] font-mono">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{planting.date}</span>
                      </span>
                    </div>

                    {/* Optional Photo or SVG Graphic */}
                    {planting.photoUrl ? (
                      <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={planting.photoUrl}
                          alt={planting.species}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-24 rounded-xl bg-gradient-to-r from-emerald-950/30 to-green-950/20 border border-white/5 flex items-center justify-center text-emerald-500/40">
                        <TreeIcon className="w-10 h-10" />
                      </div>
                    )}

                    {/* Botanical Details */}
                    <div>
                      <h4 className="text-base font-bold text-white">{planting.species}</h4>
                      <p className="text-xs italic text-[#10B981] font-mono">{planting.botanical}</p>
                    </div>

                    {/* Notes */}
                    <p className="text-xs text-white/70 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg border border-white/5">
                      &ldquo;{planting.notes}&rdquo;
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/60">
                    <span className="flex items-center gap-1 font-mono text-white/80">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#D4FF00]" />
                      <span>{planting.district}</span>
                    </span>
                    <span className="truncate text-white/50 max-w-[120px] text-[11px]">
                      By {planting.reporterName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
