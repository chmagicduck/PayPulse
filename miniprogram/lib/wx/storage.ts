export function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const value = wx.getStorageSync(key)
    return value === '' || typeof value === 'undefined' ? fallback : (value as T)
  } catch (_error) {
    return fallback
  }
}

export function safeSetStorage(key: string, value: unknown) {
  wx.setStorageSync(key, value)
}

export function safeRemoveStorage(key: string) {
  try {
    wx.removeStorageSync(key)
  } catch (_error) {
    // noop
  }
}

export function safeGetStorageInfo() {
  try {
    return wx.getStorageInfoSync()
  } catch (_error) {
    return {
      keys: [] as string[],
      currentSize: 0,
      limitSize: 10 * 1024,
    }
  }
}
