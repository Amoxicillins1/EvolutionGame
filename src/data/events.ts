import { GameConfig, GameEvent, GameStats } from '@/types/game';

export const events: GameEvent[] = [
  {
    title: '水流卷来一片锋利的碎壳。',
    text: '周围没有可以立刻躲藏的地方。碎壳在水中旋转，像一群没有眼睛的捕食者。',
    mood: '水流正在变快。',
    choices: [
      { label: '正面顶住水流', hint: '用身体的力量撑过去', result: '你被碎壳划伤，但种群记住了水流的方向。', hp: -1, stats: { strength: 2 }, memory: '正面承受危险，让力量倾向开始显现。' },
      { label: '观察水流的间隙', hint: '等待最安全的时机穿过', result: '你避开了大部分碎壳，发现了规律。', hp: 0, stats: { perception: 2 }, memory: '等待和观察，让感知倾向开始显现。' },
    ],
  },
  {
    title: '一团绿色微生物沉在浅水处。',
    text: '它可能是食物，也可能让你变得虚弱。更深的水域里，还有另一种气味。',
    mood: '饥饿比恐惧更早到来。',
    choices: [
      { label: '吞食眼前的微生物', hint: '立刻获得能量，但可能有风险', result: '你获得了能量，也适应了陌生的成分。', hp: 0, stats: { adaptability: 2 }, memory: '接纳陌生食物，让适应性倾向增强。' },
      { label: '追踪更深处的气味', hint: '离开安全区域寻找更好的食物', result: '你找到丰富的食物，但被暗流拖得很远。', hp: -1, stats: { strength: 1, adaptability: 1 }, memory: '远离熟悉环境，让力量与适应性共同增长。' },
    ],
  },
  {
    title: '巨大的阴影从上方掠过。',
    text: '捕食者还没有发现你。珊瑚缝隙只能容纳一小群生命，离开则会暴露在开阔水域。',
    mood: '不要让影子看见你。',
    choices: [
      { label: '躲进珊瑚缝隙', hint: '安全，但会错过一部分食物', result: '阴影离开了。你记住了隐蔽处的位置。', hp: 0, stats: { perception: 2 }, memory: '依靠感知和隐蔽活下来，敏捷路线变得清晰。' },
      { label: '趁阴影转身时逃跑', hint: '快速离开，但更容易受伤', result: '你逃过了追捕，几名同伴却掉队了。', hp: -1, stats: { strength: 2 }, memory: '速度和爆发力救了你，力量路线变得清晰。' },
    ],
  },
  {
    title: '海水突然变得浑浊而温暖。',
    text: '熟悉的盐度正在改变。你可以留在原地等待，也可以尝试进入旁边的淡水潮池。',
    mood: '环境不会一直保持原样。',
    choices: [
      { label: '进入淡水潮池', hint: '承受变化，寻找新的生存方式', result: '你的身体逐渐适应了不同的水质。', hp: 0, stats: { adaptability: 2 }, memory: '主动适应环境变化，广适应路线正在成形。' },
      { label: '留在熟悉的海水里', hint: '暂时安全，但变化可能越来越大', result: '你暂时躲过了变化，却消耗了更多能量。', hp: -1, stats: { perception: 1, strength: 1 }, memory: '谨慎留守让你活下来，但环境正在逼你改变。' },
    ],
  },
  {
    title: '最后一片食物被发现了。',
    text: '种群已经疲惫。你可以独自吞下它，也可以让几名同伴一起分享，然后面对接下来的黑暗。',
    mood: '活下去，还是一起活下去？',
    choices: [
      { label: '独自吞下食物', hint: '立刻恢复一点活力', result: '你恢复了活力，但种群之间的联系变弱了。', hp: 1, stats: { strength: 1 }, memory: '个体生存让力量占据上风。' },
      { label: '让同伴一起分享', hint: '每个个体都少一点，但不会独自面对黑暗', result: '食物变少了，但种群互相靠近，形成了新的默契。', hp: 0, stats: { adaptability: 1, perception: 1 }, memory: '协作带来更稳定的生存方式。' },
    ],
  },
];

export const statLabels: Record<keyof GameStats, string> = {
  strength: '力量',
  perception: '感知',
  adaptability: '适应性',
};

export const evolutionNames: Record<keyof GameStats, string> = {
  strength: '力量型猎手',
  perception: '敏捷型观察者',
  adaptability: '广适应生物',
};

export const evolutionDescriptions: Record<keyof GameStats, string> = {
  strength: '你多次选择正面承受危险、追逐食物或依靠爆发力逃生。你的种群开始相信，强壮的身体可以打开生存空间。',
  perception: '你多次观察环境、等待时机并利用隐蔽处。你的种群开始相信，提前发现危险比战胜危险更重要。',
  adaptability: '你多次接纳陌生食物或主动进入变化中的环境。你的种群开始相信，能够改变自己，才不会被环境淘汰。',
};

export const gameConfig: GameConfig = {
  initialHp: 3,
  maxHp: 3,
  maxRecords: 20,
  events,
  statLabels,
  evolutionNames,
  evolutionDescriptions,
};
