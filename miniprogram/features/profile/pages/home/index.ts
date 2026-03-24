import { icon } from '../../../../lib/icons'
import { profileHomeStaticViewModel } from '../../model/static'

const vm = profileHomeStaticViewModel
const DEFAULT_RANK_INDEX = 4
const AUTO_PLAY_INTERVAL = 2000

type RankRuntimeItem = (typeof vm.ranks)[number] & {
  badgeIconSrc: string
  axisIconSrc: string
}

const defaultRank: RankRuntimeItem = {
  ...vm.ranks[DEFAULT_RANK_INDEX],
  badgeIconSrc: '',
  axisIconSrc: '',
}

let rankTimer: ReturnType<typeof setInterval> | null = null

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
    primaryItems: [] as Array<(typeof vm.sections.primary.items)[number] & { iconSrc: string }>,
    secondaryItems: [] as Array<(typeof vm.sections.secondary.items)[number] & { iconSrc: string; isLast: boolean }>,
    storageCard: {
      ...vm.sections.storage,
      iconSrc: '',
    },
    icons: {
      sparkles: '',
      trophy: '',
      chevronRight: '',
      x: '',
      checkCircle2: '',
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()

    const ranks = vm.ranks.map(rank => ({
      ...rank,
      badgeIconSrc: icon(rank.iconName, rank.iconColor, 16),
      axisIconSrc: icon(rank.iconName, rank.iconColor, 10),
    }))

    const primaryItems = vm.sections.primary.items.map(item => ({
      ...item,
      iconSrc: icon(item.iconName, item.iconColor, 18),
    }))

    const secondaryItems = vm.sections.secondary.items.map((item, index, items) => ({
      ...item,
      iconSrc: icon(item.iconName, item.iconColor, 18),
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
        iconSrc: icon(vm.sections.storage.iconName, vm.sections.storage.iconColor, 20),
      },
      icons: {
        sparkles: icon('sparkles', '#2563eb', 20),
        trophy: icon('trophy', '#f59e0b', 14),
        chevronRight: icon('chevron-right', '#cbd5e1', 16),
        x: icon('x', '#94a3b8', 20),
        checkCircle2: icon('check-circle-2', '#2563eb', 24),
      },
    })

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

  toggleAutoPlay() {
    const nextValue = !this.data.isAutoPlay
    this.setData({ isAutoPlay: nextValue })

    if (nextValue) {
      this.startRankAutoPlay()
      return
    }

    this.stopRankAutoPlay()
  },

  openAvatarModal() {
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
    const { src } = e.currentTarget.dataset
    if (!src) return
    this.setData({ draftAvatar: src })
  },

  confirmAvatar() {
    this.setData({
      currentAvatar: this.data.draftAvatar,
      showAvatarModal: false,
    })
  },
})
