import React from 'react';
import { Button, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { clearRecords } from '@/services/records';
import styles from './index.module.scss';

const SettingsPage: React.FC = () => {
  const handleClear = () => {
    Taro.showModal({ title: '清除谱系记录', content: '这会删除本机保存的所有生存记录，确定继续吗？', success: ({ confirm }) => { if (confirm) { clearRecords(); Taro.showToast({ title: '已清除', icon: 'success' }); } } });
  };
  return <View className={styles.page}><View className={styles.header}><Text className={styles.eyebrow}>FIELD NOTES</Text><Text className={styles.title}>设置</Text><Text className={styles.subtitle}>当前版本专注于验证事件选择与进化结果。</Text></View><View className={styles.card}><Text className={styles.cardTitle}>本地数据</Text><Text className={styles.cardText}>谱系记录只保存在当前设备，不会上传到网络。</Text><Button className={styles.dangerButton} onClick={handleClear}>清除谱系记录</Button></View><View className={styles.about}><Text className={styles.aboutTitle}>潮汐之前 · 可玩首版</Text><Text className={styles.aboutText}>远古海洋 / 五个事件 / 三条进化方向</Text></View></View>;
};

export default SettingsPage;
