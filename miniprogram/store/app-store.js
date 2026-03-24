"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppState = getAppState;
exports.setLastVisitedRoute = setLastVisitedRoute;
const appState = {
    lastVisitedRoute: 'features/home/pages/dashboard/index',
};
function getAppState() {
    return appState;
}
function setLastVisitedRoute(route) {
    appState.lastVisitedRoute = route;
}
