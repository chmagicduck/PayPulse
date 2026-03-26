import { storageKeys } from '../../../lib/constants/storage'
import { safeGetStorage, safeSetStorage } from '../../../lib/wx/storage'
import type { ProfileSettings } from '../../../lib/domain/types'
import { defaultProfileSettings } from './schema'

export function readProfileSettings() {
  return safeGetStorage<ProfileSettings>(storageKeys.profileSettings, defaultProfileSettings)
}

export function writeProfileSettings(settings: ProfileSettings) {
  safeSetStorage(storageKeys.profileSettings, settings)
}
