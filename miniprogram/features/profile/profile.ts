import { clearTimerBag, createTimerBag, openModal, pulseState, replayState } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { buildProfilePageState } from './home.helper'
import { profileHomeModel } from './model'
import { buildProfileSummaryState } from './model/state'
import { writeProfileAvatar } from './model/storage'

const timers = createTimerBag()
const pageState = buildProfilePageState()

Page({
  data: {
    vm: profileHomeModel,
    statusBarHeight: 0,
    showAvatarModal: false,
    avatarModalVisible: false,
    ...pageState,
    iconAnimations: {
      header: false,
      avatarBadge: false,
      cardKey: '',
    },
    pressStates: {
      avatar: false,
      cardKey: '',
      avatarOptionIndex: -1,
      wechatAvatar: false,
      uploadAvatar: false,
      modalConfirm: false,
      modalClose: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  onShow() {
    if (!ensureBootstrapReady()) {
      return
    }
    this.reloadRuntimeState()
  },

  onUnload() {
    clearTimerBag(timers)
  },

  reloadRuntimeState() {
    const summary = buildProfileSummaryState()
    this.setData({
      vm: Object.assign({}, this.data.vm, {
        user: summary.user,
      }),
      currentAvatar: summary.currentAvatar,
      draftAvatar: summary.currentAvatar,
      currentRank: summary.currentRank,
    })
  },

  triggerHeaderAnimation() {
    replayState(this, timers, 'header-icon', 'iconAnimations.header', true, false, 2400)
  },

  openAvatarModal() {
    pulseState(this, timers, 'avatar-press', 'pressStates.avatar', true, false, 280)
    replayState(this, timers, 'avatar-badge', 'iconAnimations.avatarBadge', true, false, 2600)
    openModal(
      this,
      timers,
      'avatar-modal',
      {
        show: 'showAvatarModal',
        visible: 'avatarModalVisible',
      },
      {
        draftAvatar: this.data.currentAvatar,
      },
    )
  },

  hideAvatarModal(applyDraft: boolean) {
    const nextAvatar = applyDraft ? this.data.draftAvatar : this.data.currentAvatar
    this.setData({ avatarModalVisible: false })
    timers['avatar-modal'] = setTimeout(() => {
      this.setData({
        showAvatarModal: false,
        avatarModalVisible: false,
        currentAvatar: nextAvatar,
        draftAvatar: nextAvatar,
      })
      timers['avatar-modal'] = null
    }, 280)
  },

  closeAvatarModal() {
    pulseState(this, timers, 'avatar-modal-close', 'pressStates.modalClose', true, false)
    this.hideAvatarModal(false)
  },

  stopModalTap() {},

  selectAvatar(e: WechatMiniprogram.TouchEvent) {
    const { src, index } = e.currentTarget.dataset
    if (!src) return

    pulseState(this, timers, 'avatar-option', 'pressStates.avatarOptionIndex', Number(index), -1)
    this.setData({ draftAvatar: String(src) })
  },

  useWechatAvatar() {
    pulseState(this, timers, 'avatar-wechat', 'pressStates.wechatAvatar', true, false)
    const nextAvatar = String(this.data.vm.avatarPresets[0]?.src || this.data.draftAvatar)
    this.setData({ draftAvatar: nextAvatar })
    wx.showToast({
      title: '已切换微信头像演示',
      icon: 'none',
    })
  },

  useUploadedAvatar() {
    pulseState(this, timers, 'avatar-upload', 'pressStates.uploadAvatar', true, false)
    const nextAvatar = String(this.data.vm.avatarPresets[1]?.src || this.data.draftAvatar)
    this.setData({ draftAvatar: nextAvatar })
    wx.showToast({
      title: '已切换上传头像演示',
      icon: 'none',
    })
  },

  confirmAvatar() {
    pulseState(this, timers, 'avatar-modal-confirm', 'pressStates.modalConfirm', true, false)
    writeProfileAvatar(String(this.data.draftAvatar))
    this.hideAvatarModal(true)
  },

  pressMenuCard(e: WechatMiniprogram.TouchEvent) {
    const { cardKey, url, navMethod } = e.currentTarget.dataset
    if (!cardKey) return

    pulseState(this, timers, 'menu-card-press', 'pressStates.cardKey', String(cardKey), '')
    replayState(this, timers, 'menu-card-icon', 'iconAnimations.cardKey', String(cardKey), '', 2200)

    if (url) {
      this.openPage(String(url), String(navMethod || 'navigateTo'))
    }
  },

  openPage(url: string, navMethod: string = 'navigateTo') {
    setTimeout(() => {
      if (navMethod === 'switchTab') {
        wx.switchTab({ url })
        return
      }

      wx.navigateTo({ url })
    }, 110)
  },
})
