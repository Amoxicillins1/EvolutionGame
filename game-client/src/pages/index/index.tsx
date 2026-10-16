import React, { useMemo, useState } from 'react';
import { Button, Text, View } from '@tarojs/components';
import { gameConfig } from '@/data/events';
import { choose as chooseGame, createGame, getTopStat, statKeys } from '@/services/game';
import { saveRecord } from '@/services/records';
import { GameState } from '@/types/game';
import styles from './index.module.scss';

const IndexPage: React.FC = () => {
  const [game, setGame] = useState<GameState>(createGame);
  const event = gameConfig.events[game.eventIndex];
  const topStat = useMemo(() => getTopStat(game.stats), [game.stats]);

  const restart = () => setGame(createGame());

  const choose = (choiceIndex: number) => {
    const nextGame = chooseGame(game, event.choices[choiceIndex]);
    setGame(nextGame);
    console.info('[Evolution] choice', { eventIndex: game.eventIndex, choiceIndex, nextGame });

    if (nextGame.result) {
      saveRecord({
        id: `${Date.now()}`,
        createdAt: new Date().toLocaleString('zh-CN'),
        result: nextGame.result.title,
        extinct: nextGame.result.extinct,
        stats: nextGame.stats,
        memories: nextGame.memories,
      });
    }
  };

  const { eventIndex, hp, stats, memories, result } = game;

  if (result) {
    return (
      <View className={styles.page}>
        <View className={styles.resultCard}>
          <View className={result.extinct ? styles.resultMarkDanger : styles.resultMark}> {result.extinct ? '×' : '✦'} </View>
          <Text className={styles.eyebrow}>进化结算</Text>
          <Text className={styles.resultTitle}>{result.title}</Text>
          <Text className={styles.resultLead}>{result.extinct ? '失败也会改变下一次选择。' : '这不是随机结果，而是你在环境中反复坚持的方向。'}</Text>
          <View className={styles.reasonBox}>
            <Text className={styles.reasonLabel}>为什么是它？</Text>
            <Text className={styles.reason}>{result.reason}</Text>
            <View className={styles.resultStats}>
              {statKeys.map((key) => <View className={styles.resultStat} key={key}><Text className={styles.resultNumber}>{stats[key]}</Text><Text className={styles.resultStatLabel}>{gameConfig.statLabels[key]}</Text></View>)}
            </View>
          </View>
          <Button className={styles.primaryButton} onClick={restart}>重新尝试</Button>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View><Text className={styles.eyebrow}>EVOLUTION SURVIVAL / 01</Text><Text className={styles.title}>潮汐之前</Text><Text className={styles.subtitle}>在成为某种生物之前，先学会活下去。</Text></View>
        <Text className={styles.lineage}>单细胞生命</Text>
      </View>
      <View className={styles.sceneCard}>
        <View className={styles.sceneArt}><Text className={styles.sceneSmall}>远古海洋 · 约 5 亿年前</Text><Text className={styles.sceneMood}>{event.mood}</Text></View>
        <View className={styles.eventBody}>
          <Text className={styles.eventCount}>事件 {eventIndex + 1} / {gameConfig.events.length}</Text>
          <Text className={styles.eventTitle}>{event.title}</Text>
          <Text className={styles.eventText}>{event.text}</Text>
          <View className={styles.choices}>{event.choices.map((choice, index) => <Button className={styles.choice} key={choice.label} onClick={() => choose(index)}><Text className={styles.choiceNumber}>{index + 1}</Text><View className={styles.choiceCopy}><Text className={styles.choiceLabel}>{choice.label}</Text><Text className={styles.choiceHint}>{choice.hint}</Text></View><Text className={styles.choiceArrow}>›</Text></Button>)}</View>
          <View className={styles.healthRow}><Text className={styles.healthLabel}>种群活力</Text><View className={styles.health}>{Array.from({ length: gameConfig.maxHp }, (_, index) => <View className={index < hp ? styles.heart : styles.heartEmpty} key={index} />)}</View></View>
        </View>
      </View>
      <View className={styles.sideCard}>
        <Text className={styles.cardTitle}>正在形成的倾向</Text>
        <Text className={styles.cardIntro}>你没有直接选择物种。连续的生存策略，会慢慢改变种群的方向。</Text>
        <View className={styles.statList}>{statKeys.map((key) => <View className={styles.statItem} key={key}><View className={styles.statHead}><Text>{gameConfig.statLabels[key]}</Text><Text className={styles.statValue}>{stats[key]}</Text></View><View className={styles.bar}><View className={styles.barFill} style={{ width: `${Math.min(100, 5 + stats[key] * 19)}%` }} /></View></View>)}</View>
        <Text className={styles.traitNote}>{stats[topStat] === 0 ? '目前还没有明显倾向。每一次选择都会留下痕迹。' : `目前最明显的是“${gameConfig.statLabels[topStat]}”倾向。继续选择，方向会越来越清晰。`}</Text>
        <View className={styles.memory}><Text className={styles.memoryTitle}>本局记忆</Text><Text className={styles.memoryText}>{memories[memories.length - 1] || '这是你的第一次尝试。先活下来，再看看会变成什么。'}</Text></View>
      </View>
    </View>
  );
};

export default IndexPage;
