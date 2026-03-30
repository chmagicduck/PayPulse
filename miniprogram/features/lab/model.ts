export const labStaticViewModel = {
  header: {
    title: '动力舱',
  },
  rankPanel: {
    eyebrow: '动能舱',
    stagePrefix: '第',
    stageSuffix: '阶段',
    todayLabel: '今日动能',
    totalLabel: '总动能',
    targetLabel: '下一等级',
    maxLabel: '已抵达满级航道',
  },
  sections: {
    tasks: {
      title: '每日任务',
      subtitle: '每日打开时自动按自然日重置',
      progressLabel: '任务进度',
      rewardSuffix: ' 动能',
      doneText: '已达上限',
    },
    achievements: {
      title: '每周成就',
      rewardPrefix: '+',
    },
  },
  ranks: [
    { level: 1, name: '海湾漫步者', exp: 0, iconName: 'shell', tone: 'slate', theme: 'basic', iconColor: '#94a3b8', cardIconColor: '#94a3b8' },
    { level: 2, name: '浅滩摸鱼手', exp: 100, iconName: 'waves', tone: 'cyan', theme: 'basic', iconColor: '#0891b2', cardIconColor: '#0891b2' },
    { level: 3, name: '茶歇守望员', exp: 260, iconName: 'coffee', tone: 'orange', theme: 'basic', iconColor: '#ea580c', cardIconColor: '#ea580c' },
    { level: 4, name: '风平掌舵人', exp: 520, iconName: 'wind', tone: 'emerald', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 5, name: '资深航迹师', exp: 900, iconName: 'compass', tone: 'blue', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 6, name: '深海潜航员', exp: 1400, iconName: 'ghost', tone: 'indigo', theme: 'mid', iconColor: '#e2e8f0', cardIconColor: '#ffffff' },
    { level: 7, name: '风暴避险者', exp: 2050, iconName: 'anchor', tone: 'violet', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 8, name: '核芯巡航长', exp: 2900, iconName: 'zap', tone: 'rose', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 9, name: '深海舰长', exp: 3950, iconName: 'ship', tone: 'blue', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 10, name: '满级灯塔', exp: 5200, iconName: 'crown', tone: 'amber', theme: 'ultra', iconColor: '#92400e', cardIconColor: '#92400e' },
  ],
  score: {
    total: 0,
    today: 0,
    selectedRankIndex: 0,
  },
  tasks: [
    { id: 'water', title: '深海补水计划', desc: '喝一杯水，保持清醒与续航。', reward: 1, count: 0, limit: 8, tone: 'blue', iconName: 'droplets' },
    { id: 'move', title: '甲板体能回收', desc: '起身活动一次，避免久坐卡顿。', reward: 1, count: 0, limit: 10, tone: 'emerald', iconName: 'accessibility' },
    { id: 'eye', title: '远场海平线', desc: '做一次远眺，给视线放个风。', reward: 1, count: 0, limit: 10, tone: 'amber', iconName: 'eye' },
    { id: 'leave', title: '准点回港靠岸', desc: '准点下班一次，守住自己的边界。', reward: 12, count: 0, limit: 1, tone: 'rose', iconName: 'log-out' },
    { id: 'toilet', title: '潜艇压力排放', desc: '离开工位放空一会儿，累计减压分钟。', reward: 4, count: 0, limit: 5, tone: 'indigo', iconName: 'navigation', rotate: true },
  ],
  achievements: [
    { id: 'discipline', title: '黄金航线守护者', desc: '本周连续 7 天准点回港靠岸。', reward: 50, progress: 0, target: 7 },
    { id: 'idle-master', title: '静默巡航专家', desc: '本周累计完成 120 分钟压力排放。', reward: 50, progress: 0, target: 120, unit: '分钟' },
    { id: 'whale', title: '满点核动力', desc: '本周累计完成 40 次深海补水计划。', reward: 50, progress: 0, target: 40 },
  ],
} as const
