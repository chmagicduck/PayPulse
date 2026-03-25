export const labStaticViewModel = {
  header: {
    title: '动力室',
  },
  rankPanel: {
    eyebrow: '当前航行等级',
    todayLabel: '今日进度',
    todayUnit: 'PTS',
    totalLabel: '累计',
    nextLabel: '下级需',
    maxLabel: '最高等级',
  },
  sections: {
    tasks: {
      title: '日常巡航任务',
      subtitle: '每日 00:00 重置',
      progressLabel: 'Progress',
      rewardUnit: 'PTS',
      doneText: '已达成',
    },
    achievements: {
      title: '荣誉勋章',
      rewardPrefix: '+',
      rewardSuffix: ' PTS',
    },
  },
  ranks: [
    { level: 1, name: '海滩漫步者', exp: 0, iconName: 'shell', tone: 'slate', iconColor: '#94a3b8' },
    { level: 2, name: '浅滩摸鱼手', exp: 50, iconName: 'waves', tone: 'cyan', iconColor: '#0891b2' },
    { level: 3, name: '茶歇守卫官', exp: 120, iconName: 'coffee', tone: 'orange', iconColor: '#ea580c' },
    { level: 4, name: '划水见习生', exp: 200, iconName: 'wind', tone: 'emerald', iconColor: '#10b981' },
    { level: 5, name: '资深舵手', exp: 350, iconName: 'compass', tone: 'blue', iconColor: '#3b82f6' },
    { level: 6, name: '隐身巡航员', exp: 500, iconName: 'ghost', tone: 'indigo', iconColor: '#6366f1' },
    { level: 7, name: '风暴避难者', exp: 750, iconName: 'anchor', tone: 'violet', iconColor: '#7c3aed' },
    { level: 8, name: '极速快艇王', exp: 1000, iconName: 'zap', tone: 'yellow', iconColor: '#a16207' },
    { level: 9, name: '深海霸主', exp: 1500, iconName: 'ship', tone: 'rose', iconColor: '#e11d48' },
    { level: 10, name: '深海大懒兽', exp: 2000, iconName: 'crown', tone: 'amber', iconColor: '#d97706' },
  ],
  score: {
    total: 128,
    today: 45,
    selectedRankIndex: 2,
  },
  tasks: [
    { id: 'water', title: '深海补水', desc: '喝水一次', reward: 2, count: 3, limit: 8, tone: 'blue', iconName: 'droplets' },
    { id: 'move', title: '甲板活动', desc: '站起来活动', reward: 3, count: 2, limit: 10, tone: 'emerald', iconName: 'accessibility' },
    { id: 'eye', title: '远眺海平线', desc: '看远处缓解疲劳', reward: 3, count: 1, limit: 10, tone: 'amber', iconName: 'eye' },
    { id: 'leave', title: '准点回港', desc: '不加班下班', reward: 10, count: 0, limit: 1, tone: 'rose', iconName: 'log-out' },
    { id: 'toilet', title: '潜艇维护', desc: '带薪蹲坑', reward: 5, count: 1, limit: 5, tone: 'indigo', iconName: 'navigation', rotate: true },
  ],
  achievements: [
    { id: 'discipline', title: '自律航行者', desc: '连续7天准点下班', reward: 50, progress: 5, target: 7 },
    { id: 'idle-master', title: '顶级摸鱼师', desc: '累计摸鱼120分钟', reward: 50, progress: 85, target: 120 },
    { id: 'whale', title: '海洋巨鲸', desc: '一周喝水40次', reward: 50, progress: 28, target: 40 },
  ],
} as const
