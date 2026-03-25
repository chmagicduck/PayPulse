export interface HomeDashboardSection {
  id: string
  title: string
  description: string
}

export const homeDashboardSections: HomeDashboardSection[] = [
  {
    id: 'docs-first',
    title: '先文档后实现',
    description: '任何正式页面开发都应先补 PRD，再进入 UI 还原。',
  },
  {
    id: 'feature-boundary',
    title: '按 Feature 收口',
    description: '业务状态和动作应收敛在 feature 自己的数据与 helper 中。',
  },
  {
    id: 'theme-layer',
    title: '主题统一收口',
    description: '视觉变化优先通过 theme token 和 recipe 实现。',
  },
]

const HOME_STORAGE_KEY = 'home.scaffold'

export function buildHomeDashboardViewModel() {
  return homeDashboardSections
}

export function readHomeScaffoldFlag() {
  return wx.getStorageSync(HOME_STORAGE_KEY) || null
}

export function writeHomeScaffoldFlag(value: string) {
  wx.setStorageSync(HOME_STORAGE_KEY, value)
}

export const homeDashboardModel = {
  income: {
    value: '¥128.632',
    rate: '航速 0.024/s',
    rateBadge: '自动结算',
    workPercent: 68,
    idlePercent: 32,
    moyuIncome: '¥46.125',
    monthlyIncome: '¥6,340.632',
  },
  timer: {
    leftValue: '02:18:42',
    rightValue: '01:24:16',
  },
  taskPreview: {
    completed: 2,
    total: 6,
    segments: [
      { filled: true },
      { filled: true },
      { filled: false },
      { filled: false },
      { filled: false },
      { filled: false },
    ],
  },
  regularTides: [
    {
      id: 'salary',
      title: '发薪大潮',
      days: '12',
      suffix: '天后',
      tone: 'blue',
    },
    {
      id: 'weekend',
      title: '双休倒计时',
      days: '4',
      suffix: '天后',
      tone: 'emerald',
    },
  ],
  importantDates: [
    {
      id: 'anniversary',
      title: '结婚纪念日',
      date: '10月20日',
      remaining: '28',
      suffix: '天后',
      tone: 'rose',
    },
    {
      id: 'birthday',
      title: '我的生日',
      date: '12月25日',
      remaining: '74',
      suffix: '天后',
      tone: 'amber',
    },
    {
      id: 'bonus',
      title: 'Q3 季度奖金',
      date: '09月30日',
      remaining: '8',
      suffix: '天后',
      tone: 'blue',
    },
  ],
  lifeJourney: [
    {
      id: 'life',
      eyebrow: '生命航程 (LIFE)',
      statusLabel: '已过',
      valueModes: ['11,240天', '30年 10个月 15天', '374个月 20天', '1605周 5天'],
      descriptionPrefix: '这是你从',
      descriptionHighlight: '诞生启航',
      descriptionSuffix: '至今走过的日夜。',
    },
    {
      id: 'career',
      eyebrow: '职场航程 (CAREER)',
      statusLabel: '已过',
      valueModes: ['2,823天', '7年 8个月 18天', '94个月 3天', '403周 2天'],
      descriptionPrefix: '自从步入',
      descriptionHighlight: '社会熔炉',
      descriptionSuffix: '起，你已交付的岁月。',
    },
    {
      id: 'retire',
      eyebrow: '退休倒计时 (RETIRE)',
      statusLabel: '还剩',
      valueModes: ['10,675天', '29年 3个月 10天', '355个月 25天', '1525周 0天'],
      descriptionPrefix: '距离你可以',
      descriptionHighlight: '正式卸甲',
      descriptionSuffix: '，还有这些定额任务。',
      progress: 45,
    },
    {
      id: 'final',
      eyebrow: '终点倒计时 (FINAL)',
      statusLabel: '还剩',
      valueModes: ['19,807天', '54年 3个月 2天', '660个月 7天', '2829周 4天'],
      quote: '"警告：航线即将耗尽，此数据不可逆转。"',
      note: '* 基于预计 85 岁自然终点计算。每一秒都是该生命周期中不可再生的珍贵样本。',
    },
  ],
  editModal: {
    title: '修正避风时长',
    subtitle: '手动校准今日避风港停留的时间',
    cancelText: '取消',
    confirmText: '确认保存',
  },
} as const
