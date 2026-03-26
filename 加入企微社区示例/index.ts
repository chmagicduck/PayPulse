// pages/community/index.ts — 加入社群
Page({
  data: {
    groupUrl: 'https://work.weixin.qq.com/gm/fd6f1bdd86a54ac96a1254f542d23a8e',
  },

  onStartMessage() {
    // 用户点击加入按钮，开始执行
  },

  onCompleteMessage(e: any) {
    const detail = e.detail
    if (detail && detail.errcode) {
      const messages: Record<number, string> = {
        [-3002]: '获取配置信息失败，请稍后重试',
        [-3004]: '用户信息授权失败',
        [-3005]: '加入群聊失败，请稍后重试',
        [-3006]: '你已经在群里啦~',
        [-3009]: '群聊已满员，请联系管理员',
        [-3010]: '群聊已解散',
        [-3011]: '暂时无法加入该群聊',
        [-3012]: '你已经在群里了，且群已满员',
      }
      const msg = messages[detail.errcode] || '操作失败，请稍后重试'
      wx.showToast({ title: msg, icon: 'none', duration: 2500 })
    }
  },

  onShareAppMessage() {
    return {
      title: '薪潮涌动 — 一起摸鱼，一起快乐',
      path: '/pages/index/index',
    }
  },
})
