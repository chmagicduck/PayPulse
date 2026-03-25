import { homeDashboardModel } from './model'
import {
  buildDashboardIcons,
  buildJourneyDisplayItems,
  INITIAL_JOURNEY_TIME_MODES,
  type JourneyId,
  type JourneyTimeModes,
} from './dashboard.helper'
import { clearTimerBag, createTimerBag, openModal, replayState } from '../../lib/wx/page'

const vm = homeDashboardModel
const timers = createTimerBag()
const ICON_ANIMATION_DURATION = 2200
const CARD_FEEDBACK_DURATION = 260

Page({
  data: {
    vm,
    statusBarHeight: 0,
    showAmount: true,
    isMoYu: false,
    showEditModal: false,
    editModalVisible: false,
    editH: '00',
    editM: '00',
    editS: '00',
    journeyTimeModes: INITIAL_JOURNEY_TIME_MODES,
    journeyDisplayItems: buildJourneyDisplayItems(vm.lifeJourney, INITIAL_JOURNEY_TIME_MODES),
    ...buildDashboardIcons(),
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
      modalConfirm: false,
      modalClose: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
    })
  },

  onUnload() {
    clearTimerBag(timers)
  },

  playIconAnimation(key: string, duration: number = ICON_ANIMATION_DURATION) {
    replayState(this, timers, `icon:${key}`, `iconAnimations.${key}`, true, false, duration)
  },

  playPressState(key: string, duration: number = CARD_FEEDBACK_DURATION) {
    replayState(this, timers, `press:${key}`, `pressStates.${key}`, true, false, duration)
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
      journeyDisplayItems: buildJourneyDisplayItems(vm.lifeJourney, nextModes),
    })
  },

  toggleAmount() {
    this.setData({ showAmount: !this.data.showAmount })
  },

  toggleMoYu() {
    this.setData({ isMoYu: !this.data.isMoYu })
    this.playIconAnimation('moyu', 1800)
  },

  openEditModal() {
    openModal(
      this,
      timers,
      'edit-modal',
      {
        show: 'showEditModal',
        visible: 'editModalVisible',
      },
      {
        editH: '01',
        editM: '24',
        editS: '16',
      },
    )
  },

  closeEditModal() {
    this.playPressState('modalClose')
    this.setData({ editModalVisible: false })
    timers['edit-modal'] = setTimeout(() => {
      this.setData({
        showEditModal: false,
        editModalVisible: false,
      })
      timers['edit-modal'] = null
    }, 280)
  },

  saveEditTime() {
    this.playPressState('modalConfirm')
    this.setData({ editModalVisible: false })
    timers['edit-modal'] = setTimeout(() => {
      this.setData({
        showEditModal: false,
        editModalVisible: false,
      })
      timers['edit-modal'] = null
    }, 280)
  },

  updateTimeField(e: WechatMiniprogram.Input) {
    const { field, max } = e.currentTarget.dataset
    if (!field) return

    const parsed = Math.max(0, Math.min(Number(max) || 59, parseInt(e.detail.value, 10) || 0))
    this.setData({
      [String(field)]: parsed.toString().padStart(2, '0'),
    })
  },
})
