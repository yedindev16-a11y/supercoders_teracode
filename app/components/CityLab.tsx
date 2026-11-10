'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  type CityParameters,
  type SimulationResult,
  PRESETS,
  getScoreLabel,
  getScoreColor,
} from '../lib/simulation';
import { useCity } from '../context/CityContext';

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
  ecotopia: 'Ecotopia 2050',
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
  if (score < 50) {
    return lerpColor('#4A4036', '#475569', score / 50);
  }
  return lerpColor('#475569', '#0284C7', (score - 50) / 50);
}

function getSkyGradientBottom(score: number): string {
  if (score < 50) {
    return lerpColor('#2E2620', '#334155', score / 50);
  }
  return lerpColor('#334155', '#0D9488', (score - 50) / 50);
}

// Canal water color transitions from murky to crystalline emerald-blue
function getCanalWaterColor(waterConservation: number): { stop0: string; stop1: string } {
  const t = Math.min(1, Math.max(0, waterConservation / 100));
  // Murky algae tone: #3B4A3F to vibrant backwater emerald/teal: #0D9488 / #0284C7
  return {
    stop0: lerpColor('#334139', '#0F766E', t),
    stop1: lerpColor('#3A4B40', '#0284C7', t),
  };
}

/* ═══════════════════════════════════════════════════════════
   KERALA 2040 STYLIZED COCONUT PALM (Kera)
   ═══════════════════════════════════════════════════════════ */

function CoconutPalm({
  x,
  y,
  scale = 1,
  opacity = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity} className="transition-all duration-700">
      {/* Slender curved trunk */}
      <path
        d="M 0 0 Q 6 -20 10 -42 Q 13 -48 14 -52"
        fill="none"
        stroke="#78350F"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Trunk rings */}
      <line x1="2" y1="-12" x2="5" y2="-11" stroke="#92400E" strokeWidth="1.2" />
      <line x1="5" y1="-25" x2="8" y2="-24" stroke="#92400E" strokeWidth="1.2" />
      <line x1="9" y1="-38" x2="12" y2="-37" stroke="#92400E" strokeWidth="1.2" />

      {/* Palm fronds radiating gracefully */}
      <g transform="translate(14, -52)">
        {/* Left fronds */}
        <path d="M 0 0 Q -15 -12 -28 -4" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 0 0 Q -18 -4 -26 8" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 0 0 Q -12 -18 -18 -24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
        
        {/* Right fronds */}
        <path d="M 0 0 Q 15 -14 28 -6" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 0 0 Q 18 -4 26 7" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M 0 0 Q 10 -18 16 -24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />

        {/* Small golden coconut cluster */}
        <circle cx="-1" cy="2" r="2.2" fill="#D97706" />
        <circle cx="2" cy="1" r="2.2" fill="#B45309" />
        <circle cx="1" cy="4" r="2" fill="#D97706" />
      </g>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════
   CITY VISUALIZATION (SVG) — Enhanced with Kerala 2040 Touches
   ═══════════════════════════════════════════════════════════ */

function CityVisualization({ result }: { result: SimulationResult }) {
  const v = result.cityVisualState;
  const score = result.sustainabilityIndex;
  const skyTop = getSkyColor(score);
  const skyBottom = getSkyGradientBottom(score);
  const canalColors = getCanalWaterColor(v.waterFeatures * 100);

  return (
    <div className="relative w-full">
      <svg
        viewBox="0 0 600 400"
        className="w-full h-auto max-h-[460px] select-none"
        aria-label="Interactive Kerala 2040 sustainable city visualization"
        role="img"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop} className="transition-all duration-700" />
            <stop offset="100%" stopColor={skyBottom} className="transition-all duration-700" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#132313" />
            <stop offset="100%" stopColor="#0A160A" />
          </linearGradient>
          <linearGradient id="backwaterCanalGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={canalColors.stop0} className="transition-all duration-700" />
            <stop offset="100%" stopColor={canalColors.stop1} className="transition-all duration-700" />
          </linearGradient>
          <linearGradient id="keralaSolarRoof" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="600" height="270" fill="url(#skyGrad)" className="transition-all duration-700" />

        {/* Distant misty Western Ghats mountain silhouette */}
        <path
          d="M 0 250 Q 80 200 160 230 Q 240 180 340 225 Q 440 190 520 220 Q 560 210 600 235 L 600 270 L 0 270 Z"
          fill="#1E293B"
          opacity={0.35}
          className="transition-all duration-700"
        />

        {/* Sun/Moon based on score */}
        <circle
          cx="520"
          cy="55"
          r={24 + score * 0.08}
          fill={score > 40 ? '#FCD34D' : '#9CA3AF'}
          opacity={0.85}
          className="transition-all duration-700"
        />

        {/* Clouds - fewer with higher score */}
        <g opacity={Math.max(0.1, 1 - score / 85)} className="transition-all duration-700">
          <ellipse cx="120" cy="55" rx="38" ry="14" fill="#94A3B8" opacity={0.45} />
          <ellipse cx="145" cy="50" rx="28" ry="11" fill="#94A3B8" opacity={0.45} />
          <ellipse cx="360" cy="40" rx="35" ry="12" fill="#94A3B8" opacity={0.35} />
          <ellipse cx="390" cy="36" rx="26" ry="10" fill="#94A3B8" opacity={0.35} />
        </g>

        {/* ── Wind Turbines (Coastal & hill breeze arrays) ── */}
        {v.windTurbines > 0 && (
          <g opacity={v.windTurbines} className="transition-all duration-500">
            <rect x="45" y="150" width="3.5" height="120" fill="#E2E8F0" rx="1" />
            <circle cx="46.75" cy="150" r="3" fill="#F8FAFC" />
            <line x1="46.75" y1="150" x2="46.75" y2="115" stroke="#F8FAFC" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="46.75" y1="150" x2="72" y2="168" stroke="#F8FAFC" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="46.75" y1="150" x2="22" y2="168" stroke="#F8FAFC" strokeWidth="2.8" strokeLinecap="round" />
          </g>
        )}
        {v.windTurbines > 0.35 && (
          <g opacity={Math.min(1, (v.windTurbines - 0.35) * 2)} className="transition-all duration-500">
            <rect x="85" y="165" width="3" height="105" fill="#CBD5E1" rx="1" />
            <circle cx="86.5" cy="165" r="2.5" fill="#E2E8F0" />
            <line x1="86.5" y1="165" x2="86.5" y2="135" stroke="#E2E8F0" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="86.5" y1="165" x2="108" y2="180" stroke="#E2E8F0" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="86.5" y1="165" x2="65" y2="180" stroke="#E2E8F0" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        )}

        {/* ── Ground Base ── */}
        <rect x="0" y="270" width="600" height="130" fill="url(#groundGrad)" />

        {/* ── Building 1 (High-tech residential hub with sloped Kerala gable solar roof) ── */}
        <g>
          <rect x="145" y="180" width="65" height="90" fill="#1E293B" rx="2" />
          {/* Windows */}
          {[0, 1, 2, 3].map(row => (
            <g key={`b1-row-${row}`}>
              <rect x="154" y={192 + row * 18} width="9" height="10" fill="#FCD34D" opacity={0.65} rx="1" />
              <rect x="168" y={192 + row * 18} width="9" height="10" fill="#FCD34D" opacity={0.5} rx="1" />
              <rect x="182" y={192 + row * 18} width="9" height="10" fill="#FCD34D" opacity={0.7} rx="1" />
              <rect x="195" y={192 + row * 18} width="9" height="10" fill="#FCD34D" opacity={0.45} rx="1" />
            </g>
          ))}
          {/* Traditional-Modern Kerala Sloped Gable Roof with integrated CIAL-style Solar Arrays */}
          <polygon points="140,180 177.5,155 215,180" fill="#0F172A" stroke="#334155" strokeWidth="1" />
          <polygon
            points="144,178 177.5,158 211,178"
            fill="url(#keralaSolarRoof)"
            opacity={Math.min(1, 0.2 + v.solarPanels * 0.8)}
            className="transition-all duration-500"
          />
          {/* Solar cell gridlines */}
          <g opacity={v.solarPanels} className="transition-all duration-500">
            <line x1="160" y1="178" x2="177.5" y2="158" stroke="#60A5FA" strokeWidth="0.75" />
            <line x1="195" y1="178" x2="177.5" y2="158" stroke="#60A5FA" strokeWidth="0.75" />
          </g>
          {/* Vertical bio-garden strip */}
          <rect x="142" y="195" width="3" height="70" fill="#10B981" opacity={v.greenRoofs} />
        </g>

        {/* ── Building 2 (Medium R&D Facility) ── */}
        <g>
          <rect x="225" y="215" width="50" height="55" fill="#334155" rx="2" />
          {[0, 1].map(row => (
            <g key={`b2-row-${row}`}>
              <rect x="233" y={226 + row * 18} width="7" height="9" fill="#FCD34D" opacity={0.6} rx="1" />
              <rect x="246" y={226 + row * 18} width="7" height="9" fill="#FCD34D" opacity={0.75} rx="1" />
              <rect x="259" y={226 + row * 18} width="7" height="9" fill="#FCD34D" opacity={0.4} rx="1" />
            </g>
          ))}
          {/* Green Roof Canopy */}
          <rect x="222" y="210" width="56" height="6" fill="#059669" rx="2" opacity={v.greenRoofs} />
          {/* Flat rooftop solar mounts */}
          <g opacity={v.solarPanels * 0.9} className="transition-all duration-500">
            <rect x="228" y="204" width="12" height="6" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
            <rect x="244" y="204" width="12" height="6" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
            <rect x="260" y="204" width="12" height="6" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          </g>
        </g>

        {/* ── Building 3 (Circular Waste & Material Recovery Center) ── */}
        <g>
          <rect x="290" y="235" width="70" height="35" fill="#1E293B" rx="2" />
          <rect x="300" y="244" width="12" height="12" fill="#FCD34D" opacity={0.5} rx="1" />
          <rect x="320" y="244" width="12" height="12" fill="#FCD34D" opacity={0.7} rx="1" />
          <rect x="340" y="244" width="12" height="12" fill="#FCD34D" opacity={0.5} rx="1" />
          {/* Sloped solar overhang */}
          <polygon points="287,235 325,223 363,235" fill="url(#keralaSolarRoof)" opacity={v.solarPanels} />
          {/* Circular recycling logo */}
          <circle cx="325" cy="250" r="5" fill="none" stroke="#22C55E" strokeWidth="1.2" opacity={v.recyclingBins} />
        </g>

        {/* ── Building 4 (Tower with Vertical Forest) ── */}
        <g>
          <rect x="375" y="145" width="48" height="125" fill="#334155" rx="2" />
          {[0, 1, 2, 3, 4, 5].map(row => (
            <g key={`b4-row-${row}`}>
              <rect x="382" y={155 + row * 18} width="7" height="9" fill="#FCD34D" opacity={0.5} rx="1" />
              <rect x="395" y={155 + row * 18} width="7" height="9" fill="#FCD34D" opacity={0.7} rx="1" />
              <rect x="408" y={155 + row * 18} width="7" height="9" fill="#FCD34D" opacity={0.5} rx="1" />
            </g>
          ))}
          {/* Rooftop garden & solar */}
          <rect x="373" y="140" width="52" height="6" fill="#059669" rx="2" opacity={v.greenRoofs} />
          <g opacity={v.solarPanels} className="transition-all duration-500">
            <rect x="378" y="133" width="11" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
            <rect x="393" y="133" width="11" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
            <rect x="408" y="133" width="11" height="7" fill="#2563EB" rx="1" stroke="#1D4ED8" strokeWidth="0.5" />
          </g>
        </g>

        {/* ── Building 5 (Medium commercial & civic hub) ── */}
        <g>
          <rect x="440" y="210" width="60" height="60" fill="#1E293B" rx="2" />
          {[0, 1].map(row => (
            <g key={`b5-row-${row}`}>
              <rect x="450" y={222 + row * 18} width="8" height="10" fill="#FCD34D" opacity={0.6} rx="1" />
              <rect x="466" y={222 + row * 18} width="8" height="10" fill="#FCD34D" opacity={0.5} rx="1" />
              <rect x="482" y={222 + row * 18} width="8" height="10" fill="#FCD34D" opacity={0.7} rx="1" />
            </g>
          ))}
          {/* Sloped Kerala roof style */}
          <polygon points="436,210 470,195 504,210" fill="url(#keralaSolarRoof)" opacity={Math.min(1, 0.2 + v.solarPanels * 0.8)} />
        </g>

        {/* ── Urban Transit Boulevard (Road + Clean Electric Tram corridor) ── */}
        <rect x="0" y="285" width="600" height="28" fill="#1F2937" />
        <line x1="0" y1="299" x2="600" y2="299" stroke="#4B5563" strokeWidth="1" strokeDasharray="16 12" />

        {/* Electric Tram Rails & Overhead catenary lines */}
        <g opacity={Math.min(1, v.buses * 1.3)} className="transition-all duration-500">
          <line x1="0" y1="287" x2="600" y2="287" stroke="#94A3B8" strokeWidth="0.75" />
          <line x1="0" y1="291" x2="600" y2="291" stroke="#94A3B8" strokeWidth="0.75" />
          {/* Modern Zero-Emission Light Tram */}
          <rect x="360" y="282" width="65" height="13" fill="#059669" rx="2.5" />
          <rect x="364" y="284" width="12" height="6" fill="#E2E8F0" rx="1" />
          <rect x="380" y="284" width="14" height="6" fill="#E2E8F0" rx="1" />
          <rect x="398" y="284" width="14" height="6" fill="#E2E8F0" rx="1" />
          <rect x="415" y="284" width="7" height="6" fill="#E2E8F0" rx="1" />
          {/* Pantograph contact on tram */}
          <line x1="390" y1="282" x2="395" y2="276" stroke="#D4FF00" strokeWidth="1.2" />
        </g>

        {/* Active Cyclists */}
        <g className="transition-all duration-500">
          <g opacity={v.bikes}>
            <circle cx="180" cy="305" r="3.5" fill="none" stroke="#D4FF00" strokeWidth="1.2" />
            <circle cx="189" cy="305" r="3.5" fill="none" stroke="#D4FF00" strokeWidth="1.2" />
            <line x1="180" y1="305" x2="185" y2="299" stroke="#D4FF00" strokeWidth="1.2" />
            <line x1="185" y1="299" x2="189" y2="305" stroke="#D4FF00" strokeWidth="1.2" />
          </g>
          {v.bikes > 0.4 && (
            <g opacity={(v.bikes - 0.4) * 1.6}>
              <circle cx="490" cy="305" r="3.5" fill="none" stroke="#A3E635" strokeWidth="1.2" />
              <circle cx="499" cy="305" r="3.5" fill="none" stroke="#A3E635" strokeWidth="1.2" />
              <line x1="490" y1="305" x2="495" y2="299" stroke="#A3E635" strokeWidth="1.2" />
              <line x1="495" y1="299" x2="499" y2="305" stroke="#A3E635" strokeWidth="1.2" />
            </g>
          )}
        </g>

        {/* ── KERALA 2040 BACKWATER CANAL (Vembanad / Kochi Water Corridor) ── */}
        {/* Canal banks */}
        <rect x="0" y="328" width="600" height="48" fill="url(#backwaterCanalGrad)" className="transition-all duration-700" />
        {/* Granite stone promenade edge (Kallu kettu) */}
        <line x1="0" y1="328" x2="600" y2="328" stroke="#334155" strokeWidth="2.5" />
        <line x1="0" y1="376" x2="600" y2="376" stroke="#1E293B" strokeWidth="2" />

        {/* Gentle water ripples (opacity increases as water clears) */}
        <g opacity={Math.min(0.7, 0.15 + v.waterFeatures * 0.55)} className="transition-all duration-700">
          <path d="M 30 338 Q 60 335 90 338 T 150 338" fill="none" stroke="#E0F2FE" strokeWidth="0.8" opacity={0.6} />
          <path d="M 220 348 Q 255 345 290 348 T 360 348" fill="none" stroke="#E0F2FE" strokeWidth="0.8" opacity={0.5} />
          <path d="M 420 340 Q 450 337 480 340 T 540 340" fill="none" stroke="#E0F2FE" strokeWidth="0.8" opacity={0.6} />
          <path d="M 120 362 Q 160 359 200 362 T 280 362" fill="none" stroke="#E0F2FE" strokeWidth="0.8" opacity={0.4} />
          <path d="M 380 364 Q 420 361 460 364 T 530 364" fill="none" stroke="#E0F2FE" strokeWidth="0.8" opacity={0.5} />
        </g>

        {/* ── KOCHI-STYLE SOLAR ELECTRIC WATER METRO CATAMARAN ── */}
        <g opacity={Math.min(1, 0.4 + v.buses * 0.8)} className="transition-all duration-700">
          {/* E-Boat hull */}
          <path
            d="M 230 354 L 275 354 Q 285 354 290 350 L 295 345 L 225 345 Z"
            fill="#F8FAFC"
            stroke="#0F766E"
            strokeWidth="1"
          />
          {/* Emerald accent waterline stripe */}
          <line x1="227" y1="352" x2="284" y2="352" stroke="#10B981" strokeWidth="1.5" />
          {/* Cabin & windows */}
          <rect x="236" y="338" width="44" height="7" fill="#0F172A" rx="1.5" />
          <rect x="240" y="340" width="8" height="3.5" fill="#38BDF8" rx="0.5" />
          <rect x="252" y="340" width="8" height="3.5" fill="#38BDF8" rx="0.5" />
          <rect x="264" y="340" width="8" height="3.5" fill="#38BDF8" rx="0.5" />
          {/* Rooftop solar canopy on boat */}
          <rect x="234" y="336" width="48" height="2" fill="#2563EB" />
          {/* Zero-emission wake ripple */}
          <path d="M 223 353 Q 212 355 200 354" fill="none" stroke="#99F6E4" strokeWidth="1" opacity={0.6} />
        </g>

        {/* ── KERALA COCONUT PALMS (Kera canopy scaling with Green Coverage) ── */}
        <CoconutPalm x={35} y={328} scale={0.85 + v.trees * 0.25} opacity={Math.min(1, 0.4 + v.trees * 0.8)} />
        <CoconutPalm x={95} y={328} scale={0.75 + v.trees * 0.3} opacity={Math.min(1, 0.3 + v.trees * 0.9)} />
        {v.trees > 0.25 && (
          <CoconutPalm x={280} y={328} scale={0.7 + v.trees * 0.3} opacity={(v.trees - 0.25) * 1.4} />
        )}
        {v.trees > 0.45 && (
          <CoconutPalm x={430} y={328} scale={0.8 + v.trees * 0.25} opacity={(v.trees - 0.45) * 1.8} />
        )}
        {v.trees > 0.65 && (
          <>
            <CoconutPalm x={515} y={328} scale={0.75 + v.trees * 0.25} opacity={(v.trees - 0.65) * 2.5} />
            <CoconutPalm x={565} y={328} scale={0.85 + v.trees * 0.2} opacity={(v.trees - 0.65) * 2.5} />
          </>
        )}

        {/* ── Standard Shrubbery & Native Bio-Belts ── */}
        <g className="transition-all duration-500">
          <ellipse cx="60" cy="388" rx="35" ry="6" fill="#047857" opacity={0.4} />
          <ellipse cx="180" cy="392" rx="30" ry="5" fill="#047857" opacity={0.35} />
          <ellipse cx="460" cy="390" rx="40" ry="6" fill="#047857" opacity={0.4} />
          <ellipse cx="560" cy="393" rx="25" ry="5" fill="#047857" opacity={0.35} />
        </g>

        {/* ── Waste Circularity Nodes (Smart Sorting Stations) ── */}
        <g className="transition-all duration-500">
          <g opacity={Math.min(1, v.recyclingBins * 1.4)}>
            <rect x="135" y="318" width="5" height="7" fill="#22C55E" rx="1" />
            <rect x="142" y="318" width="5" height="7" fill="#3B82F6" rx="1" />
          </g>
          {v.recyclingBins > 0.4 && (
            <g opacity={(v.recyclingBins - 0.4) * 1.8}>
              <rect x="470" y="318" width="5" height="7" fill="#22C55E" rx="1" />
              <rect x="477" y="318" width="5" height="7" fill="#EAB308" rx="1" />
            </g>
          )}
        </g>
      </svg>

      {/* Subtle Kerala 2040 Tech Badge overlay */}
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded-lg border border-white/10 bg-[#0A1F0A]/80 px-2.5 py-1 text-[10px] font-mono backdrop-blur-md">
        <span className="h-1.5 w-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
        <span className="text-[#A3E635] font-semibold">KERALA 2040 MODEL</span>
        <span className="text-white/40 hidden sm:inline">• Water Metro & CIAL Solar Grid</span>
      </div>
    </div>
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
          <span className="text-[10px] text-[#E8E5E0]/60 uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <span
        className="px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-500"
        style={{
          color,
          backgroundColor: `${color}18`,
          borderColor: `${color}40`,
          borderWidth: 1,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PARAM SLIDER
   ═══════════════════════════════════════════════════════════ */

function ParamSlider({
  config,
  value,
  onChange,
}: {
  config: SliderConfig;
  value: number;
  onChange: (key: keyof CityParameters, val: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {config.icon}
          <label htmlFor={`slider-${config.key}`} className="text-sm font-medium text-[#F5F5F0]">
            {config.label}
          </label>
        </div>
        <span className="text-sm font-mono font-semibold text-[#A3E635] tabular-nums">
          {value}%
        </span>
      </div>
      <input
        id={`slider-${config.key}`}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={e => onChange(config.key, Number(e.target.value))}
        className="w-full accent-[#84CC16] bg-[#1a2e1a] h-2 rounded-lg cursor-pointer"
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
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[#E8E5E0]/70">{label}</span>
        <span className="text-sm font-mono font-bold tabular-nums" style={{ color }}>
          {value}
          <span className="text-xs text-[#E8E5E0]/40 ml-0.5">{unit}</span>
        </span>
      </div>
      {/* Mini bar */}
      <div className="h-1.5 w-full bg-[#1a2e1a] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(100, value)}%`,
            backgroundColor: color,
          }}
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
  const delta = current.sustainabilityIndex - baseline.sustainabilityIndex;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[#A3E635] uppercase tracking-wider">
          Baseline vs. Current Simulation
        </h4>
        <span
          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
            delta >= 0
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}
        >
          {delta >= 0 ? `+${delta}` : delta} pts
        </span>
      </div>

      <div className="space-y-3">
        {INDICATORS.map(({ key, label }) => {
          const bVal = baseline.indicators[key];
          const cVal = current.indicators[key];
          const diff = cVal - bVal;

          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#E8E5E0]/60">{label}</span>
                <span className="font-mono text-xs">
                  <span className="text-[#E8E5E0]/40">{bVal}</span>
                  <span className="text-[#E8E5E0]/30 mx-1">→</span>
                  <span className="font-bold text-[#F5F5F0]">{cVal}</span>
                  <span
                    className={`ml-1.5 text-[10px] ${
                      diff >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    ({diff >= 0 ? `+${diff}` : diff})
                  </span>
                </span>
              </div>
              <div className="flex gap-1 h-1.5">
                <div className="w-1/2 bg-[#1a2e1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-500 transition-all duration-300 rounded-full"
                    style={{ width: `${bVal}%` }}
                  />
                </div>
                <div className="w-1/2 bg-[#1a2e1a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] transition-all duration-300 rounded-full"
                    style={{ width: `${cVal}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export default function CityLab() {
  const {
    baseParams,
    updateParam,
    setBaseParams,
    activePreset,
    setActivePreset,
    resetToDefaults,
    simulation,
    baseSimulation,
    copyShareUrl,
    hasSharedState,
    actionBoosts,
  } = useCity();

  const [compareMode, setCompareMode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check if any citizen action boosts are active
  const hasActionBoosts = useMemo(() => {
    return Object.values(actionBoosts).some(v => v > 0);
  }, [actionBoosts]);

  const handleSliderChange = useCallback((key: keyof CityParameters, val: number) => {
    updateParam(key, val);
  }, [updateParam]);

  const handlePreset = useCallback((presetKey: string) => {
    setBaseParams({ ...PRESETS[presetKey].params });
    setActivePreset(presetKey);
  }, [setBaseParams, setActivePreset]);

  const handleShare = async () => {
    const success = await copyShareUrl();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2600);
    }
  };

  return (
    <section
      id="city-lab"
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: '#0D1B0D' }}
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.header
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4FF00]/30 bg-[#0A1F0A] px-3.5 py-1 text-xs font-mono text-[#D4FF00] uppercase tracking-wider mb-4">
            Interactive Urban Simulator
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F5F5F0] mb-4">
            Future City{' '}
            <span className="bg-gradient-to-r from-[#059669] via-[#10B981] to-[#A3E635] bg-clip-text text-transparent">
              Lab
            </span>
          </h2>
          <p className="text-lg text-[#E8E5E0]/70 max-w-2xl mx-auto mb-2">
            Design your sustainable city. Adjust parameters and watch real-time urban visual dynamics transform.
          </p>
          <p className="text-xs text-[#E8E5E0]/40 max-w-xl mx-auto">
            All simulation figures are illustrative models designed for educational analysis and do not represent actual environmental measurements.
          </p>

          {hasSharedState && (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-mono text-[#34D399]">
              <span>🔗 Custom city configuration loaded via shared URL</span>
            </div>
          )}
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
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-[#A3E635] uppercase tracking-wider">
                  City Parameters
                </h3>
                {hasActionBoosts && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399]">
                    +Citizen Action Boost Active
                  </span>
                )}
              </div>

              {/* Sliders */}
              <div className="space-y-5">
                {SLIDERS.map(slider => (
                  <ParamSlider
                    key={slider.key}
                    config={slider}
                    value={baseParams[slider.key]}
                    onChange={handleSliderChange}
                  />
                ))}
              </div>

              {/* Presets & Actions Bar */}
              <div className="mt-6 pt-5 border-t border-white/5">
                <p className="text-xs text-[#E8E5E0]/50 mb-3">Preset Scenarios</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PRESET_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handlePreset(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                        activePreset === key
                          ? 'bg-[#A3E635] text-[#0A1F0A] font-semibold'
                          : 'bg-white/5 text-[#E8E5E0]/70 hover:bg-white/10 hover:text-[#E8E5E0]'
                      }`}
                      aria-pressed={activePreset === key}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-white/5">
                  <button
                    onClick={resetToDefaults}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-[#E8E5E0]/60 hover:bg-white/10 hover:text-[#E8E5E0] transition-colors duration-200"
                    title="Reset to baseline"
                  >
                    ↺ Reset
                  </button>

                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${
                      compareMode
                        ? 'bg-[#059669] text-white font-semibold'
                        : 'bg-white/5 text-[#E8E5E0]/60 hover:bg-white/10 hover:text-[#E8E5E0]'
                    }`}
                    aria-pressed={compareMode}
                  >
                    {compareMode ? '✕ Close Compare' : '⇄ Compare'}
                  </button>

                  {/* Share My City Button */}
                  <button
                    onClick={handleShare}
                    className="relative ml-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#D4FF00] text-[#0A1F0A] hover:bg-[#A3E635] transition-all duration-200 flex items-center gap-1.5 shadow-sm active:scale-95"
                    title="Share this exact city configuration via URL"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>{copied ? 'Copied Link! 📋' : 'Share My City'}</span>
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
              <ComparisonView baseline={baseSimulation} current={simulation} />
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
          <div className="flex items-center justify-center gap-2 mb-5">
            <h3 className="text-sm font-semibold text-[#A3E635] uppercase tracking-wider">
              Live Impact Indicators
            </h3>
            <span className="text-[11px] text-white/40 font-mono">
              (Calculated directly from live parameters)
            </span>
          </div>
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
