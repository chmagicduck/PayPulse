export function safeGetStorage<T>(key: string, fallback: T): T {
  const value = wx.getStorageSync(key)
  return (value || fallback) as T
}

export function safeSetStorage(key: string, value: unknown) {
  wx.setStorageSync(key, value)
}
