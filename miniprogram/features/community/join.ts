import { communityStaticViewModel } from './model'
import { buildCommunityPageState } from './join.helper'
import { handlePageBack } from '../../lib/wx/page'

const pageState = buildCommunityPageState()

Page({
  data: {
    vm: communityStaticViewModel,
    statusBarHeight: 0,
    ...pageState,
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  handleBack() {
    handlePageBack('/features/profile/home')
  },
})
