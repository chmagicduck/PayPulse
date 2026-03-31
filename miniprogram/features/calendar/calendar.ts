import { handlePageBack } from '../../lib/wx/page'
import { buildAppShareMessage, buildAppTimelineShare, showAppShareMenu } from '../../lib/wx/share'
import { now } from '../../lib/domain/date'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { buildCalendarIcons } from './helper/icons'
import { calendarViewModel } from './model/index'
import { buildCalendarMonthState } from './model/state'

const today = now()
const initialMonthState = buildCalendarMonthState(today.getFullYear(), today.getMonth(), String(today.getDate()))

Page({
  data: {
    vm: {
      title: calendarViewModel.title,
      weekLabels: calendarViewModel.weekLabels,
    },
    statusBarHeight: 0,
    displayYear: today.getFullYear(),
    displayMonthIndex: today.getMonth(),
    icons: buildCalendarIcons(),
    ...initialMonthState,
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
    this.refreshMonthState()
  },

  handleBack() {
    handlePageBack('/features/profile/profile')
  },

  refreshMonthState() {
    this.setData(buildCalendarMonthState(this.data.displayYear, this.data.displayMonthIndex, this.data.selectedDay))
  },

  prevMonth() {
    const nextMonthIndex = this.data.displayMonthIndex === 0 ? 11 : this.data.displayMonthIndex - 1
    const nextYear = this.data.displayMonthIndex === 0 ? this.data.displayYear - 1 : this.data.displayYear
    this.setData({
      displayYear: nextYear,
      displayMonthIndex: nextMonthIndex,
    }, () => {
      this.refreshMonthState()
    })
  },

  nextMonth() {
    const nextMonthIndex = this.data.displayMonthIndex === 11 ? 0 : this.data.displayMonthIndex + 1
    const nextYear = this.data.displayMonthIndex === 11 ? this.data.displayYear + 1 : this.data.displayYear
    this.setData({
      displayYear: nextYear,
      displayMonthIndex: nextMonthIndex,
    }, () => {
      this.refreshMonthState()
    })
  },

  selectDay(e: WechatMiniprogram.TouchEvent) {
    const day = String(e.currentTarget.dataset.day || '')
    if (!day) return
    this.setData(buildCalendarMonthState(this.data.displayYear, this.data.displayMonthIndex, day))
  },

  onShareAppMessage() {
    return buildAppShareMessage()
  },

  onShareTimeline() {
    return buildAppTimelineShare()
  },
})
