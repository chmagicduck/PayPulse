import { clearTimerBag, createTimerBag, openModal, pulseState, replayState } from '../../lib/wx/page'
import { buildAppShareMessage, buildAppTimelineShare, showAppShareMenu } from '../../lib/wx/share'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { createProfileIconAnimations, createProfilePressStates } from './helper/page'
import { chooseAlbumAvatarDraft, isProfileAvatarActionCancelled, isProfileAvatarTooLargeError, resolveWechatAvatarDraft } from './model/actions'
import { buildProfilePageState } from './model/index'
import { buildProfileRuntimeState } from './model/state'
import { persistProfileAvatar } from './model/storage'

const timers = createTimerBag()
const pageState = buildProfilePageState()

Page({
  data: {
    statusBarHeight: 0,
    showAvatarModal: false,
    avatarModalVisible: false,
    ...pageState,
    iconAnimations: createProfileIconAnimations(),
    pressStates: createProfilePressStates(),
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
    showAppShareMenu()
  },

  onShow() {
    if (!ensureBootstrapReady()) {
      return
    }
    showAppShareMenu()
    this.reloadRuntimeState()
  },

  onUnload() {
    clearTimerBag(timers)
  },

  reloadRuntimeState() {
    const runtimeState = buildProfileRuntimeState()
    this.setData({
      'vm.user.name': runtimeState.user.name,
      'vm.user.checkInDays': runtimeState.user.checkInDays,
      currentAvatar: runtimeState.currentAvatar,
      currentRank: runtimeState.currentRank,
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

  pressShareAction() {
    pulseState(this, timers, 'share-press', 'pressStates.share', true, false)
  },

  selectAvatar(e: WechatMiniprogram.TouchEvent) {
    const { src, index } = e.currentTarget.dataset
    if (!src) return

    pulseState(this, timers, 'avatar-option', 'pressStates.avatarOptionIndex', Number(index), -1)
    this.setData({ draftAvatar: String(src) })
  },

  pressWechatAvatarAction() {
    pulseState(this, timers, 'avatar-wechat', 'pressStates.wechatAvatar', true, false)
  },

  async useWechatAvatar(e: WechatMiniprogram.CustomEvent<{ avatarUrl?: string }>) {
    const avatarUrl = String(e.detail?.avatarUrl || '')
    if (!avatarUrl) {
      return
    }

    try {
      const nextAvatar = await resolveWechatAvatarDraft(avatarUrl)
      if (!nextAvatar) {
        return
      }

      this.setData({ draftAvatar: nextAvatar })
      wx.showToast({
        title: '已切换为微信头像',
        icon: 'none',
      })
    } catch (_error) {
      wx.showToast({
        title: '微信头像读取失败',
        icon: 'none',
      })
    }
  },

  async useUploadedAvatar() {
    pulseState(this, timers, 'avatar-upload', 'pressStates.uploadAvatar', true, false)

    try {
      const nextAvatar = await chooseAlbumAvatarDraft()
      if (!nextAvatar) {
        return
      }

      this.setData({ draftAvatar: nextAvatar })
      wx.showToast({
        title: '头像上传成功',
        icon: 'none',
      })
    } catch (error) {
      if (isProfileAvatarActionCancelled(error)) {
        return
      }

      wx.showToast({
        title: isProfileAvatarTooLargeError(error) ? '头像不能超过 2MB' : '头像上传失败',
        icon: 'none',
      })
    }
  },

  async confirmAvatar() {
    pulseState(this, timers, 'avatar-modal-confirm', 'pressStates.modalConfirm', true, false)

    try {
      const nextAvatar = await persistProfileAvatar(String(this.data.draftAvatar))
      this.setData({
        currentAvatar: nextAvatar,
        draftAvatar: nextAvatar,
      })
      this.hideAvatarModal(true)
    } catch (_error) {
      wx.showToast({
        title: '头像保存失败',
        icon: 'none',
      })
    }
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

  onShareAppMessage() {
    return buildAppShareMessage()
  },

  onShareTimeline() {
    return buildAppTimelineShare()
  },
})
