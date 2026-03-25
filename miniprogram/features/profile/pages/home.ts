import {
  animatedIconPair,
  icon,
  type IconImagePair,
  type IconName,
  type SvgAnimationPreset,
} from '../../../lib/icons'
import { profileHomeStaticViewModel } from '../model/static'

const vm = profileHomeStaticViewModel
const DEFAULT_RANK_INDEX = Number(vm.rankPanel.selectedRankIndex)
const DEFAULT_AVATAR: string = vm.avatarPresets[0].src
const AUTO_PLAY_INTERVAL = 3000
const PRESS_DURATION = 220
const ICON_ANIMATION_DURATION = 2200
const MODAL_ENTER_DELAY = 30
const MODAL_EXIT_DURATION = 280

type RankRuntimeItem = (typeof vm.ranks)[number] & {
  badgeIconPair: IconImagePair
  axisIconPair: IconImagePair
}

type ConsoleRuntimeItem = (typeof vm.sections.console.items)[number] & {
  iconPair: IconImagePair
}

type AboutRuntimeItem = (typeof vm.sections.about.items)[number] & {
  iconPair: IconImagePair
}

type StorageRuntimeCard = typeof vm.sections.storage & {
  iconPair: IconImagePair
}

function buildSetDataPatch(path: string, value: unknown) {
  const patch: Record<string, unknown> = {}
  patch[path] = value
  return patch
}

const defaultRank: RankRuntimeItem = Object.assign({}, vm.ranks[DEFAULT_RANK_INDEX], {
  badgeIconPair: { staticSrc: '', animatedSrc: '' },
  axisIconPair: { staticSrc: '', animatedSrc: '' },
})

let rankTimer: ReturnType<typeof setInterval> | null = null
let profileTimers: Record<string, ReturnType<typeof setTimeout> | null> = {}

function getProfileIconAnimation(name: IconName): SvgAnimationPreset {
  switch (name) {
    case 'user':
    case 'database':
      return 'float'
    case 'calendar':
      return 'bounce'
    case 'map-pin':
      return 'drift'
    case 'users':
      return 'wave'
    case 'info':
    case 'target':
      return 'pulse'
    default:
      return 'float'
  }
}

function buildRankDisplay(ranks: RankRuntimeItem[], rankIndex: number, totalHappiness: number) {
  const currentRank = ranks[rankIndex]
  const nextRank = ranks[rankIndex + 1] || null
  const pointsToNext = nextRank ? Math.max(0, Number(nextRank.nextExp) - totalHappiness) : 0
  const progressPercent = nextRank ? Math.min(100, (totalHappiness / Number(nextRank.nextExp)) * 100) : 100

  return {
    rankIndex,
    currentRank,
    nextRank,
    pointsToNext,
    progressPercent,
  }
}

Page({
  data: {
    vm,
    statusBarHeight: 0,
    isAutoPlay: true,
    totalHappiness: Number(vm.rankPanel.totalHappiness),
    todayHappiness: Number(vm.rankPanel.todayHappiness),
    rankIndex: DEFAULT_RANK_INDEX,
    ranks: [] as RankRuntimeItem[],
    currentRank: defaultRank as RankRuntimeItem,
    nextRank: null as RankRuntimeItem | null,
    pointsToNext: 0,
    progressPercent: 0,
    currentAvatar: DEFAULT_AVATAR,
    draftAvatar: DEFAULT_AVATAR,
    showAvatarModal: false,
    avatarModalVisible: false,
    consoleItems: [] as ConsoleRuntimeItem[],
    aboutItems: [] as AboutRuntimeItem[],
    storageCard: Object.assign({}, vm.sections.storage, {
      iconPair: { staticSrc: '', animatedSrc: '' },
    }) as StorageRuntimeCard,
    icons: {
      headerPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      chevronRight: '',
      x: '',
      checkCircle2: '',
    },
    iconAnimations: {
      header: false,
      avatarBadge: false,
      activeRankIndex: -1,
      consoleIndex: -1,
      aboutIndex: -1,
      storage: false,
    },
    pressStates: {
      avatar: false,
      rankIndex: -1,
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

    const ranks = vm.ranks.map(rank =>
      Object.assign({}, rank, {
        badgeIconPair: animatedIconPair(rank.iconName, {
          color: rank.iconColor,
          size: 12,
          animation: 'float',
          durationMs: 2600,
        }),
        axisIconPair: animatedIconPair(rank.iconName, {
          color: rank.iconColor,
          size: 10,
          animation: 'float',
          durationMs: 2200,
        }),
      }),
    )

    const consoleItems = vm.sections.console.items.map(item =>
      Object.assign({}, item, {
        iconPair: animatedIconPair(item.iconName, {
          color: item.iconColor,
          size: 18,
          animation: getProfileIconAnimation(item.iconName),
          durationMs: 2200,
        }),
      }),
    )

    const aboutItems = vm.sections.about.items.map(item =>
      Object.assign({}, item, {
        iconPair: animatedIconPair(item.iconName, {
          color: item.iconColor,
          size: 18,
          animation: getProfileIconAnimation(item.iconName),
          durationMs: 2200,
        }),
      }),
    )

    const storageCard = Object.assign({}, vm.sections.storage, {
      iconPair: animatedIconPair(vm.sections.storage.iconName, {
        color: vm.sections.storage.iconColor,
        size: 20,
        animation: getProfileIconAnimation(vm.sections.storage.iconName),
        durationMs: 2400,
      }),
    })

    this.setData(
      Object.assign(
        {
          statusBarHeight: statusBarHeight || 0,
          ranks,
          consoleItems,
          aboutItems,
          storageCard,
        },
        buildRankDisplay(ranks, DEFAULT_RANK_INDEX, Number(vm.rankPanel.totalHappiness)),
        {
          icons: {
            headerPair: animatedIconPair('user', {
              color: '#ffffff',
              size: 18,
              animation: 'float',
              durationMs: 2400,
            }),
            chevronRight: icon('chevron-right', '#cbd5e1', 18),
            x: icon('x', '#94a3b8', 20),
            checkCircle2: icon('check-circle-2', '#2563eb', 24),
          },
        },
      ),
    )

    this.startRankAutoPlay()
  },

  onShow() {
    if (this.data.isAutoPlay) {
      this.startRankAutoPlay()
    }
  },

  onHide() {
    this.stopRankAutoPlay()
  },

  onUnload() {
    this.stopRankAutoPlay()
    Object.keys(profileTimers).forEach(key => {
      const timer = profileTimers[key]
      if (timer) clearTimeout(timer)
    })
    profileTimers = {}
  },

  startRankAutoPlay() {
    if (!this.data.isAutoPlay || rankTimer || this.data.ranks.length === 0) return

    rankTimer = setInterval(() => {
      const nextIndex = (this.data.rankIndex + 1) % this.data.ranks.length
      this.setData(buildRankDisplay(this.data.ranks, nextIndex, this.data.totalHappiness))
    }, AUTO_PLAY_INTERVAL)
  },

  stopRankAutoPlay() {
    if (rankTimer) {
      clearInterval(rankTimer)
      rankTimer = null
    }
  },

  pulseState(
    timerKey: string,
    path: string,
    activeValue: string | number | boolean,
    restValue: string | number | boolean,
    duration: number = PRESS_DURATION,
  ) {
    const pending = profileTimers[timerKey]

    if (pending) {
      clearTimeout(pending)
      profileTimers[timerKey] = null
    }

    this.setData(buildSetDataPatch(path, activeValue), () => {
      profileTimers[timerKey] = setTimeout(() => {
        this.setData(buildSetDataPatch(path, restValue))
        profileTimers[timerKey] = null
      }, duration)
    })
  },

  playIconAnimation(key: string, path: string, activeValue: string | number | boolean, duration: number = ICON_ANIMATION_DURATION) {
    const pending = profileTimers[key]

    if (pending) {
      clearTimeout(pending)
      profileTimers[key] = null
    }

    this.setData(buildSetDataPatch(path, typeof activeValue === 'boolean' ? false : -1), () => {
      this.setData(buildSetDataPatch(path, activeValue), () => {
        profileTimers[key] = setTimeout(() => {
          this.setData(buildSetDataPatch(path, typeof activeValue === 'boolean' ? false : -1))
          profileTimers[key] = null
        }, duration)
      })
    })
  },

  triggerHeaderAnimation() {
    this.playIconAnimation('header-icon', 'iconAnimations.header', true, 2400)
  },

  openAvatarModal() {
    const pending = profileTimers['avatar-modal']
    if (pending) {
      clearTimeout(pending)
      profileTimers['avatar-modal'] = null
    }

    this.pulseState('avatar-press', 'pressStates.avatar', true, false, 280)
    this.playIconAnimation('avatar-badge', 'iconAnimations.avatarBadge', true, 2600)
    this.setData(
      {
        showAvatarModal: true,
        avatarModalVisible: false,
        draftAvatar: this.data.currentAvatar,
      },
      () => {
        profileTimers['avatar-modal'] = setTimeout(() => {
          this.setData({ avatarModalVisible: true })
          profileTimers['avatar-modal'] = null
        }, MODAL_ENTER_DELAY)
      },
    )
  },

  hideAvatarModal(applyDraft: boolean) {
    const pending = profileTimers['avatar-modal']
    if (pending) {
      clearTimeout(pending)
      profileTimers['avatar-modal'] = null
    }

    const nextAvatar = applyDraft ? this.data.draftAvatar : this.data.currentAvatar

    this.setData({ avatarModalVisible: false })
    profileTimers['avatar-modal'] = setTimeout(() => {
      this.setData({
        showAvatarModal: false,
        avatarModalVisible: false,
        currentAvatar: nextAvatar,
        draftAvatar: nextAvatar,
      })
      profileTimers['avatar-modal'] = null
    }, MODAL_EXIT_DURATION)
  },

  closeAvatarModal() {
    this.pulseState('avatar-modal-close', 'pressStates.modalClose', true, false)
    this.hideAvatarModal(false)
  },

  selectAvatar(e: WechatMiniprogram.TouchEvent) {
    const { src, index } = e.currentTarget.dataset
    if (!src) return

    this.pulseState('avatar-option', 'pressStates.avatarOptionIndex', Number(index), -1)
    this.setData({ draftAvatar: String(src) })
  },

  confirmAvatar() {
    this.pulseState('avatar-modal-confirm', 'pressStates.modalConfirm', true, false)
    this.hideAvatarModal(true)
  },

  selectRank(e: WechatMiniprogram.TouchEvent) {
    const rankIndex = Number(e.currentTarget.dataset.index)

    this.stopRankAutoPlay()
    this.setData(
      Object.assign(
        {
          isAutoPlay: false,
        },
        buildRankDisplay(this.data.ranks, rankIndex, this.data.totalHappiness),
      ),
    )

    this.pulseState('rank-press', 'pressStates.rankIndex', rankIndex, -1)
    this.playIconAnimation('rank-icon', 'iconAnimations.activeRankIndex', rankIndex)
  },

  pressConsoleCard(e: WechatMiniprogram.TouchEvent) {
    const cardIndex = Number(e.currentTarget.dataset.index)
    const target = this.data.consoleItems[cardIndex]

    this.pulseState('console-press', 'pressStates.consoleIndex', cardIndex, -1)
    this.playIconAnimation('console-icon', 'iconAnimations.consoleIndex', cardIndex)

    if (target?.url) {
      this.navigateTo(target.url)
    }
  },

  pressStorageCard() {
    this.pulseState('storage-press', 'pressStates.storage', true, false)
    this.playIconAnimation('storage-icon', 'iconAnimations.storage', true, 2400)

    if (this.data.storageCard.url) {
      this.navigateTo(this.data.storageCard.url)
    }
  },

  pressAboutCard(e: WechatMiniprogram.TouchEvent) {
    const cardIndex = Number(e.currentTarget.dataset.index)
    const target = this.data.aboutItems[cardIndex]

    this.pulseState('about-press', 'pressStates.aboutIndex', cardIndex, -1)
    this.playIconAnimation('about-icon', 'iconAnimations.aboutIndex', cardIndex)

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
