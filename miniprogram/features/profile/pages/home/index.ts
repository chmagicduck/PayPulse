import {
  animatedIconPair,
  icon,
  type IconImagePair,
  type IconName,
  type SvgAnimationPreset,
} from '../../../../lib/icons'
import { profileHomeStaticViewModel } from '../../model/static'

const vm = profileHomeStaticViewModel
const DEFAULT_RANK_INDEX = 4
const AUTO_PLAY_INTERVAL = 2000
const ICON_ANIMATION_DURATION = 2200
const CARD_FEEDBACK_DURATION = 260

type RankRuntimeItem = (typeof vm.ranks)[number] & {
  badgeIconPair: IconImagePair
  axisIconSrc: string
}

type PrimaryRuntimeItem = (typeof vm.sections.primary.items)[number] & {
  iconPair: IconImagePair
}

type SecondaryRuntimeItem = (typeof vm.sections.secondary.items)[number] & {
  iconPair: IconImagePair
  isLast: boolean
}

type StorageRuntimeCard = typeof vm.sections.storage & {
  iconPair: IconImagePair
}

const defaultRank: RankRuntimeItem = {
  ...vm.ranks[DEFAULT_RANK_INDEX],
  badgeIconPair: { staticSrc: '', animatedSrc: '' },
  axisIconSrc: '',
}

const PROFILE_PRIMARY_ROUTES = [
  '/features/profile/pages/settings/index',
  '/features/time-axis/pages/time-axis-settings/index',
  '/features/calendar/pages/calendar/index',
  '',
] as const

const PROFILE_SECONDARY_ROUTES = [
  '/features/community/pages/join/index',
  '/features/about/pages/about/index',
] as const

const PROFILE_STORAGE_ROUTE = '/features/data-center/pages/data-center/index'

let rankTimer: ReturnType<typeof setInterval> | null = null
let profileTimers: Record<string, ReturnType<typeof setTimeout> | null> = {}

function getProfileIconAnimation(name: IconName): SvgAnimationPreset {
  switch (name) {
    case 'user':
    case 'users':
    case 'database':
      return 'float'
    case 'calendar':
      return 'bounce'
    case 'map-pin':
      return 'drift'
    case 'target':
      return 'pulse'
    case 'info':
      return 'twinkle'
    default:
      return 'float'
  }
}

Page({
  data: {
    vm,
    statusBarHeight: 0,
    rankIndex: DEFAULT_RANK_INDEX,
    isAutoPlay: true,
    showAvatarModal: false,
    currentAvatar: vm.avatarPresets[0].src,
    draftAvatar: vm.avatarPresets[0].src,
    ranks: [] as RankRuntimeItem[],
    currentRank: defaultRank as RankRuntimeItem,
    primaryItems: [] as PrimaryRuntimeItem[],
    secondaryItems: [] as SecondaryRuntimeItem[],
    storageCard: {
      ...vm.sections.storage,
      iconPair: { staticSrc: '', animatedSrc: '' },
    } as StorageRuntimeCard,
    icons: {
      sparklesPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      trophyPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      chevronRight: '',
      x: '',
      checkCircle2: '',
    },
    iconAnimations: {
      avatarBadge: false,
      sparkles: false,
      trophy: false,
    },
    pressStates: {
      avatar: false,
      previewToggle: false,
      rankPreview: false,
      primaryIndex: -1,
      secondaryIndex: -1,
      storage: false,
      avatarOptionIndex: -1,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()

    const ranks = vm.ranks.map(rank => ({
      ...rank,
      badgeIconPair: animatedIconPair(rank.iconName, {
        color: rank.iconColor,
        animation: 'float',
        durationMs: 2600,
      }),
      axisIconSrc: icon(rank.iconName, rank.iconColor, 10),
    }))

    const primaryItems = vm.sections.primary.items.map(item => ({
      ...item,
      iconPair: animatedIconPair(item.iconName, {
        color: item.iconColor,
        animation: getProfileIconAnimation(item.iconName),
        durationMs: 2200,
      }),
    }))

    const secondaryItems = vm.sections.secondary.items.map((item, index, items) => ({
      ...item,
      iconPair: animatedIconPair(item.iconName, {
        color: item.iconColor,
        animation: getProfileIconAnimation(item.iconName),
        durationMs: 2200,
      }),
      isLast: index === items.length - 1,
    }))

    this.setData({
      statusBarHeight: statusBarHeight || 0,
      ranks,
      currentRank: ranks[DEFAULT_RANK_INDEX],
      primaryItems,
      secondaryItems,
      storageCard: {
        ...vm.sections.storage,
        iconPair: animatedIconPair(vm.sections.storage.iconName, {
          color: vm.sections.storage.iconColor,
          animation: getProfileIconAnimation(vm.sections.storage.iconName),
          durationMs: 2400,
        }),
      },
      icons: {
        sparklesPair: this.buildSparklesIconPair(),
        trophyPair: this.buildTrophyIconPair(),
        chevronRight: icon('chevron-right', '#cbd5e1', 16),
        x: icon('x', '#94a3b8', 20),
        checkCircle2: icon('check-circle-2', '#2563eb', 24),
      },
    })

    this.startRankAutoPlay()
  },

  onUnload() {
    this.stopRankAutoPlay()
    Object.keys(profileTimers).forEach(key => {
      const timer = profileTimers[key]
      if (timer) clearTimeout(timer)
    })
    profileTimers = {}
  },

  buildSparklesIconPair() {
    return animatedIconPair('sparkles', {
      color: '#2563eb',
      animation: 'twinkle',
      durationMs: 2200,
    })
  },

  buildTrophyIconPair() {
    return animatedIconPair('trophy', {
      color: '#f59e0b',
      animation: 'float',
      durationMs: 2800,
    })
  },

  onShow() {
    if (this.data.isAutoPlay) {
      this.startRankAutoPlay()
    }
  },

  onHide() {
    this.stopRankAutoPlay()
  },

  startRankAutoPlay() {
    if (!this.data.isAutoPlay || rankTimer || this.data.ranks.length === 0) return

    rankTimer = setInterval(() => {
      const nextIndex = (this.data.rankIndex + 1) % this.data.ranks.length
      this.updateCurrentRank(nextIndex)
    }, AUTO_PLAY_INTERVAL)
  },

  stopRankAutoPlay() {
    if (rankTimer) {
      clearInterval(rankTimer)
      rankTimer = null
    }
  },

  updateCurrentRank(index: number) {
    this.setData({
      rankIndex: index,
      currentRank: this.data.ranks[index],
    })
  },

  playIconAnimation(key: string, duration: number = ICON_ANIMATION_DURATION) {
    const path = `iconAnimations.${key}`
    const pending = profileTimers[key]

    if (pending) {
      clearTimeout(pending)
      profileTimers[key] = null
    }

    this.setData({ [path]: false }, () => {
      this.setData({ [path]: true }, () => {
        profileTimers[key] = setTimeout(() => {
          this.setData({ [path]: false })
          profileTimers[key] = null
        }, duration)
      })
    })
  },

  pulseState(
    key: string,
    path: string,
    activeValue: boolean | number,
    restValue: boolean | number,
    duration: number = CARD_FEEDBACK_DURATION,
  ) {
    const pending = profileTimers[key]

    if (pending) {
      clearTimeout(pending)
      profileTimers[key] = null
    }

    this.setData({ [path]: restValue }, () => {
      this.setData({ [path]: activeValue }, () => {
        profileTimers[key] = setTimeout(() => {
          this.setData({ [path]: restValue })
          profileTimers[key] = null
        }, duration)
      })
    })
  },

  triggerRankPreviewFeedback() {
    this.pulseState('press-rank-preview', 'pressStates.rankPreview', true, false)
    this.playIconAnimation('trophy', 2800)
  },

  toggleAutoPlay() {
    const nextValue = !this.data.isAutoPlay
    this.pulseState('press-preview-toggle', 'pressStates.previewToggle', true, false)
    this.setData({ isAutoPlay: nextValue })
    this.playIconAnimation('sparkles', 2200)

    if (nextValue) {
      this.startRankAutoPlay()
      return
    }

    this.stopRankAutoPlay()
  },

  openAvatarModal() {
    this.pulseState('press-avatar', 'pressStates.avatar', true, false, 300)
    this.playIconAnimation('avatarBadge', 2600)
    this.setData({
      showAvatarModal: true,
      draftAvatar: this.data.currentAvatar,
    })
  },

  closeAvatarModal() {
    this.setData({
      showAvatarModal: false,
      draftAvatar: this.data.currentAvatar,
    })
  },

  selectAvatar(e: WechatMiniprogram.TouchEvent) {
    const { src, index } = e.currentTarget.dataset
    if (!src) return
    this.pulseState('press-avatar-option', 'pressStates.avatarOptionIndex', Number(index), -1, 220)
    this.setData({ draftAvatar: src })
  },

  confirmAvatar() {
    this.setData({
      currentAvatar: this.data.draftAvatar,
      showAvatarModal: false,
    })
  },

  pressPrimaryCard(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    const nextIndex = Number(index)
    this.pulseState('press-primary-card', 'pressStates.primaryIndex', nextIndex, -1)

    const route = PROFILE_PRIMARY_ROUTES[nextIndex]
    if (route) {
      this.navigateTo(route)
    }
  },

  pressSecondaryCard(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    const nextIndex = Number(index)
    this.pulseState('press-secondary-card', 'pressStates.secondaryIndex', nextIndex, -1)

    const route = PROFILE_SECONDARY_ROUTES[nextIndex]
    if (route) {
      this.navigateTo(route)
    }
  },

  pressStorageCard() {
    this.pulseState('press-storage-card', 'pressStates.storage', true, false)
    this.navigateTo(PROFILE_STORAGE_ROUTE)
  },

  navigateTo(url: string) {
    setTimeout(() => {
      wx.navigateTo({ url })
    }, 110)
  },
})
