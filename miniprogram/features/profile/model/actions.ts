const PROFILE_AVATAR_UPLOAD_LIMIT_BYTES = 2 * 1024 * 1024

function chooseMediaFromAlbum(): Promise<WechatMiniprogram.ChooseMediaSuccessCallbackResult> {
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      sizeType: ['compressed'],
      success: resolve,
      fail: reject,
    })
  })
}

function readFileBase64(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success: result => {
        if (typeof result.data === 'string') {
          resolve(result.data)
          return
        }

        reject(new Error('PROFILE_AVATAR_READ_FAILED'))
      },
      fail: reject,
    })
  })
}

function buildAvatarMimeType(filePath: string) {
  const extension = String(filePath.split('.').pop() || '').toLowerCase()

  switch (extension) {
    case 'jpg':
    case 'jpeg':
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

function buildAvatarDataUrl(filePath: string, base64: string) {
  return `data:${buildAvatarMimeType(filePath)};base64,${base64}`
}

function isUserCancelled(error: unknown) {
  return String((error as { errMsg?: string })?.errMsg || error || '').toLowerCase().includes('cancel')
}

async function buildAvatarDraft(filePath: string) {
  const base64 = await readFileBase64(filePath)
  return buildAvatarDataUrl(filePath, base64)
}

export function isProfileAvatarTooLargeError(error: unknown) {
  return error instanceof Error && error.message === 'PROFILE_AVATAR_TOO_LARGE'
}

export function isProfileAvatarActionCancelled(error: unknown) {
  return isUserCancelled(error)
}

export async function resolveWechatAvatarDraft(avatarUrl: string) {
  if (!avatarUrl) {
    return null
  }

  return buildAvatarDraft(avatarUrl)
}

export async function chooseAlbumAvatarDraft() {
  const result = await chooseMediaFromAlbum()
  const file = result.tempFiles?.[0]

  if (!file?.tempFilePath) {
    return null
  }

  const fileSize = typeof file.size === 'number' ? file.size : 0
  if (fileSize > PROFILE_AVATAR_UPLOAD_LIMIT_BYTES) {
    throw new Error('PROFILE_AVATAR_TOO_LARGE')
  }

  return buildAvatarDraft(file.tempFilePath)
}
