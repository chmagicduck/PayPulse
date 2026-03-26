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
      consoleIndex: -1,
      aboutIndex: -1,
      storage: false,
    },
    pressStates: {
      avatar: false,
      consoleIndex: -1,
      aboutIndex: -1,
      storage: false,
      avatarOptionIndex: -1,
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

  selectAvatar(e: WechatMiniprogram.TouchEvent) {
    const { src, index } = e.currentTarget.dataset
    if (!src) return

    pulseState(this, timers, 'avatar-option', 'pressStates.avatarOptionIndex', Number(index), -1)
    this.setData({ draftAvatar: String(src) })
  },

  confirmAvatar() {
    pulseState(this, timers, 'avatar-modal-confirm', 'pressStates.modalConfirm', true, false)
    writeProfileAvatar(String(this.data.draftAvatar))
    this.hideAvatarModal(true)
  },

  pressConsoleCard(e: WechatMiniprogram.TouchEvent) {
    const cardIndex = Number(e.currentTarget.dataset.index)
    const target = this.data.consoleItems[cardIndex]

    pulseState(this, timers, 'console-press', 'pressStates.consoleIndex', cardIndex, -1)
    replayState(this, timers, 'console-icon', 'iconAnimations.consoleIndex', cardIndex, -1, 2200)

    if (target?.url) {
      this.navigateTo(target.url)
    }
  },

  pressStorageCard() {
    pulseState(this, timers, 'storage-press', 'pressStates.storage', true, false)
    replayState(this, timers, 'storage-icon', 'iconAnimations.storage', true, false, 2400)

    if (this.data.storageCard.url) {
      this.navigateTo(this.data.storageCard.url)
    }
  },

  pressAboutCard(e: WechatMiniprogram.TouchEvent) {
    const cardIndex = Number(e.currentTarget.dataset.index)
    const target = this.data.aboutItems[cardIndex]

    pulseState(this, timers, 'about-press', 'pressStates.aboutIndex', cardIndex, -1)
    replayState(this, timers, 'about-icon', 'iconAnimations.aboutIndex', cardIndex, -1, 2200)

    if (target?.url) {
      this.navigateTo(target.url)
    }
  },

  navigateTo(url: string) {
    setTimeout(() => {
      wx.navigateTo({ url })
    }, 110)
  },
})
