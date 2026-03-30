import { communityStaticViewModel } from './model'
import { buildCommunityPageState } from './join.helper'
import { handlePageBack } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'

const pageState = buildCommunityPageState()

const COMMUNITY_ERROR_MESSAGES: Record<number, string> = {
  [-3002]: '网络开小差了，获取配置失败，稍后再试吧',
  [-3004]: '用户授权失败，没法拉你进群',
  [-3005]: '进群失败了，等会儿再试',
  [-3006]: '老哥/老姐，你已经在群里啦',
  [-3009]: '群已经爆满啦，联系一下群主吧',
  [-3010]: '这群已经凉了（已解散）',
  [-3011]: '暂时加不了这个群，晚点再试',
  [-3012]: '你在群里，而且群已经满员了',
}

Page({
  data: {
    vm: communityStaticViewModel,
    statusBarHeight: 0,
    joinUnavailable: false,
    joinHint: '',
    ...pageState,
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      joinUnavailable: !wx.canIUse('openBusinessView'),
      joinHint: !wx.canIUse('openBusinessView') ? '你这微信版本太老了，没法直接进，先复制链接吧。' : '',
    })
  },

  onShow() {
    ensureBootstrapReady()
  },

  handleBack() {
    handlePageBack('/features/profile/profile')
  },

  handleJoinFallback() {
    wx.setClipboardData({
      data: this.data.vm.groupUrl,
      success: () => {
        wx.showToast({
          title: '群链接复制好啦，去微信打开吧',
          icon: 'none',
        })
      },
      fail: () => {
        wx.showToast({
          title: '暂时拉不起来，过会儿再试吧',
          icon: 'none',
        })
      },
    })
  },

  onStartMessage() {
    this.setData({ joinHint: '' })
  },

  onCompleteMessage(e: WechatMiniprogram.CustomEvent) {
    const detail = e.detail || {}
    if (!detail.errcode || detail.errcode === 0) {
      wx.showToast({
        title: '正在拉起企微进群流程',
        icon: 'success',
      })
      return
    }

    const message = COMMUNITY_ERROR_MESSAGES[detail.errcode] || '加群失败，喝口水等会儿再试吧'
    this.setData({ joinHint: message })
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2500,
    })
  },
})
