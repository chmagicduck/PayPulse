export const profileHomeStaticViewModel = {
  header: {
    title: '个人基地',
  },
  user: {
    name: '摸鱼小队长',
    checkInDays: 10,
  },
  rankPanel: {
    eyebrow: '当前航行等级',
    todayLabel: '今日进度',
    todayUnit: 'PTS',
    totalLabel: '累计',
    nextLabel: '下级需',
    maxLabel: '最高等级',
    totalHappiness: 350,
    todayHappiness: 45,
    selectedRankIndex: 4,
  },
  ranks: [
    { level: 1, name: '海滩漫步者', iconName: 'shell', tone: 'slate', iconColor: '#94a3b8', nextExp: 20 },
    { level: 2, name: '浅滩摸鱼手', iconName: 'waves', tone: 'cyan', iconColor: '#06b6d4', nextExp: 50 },
    { level: 3, name: '茶歇守卫官', iconName: 'coffee', tone: 'orange', iconColor: '#f97316', nextExp: 100 },
    { level: 4, name: '划水见习生', iconName: 'wind', tone: 'emerald', iconColor: '#10b981', nextExp: 200 },
    { level: 5, name: '资深舵手', iconName: 'compass', tone: 'blue', iconColor: '#3b82f6', nextExp: 400 },
    { level: 6, name: '隐身巡航员', iconName: 'ghost', tone: 'indigo', iconColor: '#6366f1', nextExp: 700 },
    { level: 7, name: '风暴避难者', iconName: 'anchor', tone: 'violet', iconColor: '#8b5cf6', nextExp: 1100 },
    { level: 8, name: '极速快艇王', iconName: 'zap', tone: 'yellow', iconColor: '#ca8a04', nextExp: 1600 },
    { level: 9, name: '深海霸主', iconName: 'ship', tone: 'rose', iconColor: '#e11d48', nextExp: 2200 },
    { level: 10, name: '深海大懒兽', iconName: 'crown', tone: 'amber', iconColor: '#d97706', nextExp: null },
  ],
  avatarPresets: [
    { id: 'preset-1', label: 'Felix', src: '/assets/images/profile/avatar-felix.svg' },
    { id: 'preset-2', label: 'Aneka', src: '/assets/images/profile/avatar-aneka.svg' },
    { id: 'preset-3', label: 'Jasper', src: '/assets/images/profile/avatar-jasper.svg' },
    { id: 'preset-4', label: 'Milo', src: '/assets/images/profile/avatar-milo.svg' },
    { id: 'preset-5', label: 'Luna', src: '/assets/images/profile/avatar-luna.svg' },
    { id: 'preset-6', label: 'Zoe', src: '/assets/images/profile/avatar-zoe.svg' },
  ],
  sections: {
    console: {
      title: '航行控制台',
      items: [
        {
          title: '基本信息设置',
          desc: '修改航行昵称、薪资基数及工时',
          tone: 'blue',
          iconName: 'user',
          iconColor: '#3b82f6',
          url: '/features/profile-settings/pages/settings',
        },
        {
          title: '岁月坐标设置',
          desc: '管理重要的时间节点与纪念日',
          tone: 'emerald',
          iconName: 'map-pin',
          iconColor: '#10b981',
          url: '/features/time-axis/pages/time-axis-settings',
        },
        {
          title: '查看日历',
          desc: '纵览航行周期与重要考勤节点',
          tone: 'indigo',
          iconName: 'calendar',
          iconColor: '#4f46e5',
          url: '/features/calendar/pages/calendar',
        }
      ],
    },
    about: {
      title: '关于与社群',
      items: [
        {
          title: '加入社群',
          desc: '与万千船手交流摸鱼心得',
          iconName: 'users',
          iconColor: '#64748b',
          url: '/features/community/pages/join',
        },
        {
          title: '关于软件',
          desc: '版本 v2.4.0 (Build 2024)',
          iconName: 'info',
          iconColor: '#64748b',
          url: '/features/about/pages/about',
        },
      ],
    },
    storage: {
      sectionTitle: '安全与存储',
      title: '数据管理中心',
      desc: '本地备份、同步与隐私清理',
      iconName: 'database',
      iconColor: '#60a5fa',
      url: '/features/data-center/pages/data-center',
    },
  },
  modal: {
    title: '更换基地身份',
    subtitle: 'Select Preset Avatar',
    confirmText: '确认修改',
    avatarHint: '更换',
  },
} as const
