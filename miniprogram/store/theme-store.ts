const THEME_STORAGE_KEY = 'app.theme-id'

let activeThemeId = 'ocean-default'

export function getActiveThemeId() {
  return activeThemeId
}

export function setActiveThemeId(themeId: string) {
  activeThemeId = themeId
  wx.setStorageSync(THEME_STORAGE_KEY, themeId)
}

export function hydrateActiveThemeId(defaultThemeId: string) {
  activeThemeId = wx.getStorageSync(THEME_STORAGE_KEY) || defaultThemeId
  return activeThemeId
}
