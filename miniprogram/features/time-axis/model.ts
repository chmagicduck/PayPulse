export const timeAxisModel = {
  notebooks: [
    { id: 'all', name: '全部', iconId: 'layers', tone: 'slate' },
    { id: 'commemorative', name: '纪念日', iconId: 'heart', tone: 'rose' },
    { id: 'travel', name: '旅行本', iconId: 'map', tone: 'amber' },
    { id: 'life', name: '人生本', iconId: 'user', tone: 'blue' },
    { id: 'career', name: '职场本', iconId: 'briefcase', tone: 'indigo' },
  ],
  entries: [
    {
      id: 'anniversary',
      title: '结婚纪念日',
      date: '2023-10-20',
      notebookId: 'commemorative',
      isAnniversary: true,
    },
    {
      id: 'travel-memory',
      title: '西藏大冒险',
      date: '2024-05-12',
      notebookId: 'travel',
      isAnniversary: false,
    },
    {
      id: 'career-milestone',
      title: '拿到高级架构师证',
      date: '2022-07-15',
      notebookId: 'career',
      isAnniversary: false,
    },
  ],
  draft: {
    title: '',
    date: '',
    notebookId: 'commemorative',
    isAnniversary: true,
  },
} as const
