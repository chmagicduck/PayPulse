export const routes = [
  {
    featureId: 'home',
    pageId: 'dashboard',
    route: 'features/home/pages/dashboard/index',
    kind: 'tab',
  },
  {
    featureId: 'report',
    pageId: 'ocean-report',
    route: 'features/report/pages/ocean-report/index',
    kind: 'tab',
  },
  {
    featureId: 'lab',
    pageId: 'lab',
    route: 'features/lab/pages/lab/index',
    kind: 'tab',
  },
  {
    featureId: 'profile',
    pageId: 'home',
    route: 'features/profile/pages/home/index',
    kind: 'tab',
  },
  {
    featureId: 'profile',
    pageId: 'settings',
    route: 'features/profile/pages/settings/index',
    kind: 'page',
  },
  {
    featureId: 'time-axis',
    pageId: 'time-axis-settings',
    route: 'features/time-axis/pages/time-axis-settings/index',
    kind: 'page',
  },
  {
    featureId: 'calendar',
    pageId: 'calendar',
    route: 'features/calendar/pages/calendar/index',
    kind: 'page',
  },
  {
    featureId: 'community',
    pageId: 'join',
    route: 'features/community/pages/join/index',
    kind: 'page',
  },
  {
    featureId: 'about',
    pageId: 'about',
    route: 'features/about/pages/about/index',
    kind: 'page',
  },
  {
    featureId: 'data-center',
    pageId: 'data-center',
    route: 'features/data-center/pages/data-center/index',
    kind: 'page',
  },
] as const

export type AppRoute = (typeof routes)[number]
