import { adjustDailyRecordDuration, readAmountVisibility, writeAmountVisibility } from '../../lib/domain/daily-records'
import { now, toDateKey } from '../../lib/domain/date'
import { startMoyuSession, stopMoyuSession, syncMoyuSession } from '../../lib/domain/moyu-session'
import { formatTimeFieldValue, sanitizeTimeFieldInput } from '../../lib/domain/time-fields'
import { clearTimerBag, createTimerBag, openModal, replayState } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { readProfileSettings } from '../profile-settings/model/storage'
import { buildDashboardIcons } from './helper/icons'
import { buildJourneyDisplayItems, INITIAL_JOURNEY_TIME_MODES, type JourneyTimeModes } from './helper/journey'
import { buildHomeViewModel, createHomeIconAnimations, createHomePressStates, type HomeIconAnimationKey, type HomePressStateKey } from './helper/page'
import { homeDashboardModel, type JourneyId } from './model/index'
import { buildHomeDashboardRuntimeState } from './model/state'

const timers = createTimerBag()
const ICON_ANIMATION_DURATION = 2200
const CARD_FEEDBACK_DURATION = 260
const LIVE_CLOCK_TIMER_KEY = 'live-clock'
const LIVE_CLOCK_INTERVAL = 1000

Page({
  data: {
    vm: homeDashboardModel,
    statusBarHeight: 0,
    showAmount: true,
    isMoYu: false,
    showEditModal: false,
    editModalVisible: false,
    editH: '00',
    editM: '00',
    editS: '00',
    journeyTimeModes: INITIAL_JOURNEY_TIME_MODES,
    journeyDisplayItems: buildJourneyDisplayItems(homeDashboardModel.lifeJourney, INITIAL_JOURNEY_TIME_MODES),
    ...buildDashboardIcons(),
    iconAnimations: createHomeIconAnimations(),
    pressStates: createHomePressStates(),
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
    this.startLiveClock()
  },

  onHide() {
    this.stopLiveClock()
    if (!ensureBootstrapReady()) {
      return
    }
    syncMoyuSession(readProfileSettings(), now())
  },

  onUnload() {
    this.stopLiveClock()
    clearTimerBag(timers)
  },

  reloadRuntimeState() {
    const runtimeState = buildHomeDashboardRuntimeState()
    const vm = buildHomeViewModel(runtimeState)

    this.setData({
      vm,
      isMoYu: runtimeState.isMoYu,
      journeyDisplayItems: buildJourneyDisplayItems(vm.lifeJourney, this.data.journeyTimeModes as JourneyTimeModes),
      showAmount: readAmountVisibility(),
    })
  },

  startLiveClock() {
    this.stopLiveClock()

    const tick = () => {
      if (!ensureBootstrapReady()) {
        timers[LIVE_CLOCK_TIMER_KEY] = null
        return
      }

      this.reloadRuntimeState()
      timers[LIVE_CLOCK_TIMER_KEY] = setTimeout(tick, LIVE_CLOCK_INTERVAL)
    }

    timers[LIVE_CLOCK_TIMER_KEY] = setTimeout(tick, LIVE_CLOCK_INTERVAL)
  },

  stopLiveClock() {
    const pending = timers[LIVE_CLOCK_TIMER_KEY]
    if (!pending) {
      return
    }

    clearTimeout(pending)
    timers[LIVE_CLOCK_TIMER_KEY] = null
  },

  playIconAnimation(key: HomeIconAnimationKey, duration: number = ICON_ANIMATION_DURATION) {
    replayState(this, timers, `icon:${key}`, `iconAnimations.${key}`, true, false, duration)
  },

  playPressState(key: HomePressStateKey, duration: number = CARD_FEEDBACK_DURATION) {
    replayState(this, timers, `press:${key}`, `pressStates.${key}`, true, false, duration)
  },

  triggerCardFeedback(
    animationKey: HomeIconAnimationKey,
    pressKey: HomePressStateKey,
    animationDuration: number = ICON_ANIMATION_DURATION,
  ) {
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
    const nextMode = (currentModes[id] + 1) % 4
    const nextModes: JourneyTimeModes = {
      life: nextMode,
      career: nextMode,
      retire: nextMode,
      final: nextMode,
    }

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

  toggleMoYu(e: WechatMiniprogram.TouchEvent) {
    const settings = readProfileSettings()
    const blockedMessage = String(e.currentTarget.dataset.blockedMessage || '')

    if (!this.data.isMoYu && !this.data.vm.homeStatus.allowStart) {
      wx.showToast({
        title: blockedMessage,
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
      wx.navigateTo({ url: '/features/time-axis/time-axis' })
    }, 120)
  },
})
