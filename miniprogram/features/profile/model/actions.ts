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

function isUserCancelled(error: unknown) {
  return String((error as { errMsg?: string })?.errMsg || error || '').toLowerCase().includes('cancel')
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

  return avatarUrl
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

  return file.tempFilePath
}
