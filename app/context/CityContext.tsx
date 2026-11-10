'use client';

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, startTransition } from 'react';
import {
  type CityParameters,
  type SimulationResult,
  calculateSimulation,
  DEFAULT_PARAMS,
} from '../lib/simulation';

// Action impact mapping: parameter boosts contributed by each scorecard action
export const ACTION_PARAM_BOOSTS: Record<string, Partial<CityParameters>> = {
  'home-1': { renewableEnergy: 3 },
  'home-2': { waterConservation: 4 },
  'home-3': { wasteRecovery: 4 },
  'home-4': { renewableEnergy: 4 },
  'transit-1': { sustainableTransport: 4 },
  'transit-2': { sustainableTransport: 3, greenCoverage: 1 },
  'transit-3': { sustainableTransport: 3 },
  'transit-4': { sustainableTransport: 4, renewableEnergy: 1 },
  'comm-1': { greenCoverage: 5 },
  'comm-2': { wasteRecovery: 3, waterConservation: 2 },
  'comm-3': { sustainableTransport: 3, greenCoverage: 2 },
  'comm-4': { wasteRecovery: 5 },
};

// 2040 Target constants for Kerala & Global Sustainable Cities
export const TARGETS_2040: CityParameters = {
  renewableEnergy: 85,
  greenCoverage: 75,
  sustainableTransport: 80,
  wasteRecovery: 85,
  waterConservation: 80,
};

export const TARGET_SIMULATION_2040: SimulationResult = calculateSimulation(TARGETS_2040);

interface CityContextType {
  // Base parameters from sliders
  baseParams: CityParameters;
  setBaseParams: (params: CityParameters) => void;
  updateParam: (key: keyof CityParameters, value: number) => void;
  activePreset: string | null;
  setActivePreset: (preset: string | null) => void;
  resetToDefaults: () => void;

  // Action scorecard integration
  completedActions: Record<string, boolean>;
  toggleAction: (id: string) => void;
  actionBoosts: CityParameters;

  // Effective parameters (Base + Action Boosts, clamped 0-100)
  effectiveParams: CityParameters;
  simulation: SimulationResult;
  baseSimulation: SimulationResult;

  // Share functionality
  shareUrl: string;
  copyShareUrl: () => Promise<boolean>;
  hasSharedState: boolean;
}

const CityContext = createContext<CityContextType | null>(null);

function clamp(val: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, Math.round(val)));
}

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [baseParams, setBaseParamsState] = useState<CityParameters>(DEFAULT_PARAMS);
  const [activePreset, setActivePreset] = useState<string | null>('current');
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [hasSharedState, setHasSharedState] = useState(false);

  // Restore state from URL query parameters on initial mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const url = new URL(window.location.href);
      const params = url.searchParams;

      // Check for named or shorthand query parameters
      const re = params.get('energy') ?? params.get('re');
      const gc = params.get('green') ?? params.get('gc');
      const st = params.get('transport') ?? params.get('st');
      const wr = params.get('waste') ?? params.get('wr');
      const wc = params.get('water') ?? params.get('wc');

      if (re !== null || gc !== null || st !== null || wr !== null || wc !== null) {
        startTransition(() => {
          setBaseParamsState({
            renewableEnergy: re !== null ? clamp(Number(re)) : DEFAULT_PARAMS.renewableEnergy,
            greenCoverage: gc !== null ? clamp(Number(gc)) : DEFAULT_PARAMS.greenCoverage,
            sustainableTransport: st !== null ? clamp(Number(st)) : DEFAULT_PARAMS.sustainableTransport,
            wasteRecovery: wr !== null ? clamp(Number(wr)) : DEFAULT_PARAMS.wasteRecovery,
            waterConservation: wc !== null ? clamp(Number(wc)) : DEFAULT_PARAMS.waterConservation,
          });
          setActivePreset(null);
          setHasSharedState(true);
        });
      }
    } catch {
      // Gracefully ignore query parsing issues
    }

    // Restore completed actions from localStorage
    try {
      const saved = localStorage.getItem('ecoterra-actions');
      if (saved) {
        startTransition(() => {
          setCompletedActions(JSON.parse(saved));
        });
      }
    } catch {
      // Gracefully ignore storage issues
    }
  }, []);

  const setBaseParams = useCallback((newParams: CityParameters) => {
    setBaseParamsState({
      renewableEnergy: clamp(newParams.renewableEnergy),
      greenCoverage: clamp(newParams.greenCoverage),
      sustainableTransport: clamp(newParams.sustainableTransport),
      wasteRecovery: clamp(newParams.wasteRecovery),
      waterConservation: clamp(newParams.waterConservation),
    });
  }, []);

  const updateParam = useCallback((key: keyof CityParameters, value: number) => {
    setBaseParamsState(prev => ({
      ...prev,
      [key]: clamp(value),
    }));
    setActivePreset(null);
  }, []);

  const resetToDefaults = useCallback(() => {
    setBaseParamsState(DEFAULT_PARAMS);
    setActivePreset('current');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const toggleAction = useCallback((id: string) => {
    setCompletedActions(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('ecoterra-actions', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Compute total action boosts (blocking duplicate rewards by action ID key)
  const actionBoosts = useMemo<CityParameters>(() => {
    const boosts: CityParameters = {
      renewableEnergy: 0,
      greenCoverage: 0,
      sustainableTransport: 0,
      wasteRecovery: 0,
      waterConservation: 0,
    };

    for (const [id, isDone] of Object.entries(completedActions)) {
      if (isDone && ACTION_PARAM_BOOSTS[id]) {
        const itemBoost = ACTION_PARAM_BOOSTS[id];
        if (itemBoost.renewableEnergy) boosts.renewableEnergy += itemBoost.renewableEnergy;
        if (itemBoost.greenCoverage) boosts.greenCoverage += itemBoost.greenCoverage;
        if (itemBoost.sustainableTransport) boosts.sustainableTransport += itemBoost.sustainableTransport;
        if (itemBoost.wasteRecovery) boosts.wasteRecovery += itemBoost.wasteRecovery;
        if (itemBoost.waterConservation) boosts.waterConservation += itemBoost.waterConservation;
      }
    }

    return boosts;
  }, [completedActions]);

  // Effective params combine base slider params with active action boosts (clamped 0-100)
  const effectiveParams = useMemo<CityParameters>(() => {
    return {
      renewableEnergy: clamp(baseParams.renewableEnergy + actionBoosts.renewableEnergy),
      greenCoverage: clamp(baseParams.greenCoverage + actionBoosts.greenCoverage),
      sustainableTransport: clamp(baseParams.sustainableTransport + actionBoosts.sustainableTransport),
      wasteRecovery: clamp(baseParams.wasteRecovery + actionBoosts.wasteRecovery),
      waterConservation: clamp(baseParams.waterConservation + actionBoosts.waterConservation),
    };
  }, [baseParams, actionBoosts]);

  // Live simulation results
  const simulation = useMemo<SimulationResult>(() => {
    return calculateSimulation(effectiveParams);
  }, [effectiveParams]);

  // Baseline simulation without citizen action boosts (for delta comparison)
  const baseSimulation = useMemo<SimulationResult>(() => {
    return calculateSimulation(baseParams);
  }, [baseParams]);

  // Generate shareable URL
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('energy', String(baseParams.renewableEnergy));
    url.searchParams.set('green', String(baseParams.greenCoverage));
    url.searchParams.set('transport', String(baseParams.sustainableTransport));
    url.searchParams.set('waste', String(baseParams.wasteRecovery));
    url.searchParams.set('water', String(baseParams.waterConservation));
    url.hash = 'city-lab';
    return url.toString();
  }, [baseParams]);

  const copyShareUrl = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !navigator.clipboard) return false;
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Also update address bar without reloading
      window.history.replaceState({}, '', shareUrl);
      return true;
    } catch {
      return false;
    }
  }, [shareUrl]);

  const value = useMemo(
    () => ({
      baseParams,
      setBaseParams,
      updateParam,
      activePreset,
      setActivePreset,
      resetToDefaults,
      completedActions,
      toggleAction,
      actionBoosts,
      effectiveParams,
      simulation,
      baseSimulation,
      shareUrl,
      copyShareUrl,
      hasSharedState,
    }),
    [
      baseParams,
      setBaseParams,
      updateParam,
      activePreset,
      resetToDefaults,
      completedActions,
      toggleAction,
      actionBoosts,
      effectiveParams,
      simulation,
      baseSimulation,
      shareUrl,
      copyShareUrl,
      hasSharedState,
    ]
  );

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity(): CityContextType {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error('useCity must be used within a CityProvider');
  }
  return context;
}
