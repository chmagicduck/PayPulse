export const routes = [
  {
    featureId: 'home',
    pageId: 'home',
    route: 'features/home/home',
    kind: 'tab',
  },
  {
    featureId: 'report',
    pageId: 'report',
    route: 'features/report/report',
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
    pageId: 'profile',
    route: 'features/profile/profile',
    kind: 'tab',
  },
  {
    featureId: 'profile-settings',
    pageId: 'profile-settings',
    route: 'features/profile-settings/profile-settings',
    kind: 'page',
  },
  {
    featureId: 'time-axis',
    pageId: 'time-axis',
    route: 'features/time-axis/time-axis',
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
    pageId: 'community',
    route: 'features/community/community',
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
