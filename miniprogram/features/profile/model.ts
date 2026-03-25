export const profileHomeModel = {
  user: {
    name: '摸鱼小队长',
    checkInDays: 10,
  },
  avatarPresets: [
    { id: 'preset-1', label: 'Felix', src: '/assets/images/profile/avatar-felix.svg' },
    { id: 'preset-2', label: 'Aneka', src: '/assets/images/profile/avatar-aneka.svg' },
    { id: 'preset-3', label: 'Jasper', src: '/assets/images/profile/avatar-jasper.svg' },
    { id: 'preset-4', label: 'Milo', src: '/assets/images/profile/avatar-milo.svg' },
    { id: 'preset-5', label: 'Luna', src: '/assets/images/profile/avatar-luna.svg' },
    { id: 'preset-6', label: 'Zoe', src: '/assets/images/profile/avatar-zoe.svg' },
  ],
  consoleItems: [
    {
      title: '基本信息设置',
      desc: '修改航行昵称、薪资基数与工时安排',
      tone: 'blue',
      iconName: 'user',
      iconColor: '#3b82f6',
      url: '/features/profile-settings/settings',
    },
    {
      title: '岁月坐标设置',
      desc: '管理重要时间节点与纪念坐标',
      tone: 'emerald',
      iconName: 'map-pin',
      iconColor: '#10b981',
      url: '/features/time-axis/time-axis-settings',
    },
    {
      title: '查看日历',
      desc: '纵览航行周期与重要考勤节点',
      tone: 'indigo',
      iconName: 'calendar',
      iconColor: '#4f46e5',
      url: '/features/calendar/calendar',
    },
  ],
  aboutItems: [
    {
      title: '加入社区',
      desc: '与万千舵手交流摸鱼心得',
      iconName: 'users',
      iconColor: '#64748b',
      url: '/features/community/join',
    },
    {
      title: '关于软件',
      desc: '版本 v1.0.0',
      iconName: 'info',
      iconColor: '#64748b',
      url: '/features/about/about',
    },
  ],
  storageCard: {
    title: '数据管理中心',
    desc: '本地备份、同步与隐私清理',
    iconName: 'database',
    iconColor: '#60a5fa',
    url: '/features/data-center/data-center',
  },
} as const
