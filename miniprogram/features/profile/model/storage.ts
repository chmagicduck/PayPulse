import { storageKeys } from '../../../lib/constants/storage'
import { safeGetStorage, safeSetStorage } from '../../../lib/wx/storage'
import { getDefaultProfileAvatar } from './view'

const fallbackAvatar = getDefaultProfileAvatar()

export function readProfileAvatar() {
  return safeGetStorage<string>(storageKeys.profileAvatar, fallbackAvatar)
}

export function writeProfileAvatar(value: string) {
  safeSetStorage(storageKeys.profileAvatar, value)
}
