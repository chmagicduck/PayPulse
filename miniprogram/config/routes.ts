export const routes = [
  {
    featureId: 'home',
    pageId: 'dashboard',
    route: 'features/home/dashboard',
    kind: 'tab',
  },
  {
    featureId: 'report',
    pageId: 'ocean-report',
    route: 'features/report/ocean-report',
    kind: 'tab',
  },
  {
    featureId: 'lab',
    pageId: 'lab',
    route: 'features/lab/lab',
    kind: 'tab',
  },
  {
    featureId: 'profile',
    pageId: 'home',
    route: 'features/profile/home',
    kind: 'tab',
  },
  {
    featureId: 'profile-settings',
    pageId: 'settings',
    route: 'features/profile-settings/settings',
    kind: 'page',
  },
  {
    featureId: 'time-axis',
    pageId: 'time-axis-settings',
    route: 'features/time-axis/time-axis-settings',
    kind: 'page',
  },
  {
    featureId: 'calendar',
    pageId: 'calendar',
    route: 'features/calendar/calendar',
    kind: 'page',
  },
  {
    featureId: 'community',
    pageId: 'join',
    route: 'features/community/join',
    kind: 'page',
  },
  {
    featureId: 'about',
    pageId: 'about',
    route: 'features/about/about',
    kind: 'page',
  },
  {
    featureId: 'data-center',
    pageId: 'data-center',
    route: 'features/data-center/data-center',
    kind: 'page',
  },
] as const

export type AppRoute = (typeof routes)[number]
