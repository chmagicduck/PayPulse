export const routes = [
  {
    featureId: 'home',
    pageId: 'dashboard',
    route: 'features/home/pages/dashboard/index',
    kind: 'tab',
  },
] as const

export type AppRoute = (typeof routes)[number]
