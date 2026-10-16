export type StatKey = 'strength' | 'perception' | 'adaptability';
export type Difficulty = 'normal' | 'hard';

export interface Choice {
  label: string;
  hint: string;
  result: string;
  hp: number;
  stats: Partial<Record<StatKey, number>>;
  memory: string;
}

export interface GameEvent {
  id: string;
  level: number;
  direction: StatKey;
  title: string;
  text: string;
  mood: string;
  choices: Choice[];
}

export interface EventLevel {
  level: number;
  events: GameEvent[];
}

export interface SceneConfig {
  id: string;
  name: string;
  description: string;
  levels: EventLevel[];
}

export interface GameStats {
  strength: number;
  perception: number;
  adaptability: number;
}

export interface RunRecord {
  id: string;
  sceneId?: string;
  difficulty?: Difficulty;
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
  sceneId: string;
  difficulty: Difficulty;
  eventIndex: number;
  level: number;
  currentEvent: GameEvent;
  usedEventIds: string[];
  hp: number;
  stats: GameStats;
  memories: string[];
  result: GameResult | null;
}

export interface GameConfig {
  initialHp: number;
  maxHp: number;
  initialStats: GameStats;
  maxRecords: number;
  defaultSceneId: string;
  scenes: SceneConfig[];
  statLabels: Record<StatKey, string>;
  evolutionNames: Record<StatKey, string>;
  evolutionDescriptions: Record<StatKey, string>;
}
