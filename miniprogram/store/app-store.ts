const appState = {
  lastVisitedRoute: 'features/home/home',
}

export function getAppState() {
  return appState
}

export function setLastVisitedRoute(route: string) {
  appState.lastVisitedRoute = route
}
