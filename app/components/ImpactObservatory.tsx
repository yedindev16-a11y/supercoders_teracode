'use client';

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';

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

  // Radar metrics state (can be tweaked by user)
  const [radarData, setRadarData] = useState<{ label: string; value: number }[]>([
    { label: 'Energy', value: 78 },
    { label: 'Green Space', value: 65 },
    { label: 'Transport', value: 82 },
    { label: 'Circular Waste', value: 70 },
    { label: 'Water Security', value: 75 },
  ]);

  const cx = 200;
  const cy = 200;
  const maxRadius = 130;
  const levels = [0.25, 0.5, 0.75, 1.0];

  // Polygon points
  const points = radarData.map((item, idx) => {
    const angle = (360 / radarData.length) * idx;
    const r = (item.value / 100) * maxRadius;
    const p = polarToCartesian(cx, cy, r, angle);
    return `${p.x},${p.y}`;
  }).join(' ');

  const indicators = [
    { label: 'CO₂ Emissions Reduction', val: 74, color: 'from-[#10B981] to-[#D4FF00]', desc: 'Target: -80% by 2040' },
    { label: 'Air Quality Index (AQI)', val: 86, color: 'from-[#059669] to-[#34D399]', desc: 'Optimal: Clean breathable urban corridors' },
    { label: 'Urban Biodiversity Index', val: 68, color: 'from-[#84CC16] to-[#A3E635]', desc: 'Native species density in biophilic belts' },
    { label: 'Community Livability Score', val: 91, color: 'from-[#34D399] to-[#D4FF00]', desc: '15-minute city radius satisfaction' },
    { label: 'Resource Circularity', val: 72, color: 'from-[#059669] to-[#84CC16]', desc: 'Waste diversion from landfills' },
    { label: 'Climate Shock Resilience', val: 80, color: 'from-[#10B981] to-[#A3E635]', desc: 'Flood, heatwave & storm attenuation' },
  ];

  const milestones = [
    {
      year: '2026',
      title: 'Decentralized Microgrid Trials',
      desc: 'Smart local solar and flow-battery storage piloted across high-density residential blocks.',
      status: 'Active Milestone',
    },
    {
      year: '2030',
      title: 'UN SDG 11 Target Horizon',
      desc: 'Slashing per-capita urban environmental impact with zero municipal landfill waste targets.',
      status: 'Targeted',
    },
    {
      year: '2040',
      title: 'Autonomous Clean Transit Mandate',
      desc: 'Full phaseout of combustion passenger transport; 100% electrified or green hydrogen logistics.',
      status: 'Projected',
    },
    {
      year: '2050',
      title: 'Regenerative Megacity Equilibrium',
      desc: 'Net-negative carbon operation, closed-loop hydrology, and continuous vertical ecological canopy.',
      status: 'Vision',
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
            System Observability
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#F5F5F0]">
            Impact Observatory
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#F5F5F0]/65 leading-relaxed">
            Multivariate visualization of core ecological systems. Explore the mathematical relationships between urban density, resource conservation, and atmospheric health.
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
                <p className="text-xs text-[#F5F5F0]/50 font-mono mt-0.5">Pentagonal Equilibrium Model</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-md bg-[#D4FF00]/10 text-[#D4FF00] font-mono">
                Interactive
              </span>
            </div>

            {/* SVG Radar */}
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full overflow-visible">
                {/* Background Concentric Grid Pentagons */}
                {levels.map((lvl, lIdx) => {
                  const gridPts = radarData.map((_, i) => {
                    const ang = (360 / radarData.length) * i;
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
                {radarData.map((_, i) => {
                  const ang = (360 / radarData.length) * i;
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

                {/* Filled Radar Polygon */}
                <motion.polygon
                  points={points}
                  fill="rgba(212, 255, 0, 0.22)"
                  stroke="#D4FF00"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />

                {/* Vertex Points & Labels */}
                {radarData.map((item, idx) => {
                  const ang = (360 / radarData.length) * idx;
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
                        className="cursor-pointer transition-all hover:scale-150"
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

            {/* Micro Slider Controls to tweak radar live */}
            <div className="w-full mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-white/5 pt-4">
              {radarData.map((d, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[11px] font-mono text-[#F5F5F0]/70">
                    <span>{d.label}</span>
                    <span className="text-[#D4FF00] font-bold">{d.value}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={d.value}
                    onChange={(e) => {
                      const next = [...radarData];
                      next[i] = { ...next[i], value: Number(e.target.value) };
                      setRadarData(next);
                    }}
                    className="h-1.5 accent-[#D4FF00] cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Horizontal Bar Chart Indicators */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#0D1B0D]/80 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col justify-between"
          >
            <div className="border-b border-white/10 pb-4 mb-6">
              <h3 className="text-lg font-bold text-[#F5F5F0]">Synthesized Environmental Metrics</h3>
              <p className="text-xs text-[#F5F5F0]/50 font-mono mt-0.5">Calculated resilience across critical biosphere vectors</p>
            </div>

            <div className="space-y-5">
              {indicators.map((ind, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-[#F5F5F0]">{ind.label}</span>
                    <span className="font-mono font-bold text-[#D4FF00]">{ind.val}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${ind.val}%` } : {}}
                      transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${ind.color}`}
                    />
                  </div>
                  <div className="text-[11px] text-[#F5F5F0]/40 font-mono">{ind.desc}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-white/[0.03] border border-white/5 p-3.5 text-xs text-[#F5F5F0]/60 flex items-center gap-3">
              <span className="text-[#D4FF00] text-base">ℹ</span>
              <span>Values synthesized using integrated non-linear regression curves with environmental weighting coefficients.</span>
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
            <p className="text-sm text-[#F5F5F0]/50 font-mono mt-1">Key international thresholds leading to net-zero human settlements</p>
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
