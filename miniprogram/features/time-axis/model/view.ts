export const timeAxisViewModel = {
  notebooks: [
    { id: 'all', name: '全部', iconId: 'layers', tone: 'slate' },
    { id: 'commemorative', name: '纪念日', iconId: 'heart', tone: 'rose' },
    { id: 'travel', name: '旅行本', iconId: 'map', tone: 'amber' },
    { id: 'life', name: '人生本', iconId: 'user', tone: 'blue' },
    { id: 'career', name: '打工本', iconId: 'briefcase', tone: 'indigo' },
  ],
  draft: {
    title: '',
    date: '',
    notebookId: 'commemorative',
    isAnniversary: true,
  },
} as const
