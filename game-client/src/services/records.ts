import Taro from '@tarojs/taro';
import { gameConfig } from '@/data/events';
import { RunRecord } from '@/types/game';

const RECORDS_KEY = 'tidal-evolution-records';

export const getRecords = (): RunRecord[] => {
  const records = Taro.getStorageSync<RunRecord[]>(RECORDS_KEY);
  return Array.isArray(records) ? records : [];
};

export const saveRecord = (record: RunRecord): void => {
  const records = getRecords();
  Taro.setStorageSync(RECORDS_KEY, [record, ...records].slice(0, gameConfig.maxRecords));
};

export const clearRecords = (): void => {
  Taro.removeStorageSync(RECORDS_KEY);
};
