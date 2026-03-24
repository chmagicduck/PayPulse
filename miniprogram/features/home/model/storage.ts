const HOME_STORAGE_KEY = 'home.scaffold'

export function readHomeScaffoldFlag() {
  return wx.getStorageSync(HOME_STORAGE_KEY) || null
}

export function writeHomeScaffoldFlag(value: string) {
  wx.setStorageSync(HOME_STORAGE_KEY, value)
}
