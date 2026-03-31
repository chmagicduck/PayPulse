import { buildAboutIcons } from './helper/icons'
import { handlePageBack } from '../../lib/wx/page'
import { buildAppShareMessage, buildAppTimelineShare, showAppShareMenu } from '../../lib/wx/share'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { aboutViewModel } from './model/index'

Page({
  data: {
    vm: aboutViewModel,
    statusBarHeight: 0,
    activeTab: 'changelog',
    icons: buildAboutIcons(),
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
    showAppShareMenu()
  },

  onShow() {
    showAppShareMenu()
    ensureBootstrapReady()
  },

  handleBack() {
    handlePageBack('/features/profile/profile')
  },

  switchTab(e: WechatMiniprogram.TouchEvent) {
    const value = String(e.currentTarget.dataset.value || '')
    if (!value) return
    this.setData({ activeTab: value })
  },

  onShareAppMessage() {
    return buildAppShareMessage()
  },

  onShareTimeline() {
    return buildAppTimelineShare()
  },
})
