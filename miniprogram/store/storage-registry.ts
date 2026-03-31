import { storageKeys } from '../lib/constants/storage'
import type { AppBootstrapState, ManagedStorageExportItem } from '../lib/domain/types'
import { safeGetStorage, safeGetStorageInfo, safeRemoveStorage } from '../lib/wx/storage'
import { clearStoredProfileAvatar, exportProfileAvatarBackup } from '../features/profile/model/storage'

type ManagedStorageEntry = {
  key: string
  label: string
  legacy?: boolean
  read: () => unknown
  clear?: () => void
}

const defaultBootstrapState: AppBootstrapState = {
  schemaVersion: '1.0.0',
  status: 'needs_setup',
  initializedAt: null,
  lastResetAt: null,
}

const managedStorageEntries: ManagedStorageEntry[] = [
  {
    key: storageKeys.appBootstrapState,
    label: '应用初始化状态',
    read: () => safeGetStorage(storageKeys.appBootstrapState, defaultBootstrapState),
  },
  {
    key: storageKeys.profileSettings,
    label: '职场档案',
    read: () => safeGetStorage(storageKeys.profileSettings, null),
  },
  {
    key: storageKeys.profileAvatar,
    label: '个人头像',
    read: () => safeGetStorage(storageKeys.profileAvatar, null),
    clear: clearStoredProfileAvatar,
  },
  {
    key: storageKeys.homeDailySession,
    label: '每日航行记录',
    read: () => safeGetStorage(storageKeys.homeDailySession, {}),
  },
  {
    key: storageKeys.homeAmountVisibility,
    label: '金额显隐偏好',
    read: () => safeGetStorage(storageKeys.homeAmountVisibility, true),
  },
  {
    key: storageKeys.labProgress,
    label: '实验室进度',
    read: () => safeGetStorage(storageKeys.labProgress, null),
  },
  {
    key: storageKeys.timeAxisEntries,
    label: '时间轴事件',
    read: () => safeGetStorage(storageKeys.timeAxisEntries, []),
  },
  {
    key: storageKeys.moyuSession,
    label: '摸鱼会话',
    read: () => safeGetStorage(storageKeys.moyuSession, null),
  },
  {
    key: storageKeys.homeScaffold,
    label: '首页旧版脚手架缓存',
    legacy: true,
    read: () => safeGetStorage(storageKeys.homeScaffold, null),
  },
  {
    key: storageKeys.reportHistoryAdjustments,
    label: '报表旧版历史修正缓存',
    legacy: true,
    read: () => safeGetStorage(storageKeys.reportHistoryAdjustments, null),
  },
]

export function getManagedStorageKeys() {
  return managedStorageEntries.map(entry => entry.key)
}

export function measureManagedStorage() {
  const info = safeGetStorageInfo()
  const managedKeys = new Set(getManagedStorageKeys())

  return {
    usedMb: info.currentSize / 1024,
    capacityMb: info.limitSize / 1024,
    keyCount: info.keys.length,
    managedKeyCount: info.keys.filter(key => managedKeys.has(key)).length,
    unmanagedKeys: info.keys.filter(key => !managedKeys.has(key)),
  }
}

export function readManagedStorageExportItems(): ManagedStorageExportItem[] {
  const storageInfo = safeGetStorageInfo()
  const existingKeys = new Set(storageInfo.keys)
  const managedKeys = new Set(getManagedStorageKeys())

  const managedItems = managedStorageEntries.map(entry => ({
    key: entry.key,
    label: entry.label,
    exists: existingKeys.has(entry.key),
    legacy: Boolean(entry.legacy),
    value: entry.read(),
  }))

  const unmanagedItems = storageInfo.keys
    .filter(key => !managedKeys.has(key))
    .map(key => ({
      key,
      label: '未注册存储',
      exists: true,
      legacy: true,
      value: safeGetStorage(key, null),
    }))

  return managedItems.concat(unmanagedItems)
}

export function clearManagedStorage() {
  managedStorageEntries.forEach(entry => {
    if (entry.clear) {
      entry.clear()
      return
    }

    safeRemoveStorage(entry.key)
  })

  const managedKeys = new Set(getManagedStorageKeys())
  safeGetStorageInfo().keys
    .filter(key => !managedKeys.has(key))
    .forEach(key => {
      safeRemoveStorage(key)
    })
}

export function readAvatarBackupForExport() {
  return exportProfileAvatarBackup()
}
