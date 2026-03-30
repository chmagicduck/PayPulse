export const labStaticViewModel = {
  header: {
    title: '摸鱼任务',
  },
  rankPanel: {
    eyebrow: '摸鱼值',
    stagePrefix: 'Lv.',
    stageSuffix: '',
    todayLabel: '今日获取',
    totalLabel: '总摸鱼值',
    targetLabel: '距离下一级',
    maxLabel: '已达到摸鱼天花板',
  },
  sections: {
    tasks: {
      title: '每日摸鱼任务',
      subtitle: '每天按自然日自动重置，别忘了做',
      progressLabel: '完成进度',
      rewardSuffix: ' 摸鱼值',
      doneText: '已刷满',
    },
    achievements: {
      title: '每周打工成就',
      rewardPrefix: '+',
    },
  },
  ranks: [
    { level: 1, name: '职场小透明', exp: 0, iconName: 'shell', tone: 'slate', theme: 'basic', iconColor: '#94a3b8', cardIconColor: '#94a3b8' },
    { level: 2, name: '摸鱼见习生', exp: 100, iconName: 'waves', tone: 'cyan', theme: 'basic', iconColor: '#0891b2', cardIconColor: '#0891b2' },
    { level: 3, name: '带薪喝水员', exp: 260, iconName: 'coffee', tone: 'orange', theme: 'basic', iconColor: '#ea580c', cardIconColor: '#ea580c' },
    { level: 4, name: '厕所所长', exp: 520, iconName: 'wind', tone: 'emerald', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 5, name: '老油条', exp: 900, iconName: 'compass', tone: 'blue', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 6, name: '薪水小偷', exp: 1400, iconName: 'ghost', tone: 'indigo', theme: 'mid', iconColor: '#e2e8f0', cardIconColor: '#ffffff' },
    { level: 7, name: '反内卷斗士', exp: 2050, iconName: 'anchor', tone: 'violet', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 8, name: '带薪拉屎大王', exp: 2900, iconName: 'zap', tone: 'rose', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 9, name: '职场摸鱼学大师', exp: 3950, iconName: 'ship', tone: 'blue', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 10, name: '摸鱼祖师爷', exp: 5200, iconName: 'crown', tone: 'amber', theme: 'ultra', iconColor: '#92400e', cardIconColor: '#92400e' },
  ],
  score: {
    total: 0,
    today: 0,
    selectedRankIndex: 0,
  },
  tasks: [
    { id: 'water', title: '带薪喝水', desc: '去接杯水，顺便离开工位透个气。', reward: 1, count: 0, limit: 8, tone: 'blue', iconName: 'droplets' },
    { id: 'move', title: '带薪扭腰', desc: '站起来走两步，别把腰坐坏了。', reward: 1, count: 0, limit: 10, tone: 'emerald', iconName: 'accessibility' },
    { id: 'eye', title: '发呆眺望', desc: '看看窗外的风景，给眼睛放个假。', reward: 1, count: 0, limit: 10, tone: 'amber', iconName: 'eye' },
    { id: 'leave', title: '准点下班', desc: '到点就跑，一秒不留，拒绝无意义加班。', reward: 12, count: 0, limit: 1, tone: 'rose', iconName: 'log-out' },
    { id: 'toilet', title: '带薪拉屎', desc: '带薪蹲坑，累计清空压力的分钟数。', reward: 4, count: 0, limit: 5, tone: 'indigo', iconName: 'navigation', rotate: true },
  ],
  achievements: [
    { id: 'discipline', title: '下班急先锋', desc: '本周连续 7 天到点就跑，绝不加班。', reward: 50, progress: 0, target: 7 },
    { id: 'idle-master', title: '厕所钉子户', desc: '本周累计带薪拉屎 120 分钟以上。', reward: 50, progress: 0, target: 120, unit: '分钟' },
    { id: 'whale', title: '水遁大师', desc: '本周累计完成 40 次带薪喝水。', reward: 50, progress: 0, target: 40 },
  ],
} as const
