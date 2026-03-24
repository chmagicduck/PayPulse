export const profileHomeStaticViewModel = {
  user: {
    name: '摸鱼小队长',
    id: 'ID: 20260324',
    badge: 'VIP',
    rank: 'Lv.5 资深舵手',
    totalHappiness: '100',
    progress: '50%',
  },
  avatarPresets: [
    { id: 'preset-1', label: 'M1' },
    { id: 'preset-2', label: 'A2' },
    { id: 'preset-3', label: 'J3' },
    { id: 'preset-4', label: 'L4' },
    { id: 'preset-5', label: 'N5' },
    { id: 'preset-6', label: 'Z6' },
  ],
  entryGroups: {
    primary: [
      { route: '/features/profile/pages/settings/index', title: '基本信息设置', desc: '修改航行 ID、薪资基数及工时', tone: 'blue', iconLabel: '档' },
      { route: '/features/time-axis/pages/time-axis-settings/index', title: '岁月坐标设置', desc: '管理重要时间节点与纪念日', tone: 'emerald', iconLabel: '坐' },
      { route: '/features/calendar/pages/calendar/index', title: '查看日历', desc: '纵览航行周期与重要考勤节点', tone: 'indigo', iconLabel: '历' },
      { route: '/features/lab/pages/lab/index', title: '任务中心设置', desc: '配置每日航行目标与奖励', tone: 'rose', badge: '3', iconLabel: '任' },
    ],
    secondary: [
      { route: '/features/community/pages/join/index', title: '加入社群', desc: '与万千舵手交流摸鱼心得' },
      { route: '/features/about/pages/about/index', title: '关于软件', desc: '版本 v1.0.0 (Stage 1 Static)' },
    ],
    storage: {
      route: '/features/data-center/pages/data-center/index',
      title: '数据管理中心',
      desc: '本地备份、同步与隐私清理',
    },
  },
} as const

export const profileSettingsStaticViewModel = {
  title: '航行档案设置',
  bannerTitle: '校准你的航向',
  bannerDescription: '输入坐标参数，静态阶段先完成高保真表单还原，后续再接正式校验与存储。',
  workModes: [
    { key: 'double', text: '双休' },
    { key: 'single-sat', text: '休六' },
    { key: 'single-sun', text: '休日' },
    { key: 'big-small', text: '大小周' },
  ],
  form: {
    nickname: '摸鱼小队长',
    birthday: '1995-06-15',
    gender: 'male',
    careerStartDate: '2018-07-01',
    retirementAge: '60',
    expectedLifespan: '85',
    monthlySalary: '15000',
    payDay: '10',
    workMode: 'double',
    isCurrentBigWeek: true,
    startTime: '09:00',
    endTime: '18:00',
    lunchBreakEnabled: false,
    lunchStartTime: '12:00',
    lunchEndTime: '13:30',
  },
} as const
