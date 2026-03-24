export const labStaticViewModel = {
  header: {
    title: '动力室',
    previewOff: '路线预览',
    previewOn: '预览中',
  },
  rank: {
    level: 'Lv.3 茶歇守卫官',
    todayGain: '45',
    total: '128',
    next: '距离 Lv.4 还差 72',
    progress: '42%',
  },
  rankNodes: [
    { label: '1', active: false },
    { label: '2', active: false },
    { label: '3', active: true },
    { label: '4', active: false },
    { label: '5', active: false },
    { label: '6', active: false },
    { label: '7', active: false },
    { label: '8', active: false },
    { label: '9', active: false },
    { label: '10', active: false },
  ],
  tasks: [
    { id: 'water', title: '深海补水', desc: '喝水一次', reward: '+2 快乐值', count: '3/8', progress: '37%', done: false, tone: 'blue' },
    { id: 'move', title: '甲板活动', desc: '站起来活动', reward: '+3 快乐值', count: '2/10', progress: '20%', done: false, tone: 'emerald' },
    { id: 'eye', title: '远眺海平线', desc: '看远处缓解疲劳', reward: '+3 快乐值', count: '1/10', progress: '10%', done: false, tone: 'amber' },
    { id: 'leave', title: '准点回港', desc: '不加班下班', reward: '+10 快乐值', count: '1/1', progress: '100%', done: true, tone: 'rose' },
  ],
  achievements: [
    { title: '自律航行者', desc: '连续 7 天准点下班', progressLabel: '5 / 7', progress: '71%' },
    { title: '顶级摸鱼师', desc: '累计摸鱼 120 分钟', progressLabel: '85 / 120', progress: '70%' },
    { title: '海洋巨鲸', desc: '一周喝水 40 次', progressLabel: '28 / 40', progress: '70%' },
  ],
} as const
