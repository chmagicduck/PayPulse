export const routes = [
  {
    featureId: 'home',
    pageId: 'dashboard',
    route: 'features/home/pages/dashboard',
    kind: 'tab',
  },
  {
    featureId: 'report',
    pageId: 'ocean-report',
    route: 'features/report/pages/ocean-report',
    kind: 'tab',
  },
  {
    featureId: 'lab',
    pageId: 'lab',
    route: 'features/lab/pages/lab',
    kind: 'tab',
  },
  {
    featureId: 'profile',
    pageId: 'home',
    route: 'features/profile/pages/home',
    kind: 'tab',
  },
  {
    featureId: 'profile-settings',
    pageId: 'settings',
    route: 'features/profile-settings/pages/settings',
    kind: 'page',
  },
  {
    featureId: 'time-axis',
    pageId: 'time-axis-settings',
    route: 'features/time-axis/pages/time-axis-settings',
    kind: 'page',
  },
  {
    featureId: 'calendar',
    pageId: 'calendar',
    route: 'features/calendar/pages/calendar',
    kind: 'page',
  },
  {
    featureId: 'community',
    pageId: 'join',
    route: 'features/community/pages/join',
    kind: 'page',
  },
  {
    featureId: 'about',
    pageId: 'about',
    route: 'features/about/pages/about',
    kind: 'page',
  },
  {
    featureId: 'data-center',
    pageId: 'data-center',
    route: 'features/data-center/pages/data-center',
    kind: 'page',
  },
] as const

export type AppRoute = (typeof routes)[number]
