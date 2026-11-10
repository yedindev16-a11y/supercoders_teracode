'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { useCity, TARGETS_2040 } from '../context/CityContext';

// Radar Chart calculations for a regular pentagon
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

export default function ImpactObservatory() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { effectiveParams, simulation } = useCity();

  // Radar metrics derived directly from live cityState
  const liveRadarData = useMemo(() => [
    { label: 'Energy', value: effectiveParams.renewableEnergy, target: TARGETS_2040.renewableEnergy },
    { label: 'Green Space', value: effectiveParams.greenCoverage, target: TARGETS_2040.greenCoverage },
    { label: 'Transport', value: effectiveParams.sustainableTransport, target: TARGETS_2040.sustainableTransport },
    { label: 'Circularity', value: effectiveParams.wasteRecovery, target: TARGETS_2040.wasteRecovery },
    { label: 'Water Security', value: effectiveParams.waterConservation, target: TARGETS_2040.waterConservation },
  ], [effectiveParams]);

  const cx = 200;
  const cy = 200;
  const maxRadius = 130;
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Polygon points for Live City Model
  const livePoints = useMemo(() => {
    return liveRadarData.map((item, idx) => {
      const angle = (360 / liveRadarData.length) * idx;
      const r = (item.value / 100) * maxRadius;
      const p = polarToCartesian(cx, cy, r, angle);
      return `${p.x},${p.y}`;
    }).join(' ');
  }, [liveRadarData]);

  // Polygon points for 2040 Target
  const targetPoints = useMemo(() => {
    return liveRadarData.map((item, idx) => {
      const angle = (360 / liveRadarData.length) * idx;
      const r = (item.target / 100) * maxRadius;
      const p = polarToCartesian(cx, cy, r, angle);
      return `${p.x},${p.y}`;
    }).join(' ');
  }, [liveRadarData]);

  // Metric bars driven directly from live simulation indicators
  const indicators = useMemo(() => [
    {
      label: 'CO₂ Emissions Reduction',
      val: simulation.indicators.co2ReductionPercent,
      target: 80,
      color: 'from-[#10B981] to-[#D4FF00]',
      desc: 'Annual greenhouse gas abatement vs baseline fossil benchmarks',
    },
    {
      label: 'Air Quality Index (AQI Health)',
      val: simulation.indicators.airQualityIndex,
      target: 90,
      color: 'from-[#059669] to-[#34D399]',
      desc: 'Ambient particulate matter filtration via canopy & transit electrification',
    },
    {
      label: 'Urban Biodiversity Index',
      val: simulation.indicators.biodiversityScore,
      target: 85,
      color: 'from-[#84CC16] to-[#A3E635]',
      desc: 'Native flora, pollinator highways & urban mangrove preservation',
    },
    {
      label: 'Community Livability Score',
      val: simulation.indicators.livabilityScore,
      target: 90,
      color: 'from-[#34D399] to-[#D4FF00]',
      desc: '15-minute neighborhood walkability, thermal comfort & acoustic health',
    },
    {
      label: 'Resource Circularity',
      val: simulation.indicators.resourceEfficiency,
      target: 85,
      color: 'from-[#059669] to-[#84CC16]',
      desc: 'Municipal organic & technical waste diverted from landfill streams',
    },
    {
      label: 'Climate Shock Resilience',
      val: simulation.indicators.climateResilience,
      target: 85,
      color: 'from-[#10B981] to-[#A3E635]',
      desc: 'Monsoon flood sponge attenuation, bioswales & decentralized power reserves',
    },
  ], [simulation.indicators]);

  const milestones = [
    {
      year: '2026',
      title: 'Decentralized Microgrid Trials',
      desc: 'Solar rooftop expansion & local battery storage piloted across high-density residential wards.',
      status: 'Current Sprint',
    },
    {
      year: '2030',
      title: 'UN SDG 11 Target Horizon',
      desc: 'Substantial per-capita urban environmental impact reduction; zero municipal landfill waste milestones.',
      status: 'Targeted',
    },
    {
      year: '2040',
      title: 'Kerala 2040 Net-Zero Equilibrium',
      desc: 'Full Water Metro & electric tram feeder networks; closed-loop municipal hydrology and 100% CIAL-model clean energy.',
      status: 'State Blueprint',
    },
    {
      year: '2050',
      title: 'Regenerative Megacity Canopy',
      desc: 'Net-negative carbon operation, automated biophilic integration & intergenerational ecological stewardship.',
      status: 'Long-term Vision',
    },
  ];

  return (
    <section id="observatory" ref={ref} className="relative bg-[#0A1F0A] py-28 px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[#10B981]/5 blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4FF00]/10 border border-[#D4FF00]/20 text-xs font-mono font-medium text-[#D4FF00] uppercase tracking-wider mb-4">
            Live System Observability
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            Impact Observatory
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#F5F5F0]/65 leading-relaxed">
            Real-time multi-system tracking. Compare your active city model directly against the ambitious <strong className="text-[#A3E635]">2040 Target</strong> benchmark for sustainable urban futures.
          </p>
        </motion.div>

        {/* 2-Column Section: Radar Chart + Indicator Bars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Radar Pentagon Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#0D1B0D]/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F0]">Systems Radar Matrix</h3>
                <p className="text-xs text-[#F5F5F0]/50 font-mono mt-0.5">Live City Model vs. 2040 Target</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#D4FF00]">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#D4FF00]" />
                  Live City
                </span>
                <span className="flex items-center gap-1.5 text-[#10B981]">
                  <span className="inline-block w-2.5 h-0.5 bg-[#10B981] border-b border-dashed" />
                  2040 Target
                </span>
              </div>
            </div>

            {/* SVG Radar */}
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
                {/* Background Concentric Grid Pentagons */}
                {levels.map((lvl, lIdx) => {
                  const gridPts = liveRadarData.map((_, i) => {
                    const ang = (360 / liveRadarData.length) * i;
                    const pt = polarToCartesian(cx, cy, maxRadius * lvl, ang);
                    return `${pt.x},${pt.y}`;
                  }).join(' ');

                  return (
                    <polygon
                      key={lIdx}
                      points={gridPts}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="1"
                      strokeDasharray={lIdx === levels.length - 1 ? 'none' : '3 3'}
                    />
                  );
                })}

                {/* Axis Radial Lines */}
                {liveRadarData.map((_, i) => {
                  const ang = (360 / liveRadarData.length) * i;
                  const edgePt = polarToCartesian(cx, cy, maxRadius, ang);
                  return (
                    <line
                      key={i}
                      x1={cx}
                      y1={cy}
                      x2={edgePt.x}
                      y2={edgePt.y}
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Layer 1: 2040 Target Polygon (Dashed Emerald Boundary) */}
                <polygon
                  points={targetPoints}
                  fill="rgba(16, 185, 129, 0.08)"
                  stroke="#10B981"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinejoin="round"
                  className="transition-all duration-700"
                />

                {/* Layer 2: Live City Model Polygon (Vibrant Electric Lime) */}
                <polygon
                  points={livePoints}
                  fill="rgba(212, 255, 0, 0.22)"
                  stroke="#D4FF00"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  className="transition-all duration-500"
                />

                {/* Vertex Points & Labels */}
                {liveRadarData.map((item, idx) => {
                  const ang = (360 / liveRadarData.length) * idx;
                  const r = (item.value / 100) * maxRadius;
                  const pt = polarToCartesian(cx, cy, r, ang);
                  const labelPt = polarToCartesian(cx, cy, maxRadius + 24, ang);

                  return (
                    <g key={idx}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="5"
                        fill="#D4FF00"
                        stroke="#0A1F0A"
                        strokeWidth="2"
                        className="transition-all duration-500"
                      />
                      <text
                        x={labelPt.x}
                        y={labelPt.y}
                        fill="#F5F5F0"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="600"
                        textAnchor="middle"
                        dominantBaseline="central"
                        className="pointer-events-none select-none"
                      >
                        {item.label} ({item.value}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Live Metrics Summary Bar */}
            <div className="w-full mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 border-t border-white/5 pt-4 text-center">
              {liveRadarData.map((d, i) => {
                const diff = d.value - d.target;
                return (
                  <div key={i} className="flex flex-col p-1.5 rounded-lg bg-white/[0.02]">
                    <span className="text-[10px] text-[#F5F5F0]/60 font-mono">{d.label}</span>
                    <span className="text-sm font-bold font-mono text-[#D4FF00] mt-0.5">{d.value}%</span>
                    <span className={`text-[10px] font-mono mt-0.5 ${diff >= 0 ? 'text-emerald-400' : 'text-amber-400/80'}`}>
                      {diff >= 0 ? `✓ Target Met` : `${diff}% vs 2040`}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Horizontal Bar Chart Indicators */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#0D1B0D]/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between"
          >
            <div className="border-b border-white/10 pb-4 mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#F5F5F0]">Synthesized Environmental Metrics</h3>
                <p className="text-xs text-[#F5F5F0]/50 font-mono mt-0.5">Driven in real time by City Lab parameters</p>
              </div>
              <span className="text-xs font-mono text-[#A3E635] px-2.5 py-1 rounded bg-white/5 border border-white/10">
                Live Reactive
              </span>
            </div>

            <div className="space-y-5">
              {indicators.map((ind, i) => {
                const isMet = ind.val >= ind.target;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-semibold text-[#F5F5F0]">{ind.label}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-[#D4FF00]">{ind.val}%</span>
                        <span className="text-[11px] text-[#A3E635]/80">
                          (2040 Target: {ind.target}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress track with target tick mark */}
                    <div className="relative h-3 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                      {/* 2040 Target Tick indicator */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-white/80 z-10 shadow-[0_0_6px_rgba(255,255,255,0.8)]"
                        style={{ left: `${ind.target}%` }}
                        title={`2040 Target: ${ind.target}%`}
                      />
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${ind.color} transition-all duration-500`}
                        style={{ width: `${Math.min(100, ind.val)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#F5F5F0]/50 font-mono">
                      <span>{ind.desc}</span>
                      <span className={isMet ? 'text-emerald-400 font-bold' : 'text-amber-400/90'}>
                        {isMet ? '✓ 2040 Target Reached' : `${ind.target - ind.val}% to 2040 Target`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-xl bg-white/[0.03] border border-white/5 p-3.5 text-xs text-[#F5F5F0]/60 flex items-center gap-3">
              <span className="text-[#D4FF00] text-base">ℹ</span>
              <span>All indicators compute live from your custom City Lab configuration and citizen action scorecards.</span>
            </div>
          </motion.div>
        </div>

        {/* Milestone Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="rounded-3xl border border-white/10 bg-[#0D1B0D]/60 p-6 sm:p-10 backdrop-blur-md"
        >
          <div className="mb-10 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-[#F5F5F0]">Strategic Transition Roadmap</h3>
            <p className="text-sm text-[#F5F5F0]/50 font-mono mt-1">Key institutional & municipal thresholds leading to net-zero human settlements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Continuous horizontal timeline line (desktop) */}
            <div className="hidden md:block absolute top-7 left-6 right-6 h-0.5 bg-gradient-to-r from-[#D4FF00] via-[#10B981] to-[#059669]/30 -z-0" />

            {milestones.map((m, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-start bg-[#0A1F0A]/80 md:bg-transparent p-5 md:p-0 rounded-2xl border md:border-0 border-white/5">
                {/* Year Badge Node */}
                <div className="flex items-center gap-3 md:block">
                  <div className="h-14 w-14 rounded-2xl border-2 border-[#D4FF00] bg-[#0A1F0A] flex items-center justify-center font-mono font-bold text-sm text-[#D4FF00] shadow-[0_0_20px_rgba(212,255,0,0.25)]">
                    {m.year}
                  </div>
                  <span className="md:hidden text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-[#A3E635]">
                    {m.status}
                  </span>
                </div>

                <div className="hidden md:inline-block mt-3 text-[11px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#A3E635]">
                  {m.status}
                </div>

                <h4 className="text-base font-bold text-[#F5F5F0] mt-3">{m.title}</h4>
                <p className="text-xs text-[#F5F5F0]/60 leading-relaxed mt-1.5">{m.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
