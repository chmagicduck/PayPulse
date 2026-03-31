const SHARE_IMAGE_URL = '/assets/images/share/share-cover.png'
const DEFAULT_SHARE_TITLE = '薪潮涌动 | 把上班时间换算成摸鱼收益'
const DEFAULT_SHARE_PATH = '/features/home/home?from=share'
const DEFAULT_TIMELINE_QUERY = 'from=timeline'

export function showAppShareMenu() {
  if (typeof wx.showShareMenu !== 'function') {
    return
  }

  wx.showShareMenu({
    menus: ['shareAppMessage', 'shareTimeline'],
    fail: () => {
      wx.showShareMenu({})
    },
  })
}

export function buildAppShareMessage(
  title: string = DEFAULT_SHARE_TITLE,
  path: string = DEFAULT_SHARE_PATH,
): WechatMiniprogram.Page.ICustomShareContent {
  return {
    title,
    path,
    imageUrl: SHARE_IMAGE_URL,
  }
}

export function buildAppTimelineShare(
  title: string = DEFAULT_SHARE_TITLE,
  query: string = DEFAULT_TIMELINE_QUERY,
): WechatMiniprogram.Page.ICustomTimelineContent {
  return {
    title,
    query,
    imageUrl: SHARE_IMAGE_URL,
  }
}
