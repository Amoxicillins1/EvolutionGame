import React, { useState } from 'react';
import { Text, View } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { getRecords } from '@/services/records';
import { RunRecord } from '@/types/game';
import { gameConfig } from '@/data/events';
import styles from './index.module.scss';

const RecordsPage: React.FC = () => {
  const [records, setRecords] = useState<RunRecord[]>([]);
  useDidShow(() => setRecords(getRecords()));

  return <View className={styles.page}>
    <View className={styles.header}><Text className={styles.eyebrow}>LINEAGE ARCHIVE</Text><Text className={styles.title}>谱系记录</Text><Text className={styles.subtitle}>每一次尝试，都会留下下一次生存的线索。</Text></View>
    {records.length === 0 ? <View className={styles.empty}><Text className={styles.emptyMark}>◌</Text><Text className={styles.emptyTitle}>还没有谱系记录</Text><Text className={styles.emptyText}>完成第一次五事件生存，就会在这里看到结果。</Text></View> : <View className={styles.list}>{records.map((record) => <View className={styles.recordCard} key={record.id}><View className={styles.recordTop}><Text className={record.extinct ? styles.failed : styles.success}>{record.extinct ? '灭绝' : '完成进化'}</Text><Text className={styles.date}>{record.createdAt}</Text></View><Text className={styles.recordTitle}>{record.result}</Text><View className={styles.stats}>{Object.entries(record.stats).map(([key, value]) => <Text className={styles.stat} key={key}>{gameConfig.statLabels[key as keyof typeof gameConfig.statLabels]} {value}</Text>)}</View><Text className={styles.memory}>{record.memories[record.memories.length - 1]}</Text></View>)}</View>}
  </View>;
};

export default RecordsPage;
