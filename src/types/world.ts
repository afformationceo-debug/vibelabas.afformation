// V2 World Types

export interface CameraState {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface ParticleConfig {
  count: number;
  color: string;
  speed: number;
  spread: number;
  enabled: boolean;
}

export interface OverlayConfig {
  id: string;
  type: 'hint' | 'achievement' | 'chapter-title';
  content: string;
  visible: boolean;
}

export interface WorldState {
  currentChapter: number;
  camera: CameraState;
  activeNodes: string[];
  highlightedConnections: string[];
  particles: ParticleConfig;
  overlays: OverlayConfig[];
  bootComplete: boolean;
  journeyStarted: boolean;
  flowActive: boolean;
  metricsVisible: boolean;
  simulationActive: boolean;
}

export interface WorldAction {
  type: WorldActionType;
  payload?: unknown;
}

export type WorldActionType =
  | 'START_BOOT_SEQUENCE'
  | 'COMPLETE_BOOT'
  | 'SET_CHAPTER'
  | 'ACTIVATE_NODE'
  | 'DEACTIVATE_NODE'
  | 'HIGHLIGHT_CONNECTION'
  | 'START_FLOW'
  | 'STOP_FLOW'
  | 'SHOW_METRICS'
  | 'START_SIMULATION'
  | 'FOCUS_CAMERA'
  | 'RESET_CAMERA'
  | 'SHOW_OVERLAY'
  | 'HIDE_OVERLAY';

export const DEFAULT_CAMERA: CameraState = {
  position: [0, 0, 10],
  target: [0, 0, 0],
  fov: 50,
};

export const DEFAULT_PARTICLES: ParticleConfig = {
  count: 100,
  color: '#00ff88',
  speed: 0.5,
  spread: 10,
  enabled: true,
};

export const INITIAL_WORLD_STATE: WorldState = {
  currentChapter: 0,
  camera: DEFAULT_CAMERA,
  activeNodes: [],
  highlightedConnections: [],
  particles: DEFAULT_PARTICLES,
  overlays: [],
  bootComplete: false,
  journeyStarted: false,
  flowActive: false,
  metricsVisible: false,
  simulationActive: false,
};
