// V2 Story Types

export interface StoryState {
  problemsSolved: number;
  productsExplored: string[];
  connectionsDiscovered: string[];
  metricsViewed: boolean;
  simulationRun: boolean;
  journeyComplete: boolean;
  currentProblem: number;
  achievementsUnlocked: string[];
}

export interface ProblemSolution {
  id: string;
  problem: {
    title: string;
    titleKo: string;
    description: string;
    painPoints: string[];
    icon: string;
  };
  solution: {
    productId: string;
    productName: string;
    features: string[];
    result: string;
    url: string;
  };
  connections: {
    prev?: string;
    next?: string;
  };
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  titleKo: string;
  description: string;
  availableCommands: string[];
  completionCriteria: CompletionCriteria;
  transitions: {
    prev?: string;
    next?: string;
  };
}

export interface CompletionCriteria {
  commands?: string[];
  scanned?: string[];
  explored?: string[];
  solved?: number;
  connections?: number;
  flowViewed?: boolean;
  metricsViewed?: boolean;
  simulationRun?: boolean;
  journeyComplete?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const INITIAL_STORY_STATE: StoryState = {
  problemsSolved: 0,
  productsExplored: [],
  connectionsDiscovered: [],
  metricsViewed: false,
  simulationRun: false,
  journeyComplete: false,
  currentProblem: 0,
  achievementsUnlocked: [],
};
