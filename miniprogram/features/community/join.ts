import { communityStaticViewModel } from './model'
import { buildCommunityPageState } from './join.helper'
import { handlePageBack } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'

const pageState = buildCommunityPageState()

const COMMUNITY_ERROR_MESSAGES: Record<number, string> = {
  [-3002]: '获取配置失败，请稍后重试',
  [-3004]: '用户授权失败，无法继续拉起入群流程',
  [-3005]: '加群失败，请稍后重试',
  [-3006]: '你已经在群里了',
  [-3009]: '群聊已满员，请联系管理员',
  [-3010]: '群聊已解散',
  [-3011]: '当前无法加入该群聊',
  [-3012]: '你已在群里，但该群目前已满员',
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
      joinHint: !wx.canIUse('openBusinessView') ? '当前微信版本暂不支持直接拉起入群，请先复制群链接。' : '',
    })
  },

  onShow() {
    ensureBootstrapReady()
  },

  handleBack() {
    handlePageBack('/features/profile/home')
  },

  handleJoinFallback() {
    wx.setClipboardData({
      data: this.data.vm.groupUrl,
      success: () => {
        wx.showToast({
          title: '已复制群链接，请手动打开',
          icon: 'none',
        })
      },
      fail: () => {
        wx.showToast({
          title: '当前无法直接拉起，请稍后重试',
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
        title: '已拉起企微入群流程',
        icon: 'success',
      })
      return
    }

    const message = COMMUNITY_ERROR_MESSAGES[detail.errcode] || '当前无法加入，请稍后重试'
    this.setData({ joinHint: message })
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 2500,
    })
  },
})
