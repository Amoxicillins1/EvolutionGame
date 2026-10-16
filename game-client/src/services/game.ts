import { gameConfig } from '@/data/events';
import { Choice, GameResult, GameState, GameStats, StatKey } from '@/types/game';

const statKeys: StatKey[] = ['strength', 'perception', 'adaptability'];

const emptyStats = (): GameStats => ({ strength: 0, perception: 0, adaptability: 0 });

export const createGame = (): GameState => ({
  eventIndex: 0,
  hp: gameConfig.initialHp,
  stats: emptyStats(),
  memories: [],
  result: null,
});

const getTopStat = (stats: GameStats): StatKey => statKeys.reduce((top, key) => stats[key] > stats[top] ? key : top, 'strength');

const createResult = (hp: number, stats: GameStats): GameResult => {
  const extinct = hp === 0;
  const key = getTopStat(stats);
  return {
    extinct,
    title: extinct ? '这条谱系消失了' : `你进化成了：${gameConfig.evolutionNames[key]}`,
    reason: extinct ? '你的活力耗尽了，但这次尝试留下了生存记忆。下一局可以换一种策略。' : gameConfig.evolutionDescriptions[key],
  };
};

export const choose = (state: GameState, choice: Choice): GameState => {
  const hp = Math.max(0, Math.min(gameConfig.maxHp, state.hp + choice.hp));
  const stats = { ...state.stats };
  Object.entries(choice.stats).forEach(([key, value]) => {
    stats[key as StatKey] += value || 0;
  });
  const memories = [...state.memories, choice.memory];
  const isFinished = hp === 0 || state.eventIndex === gameConfig.events.length - 1;

  return {
    eventIndex: isFinished ? state.eventIndex : state.eventIndex + 1,
    hp,
    stats,
    memories,
    result: isFinished ? createResult(hp, stats) : null,
  };
};

export { getTopStat, statKeys };
