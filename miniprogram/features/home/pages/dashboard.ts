import { dashboardStaticViewModel } from '../model/static'
import { animatedIconPair, icon, type IconImagePair } from '../../../lib/icons'

const vm = dashboardStaticViewModel
const ICON_ANIMATION_DURATION = 2200
const CARD_FEEDBACK_DURATION = 260
const JOURNEY_IDS = ['life', 'career', 'retire', 'final'] as const

type JourneyId = (typeof JOURNEY_IDS)[number]
type JourneyDisplayItem = (typeof vm.lifeJourney.items)[number] & {
  displayValue: string
}
type JourneyTimeModes = Record<JourneyId, number>

function buildSetDataPatch(path: string, value: unknown) {
  const patch: Record<string, unknown> = {}
  patch[path] = value
  return patch
}

const INITIAL_JOURNEY_TIME_MODES: JourneyTimeModes = {
  life: 0,
  career: 0,
  retire: 0,
  final: 0,
}

let homeTimers: Record<string, ReturnType<typeof setTimeout> | null> = {}

function buildJourneyDisplayItems(timeModes: JourneyTimeModes): JourneyDisplayItem[] {
  return vm.lifeJourney.items.map(item =>
    Object.assign({}, item, {
      displayValue: item.valueModes[timeModes[item.id]],
    }),
  )
}

Page({
  data: {
    vm,
    statusBarHeight: 0,
    showAmount: true,
    isMoYu: false,
    isEditModalOpen: false,
    editH: '00',
    editM: '00',
    editS: '00',
    journeyTimeModes: INITIAL_JOURNEY_TIME_MODES,
    journeyDisplayItems: buildJourneyDisplayItems(INITIAL_JOURNEY_TIME_MODES),
    iconEye: '',
    iconEyeOff: '',
    iconLogOut: '',
    iconSettingsSlate: '',
    iconListTodo: '',
    iconChevronRightBlue: '',
    iconX: '',
    iconPairs: {
      wavesWhite: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      coffeeWhite: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      coffeeBlue: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      walletWhite: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      calendarDaysWhite: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      heartRose: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      giftAmber: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      starBlue: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      babyWhite: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      babyIndigo: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      briefcaseWhite: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      briefcaseBlue: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      flagWhite: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      flagEmerald: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      skullWhite: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      skullRose: { staticSrc: '', animatedSrc: '' } as IconImagePair,
    },
    iconAnimations: {
      logo: false,
      moyu: false,
      tideWallet: false,
      tideWeekend: false,
      dateHeart: false,
      dateGift: false,
      dateStar: false,
      journeyLife: false,
      journeyCareer: false,
      journeyRetire: false,
      journeyFinal: false,
    },
    pressStates: {
      task: false,
      tideWallet: false,
      tideWeekend: false,
      dateHeart: false,
      dateGift: false,
      dateStar: false,
      journeyLife: false,
      journeyCareer: false,
      journeyRetire: false,
      journeyFinal: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      iconEye: icon('eye', '#bfdbfe', 14),
      iconEyeOff: icon('eye-off', '#bfdbfe', 14),
      iconLogOut: icon('log-out', '#bfdbfe', 12),
      iconSettingsSlate: icon('settings2', '#bfdbfe', 12),
      iconListTodo: icon('list-todo', '#2563eb', 16),
      iconChevronRightBlue: icon('chevron-right', '#2563eb', 12),
      iconX: icon('x', '#94a3b8', 18),
      iconPairs: this.buildAnimatedIconPairs(),
    })
  },

  onUnload() {
    Object.keys(homeTimers).forEach(key => {
      const timer = homeTimers[key]
      if (timer) clearTimeout(timer)
    })
    homeTimers = {}
  },

  buildAnimatedIconPairs() {
    return {
      wavesWhite: animatedIconPair('waves', {
        color: '#ffffff',
        animation: 'wave',
        durationMs: 2800,
      }),
      coffeeWhite: animatedIconPair('coffee', {
        color: '#ffffff',
        animation: 'bounce',
        durationMs: 1800,
      }),
      coffeeBlue: animatedIconPair('coffee', {
        color: '#2563eb',
        animation: 'bounce',
        durationMs: 1800,
      }),
      walletWhite: animatedIconPair('wallet', {
        color: '#ffffff',
        animation: 'float',
        durationMs: 2200,
      }),
      calendarDaysWhite: animatedIconPair('calendar-days', {
        color: '#ffffff',
        animation: 'float',
        durationMs: 2200,
      }),
      heartRose: animatedIconPair('heart', {
        color: '#f43f5e',
        animation: 'pulse',
        durationMs: 1800,
      }),
      giftAmber: animatedIconPair('gift', {
        color: '#f59e0b',
        animation: 'bounce',
        durationMs: 2000,
      }),
      starBlue: animatedIconPair('star', {
        color: '#3b82f6',
        animation: 'twinkle',
        durationMs: 2000,
      }),
      babyWhite: animatedIconPair('baby', {
        color: '#ffffff',
        animation: 'bounce',
        durationMs: 2000,
      }),
      babyIndigo: animatedIconPair('baby', {
        color: '#6366f1',
        animation: 'bounce',
        durationMs: 2000,
      }),
      briefcaseWhite: animatedIconPair('briefcase', {
        color: '#ffffff',
        animation: 'float',
        durationMs: 2000,
      }),
      briefcaseBlue: animatedIconPair('briefcase', {
        color: '#2563eb',
        animation: 'float',
        durationMs: 2000,
      }),
      flagWhite: animatedIconPair('flag', {
        color: '#ffffff',
        animation: 'wave',
        durationMs: 2200,
      }),
      flagEmerald: animatedIconPair('flag', {
        color: '#059669',
        animation: 'wave',
        durationMs: 2200,
      }),
      skullWhite: animatedIconPair('skull', {
        color: '#ffffff',
        animation: 'pulse',
        durationMs: 2000,
      }),
      skullRose: animatedIconPair('skull', {
        color: '#e11d48',
        animation: 'pulse',
        durationMs: 2000,
      }),
    }
  },

  playTransientState(path: string, key: string, duration: number) {
    const pending = homeTimers[key]

    if (pending) {
      clearTimeout(pending)
      homeTimers[key] = null
    }

    this.setData(buildSetDataPatch(path, false), () => {
      this.setData(buildSetDataPatch(path, true), () => {
        homeTimers[key] = setTimeout(() => {
          this.setData(buildSetDataPatch(path, false))
          homeTimers[key] = null
        }, duration)
      })
    })
  },

  playIconAnimation(key: string, duration: number = ICON_ANIMATION_DURATION) {
    this.playTransientState(`iconAnimations.${key}`, `icon:${key}`, duration)
  },

  playPressState(key: string, duration: number = CARD_FEEDBACK_DURATION) {
    this.playTransientState(`pressStates.${key}`, `press:${key}`, duration)
  },

  triggerCardFeedback(animationKey: string, pressKey: string, animationDuration: number = ICON_ANIMATION_DURATION) {
    this.playPressState(pressKey)
    this.playIconAnimation(animationKey, animationDuration)
  },

  triggerLogoAnimation() {
    this.playIconAnimation('logo', 2800)
  },

  triggerTaskCardFeedback() {
    this.playPressState('task')
  },

  triggerWalletTideAnimation() {
    this.triggerCardFeedback('tideWallet', 'tideWallet', 2000)
  },

  triggerWeekendTideAnimation() {
    this.triggerCardFeedback('tideWeekend', 'tideWeekend', 2000)
  },

  triggerDateHeartAnimation() {
    this.triggerCardFeedback('dateHeart', 'dateHeart', 1800)
  },

  triggerDateGiftAnimation() {
    this.triggerCardFeedback('dateGift', 'dateGift', 2000)
  },

  triggerDateStarAnimation() {
    this.triggerCardFeedback('dateStar', 'dateStar', 2000)
  },

  triggerJourneyLifeAnimation() {
    this.toggleJourneyDisplayMode('life')
    this.triggerCardFeedback('journeyLife', 'journeyLife', 2000)
  },

  triggerJourneyCareerAnimation() {
    this.toggleJourneyDisplayMode('career')
    this.triggerCardFeedback('journeyCareer', 'journeyCareer', 2000)
  },

  triggerJourneyRetireAnimation() {
    this.toggleJourneyDisplayMode('retire')
    this.triggerCardFeedback('journeyRetire', 'journeyRetire', 2200)
  },

  triggerJourneyFinalAnimation() {
    this.toggleJourneyDisplayMode('final')
    this.triggerCardFeedback('journeyFinal', 'journeyFinal', 2200)
  },

  toggleJourneyDisplayMode(id: JourneyId) {
    const currentModes = this.data.journeyTimeModes as JourneyTimeModes
    const nextModes: JourneyTimeModes = {
      life: currentModes.life,
      career: currentModes.career,
      retire: currentModes.retire,
      final: currentModes.final,
    }

    nextModes[id] = (currentModes[id] + 1) % 4

    this.setData({
      journeyTimeModes: nextModes,
      journeyDisplayItems: buildJourneyDisplayItems(nextModes),
    })
  },

  toggleAmount() {
    this.setData({ showAmount: !this.data.showAmount })
  },

  toggleMoYu() {
    const nextIsMoYu = !this.data.isMoYu
    this.setData({ isMoYu: nextIsMoYu })
    this.playIconAnimation('moyu', 1800)
  },

  openEditModal() {
    this.setData({
      isEditModalOpen: true,
      editH: '01',
      editM: '24',
      editS: '16',
    })
  },

  closeEditModal() {
    this.setData({ isEditModalOpen: false })
  },

  saveEditTime() {
    this.setData({ isEditModalOpen: false })
  },

  onEditHInput(e: WechatMiniprogram.Input) {
    const val = Math.min(23, Math.max(0, parseInt(e.detail.value) || 0))
    this.setData({ editH: val.toString().padStart(2, '0') })
  },

  onEditMInput(e: WechatMiniprogram.Input) {
    const val = Math.min(59, Math.max(0, parseInt(e.detail.value) || 0))
    this.setData({ editM: val.toString().padStart(2, '0') })
  },

  onEditSInput(e: WechatMiniprogram.Input) {
    const val = Math.min(59, Math.max(0, parseInt(e.detail.value) || 0))
    this.setData({ editS: val.toString().padStart(2, '0') })
  },
})
