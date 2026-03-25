const appState = {
  lastVisitedRoute: 'features/home/pages/dashboard',
}

export function getAppState() {
  return appState
}

export function setLastVisitedRoute(route: string) {
  appState.lastVisitedRoute = route
}
