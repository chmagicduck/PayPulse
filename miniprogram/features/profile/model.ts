export const profileHomeModel = {
  user: {
    name: '摸鱼小队长',
    checkInDays: 10,
    rank: {
      level: 9,
      name: '摸鱼霸主',
      tone: 'rose',
      iconName: 'ship',
      iconColor: '#e11d48',
    },
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
      title: '我的职场档案',
      tone: 'blue',
      iconName: 'user',
      iconColor: '#3b82f6',
      url: '/features/profile-settings/profile-settings',
    },
    {
      title: '纪念日设置',
      tone: 'emerald',
      iconName: 'map-pin',
      iconColor: '#10b981',
      url: '/features/time-axis/time-axis',
    },
    {
      title: '查看打工日历',
      tone: 'indigo',
      iconName: 'calendar',
      iconColor: '#4f46e5',
      url: '/features/calendar/calendar',
    }
  ],
  aboutItems: [
    {
      title: '打工人交流群',
      tone: 'indigo',
      iconName: 'users',
      iconColor: '#6366f1',
      url: '/features/community/community',
    },
    {
      title: '系统通知',
      tone: 'slate',
      iconName: 'info',
      iconColor: '#64748b',
      url: '/features/about/about',
    },
  ],
  storageItems: [
    {
      title: '数据同步中心',
      tone: 'amber',
      iconName: 'database',
      iconColor: '#f59e0b',
      highlight: true,
      url: '/features/data-center/data-center',
    },
  ],
} as const
