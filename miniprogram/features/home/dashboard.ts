import { adjustDailyRecordDuration, readAmountVisibility, writeAmountVisibility } from '../../lib/domain/daily-records'
import { now, toDateKey } from '../../lib/domain/date'
import { startMoyuSession, stopMoyuSession, syncMoyuSession } from '../../lib/domain/moyu-session'
import { formatTimeFieldValue, sanitizeTimeFieldInput } from '../../lib/domain/time-fields'
import { clearTimerBag, createTimerBag, openModal, replayState } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { readProfileSettings } from '../profile-settings/model/storage'
import { buildDashboardIcons, buildJourneyDisplayItems, INITIAL_JOURNEY_TIME_MODES, type JourneyId, type JourneyTimeModes } from './dashboard.helper'
import { homeDashboardModel } from './model'
import { buildHomeDashboardRuntimeState } from './model/state'

const timers = createTimerBag()
const ICON_ANIMATION_DURATION = 2200
const CARD_FEEDBACK_DURATION = 260

Page({
  data: {
    vm: homeDashboardModel as any,
    statusBarHeight: 0,
    showAmount: true,
    isMoYu: false,
    showEditModal: false,
    editModalVisible: false,
    editH: '00',
    editM: '00',
    editS: '00',
    journeyTimeModes: INITIAL_JOURNEY_TIME_MODES,
    journeyDisplayItems: buildJourneyDisplayItems(homeDashboardModel.lifeJourney as any, INITIAL_JOURNEY_TIME_MODES) as any[],
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
      showAmount: readAmountVisibility(),
    })
  },

  onShow() {
    if (!ensureBootstrapReady()) {
      return
    }
    this.reloadRuntimeState()
  },

  onHide() {
    if (!ensureBootstrapReady()) {
      return
    }
    syncMoyuSession(readProfileSettings(), now())
  },

  onUnload() {
    clearTimerBag(timers)
  },

  reloadRuntimeState() {
    const runtimeState = buildHomeDashboardRuntimeState() as unknown as typeof homeDashboardModel
    const vm = Object.assign({}, homeDashboardModel, runtimeState, {
      importantDates: runtimeState.importantDates.filter(item => !String(item.id).startsWith('placeholder-')),
    })
    this.setData({
      vm,
      isMoYu: Boolean((runtimeState as any).isMoYu),
      journeyDisplayItems: buildJourneyDisplayItems(vm.lifeJourney, this.data.journeyTimeModes as JourneyTimeModes),
      showAmount: readAmountVisibility(),
    })
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
    this.openLabPage()
  },

  triggerWalletTideAnimation() {
    this.triggerCardFeedback('tideWallet', 'tideWallet', 2000)
    this.openCalendarPage()
  },

  triggerWeekendTideAnimation() {
    this.triggerCardFeedback('tideWeekend', 'tideWeekend', 2000)
    this.openCalendarPage()
  },

  triggerDateHeartAnimation() {
    this.triggerCardFeedback('dateHeart', 'dateHeart', 1800)
    this.openTimeAxisPage()
  },

  triggerDateGiftAnimation() {
    this.triggerCardFeedback('dateGift', 'dateGift', 2000)
    this.openTimeAxisPage()
  },

  triggerDateStarAnimation() {
    this.triggerCardFeedback('dateStar', 'dateStar', 2000)
    this.openTimeAxisPage()
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
      journeyDisplayItems: buildJourneyDisplayItems(this.data.vm.lifeJourney, nextModes),
    })
  },

  toggleAmount() {
    const nextValue = !this.data.showAmount
    writeAmountVisibility(nextValue)
    this.setData({ showAmount: nextValue })
  },

  toggleMoYu() {
    const settings = readProfileSettings()
    const runtimeState = this.data.vm as typeof homeDashboardModel & {
      homeStatus?: {
        allowStart: boolean
      }
    }

    if (!this.data.isMoYu && !runtimeState.homeStatus?.allowStart) {
      wx.showToast({
        title: '当前状态不能开启避风',
        icon: 'none',
      })
      return
    }

    if (this.data.isMoYu) {
      stopMoyuSession(settings, 'manual', now())
    } else {
      startMoyuSession(now())
    }

    this.playIconAnimation('moyu', 1800)
    this.reloadRuntimeState()
  },

  openEditModal() {
    const [editH = '00', editM = '00', editS = '00'] = String(this.data.vm.timer.rightValue || '00:00:00').split(':')
    openModal(
      this,
      timers,
      'edit-modal',
      {
        show: 'showEditModal',
        visible: 'editModalVisible',
      },
      {
        editH,
        editM,
        editS,
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

  stopModalTap() {},

  saveEditTime() {
    this.playPressState('modalConfirm')
    const editH = formatTimeFieldValue(this.data.editH, 23)
    const editM = formatTimeFieldValue(this.data.editM, 59)
    const editS = formatTimeFieldValue(this.data.editS, 59)
    const durationSec = Number(editH) * 3600 + Number(editM) * 60 + Number(editS)
    const settings = readProfileSettings()
    stopMoyuSession(settings, 'manual', now())
    adjustDailyRecordDuration(toDateKey(now()), durationSec, 'home', settings)
    this.setData({
      editModalVisible: false,
      editH,
      editM,
      editS,
    })
    timers['edit-modal'] = setTimeout(() => {
      this.setData({
        showEditModal: false,
        editModalVisible: false,
      })
      this.reloadRuntimeState()
      timers['edit-modal'] = null
    }, 280)
  },

  updateTimeField(e: WechatMiniprogram.Input) {
    const { field, max } = e.currentTarget.dataset
    if (!field) return

    this.setData({
      [String(field)]: sanitizeTimeFieldInput(String(e.detail.value || ''), Number(max) || 59),
    })
  },

  normalizeTimeField(e: WechatMiniprogram.Input) {
    const { field, max } = e.currentTarget.dataset
    if (!field) return

    this.setData({
      [String(field)]: formatTimeFieldValue(String(this.data[String(field) as 'editH' | 'editM' | 'editS'] || ''), Number(max) || 59),
    })
  },

  openLabPage() {
    setTimeout(() => {
      wx.switchTab({ url: '/features/lab/lab' })
    }, 120)
  },

  openCalendarPage() {
    setTimeout(() => {
      wx.navigateTo({ url: '/features/calendar/calendar' })
    }, 120)
  },

  openTimeAxisPage() {
    setTimeout(() => {
      wx.navigateTo({ url: '/features/time-axis/time-axis-settings' })
    }, 120)
  },
})
