// Product Types
export interface Product {
  id: string;
  name: string;
  koreanName: string;
  description: string;
  url: string;
  category: 'core' | 'supporting';
  features: string[];
  metrics?: ProductMetric[];
  aiFeatures?: string[];
  color: string;
}

export interface ProductMetric {
  label: string;
  value: string;
  unit?: string;
}

// Terminal Types
export interface TerminalEntry {
  id: string;
  type: 'command' | 'output' | 'system';
  content: string;
  timestamp: Date;
}

export interface TerminalCommand {
  name: string;
  aliases?: string[];
  description: string;
  handler: () => string;
}

// Traction Types
export interface TractionMetric {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

// Section Types
export interface Section {
  id: string;
  title: string;
  hash: string;
}

// AI Capability Types
export interface AICapability {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
}

// V2 Types - Re-export
export * from './world';
export * from './story';
export * from './commands';

// V3 Types - Re-export
export * from './chat';
