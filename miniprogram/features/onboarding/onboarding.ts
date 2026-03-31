import { icon } from '../../lib/icons'
import { isBootstrapReady, readBootstrapState } from '../../store/bootstrap'

const HOME_ROUTE = '/features/home/home'
const PROFILE_SETTINGS_ROUTE = '/features/profile-settings/profile-settings'

function buildGuideIcons() {
  return {
    anchor: icon('anchor', '#ffffff', 44),
    user: icon('user', '#2563eb', 18),
    wallet: icon('wallet', '#059669', 18),
    waves: icon('waves', '#6366f1', 18),
    arrowRight: icon('arrow-up-right', '#ffffff', 16),
  }
}

Page({
  data: {
    statusBarHeight: 0,
    isResetFlow: false,
    heroTitle: '欢迎来到薪潮涌动',
    heroDesc: '把上班时间、摸鱼收益和打工人生，认真又轻松地记下来。',
    ctaText: '开始编写职场档案',
    subcopy: '只需要 1 分钟，把你的打工参数交给我们。',
    icons: buildGuideIcons(),
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  onShow() {
    if (isBootstrapReady()) {
      wx.switchTab({ url: HOME_ROUTE })
      return
    }

    const bootstrap = readBootstrapState()
    const isResetFlow = Boolean(bootstrap.lastResetAt)
    this.setData({
      isResetFlow,
      heroTitle: isResetFlow ? '重新扬帆，再建一份档案' : '欢迎来到薪潮涌动',
      heroDesc: isResetFlow
        ? '你刚清空了本地数据。重新填好职场档案后，我们会为你重建摸鱼旅程。'
        : '把上班时间、摸鱼收益和打工人生，认真又轻松地记下来。',
      ctaText: isResetFlow ? '重新编写职场档案' : '开始编写职场档案',
      subcopy: isResetFlow
        ? '新的档案会作为后续统计、时间轴和实验室的起点。'
        : '只需要 1 分钟，把你的打工参数交给我们。',
    })
  },

  startSetup() {
    wx.navigateTo({ url: PROFILE_SETTINGS_ROUTE })
  },
})
