import { storageKeys } from '../constants/storage'
import { readCurrentLabProgress, updateSelectedRankIndex } from '../../features/lab/model/actions'
import { writeProfileSettings } from '../../features/profile-settings/model/storage'
import { ensureDefaultTimeAxisEntries } from '../../features/time-axis/model/storage'
import { safeGetStorage, safeRemoveStorage } from '../wx/storage'
import { clearLegacyReportAdjustments, rebuildAllDailyRecords } from './daily-records'
import { getDefaultRetirementProfile, computeRetirementAge } from './retirement'
import type { ProfileSettings } from './types'

function migrateProfileSettings(settings: ProfileSettings) {
  const nextRetirementProfile = settings.retirementProfile
    || getDefaultRetirementProfile(settings.gender)
  const nextRetirementAgeEditedByUser = typeof settings.retirementAgeEditedByUser === 'boolean'
    ? settings.retirementAgeEditedByUser
    : false
  const nextRetirementAge = nextRetirementAgeEditedByUser
    ? settings.retirementAge
    : computeRetirementAge(nextRetirementProfile, settings.birthday)

  return {
    ...settings,
    retirementProfile: nextRetirementProfile,
    retirementAgeEditedByUser: nextRetirementAgeEditedByUser,
    retirementAge: nextRetirementAge,
  }
}

export function migrateAppData() {
  const settings = safeGetStorage<ProfileSettings | null>(storageKeys.profileSettings, null)
  if (!settings) {
    clearLegacyReportAdjustments()
    return
  }

  const migratedSettings = migrateProfileSettings(settings)
  writeProfileSettings(migratedSettings)
  ensureDefaultTimeAxisEntries(migratedSettings)
  rebuildAllDailyRecords(migratedSettings)

  safeRemoveStorage(storageKeys.homeScaffold)
  clearLegacyReportAdjustments()

  const labProgress = readCurrentLabProgress()
  updateSelectedRankIndex(labProgress.selectedRankIndex)
}
