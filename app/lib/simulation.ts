// ECOTERRA Sustainability Simulation Engine
// All figures are illustrative and do not represent actual environmental measurements.

export interface CityParameters {
  renewableEnergy: number;    // 0-100: percentage of energy from renewable sources
  greenCoverage: number;      // 0-100: percentage of urban area with green coverage
  sustainableTransport: number; // 0-100: percentage of trips via sustainable modes
  wasteRecovery: number;      // 0-100: percentage of waste recovered/recycled
  waterConservation: number;  // 0-100: percentage reduction in water waste
}

export interface SimulationResult {
  sustainabilityIndex: number;  // 0-100 overall score
  categoryScores: {
    energy: number;
    green: number;
    transport: number;
    waste: number;
    water: number;
  };
  indicators: {
    co2ReductionPercent: number;
    airQualityIndex: number;      // 0-100 (higher = better)
    biodiversityScore: number;    // 0-100
    livabilityScore: number;      // 0-100
    resourceEfficiency: number;   // 0-100
    climateResilience: number;    // 0-100
  };
  cityVisualState: {
    solarPanels: number;     // 0-1 density
    windTurbines: number;    // 0-1 density
    trees: number;           // 0-1 density
    parks: number;           // 0-1 density
    bikes: number;           // 0-1 density
    buses: number;           // 0-1 density
    recyclingBins: number;   // 0-1 density
    waterFeatures: number;   // 0-1 density
    greenRoofs: number;      // 0-1 density
    evChargers: number;      // 0-1 density
  };
}

// Weights for sustainability index calculation
// Based on common sustainability framework proportions
const WEIGHTS = {
  energy: 0.25,      // Energy is highest impact
  green: 0.20,       // Urban green is critical for livability
  transport: 0.20,   // Transport is a major emissions source
  waste: 0.15,       // Waste management matters
  water: 0.20,       // Water is a vital resource
};

// Documented methodology:
// Each parameter (0-100) is weighted according to the above proportions.
// Category scores apply a non-linear curve to reward higher investment.
// The sustainability index is the weighted sum of category scores.
// All derived indicators use documented formulas below.

function applyCurve(value: number): number {
  // Slightly exponential: rewards higher investment
  // f(x) = x^1.1 / 100^0.1 to keep range 0-100
  return Math.pow(value, 1.1) / Math.pow(100, 0.1);
}

export function calculateSimulation(params: CityParameters): SimulationResult {
  const categoryScores = {
    energy: applyCurve(params.renewableEnergy),
    green: applyCurve(params.greenCoverage),
    transport: applyCurve(params.sustainableTransport),
    waste: applyCurve(params.wasteRecovery),
    water: applyCurve(params.waterConservation),
  };

  const sustainabilityIndex = Math.round(
    categoryScores.energy * WEIGHTS.energy +
    categoryScores.green * WEIGHTS.green +
    categoryScores.transport * WEIGHTS.transport +
    categoryScores.waste * WEIGHTS.waste +
    categoryScores.water * WEIGHTS.water
  );

  // Derived indicators (illustrative formulas)
  const co2ReductionPercent = Math.round(
    params.renewableEnergy * 0.4 +
    params.sustainableTransport * 0.35 +
    params.greenCoverage * 0.1 +
    params.wasteRecovery * 0.1 +
    params.waterConservation * 0.05
  );

  const airQualityIndex = Math.round(
    params.greenCoverage * 0.3 +
    params.sustainableTransport * 0.35 +
    params.renewableEnergy * 0.25 +
    params.wasteRecovery * 0.1
  );

  const biodiversityScore = Math.round(
    params.greenCoverage * 0.5 +
    params.waterConservation * 0.25 +
    params.wasteRecovery * 0.15 +
    params.renewableEnergy * 0.1
  );

  const livabilityScore = Math.round(
    params.greenCoverage * 0.25 +
    params.sustainableTransport * 0.25 +
    params.waterConservation * 0.2 +
    params.renewableEnergy * 0.15 +
    params.wasteRecovery * 0.15
  );

  const resourceEfficiency = Math.round(
    params.wasteRecovery * 0.3 +
    params.waterConservation * 0.3 +
    params.renewableEnergy * 0.2 +
    params.sustainableTransport * 0.1 +
    params.greenCoverage * 0.1
  );

  const climateResilience = Math.round(
    params.greenCoverage * 0.25 +
    params.waterConservation * 0.25 +
    params.renewableEnergy * 0.2 +
    params.wasteRecovery * 0.15 +
    params.sustainableTransport * 0.15
  );

  // Visual state mapping
  const cityVisualState = {
    solarPanels: params.renewableEnergy / 100,
    windTurbines: Math.max(0, (params.renewableEnergy - 30) / 70),
    trees: params.greenCoverage / 100,
    parks: Math.max(0, (params.greenCoverage - 20) / 80),
    bikes: params.sustainableTransport / 100,
    buses: Math.max(0, (params.sustainableTransport - 15) / 85),
    recyclingBins: params.wasteRecovery / 100,
    waterFeatures: params.waterConservation / 100,
    greenRoofs: Math.max(0, (params.greenCoverage - 40) / 60),
    evChargers: Math.max(0, (params.sustainableTransport - 25) / 75),
  };

  return {
    sustainabilityIndex,
    categoryScores,
    indicators: {
      co2ReductionPercent,
      airQualityIndex,
      biodiversityScore,
      livabilityScore,
      resourceEfficiency,
      climateResilience,
    },
    cityVisualState,
  };
}

export const DEFAULT_PARAMS: CityParameters = {
  renewableEnergy: 15,
  greenCoverage: 20,
  sustainableTransport: 10,
  wasteRecovery: 25,
  waterConservation: 15,
};

export const PRESETS: Record<string, { name: string; description: string; params: CityParameters }> = {
  current: {
    name: "Today's Average City",
    description: "Typical urban sustainability levels worldwide",
    params: DEFAULT_PARAMS,
  },
  progressive: {
    name: "Progressive City",
    description: "A city actively investing in sustainable infrastructure",
    params: {
      renewableEnergy: 55,
      greenCoverage: 45,
      sustainableTransport: 50,
      wasteRecovery: 60,
      waterConservation: 50,
    },
  },
  ecotopia: {
    name: "Ecotopia 2050",
    description: "An ambitious vision for a fully sustainable city",
    params: {
      renewableEnergy: 95,
      greenCoverage: 80,
      sustainableTransport: 90,
      wasteRecovery: 95,
      waterConservation: 90,
    },
  },
  minimal: {
    name: "Minimal Effort",
    description: "Little investment in sustainability",
    params: {
      renewableEnergy: 5,
      greenCoverage: 8,
      sustainableTransport: 5,
      wasteRecovery: 10,
      waterConservation: 5,
    },
  },
};

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Poor";
  return "Critical";
}

export function getScoreColor(score: number): string {
  if (score >= 75) return "#10B981";
  if (score >= 50) return "#84CC16";
  if (score >= 25) return "#F59E0B";
  return "#EF4444";
}

/* ═══════════════════════════════════════════════════════════
   KERALA MONSOON STRESS TEST ENGINE
   Simulates extreme 24h Southwest Monsoon downpour (250mm)
   Evaluates Sponge City absorption vs Flash Inundation
   All values illustrative and educational
   ═══════════════════════════════════════════════════════════ */

export interface MonsoonTestResult {
  absorptionRate: number;        // 0-100% capacity to sponge torrential downpour
  floodRiskScore: number;        // 0-100 risk level (lower is safer)
  status: 'sponge-resilient' | 'moderate-runoff' | 'severe-flooding';
  statusLabel: string;
  badgeColor: string;
  summary: string;
  breakdown: {
    permeableInfiltration: number; // Soil & canopy sponge capacity
    retentionDrainage: number;     // Cisterns, bioswales & canal buffering
    climateDefense: number;        // Decentralized pumps & shock resilience
  };
  streetFlooded: boolean;
  canalOverflow: boolean;
  waterLevelIncrease: number;     // Visual delta for canal (px)
  recommendations: string[];
}

export function calculateMonsoonTest(
  params: CityParameters,
  climateResilience: number
): MonsoonTestResult {
  const permeableInfiltration = Math.min(100, Math.round(params.greenCoverage * 0.95));
  const retentionDrainage = Math.min(100, Math.round(params.waterConservation * 0.9 + 5));
  const climateDefense = Math.min(100, Math.round(climateResilience * 0.9));

  // Weighted sponge absorption capacity
  const absorptionRate = Math.min(
    100,
    Math.round(permeableInfiltration * 0.35 + retentionDrainage * 0.35 + climateDefense * 0.30)
  );

  const floodRiskScore = Math.max(0, 100 - absorptionRate);

  if (absorptionRate >= 70) {
    return {
      absorptionRate,
      floodRiskScore,
      status: 'sponge-resilient',
      statusLabel: 'Sponge City Equilibrium',
      badgeColor: '#10B981',
      summary:
        'Outstanding monsoon flood resilience. Permeable urban green belts, deep root systems, and desilted backwater canals completely absorbed the simulated 250mm downpour without street waterlogging.',
      breakdown: {
        permeableInfiltration,
        retentionDrainage,
        climateDefense,
      },
      streetFlooded: false,
      canalOverflow: false,
      waterLevelIncrease: 6,
      recommendations: [
        'Sponge capacity safely handles peak tropical precipitation',
        'Groundwater recharge reservoirs fully replenishing regional aquifers',
      ],
    };
  }

  if (absorptionRate >= 45) {
    return {
      absorptionRate,
      floodRiskScore,
      status: 'moderate-runoff',
      statusLabel: 'Partial Absorption (Localized Runoff)',
      badgeColor: '#F59E0B',
      summary:
        'Moderate stormwater absorption (~65% buffered). Backwater canal water levels reached peak holding capacity, with minor localized waterlogging on lower transit corridors.',
      breakdown: {
        permeableInfiltration,
        retentionDrainage,
        climateDefense,
      },
      streetFlooded: true,
      canalOverflow: false,
      waterLevelIncrease: 12,
      recommendations: [
        'Increase Water Conservation to expand bioswales and retention cisterns',
        'Boost Green Coverage along transport corridors to curb concrete surface runoff',
      ],
    };
  }

  return {
    absorptionRate,
    floodRiskScore,
    status: 'severe-flooding',
    statusLabel: 'Flash Waterlogging Alert',
    badgeColor: '#EF4444',
    summary:
      'Critical flood vulnerability! Low permeable soil and inadequate water retention caused sudden stormwater runoff overload. Canal banks crested, resulting in severe street flooding across low-lying sectors.',
    breakdown: {
      permeableInfiltration,
      retentionDrainage,
      climateDefense,
    },
    streetFlooded: true,
    canalOverflow: true,
    waterLevelIncrease: 18,
    recommendations: [
      'Urgent: Elevate Water Conservation to buffer torrential monsoon surges',
      'Expand permeable green coverage and bio-retention wetlands to sponge surface runoff',
    ],
  };
}

