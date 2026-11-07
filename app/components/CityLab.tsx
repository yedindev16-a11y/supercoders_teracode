'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  type CityParameters,
  type SimulationResult,
  calculateSimulation,
  DEFAULT_PARAMS,
  PRESETS,
  getScoreLabel,
  getScoreColor,
} from '../lib/simulation';

/* ─────────────────────── Icon Components ─────────────────────── */

function SunIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function TreeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L6 10h3l-2 5h3l-2 5h8l-2-5h3l-2-5h3L12 2z" />
      <line x1="12" y1="22" x2="12" y2="17" />
    </svg>
  );
}

function BusIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="14" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="7" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
      <line x1="7" y1="17" x2="7" y2="21" />
      <line x1="17" y1="17" x2="17" y2="21" />
    </svg>
  );
}

function RecycleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 00-.005-1.775L16.8 9.5" />
      <path d="M12 5l3.458 5.96" />
      <path d="M12 5L8.542 10.96" />
      <path d="M4.5 16.5l2.5-3h-5" />
      <path d="M19.5 16.5l-2.5-3h5" />
      <path d="M12 2l2 3h-4l2-3" />
    </svg>
  );
}

function DropletIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
    </svg>
  );
}

/* ─────────────────── Slider Configuration ─────────────────── */

interface SliderConfig {
  key: keyof CityParameters;
  label: string;
  icon: React.ReactNode;
}

const SLIDERS: SliderConfig[] = [
  { key: 'renewableEnergy', label: 'Renewable Energy', icon: <SunIcon className="w-5 h-5 text-yellow-400" /> },
  { key: 'greenCoverage', label: 'Green Coverage', icon: <TreeIcon className="w-5 h-5 text-emerald-400" /> },
  { key: 'sustainableTransport', label: 'Sustainable Transport', icon: <BusIcon className="w-5 h-5 text-sky-400" /> },
  { key: 'wasteRecovery', label: 'Waste Recovery', icon: <RecycleIcon className="w-5 h-5 text-lime-400" /> },
  { key: 'waterConservation', label: 'Water Conservation', icon: <DropletIcon className="w-5 h-5 text-blue-400" /> },
];

/* ─────────────────── Preset Button Labels ─────────────────── */

const PRESET_LABELS: Record<string, string> = {
  current: "Today's City",
  progressive: 'Progressive',
  ecotopia: 'Ecotopia',
  minimal: 'Minimal Effort',
};

/* ─────────────────── Indicator metadata ─────────────────── */

interface IndicatorMeta {
  key: keyof SimulationResult['indicators'];
  label: string;
  unit: string;
}

const INDICATORS: IndicatorMeta[] = [
  { key: 'co2ReductionPercent', label: 'CO₂ Reduction', unit: '%' },
  { key: 'airQualityIndex', label: 'Air Quality', unit: '/100' },
  { key: 'biodiversityScore', label: 'Biodiversity', unit: '/100' },
  { key: 'livabilityScore', label: 'Livability', unit: '/100' },
  { key: 'resourceEfficiency', label: 'Resource Efficiency', unit: '/100' },
  { key: 'climateResilience', label: 'Climate Resilience', unit: '/100' },
];

/* ─────────────── Helper: interpolate color ─────────────── */

function lerpColor(a: string, b: string, t: number): string {
  const ah = a.replace('#', '');
  const bh = b.replace('#', '');
  const ar = parseInt(ah.substring(0, 2), 16);
  const ag = parseInt(ah.substring(2, 4), 16);
  const ab = parseInt(ah.substring(4, 6), 16);
  const br = parseInt(bh.substring(0, 2), 16);
  const bg = parseInt(bh.substring(2, 4), 16);
  const bb = parseInt(bh.substring(4, 6), 16);
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `#${rr.toString(16).padStart(2, '0')}${rg.toString(16).padStart(2, '0')}${rb.toString(16).padStart(2, '0')}`;
}

function getSkyColor(score: number): string {
  // Low → gray/brown (#5C534A), Mid → slate blue (#64748B), High → clean blue (#38BDF8)
  if (score < 50) {
    return lerpColor('#5C534A', '#64748B', score / 50);
  }
  return lerpColor('#64748B', '#38BDF8', (score - 50) / 50);
}

function getSkyGradientBottom(score: number): string {
  if (score < 50) {
    return lerpColor('#3D3630', '#475569', score / 50);
  }
  return lerpColor('#475569', '#0EA5E9', (score - 50) / 50);
}

/* ═══════════════════════════════════════════════════════════
   CITY VISUALIZATION (SVG)
   ═══════════════════════════════════════════════════════════ */

function CityVisualization({ result }: { result: SimulationResult }) {
  const v = result.cityVisualState;
  const score = result.sustainabilityIndex;
  const skyTop = getSkyColor(score);
  const skyBottom = getSkyGradientBottom(score);

  return (
    <svg
      viewBox="0 0 600 400"
      className="w-full h-auto max-h-[450px]"
      aria-label="Interactive city visualization reflecting sustainability parameters"
      role="img"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyTop} className="transition-all duration-700" />
          <stop offset="100%" stopColor={skyBottom} className="transition-all duration-700" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a2e1a" />
          <stop offset="100%" stopColor="#0D1B0D" />
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="600" height="280" fill="url(#skyGrad)" className="transition-all duration-700" />

      {/* Sun/Moon based on score */}
      <circle
        cx="520"
        cy="60"
        r={25 + score * 0.1}
        fill={score > 40 ? '#FCD34D' : '#9CA3AF'}
        opacity={0.8}
        className="transition-all duration-700"
      />

      {/* Clouds - fewer with higher score */}
      <g opacity={Math.max(0.1, 1 - score / 80)} className="transition-all duration-700">
        <ellipse cx="120" cy="60" rx="40" ry="15" fill="#94A3B8" opacity={0.5} />
        <ellipse cx="145" cy="55" rx="30" ry="12" fill="#94A3B8" opacity={0.5} />
        <ellipse cx="350" cy="45" rx="35" ry="13" fill="#94A3B8" opacity={0.4} />
        <ellipse cx="380" cy="40" rx="28" ry="10" fill="#94A3B8" opacity={0.4} />
      </g>

      {/* Ground */}
      <rect x="0" y="280" width="600" height="120" fill="url(#groundGrad)" />

      {/* Road */}
      <rect x="0" y="310" width="600" height="30" fill="#374151" rx="2" />
      <line x1="0" y1="325" x2="600" y2="325" stroke="#6B7280" strokeWidth="1" strokeDasharray="20 15" />

      {/* ── Wind Turbines ── */}
      {v.windTurbines > 0 && (
        <g opacity={v.windTurbines} className="transition-all duration-500">
          <rect x="50" y="160" width="4" height="120" fill="#D1D5DB" rx="1" />
          <circle cx="52" cy="160" r="3" fill="#E5E7EB" />
          <line x1="52" y1="160" x2="52" y2="125" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
          <line x1="52" y1="160" x2="78" y2="178" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
          <line x1="52" y1="160" x2="26" y2="178" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" />
        </g>
      )}
      {v.windTurbines > 0.3 && (
        <g opacity={Math.min(1, (v.windTurbines - 0.3) * 2)} className="transition-all duration-500">
          <rect x="90" y="175" width="3" height="105" fill="#D1D5DB" rx="1" />
          <circle cx="91.5" cy="175" r="2.5" fill="#E5E7EB" />
          <line x1="91.5" y1="175" x2="91.5" y2="145" stroke="#E5E7EB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="91.5" y1="175" x2="113" y2="190" stroke="#E5E7EB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="91.5" y1="175" x2="70" y2="190" stroke="#E5E7EB" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      )}

      {/* ── Building 1 (tall) ── */}
      <g>
        <rect x="150" y="180" width="60" height="130" fill="#1E293B" rx="2" />
        {/* Windows */}
        {[0, 1, 2, 3, 4, 5].map(row => (
          <g key={`b1-row-${row}`}>
            <rect x="158" y={190 + row * 20} width="8" height="10" fill="#FCD34D" opacity={0.6} rx="1" />
            <rect x="172" y={190 + row * 20} width="8" height="10" fill="#FCD34D" opacity={0.5} rx="1" />
            <rect x="186" y={190 + row * 20} width="8" height="10" fill="#FCD34D" opacity={0.7} rx="1" />
            <rect x="198" y={190 + row * 20} width="8" height="10" fill="#FCD34D" opacity={0.4} rx="1" />
          </g>
        ))}
        {/* Green Roof */}
        <rect
          x="148"
          y="176"
          width="64"
          height="6"
          fill="#059669"
          rx="2"
          opacity={v.greenRoofs}
          className="transition-all duration-500"
        />
        {/* Solar panels */}
        <g opacity={v.solarPanels} className="transition-all duration-500">
          <rect x="155" y="170" width="15" height="8" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="174" y="170" width="15" height="8" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="193" y="170" width="15" height="8" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
        </g>
      </g>

      {/* ── Building 2 (medium) ── */}
      <g>
        <rect x="225" y="220" width="50" height="90" fill="#334155" rx="2" />
        {[0, 1, 2, 3].map(row => (
          <g key={`b2-row-${row}`}>
            <rect x="232" y={228 + row * 20} width="7" height="10" fill="#FCD34D" opacity={0.5} rx="1" />
            <rect x="244" y={228 + row * 20} width="7" height="10" fill="#FCD34D" opacity={0.7} rx="1" />
            <rect x="256" y={228 + row * 20} width="7" height="10" fill="#FCD34D" opacity={0.4} rx="1" />
          </g>
        ))}
        <rect
          x="223"
          y="216"
          width="54"
          height="6"
          fill="#059669"
          rx="2"
          opacity={v.greenRoofs}
          className="transition-all duration-500"
        />
        <g opacity={v.solarPanels} className="transition-all duration-500">
          <rect x="228" y="210" width="12" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="244" y="210" width="12" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="260" y="210" width="12" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
        </g>
      </g>

      {/* ── Building 3 (short-wide) ── */}
      <g>
        <rect x="290" y="250" width="70" height="60" fill="#1E293B" rx="2" />
        {[0, 1].map(row => (
          <g key={`b3-row-${row}`}>
            <rect x="298" y={258 + row * 22} width="8" height="12" fill="#FCD34D" opacity={0.6} rx="1" />
            <rect x="314" y={258 + row * 22} width="8" height="12" fill="#FCD34D" opacity={0.5} rx="1" />
            <rect x="330" y={258 + row * 22} width="8" height="12" fill="#FCD34D" opacity={0.7} rx="1" />
            <rect x="346" y={258 + row * 22} width="8" height="12" fill="#FCD34D" opacity={0.4} rx="1" />
          </g>
        ))}
        <rect
          x="288"
          y="246"
          width="74"
          height="6"
          fill="#059669"
          rx="2"
          opacity={v.greenRoofs}
          className="transition-all duration-500"
        />
        <g opacity={v.solarPanels * 0.8} className="transition-all duration-500">
          <rect x="295" y="240" width="18" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="318" y="240" width="18" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="341" y="240" width="18" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
        </g>
      </g>

      {/* ── Building 4 (skyscraper) ── */}
      <g>
        <rect x="380" y="150" width="45" height="160" fill="#334155" rx="2" />
        {[0, 1, 2, 3, 4, 5, 6].map(row => (
          <g key={`b4-row-${row}`}>
            <rect x="386" y={158 + row * 20} width="6" height="10" fill="#FCD34D" opacity={0.5} rx="1" />
            <rect x="396" y={158 + row * 20} width="6" height="10" fill="#FCD34D" opacity={0.7} rx="1" />
            <rect x="406" y={158 + row * 20} width="6" height="10" fill="#FCD34D" opacity={0.4} rx="1" />
            <rect x="416" y={158 + row * 20} width="6" height="10" fill="#FCD34D" opacity={0.6} rx="1" />
          </g>
        ))}
        <rect
          x="378"
          y="146"
          width="49"
          height="6"
          fill="#059669"
          rx="2"
          opacity={v.greenRoofs}
          className="transition-all duration-500"
        />
        <g opacity={v.solarPanels} className="transition-all duration-500">
          <rect x="382" y="139" width="10" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="396" y="139" width="10" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="410" y="139" width="10" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
        </g>
      </g>

      {/* ── Building 5 (medium-right) ── */}
      <g>
        <rect x="440" y="230" width="55" height="80" fill="#1E293B" rx="2" />
        {[0, 1, 2].map(row => (
          <g key={`b5-row-${row}`}>
            <rect x="448" y={238 + row * 22} width="7" height="12" fill="#FCD34D" opacity={0.6} rx="1" />
            <rect x="462" y={238 + row * 22} width="7" height="12" fill="#FCD34D" opacity={0.5} rx="1" />
            <rect x="476" y={238 + row * 22} width="7" height="12" fill="#FCD34D" opacity={0.7} rx="1" />
          </g>
        ))}
        <rect
          x="438"
          y="226"
          width="59"
          height="6"
          fill="#059669"
          rx="2"
          opacity={v.greenRoofs}
          className="transition-all duration-500"
        />
        <g opacity={v.solarPanels * 0.7} className="transition-all duration-500">
          <rect x="443" y="220" width="14" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="461" y="220" width="14" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          <rect x="479" y="220" width="14" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
        </g>
      </g>

      {/* ── Small building (left) ── */}
      <g>
        <rect x="120" y="265" width="30" height="45" fill="#334155" rx="2" />
        <rect x="124" y="272" width="5" height="8" fill="#FCD34D" opacity={0.5} rx="1" />
        <rect x="134" y="272" width="5" height="8" fill="#FCD34D" opacity={0.6} rx="1" />
        <rect x="124" y="286" width="5" height="8" fill="#FCD34D" opacity={0.4} rx="1" />
        <rect x="134" y="286" width="5" height="8" fill="#FCD34D" opacity={0.7} rx="1" />
        <rect
          x="118"
          y="261"
          width="34"
          height="5"
          fill="#059669"
          rx="2"
          opacity={v.greenRoofs}
          className="transition-all duration-500"
        />
      </g>

      {/* ── Small building (far right) ── */}
      <g>
        <rect x="510" y="260" width="35" height="50" fill="#1E293B" rx="2" />
        <rect x="516" y="268" width="6" height="8" fill="#FCD34D" opacity={0.5} rx="1" />
        <rect x="528" y="268" width="6" height="8" fill="#FCD34D" opacity={0.6} rx="1" />
        <rect x="516" y="282" width="6" height="8" fill="#FCD34D" opacity={0.4} rx="1" />
        <rect x="528" y="282" width="6" height="8" fill="#FCD34D" opacity={0.7} rx="1" />
        <rect
          x="508"
          y="256"
          width="39"
          height="5"
          fill="#059669"
          rx="2"
          opacity={v.greenRoofs}
          className="transition-all duration-500"
        />
      </g>

      {/* ── Trees ── */}
      <g className="transition-all duration-500">
        {/* Tree cluster left of buildings */}
        <g opacity={Math.min(1, v.trees * 1.5)}>
          <rect x="133" y="295" width="3" height="15" fill="#78350F" />
          <ellipse cx="134.5" cy="290" rx="8" ry="10" fill="#059669" />
        </g>
        <g opacity={Math.min(1, v.trees * 1.3)}>
          <rect x="113" y="298" width="3" height="12" fill="#78350F" />
          <ellipse cx="114.5" cy="294" rx="7" ry="8" fill="#10B981" />
        </g>
        {/* Trees between buildings */}
        <g opacity={v.trees}>
          <rect x="217" y="297" width="3" height="13" fill="#78350F" />
          <ellipse cx="218.5" cy="292" rx="7" ry="9" fill="#059669" />
        </g>
        <g opacity={Math.min(1, v.trees * 1.2)}>
          <rect x="365" y="298" width="3" height="12" fill="#78350F" />
          <ellipse cx="366.5" cy="293" rx="6" ry="8" fill="#10B981" />
        </g>
        {/* Trees right side */}
        <g opacity={v.trees}>
          <rect x="498" y="296" width="3" height="14" fill="#78350F" />
          <ellipse cx="499.5" cy="291" rx="8" ry="10" fill="#059669" />
        </g>
        {/* Extra trees that appear at higher coverage */}
        {v.trees > 0.3 && (
          <>
            <g opacity={(v.trees - 0.3) * 1.5}>
              <rect x="555" y="296" width="3" height="14" fill="#78350F" />
              <ellipse cx="556.5" cy="291" rx="7" ry="9" fill="#34D399" />
            </g>
            <g opacity={(v.trees - 0.3) * 1.5}>
              <rect x="100" y="300" width="2" height="10" fill="#78350F" />
              <ellipse cx="101" cy="296" rx="5" ry="7" fill="#34D399" />
            </g>
          </>
        )}
        {v.trees > 0.5 && (
          <>
            <g opacity={(v.trees - 0.5) * 2}>
              <rect x="278" y="298" width="3" height="12" fill="#78350F" />
              <ellipse cx="279.5" cy="293" rx="6" ry="8" fill="#059669" />
            </g>
            <g opacity={(v.trees - 0.5) * 2}>
              <rect x="430" y="297" width="3" height="13" fill="#78350F" />
              <ellipse cx="431.5" cy="292" rx="7" ry="9" fill="#10B981" />
            </g>
          </>
        )}
        {v.trees > 0.7 && (
          <>
            <g opacity={(v.trees - 0.7) * 3}>
              <rect x="573" y="298" width="2" height="12" fill="#78350F" />
              <ellipse cx="574" cy="294" rx="6" ry="7" fill="#059669" />
            </g>
            <g opacity={(v.trees - 0.7) * 3}>
              <rect x="75" y="300" width="2" height="10" fill="#78350F" />
              <ellipse cx="76" cy="296" rx="5" ry="7" fill="#34D399" />
            </g>
          </>
        )}
      </g>

      {/* ── Bikes on the road ── */}
      <g className="transition-all duration-500">
        <g opacity={v.bikes}>
          <circle cx="200" cy="322" r="4" fill="none" stroke="#84CC16" strokeWidth="1.5" />
          <circle cx="210" cy="322" r="4" fill="none" stroke="#84CC16" strokeWidth="1.5" />
          <line x1="200" y1="322" x2="205" y2="316" stroke="#84CC16" strokeWidth="1.5" />
          <line x1="205" y1="316" x2="210" y2="322" stroke="#84CC16" strokeWidth="1.5" />
          <line x1="205" y1="316" x2="205" y2="313" stroke="#84CC16" strokeWidth="1" />
        </g>
        {v.bikes > 0.3 && (
          <g opacity={(v.bikes - 0.3) * 1.5}>
            <circle cx="340" cy="322" r="4" fill="none" stroke="#A3E635" strokeWidth="1.5" />
            <circle cx="350" cy="322" r="4" fill="none" stroke="#A3E635" strokeWidth="1.5" />
            <line x1="340" y1="322" x2="345" y2="316" stroke="#A3E635" strokeWidth="1.5" />
            <line x1="345" y1="316" x2="350" y2="322" stroke="#A3E635" strokeWidth="1.5" />
            <line x1="345" y1="316" x2="345" y2="313" stroke="#A3E635" strokeWidth="1" />
          </g>
        )}
        {v.bikes > 0.6 && (
          <g opacity={(v.bikes - 0.6) * 2.5}>
            <circle cx="470" cy="322" r="4" fill="none" stroke="#84CC16" strokeWidth="1.5" />
            <circle cx="480" cy="322" r="4" fill="none" stroke="#84CC16" strokeWidth="1.5" />
            <line x1="470" y1="322" x2="475" y2="316" stroke="#84CC16" strokeWidth="1.5" />
            <line x1="475" y1="316" x2="480" y2="322" stroke="#84CC16" strokeWidth="1.5" />
            <line x1="475" y1="316" x2="475" y2="313" stroke="#84CC16" strokeWidth="1" />
          </g>
        )}
      </g>

      {/* ── Water Features ── */}
      <g className="transition-all duration-500">
        {v.waterFeatures > 0 && (
          <g opacity={v.waterFeatures}>
            <ellipse cx="80" cy="365" rx="30" ry="8" fill="url(#waterGrad)" opacity={0.7} />
            <ellipse cx="80" cy="363" rx="26" ry="5" fill="#38BDF8" opacity={0.3} />
          </g>
        )}
        {v.waterFeatures > 0.4 && (
          <g opacity={(v.waterFeatures - 0.4) * 1.7}>
            <ellipse cx="530" cy="370" rx="25" ry="7" fill="url(#waterGrad)" opacity={0.7} />
            <ellipse cx="530" cy="368" rx="21" ry="4" fill="#38BDF8" opacity={0.3} />
          </g>
        )}
      </g>

      {/* ── Recycling Bins ── */}
      <g className="transition-all duration-500">
        {v.recyclingBins > 0 && (
          <g opacity={v.recyclingBins}>
            <rect x="243" y="340" width="6" height="8" fill="#22C55E" rx="1" />
            <rect x="242" y="338" width="8" height="3" fill="#16A34A" rx="1" />
          </g>
        )}
        {v.recyclingBins > 0.3 && (
          <g opacity={(v.recyclingBins - 0.3) * 1.5}>
            <rect x="383" y="340" width="6" height="8" fill="#3B82F6" rx="1" />
            <rect x="382" y="338" width="8" height="3" fill="#2563EB" rx="1" />
          </g>
        )}
        {v.recyclingBins > 0.5 && (
          <g opacity={(v.recyclingBins - 0.5) * 2}>
            <rect x="163" y="340" width="6" height="8" fill="#EAB308" rx="1" />
            <rect x="162" y="338" width="8" height="3" fill="#CA8A04" rx="1" />
          </g>
        )}
        {v.recyclingBins > 0.7 && (
          <g opacity={(v.recyclingBins - 0.7) * 3.3}>
            <rect x="503" y="340" width="6" height="8" fill="#22C55E" rx="1" />
            <rect x="502" y="338" width="8" height="3" fill="#16A34A" rx="1" />
          </g>
        )}
      </g>

      {/* ── Foreground grass patches ── */}
      <g opacity={Math.min(1, 0.3 + v.trees * 0.7)} className="transition-all duration-500">
        <ellipse cx="60" cy="385" rx="40" ry="6" fill="#065F46" opacity={0.4} />
        <ellipse cx="180" cy="390" rx="35" ry="5" fill="#065F46" opacity={0.3} />
        <ellipse cx="450" cy="388" rx="45" ry="6" fill="#065F46" opacity={0.35} />
        <ellipse cx="560" cy="392" rx="30" ry="5" fill="#065F46" opacity={0.3} />
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUSTAINABILITY GAUGE
   ═══════════════════════════════════════════════════════════ */

function SustainabilityGauge({ score }: { score: number }) {
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-semibold text-[#A3E635] uppercase tracking-wider">Sustainability Index</p>
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          {/* Background track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#1a2e1a"
            strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums transition-colors duration-500"
            style={{ color }}
          >
            {score}
          </span>
          <span className="text-xs text-[#E8E5E0] transition-colors duration-500">{label}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PARAMETER SLIDER
   ═══════════════════════════════════════════════════════════ */

function ParamSlider({
  config,
  value,
  onChange,
}: {
  config: SliderConfig;
  value: number;
  onChange: (key: keyof CityParameters, value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={`slider-${config.key}`} className="flex items-center gap-2 text-sm font-medium text-[#E8E5E0]">
          {config.icon}
          {config.label}
        </label>
        <span className="text-sm font-bold tabular-nums text-[#A3E635]">{value}%</span>
      </div>
      <input
        id={`slider-${config.key}`}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={e => onChange(config.key, Number(e.target.value))}
        className="city-slider w-full h-2 rounded-full appearance-none cursor-pointer bg-[#1a2e1a] outline-none focus-visible:ring-2 focus-visible:ring-[#A3E635] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1B0D]"
        aria-label={`${config.label}: ${value}%`}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   INDICATOR CARD
   ═══════════════════════════════════════════════════════════ */

function IndicatorCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) {
  const color = getScoreColor(value);

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-medium text-[#E8E5E0]/70">{label}</span>
        <span className="text-lg font-bold tabular-nums" style={{ color }}>
          {value}
          <span className="text-xs font-normal text-[#E8E5E0]/50">{unit}</span>
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-[#1a2e1a] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COMPARISON VIEW
   ═══════════════════════════════════════════════════════════ */

function ComparisonView({
  baseline,
  current,
}: {
  baseline: SimulationResult;
  current: SimulationResult;
}) {
  const comparisons: { label: string; baselineKey: keyof SimulationResult['indicators']; }[] = [
    { label: 'CO₂ Reduction', baselineKey: 'co2ReductionPercent' },
    { label: 'Air Quality', baselineKey: 'airQualityIndex' },
    { label: 'Biodiversity', baselineKey: 'biodiversityScore' },
    { label: 'Livability', baselineKey: 'livabilityScore' },
    { label: 'Resource Efficiency', baselineKey: 'resourceEfficiency' },
    { label: 'Climate Resilience', baselineKey: 'climateResilience' },
  ];

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[#E8E5E0]">Comparison</h4>
        <div className="flex items-center gap-4 text-xs text-[#E8E5E0]/60">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#6B7280]" /> Baseline
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-[#A3E635]" /> Your City
          </span>
        </div>
      </div>
      <div className="space-y-4">
        {comparisons.map(({ label, baselineKey }) => {
          const bVal = baseline.indicators[baselineKey];
          const cVal = current.indicators[baselineKey];
          const delta = cVal - bVal;
          const sign = delta > 0 ? '+' : '';
          const deltaColor = delta > 0 ? '#10B981' : delta < 0 ? '#EF4444' : '#6B7280';

          return (
            <div key={baselineKey}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#E8E5E0]/70">{label}</span>
                <span
                  className="text-xs font-bold tabular-nums"
                  style={{ color: deltaColor }}
                >
                  {sign}{delta}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-[#1a2e1a] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#6B7280] transition-all duration-500"
                    style={{ width: `${bVal}%` }}
                  />
                </div>
                <div className="flex-1 h-2 rounded-full bg-[#1a2e1a] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#A3E635] transition-all duration-500"
                    style={{ width: `${cVal}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] tabular-nums text-[#6B7280]">{bVal}</span>
                <span className="text-[10px] tabular-nums text-[#A3E635]/80">{cVal}</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Overall index comparison */}
      <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#E8E5E0]">Overall Index</span>
        <div className="flex items-center gap-3">
          <span className="text-sm tabular-nums text-[#6B7280]">{baseline.sustainabilityIndex}</span>
          <span className="text-sm font-bold" style={{ color: '#A3E635' }}>→</span>
          <span
            className="text-lg font-bold tabular-nums"
            style={{ color: getScoreColor(current.sustainabilityIndex) }}
          >
            {current.sustainabilityIndex}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLIDER CSS (injected inline)
   ═══════════════════════════════════════════════════════════ */

const SLIDER_STYLES = `
  .city-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #A3E635;
    cursor: pointer;
    border: 2px solid #0D1B0D;
    box-shadow: 0 0 6px rgba(163,230,53,0.4);
    transition: box-shadow 0.2s;
  }
  .city-slider::-webkit-slider-thumb:hover {
    box-shadow: 0 0 12px rgba(163,230,53,0.7);
  }
  .city-slider::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #A3E635;
    cursor: pointer;
    border: 2px solid #0D1B0D;
    box-shadow: 0 0 6px rgba(163,230,53,0.4);
    transition: box-shadow 0.2s;
  }
  .city-slider::-moz-range-thumb:hover {
    box-shadow: 0 0 12px rgba(163,230,53,0.7);
  }
  .city-slider::-webkit-slider-runnable-track {
    background: linear-gradient(to right, #059669, #A3E635);
    height: 8px;
    border-radius: 9999px;
  }
  .city-slider::-moz-range-track {
    background: linear-gradient(to right, #059669, #A3E635);
    height: 8px;
    border-radius: 9999px;
  }
  @media (prefers-reduced-motion: reduce) {
    .city-slider::-webkit-slider-thumb,
    .city-slider::-moz-range-thumb {
      transition: none;
    }
  }
`;

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function CityLab() {
  const [params, setParams] = useState<CityParameters>({ ...DEFAULT_PARAMS });
  const [compareMode, setCompareMode] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>('current');

  const simulation = useMemo(() => calculateSimulation(params), [params]);
  const baseline = useMemo(() => calculateSimulation(DEFAULT_PARAMS), []);

  const handleSliderChange = useCallback((key: keyof CityParameters, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setActivePreset(null);
  }, []);

  const handlePreset = useCallback((presetKey: string) => {
    setParams({ ...PRESETS[presetKey].params });
    setActivePreset(presetKey);
  }, []);

  const handleReset = useCallback(() => {
    setParams({ ...DEFAULT_PARAMS });
    setActivePreset('current');
  }, []);

  return (
    <section
      id="city-lab"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#0D1B0D' }}
    >
      {/* Inject slider styles */}
      <style dangerouslySetInnerHTML={{ __html: SLIDER_STYLES }} />

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.header
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0] mb-4">
            Future City{' '}
            <span className="bg-gradient-to-r from-[#059669] via-[#10B981] to-[#A3E635] bg-clip-text text-transparent">
              Lab
            </span>
          </h2>
          <p className="text-lg text-[#E8E5E0]/70 max-w-2xl mx-auto mb-2">
            Design your sustainable city. Adjust parameters and watch the impact unfold.
          </p>
          <p className="text-xs text-[#E8E5E0]/40 max-w-xl mx-auto">
            All simulation figures are illustrative and do not represent actual environmental measurements.
          </p>
        </motion.header>

        {/* ── Main Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* ── LEFT PANEL: Controls + Gauge ── */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            {/* Controls Card */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-[#A3E635] uppercase tracking-wider mb-5">
                City Parameters
              </h3>

              {/* Sliders */}
              <div className="space-y-5">
                {SLIDERS.map(slider => (
                  <ParamSlider
                    key={slider.key}
                    config={slider}
                    value={params[slider.key]}
                    onChange={handleSliderChange}
                  />
                ))}
              </div>

              {/* Presets */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <p className="text-xs text-[#E8E5E0]/50 mb-3">Presets</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PRESET_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handlePreset(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                        activePreset === key
                          ? 'bg-[#A3E635] text-[#0A1F0A]'
                          : 'bg-white/5 text-[#E8E5E0]/70 hover:bg-white/10 hover:text-[#E8E5E0]'
                      }`}
                      aria-pressed={activePreset === key}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-[#E8E5E0]/50 hover:bg-white/10 hover:text-[#E8E5E0] transition-colors duration-200"
                  >
                    ↺ Reset
                  </button>
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                      compareMode
                        ? 'bg-[#059669] text-white'
                        : 'bg-white/5 text-[#E8E5E0]/50 hover:bg-white/10 hover:text-[#E8E5E0]'
                    }`}
                    aria-pressed={compareMode}
                  >
                    {compareMode ? '✕ Close Compare' : '⇄ Compare'}
                  </button>
                </div>
              </div>
            </div>

            {/* Sustainability Gauge (visible on desktop) */}
            <div className="hidden lg:flex rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm items-center justify-center">
              <SustainabilityGauge score={simulation.sustainabilityIndex} />
            </div>
          </motion.div>

          {/* ── RIGHT PANEL: City Visualization ── */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            {/* City SVG */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 backdrop-blur-sm overflow-hidden">
              <CityVisualization result={simulation} />
            </div>

            {/* Sustainability Gauge (mobile only) */}
            <div className="flex lg:hidden rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm items-center justify-center">
              <SustainabilityGauge score={simulation.sustainabilityIndex} />
            </div>

            {/* Comparison view (when enabled) */}
            {compareMode && (
              <ComparisonView baseline={baseline} current={simulation} />
            )}
          </motion.div>
        </div>

        {/* ── INDICATORS PANEL ── */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        >
          <h3 className="text-sm font-semibold text-[#A3E635] uppercase tracking-wider mb-5 text-center">
            Impact Indicators
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INDICATORS.map(({ key, label, unit }) => (
              <IndicatorCard
                key={key}
                label={label}
                value={simulation.indicators[key]}
                unit={unit}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
