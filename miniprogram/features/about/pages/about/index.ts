import { icon } from '../../../../lib/icons'
import { aboutStaticViewModel } from '../../model/static'

const vm = aboutStaticViewModel

Page({
  data: {
    vm,
    statusBarHeight: 0,
    activeTab: 'changelog',
    icons: {
      chevronLeft: '',
      anchor: '',
      compass: '',
      cpu: '',
      heart: '',
      checkCircle2: '',
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      icons: {
        chevronLeft: icon('chevron-left', '#475569', 20),
        anchor: icon('anchor', '#ffffff', 42),
        compass: icon('compass', '#6366f1', 18),
        cpu: icon('cpu', '#2563eb', 18),
        heart: icon('heart', '#f43f5e', 18),
        checkCircle2: icon('check-circle-2', '#10b981', 14),
      },
    })
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }

    wx.reLaunch({ url: '/features/profile/pages/home/index' })
  },

  switchTab(e: WechatMiniprogram.TouchEvent) {
    const { value } = e.currentTarget.dataset
    if (!value) return
    this.setData({ activeTab: value })
  },
})
