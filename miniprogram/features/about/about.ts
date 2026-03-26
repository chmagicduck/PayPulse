import { aboutStaticViewModel } from './model'
import { buildAboutIcons } from './about.helper'
import { handlePageBack } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'

Page({
  data: {
    vm: aboutStaticViewModel,
    statusBarHeight: 0,
    activeTab: 'changelog',
    icons: buildAboutIcons(),
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  onShow() {
    ensureBootstrapReady()
  },

  handleBack() {
    handlePageBack('/features/profile/home')
  },

  switchTab(e: WechatMiniprogram.TouchEvent) {
    const value = String(e.currentTarget.dataset.value || '')
    if (!value) return
    this.setData({ activeTab: value })
  },
})
