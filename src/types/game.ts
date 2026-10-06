export type StatKey = 'strength' | 'perception' | 'adaptability';

export interface Choice {
  label: string;
  hint: string;
  result: string;
  hp: number;
  stats: Partial<Record<StatKey, number>>;
  memory: string;
}

export interface GameEvent {
  title: string;
  text: string;
  mood: string;
  choices: Choice[];
}

export interface GameStats {
  strength: number;
  perception: number;
  adaptability: number;
}

export interface RunRecord {
  id: string;
  createdAt: string;
  result: string;
  extinct: boolean;
  stats: GameStats;
  memories: string[];
}

export interface GameResult {
  extinct: boolean;
  title: string;
  reason: string;
}

export interface GameState {
  eventIndex: number;
  hp: number;
  stats: GameStats;
  memories: string[];
  result: GameResult | null;
}

export interface GameConfig {
  initialHp: number;
  maxHp: number;
  maxRecords: number;
  events: GameEvent[];
  statLabels: Record<StatKey, string>;
  evolutionNames: Record<StatKey, string>;
  evolutionDescriptions: Record<StatKey, string>;
}
