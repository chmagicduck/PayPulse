import { storageKeys } from '../../../lib/constants/storage'
import { safeGetStorage, safeRemoveStorage, safeSetStorage } from '../../../lib/wx/storage'
import { getDefaultProfileAvatar } from './view'

const fallbackAvatar = getDefaultProfileAvatar()
const AVATAR_FILE_PREFIX = `${wx.env.USER_DATA_PATH}/profile-avatar`

function resolveAvatarExtension(path: string) {
  const extension = String(path.split('.').pop() || '').toLowerCase()

  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'jpg'
    case 'webp':
      return 'webp'
    case 'gif':
      return 'gif'
    case 'png':
    default:
      return 'png'
  }
}

function buildAvatarMimeType(path: string) {
  switch (resolveAvatarExtension(path)) {
    case 'jpg':
      return 'image/jpeg'
    case 'webp':
      return 'image/webp'
    case 'gif':
      return 'image/gif'
    case 'png':
    default:
      return 'image/png'
  }
}

function isPresetAvatar(value: string) {
  return value.startsWith('/assets/')
}

function isManagedLocalAvatar(value: string) {
  return value.startsWith(AVATAR_FILE_PREFIX)
}

function isDataUrlAvatar(value: string) {
  return value.startsWith('data:image/')
}

function parseDataUrlAvatar(value: string) {
  const match = value.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  if (!match) {
    return null
  }

  const mimeType = match[1]
  const base64 = match[2]
  const extension = mimeType.includes('jpeg')
    ? 'jpg'
    : mimeType.includes('webp')
      ? 'webp'
      : mimeType.includes('gif')
        ? 'gif'
        : 'png'

  return {
    mimeType,
    base64,
    extension,
  }
}

function fileExists(path: string) {
  if (!path) {
    return false
  }

  try {
    wx.getFileSystemManager().accessSync(path)
    return true
  } catch (_error) {
    return false
  }
}

function removeAvatarFile(path: string) {
  if (!isManagedLocalAvatar(path) || !fileExists(path)) {
    return
  }

  try {
    wx.getFileSystemManager().unlinkSync(path)
  } catch (_error) {
    // noop
  }
}

function buildPersistedAvatarPath(sourcePath: string) {
  return `${AVATAR_FILE_PREFIX}.${resolveAvatarExtension(sourcePath)}`
}

function buildPersistedAvatarPathByExtension(extension: string) {
  return `${AVATAR_FILE_PREFIX}.${extension}`
}

function readLocalAvatarAsDataUrl(path: string) {
  try {
    const base64 = wx.getFileSystemManager().readFileSync(path, 'base64') as string
    return `data:${buildAvatarMimeType(path)};base64,${base64}`
  } catch (_error) {
    return null
  }
}

function migrateLegacyAvatarDataUrl(value: string) {
  const parsed = parseDataUrlAvatar(value)
  if (!parsed) {
    return value
  }

  const targetPath = buildPersistedAvatarPathByExtension(parsed.extension)
  try {
    wx.getFileSystemManager().writeFileSync(targetPath, parsed.base64, 'base64')
    safeSetStorage(storageKeys.profileAvatar, targetPath)
    return targetPath
  } catch (_error) {
    return value
  }
}

export function readProfileAvatar() {
  const storedAvatar = safeGetStorage<string>(storageKeys.profileAvatar, fallbackAvatar)
  const avatar = isDataUrlAvatar(storedAvatar)
    ? migrateLegacyAvatarDataUrl(storedAvatar)
    : storedAvatar
  if (isManagedLocalAvatar(avatar) && !fileExists(avatar)) {
    safeRemoveStorage(storageKeys.profileAvatar)
    return fallbackAvatar
  }

  return avatar
}

export function writeProfileAvatar(value: string) {
  safeSetStorage(storageKeys.profileAvatar, value)
}

export function clearStoredProfileAvatar() {
  removeAvatarFile(safeGetStorage<string>(storageKeys.profileAvatar, ''))
  safeRemoveStorage(storageKeys.profileAvatar)
}

export function exportProfileAvatarBackup() {
  const avatar = safeGetStorage<string>(storageKeys.profileAvatar, '')
  if (!avatar) {
    return null
  }

  if (!isManagedLocalAvatar(avatar)) {
    return avatar
  }

  return readLocalAvatarAsDataUrl(avatar) || avatar
}

export async function persistProfileAvatar(value: string) {
  const previousAvatar = safeGetStorage<string>(storageKeys.profileAvatar, '')

  if (!value || isPresetAvatar(value) || isManagedLocalAvatar(value)) {
    if (previousAvatar && previousAvatar !== value) {
      removeAvatarFile(previousAvatar)
    }
    writeProfileAvatar(value || fallbackAvatar)
    return value || fallbackAvatar
  }

  if (isDataUrlAvatar(value)) {
    const migrated = migrateLegacyAvatarDataUrl(value)
    writeProfileAvatar(migrated)
    return migrated
  }

  const fileManager = wx.getFileSystemManager()
  const targetPath = buildPersistedAvatarPath(value)

  removeAvatarFile(targetPath)

  await new Promise<void>((resolve, reject) => {
    fileManager.copyFile({
      srcPath: value,
      destPath: targetPath,
      success: () => resolve(),
      fail: reject,
    })
  })

  if (previousAvatar && previousAvatar !== targetPath) {
    removeAvatarFile(previousAvatar)
  }

  writeProfileAvatar(targetPath)
  return targetPath
}
