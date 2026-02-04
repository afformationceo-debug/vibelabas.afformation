'use client';

import { create } from 'zustand';
import type { StoryState } from '@/types/story';
import { INITIAL_STORY_STATE } from '@/types/story';

interface StoryStore extends StoryState {
  // Actions
  solveProblem: () => void;
  exploreProduct: (productId: string) => void;
  discoverConnection: (connectionId: string) => void;
  viewMetrics: () => void;
  runSimulation: () => void;
  completeJourney: () => void;
  setCurrentProblem: (index: number) => void;
  unlockAchievement: (achievementId: string) => void;
  reset: () => void;
  getProgress: () => number;
}

export const useStoryStore = create<StoryStore>((set, get) => ({
  ...INITIAL_STORY_STATE,

  solveProblem: () => {
    const { problemsSolved } = get();
    set({ problemsSolved: problemsSolved + 1 });
  },

  exploreProduct: (productId: string) => {
    const { productsExplored } = get();
    if (!productsExplored.includes(productId)) {
      set({ productsExplored: [...productsExplored, productId] });
    }
  },

  discoverConnection: (connectionId: string) => {
    const { connectionsDiscovered } = get();
    if (!connectionsDiscovered.includes(connectionId)) {
      set({ connectionsDiscovered: [...connectionsDiscovered, connectionId] });
    }
  },

  viewMetrics: () => set({ metricsViewed: true }),

  runSimulation: () => set({ simulationRun: true }),

  completeJourney: () => set({ journeyComplete: true }),

  setCurrentProblem: (index: number) => set({ currentProblem: index }),

  unlockAchievement: (achievementId: string) => {
    const { achievementsUnlocked } = get();
    if (!achievementsUnlocked.includes(achievementId)) {
      set({ achievementsUnlocked: [...achievementsUnlocked, achievementId] });
    }
  },

  reset: () => set(INITIAL_STORY_STATE),

  getProgress: () => {
    const state = get();
    let progress = 0;

    // Problems solved (5 total) = 30%
    progress += (state.problemsSolved / 5) * 30;

    // Products explored (6 total) = 20%
    progress += (state.productsExplored.length / 6) * 20;

    // Connections discovered (5 total) = 20%
    progress += (state.connectionsDiscovered.length / 5) * 20;

    // Metrics viewed = 10%
    if (state.metricsViewed) progress += 10;

    // Simulation run = 10%
    if (state.simulationRun) progress += 10;

    // Journey complete = 10%
    if (state.journeyComplete) progress += 10;

    return Math.min(100, Math.round(progress));
  },
}));
