'use client';

import { create } from 'zustand';
import type {
  WorldState,
  WorldAction,
  CameraState,
  ParticleConfig,
  OverlayConfig,
} from '@/types/world';
import { INITIAL_WORLD_STATE, DEFAULT_CAMERA } from '@/types/world';

interface WorldStore extends WorldState {
  // Actions
  dispatch: (action: WorldAction) => void;
  startBoot: () => void;
  completeBoot: () => void;
  startJourney: () => void;
  setChapter: (chapter: number) => void;
  activateNode: (nodeId: string) => void;
  deactivateNode: (nodeId: string) => void;
  highlightConnection: (connectionId: string) => void;
  clearConnections: () => void;
  startFlow: () => void;
  stopFlow: () => void;
  showMetrics: () => void;
  hideMetrics: () => void;
  startSimulation: () => void;
  stopSimulation: () => void;
  focusCamera: (position: [number, number, number], target?: [number, number, number]) => void;
  resetCamera: () => void;
  setParticles: (config: Partial<ParticleConfig>) => void;
  showOverlay: (overlay: OverlayConfig) => void;
  hideOverlay: (overlayId: string) => void;
  reset: () => void;
}

export const useWorldStore = create<WorldStore>((set, get) => ({
  ...INITIAL_WORLD_STATE,

  dispatch: (action: WorldAction) => {
    const { type, payload } = action;

    switch (type) {
      case 'START_BOOT_SEQUENCE':
        get().startBoot();
        break;
      case 'COMPLETE_BOOT':
        get().completeBoot();
        break;
      case 'SET_CHAPTER':
        get().setChapter(payload as number);
        break;
      case 'ACTIVATE_NODE':
        get().activateNode(payload as string);
        break;
      case 'DEACTIVATE_NODE':
        get().deactivateNode(payload as string);
        break;
      case 'HIGHLIGHT_CONNECTION':
        get().highlightConnection(payload as string);
        break;
      case 'START_FLOW':
        get().startFlow();
        break;
      case 'STOP_FLOW':
        get().stopFlow();
        break;
      case 'SHOW_METRICS':
        get().showMetrics();
        break;
      case 'START_SIMULATION':
        get().startSimulation();
        break;
      case 'FOCUS_CAMERA':
        const { position, target } = payload as { position: [number, number, number]; target?: [number, number, number] };
        get().focusCamera(position, target);
        break;
      case 'RESET_CAMERA':
        get().resetCamera();
        break;
      case 'SHOW_OVERLAY':
        get().showOverlay(payload as OverlayConfig);
        break;
      case 'HIDE_OVERLAY':
        get().hideOverlay(payload as string);
        break;
    }
  },

  startBoot: () => set({ bootComplete: false, journeyStarted: false }),

  completeBoot: () => set({ bootComplete: true }),

  startJourney: () => set({ journeyStarted: true, currentChapter: 1 }),

  setChapter: (chapter: number) => {
    set({
      currentChapter: chapter,
      activeNodes: [],
      highlightedConnections: [],
      flowActive: false,
    });
  },

  activateNode: (nodeId: string) => {
    const { activeNodes } = get();
    if (!activeNodes.includes(nodeId)) {
      set({ activeNodes: [...activeNodes, nodeId] });
    }
  },

  deactivateNode: (nodeId: string) => {
    const { activeNodes } = get();
    set({ activeNodes: activeNodes.filter((id) => id !== nodeId) });
  },

  highlightConnection: (connectionId: string) => {
    const { highlightedConnections } = get();
    if (!highlightedConnections.includes(connectionId)) {
      set({ highlightedConnections: [...highlightedConnections, connectionId] });
    }
  },

  clearConnections: () => set({ highlightedConnections: [] }),

  startFlow: () => set({ flowActive: true }),

  stopFlow: () => set({ flowActive: false }),

  showMetrics: () => set({ metricsVisible: true }),

  hideMetrics: () => set({ metricsVisible: false }),

  startSimulation: () => set({ simulationActive: true }),

  stopSimulation: () => set({ simulationActive: false }),

  focusCamera: (position: [number, number, number], target?: [number, number, number]) => {
    set({
      camera: {
        ...get().camera,
        position,
        target: target || get().camera.target,
      },
    });
  },

  resetCamera: () => set({ camera: DEFAULT_CAMERA }),

  setParticles: (config: Partial<ParticleConfig>) => {
    set({ particles: { ...get().particles, ...config } });
  },

  showOverlay: (overlay: OverlayConfig) => {
    const { overlays } = get();
    const existing = overlays.find((o) => o.id === overlay.id);
    if (existing) {
      set({
        overlays: overlays.map((o) => (o.id === overlay.id ? overlay : o)),
      });
    } else {
      set({ overlays: [...overlays, overlay] });
    }
  },

  hideOverlay: (overlayId: string) => {
    const { overlays } = get();
    set({
      overlays: overlays.map((o) =>
        o.id === overlayId ? { ...o, visible: false } : o
      ),
    });
  },

  reset: () => set(INITIAL_WORLD_STATE),
}));
