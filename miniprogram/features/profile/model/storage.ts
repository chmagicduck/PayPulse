import { storageKeys } from '../../../lib/constants/storage'
import { safeGetStorage, safeSetStorage } from '../../../lib/wx/storage'
import { profileHomeModel } from '../model'

const fallbackAvatar = profileHomeModel.avatarPresets[0]?.src || ''

export function readProfileAvatar() {
  return safeGetStorage<string>(storageKeys.profileAvatar, fallbackAvatar)
}

export function writeProfileAvatar(value: string) {
  safeSetStorage(storageKeys.profileAvatar, value)
}
