import { storageKeys } from '../lib/constants/storage'
import {
  clearLegacyReportAdjustments,
  ensureCurrentMonthRecords,
  readAmountVisibility,
  rebuildAllDailyRecords,
} from '../lib/domain/daily-records'
import { migrateAppData } from '../lib/domain/migrations'
import { recoverStaleMoyuSession, clearMoyuSession, readMoyuSession } from '../lib/domain/moyu-session'
import { formatDateTimeIso, now } from '../lib/domain/date'
import type { AppBootstrapState, DataExportPackage, ProfileSettings } from '../lib/domain/types'
import { safeGetStorage, safeRemoveStorage, safeSetStorage } from '../lib/wx/storage'
import { createDefaultLabProgress, readLabProgress, writeLabProgress } from '../features/lab/model/storage'
import { readProfileSettings, writeProfileSettings } from '../features/profile-settings/model/storage'
import { readProfileAvatar, writeProfileAvatar } from '../features/profile/model/storage'
import { ensureDefaultTimeAxisEntries, readTimeAxisEntries } from '../features/time-axis/model/storage'
import { profileHomeModel } from '../features/profile/model'

const SETTINGS_ROUTE = '/features/profile-settings/settings'
const HOME_ROUTE = '/features/home/dashboard'

let hasPreparedCurrentLaunch = false

export function readBootstrapState(): AppBootstrapState {
  return safeGetStorage<AppBootstrapState>(storageKeys.appBootstrapState, {
    schemaVersion: '1.0.0',
    status: 'needs_setup',
    initializedAt: null,
    lastResetAt: null,
  })
}

export function writeBootstrapState(state: AppBootstrapState) {
  safeSetStorage(storageKeys.appBootstrapState, state)
}

export function isBootstrapReady() {
  return readBootstrapState().status === 'ready'
}

export function ensureAppDataReady() {
  if (hasPreparedCurrentLaunch) {
    return
  }

  migrateAppData()
  if (isBootstrapReady()) {
    const settings = readProfileSettings()
    recoverStaleMoyuSession(settings)
    ensureCurrentMonthRecords(settings)
  }
  hasPreparedCurrentLaunch = true
}

export function ensureBootstrapReady() {
  ensureAppDataReady()
  if (isBootstrapReady()) {
    return true
  }

  wx.reLaunch({ url: SETTINGS_ROUTE })
  return false
}

export function initializeAppData(settings: ProfileSettings) {
  writeProfileSettings(settings)
  writeProfileAvatar(profileHomeModel.avatarPresets[0]?.src || '')
  ensureDefaultTimeAxisEntries(settings)
  ensureCurrentMonthRecords(settings)
  writeLabProgress(createDefaultLabProgress())
  clearLegacyReportAdjustments()
  clearMoyuSession()
  safeRemoveStorage(storageKeys.homeScaffold)
  const stamp = formatDateTimeIso(now())
  writeBootstrapState({
    schemaVersion: '1.0.0',
    status: 'ready',
    initializedAt: stamp,
    lastResetAt: null,
  })
}

export function saveProfileSettingsAndRefresh(settings: ProfileSettings) {
  writeProfileSettings(settings)
  ensureDefaultTimeAxisEntries(settings)
  rebuildAllDailyRecords(settings)
}

export function resetAppData() {
  const resetAt = formatDateTimeIso(now())
  safeRemoveStorage(storageKeys.appBootstrapState)
  safeRemoveStorage(storageKeys.homeScaffold)
  safeRemoveStorage(storageKeys.profileSettings)
  safeRemoveStorage(storageKeys.profileAvatar)
  safeRemoveStorage(storageKeys.homeDailySession)
  safeRemoveStorage(storageKeys.homeAmountVisibility)
  safeRemoveStorage(storageKeys.labProgress)
  safeRemoveStorage(storageKeys.timeAxisEntries)
  safeRemoveStorage(storageKeys.reportHistoryAdjustments)
  safeRemoveStorage(storageKeys.moyuSession)
  hasPreparedCurrentLaunch = false

  writeBootstrapState({
    schemaVersion: '1.0.0',
    status: 'needs_setup',
    initializedAt: null,
    lastResetAt: resetAt,
  })
}

export function buildExportPackage(): DataExportPackage {
  ensureAppDataReady()

  return {
    schemaVersion: '1.0.0',
    exportedAt: formatDateTimeIso(now()),
    bootstrap: readBootstrapState(),
    settings: isBootstrapReady() ? readProfileSettings() : null,
    avatar: readProfileAvatar(),
    dailyRecords: Object.values(safeGetStorage(storageKeys.homeDailySession, {} as Record<string, never>)) as DataExportPackage['dailyRecords'],
    timeAxisEntries: readTimeAxisEntries(),
    labProgress: readLabProgress(),
    moyuSession: readMoyuSession(),
    preferences: {
      amountVisible: readAmountVisibility(),
    },
  }
}

export function finishInitialSetup() {
  wx.switchTab({ url: HOME_ROUTE })
}
