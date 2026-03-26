import { handlePageBack } from '../../lib/wx/page'
import { now } from '../../lib/domain/date'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { buildCalendarIcons } from './calendar.helper'
import { calendarStaticViewModel } from './model'
import { buildCalendarMonthState, CALENDAR_MONTHS_2026 } from './model/state'

const today = now()
const initialMonthIndex = today.getFullYear() === 2026 ? Math.max(0, Math.min(11, today.getMonth())) : 0
const initialMonthState = buildCalendarMonthState(initialMonthIndex, String(today.getDate()))

Page({
  data: {
    vm: {
      title: calendarStaticViewModel.title,
      weekLabels: calendarStaticViewModel.weekLabels,
    },
    statusBarHeight: 0,
    monthIndex: initialMonthIndex,
    months: CALENDAR_MONTHS_2026,
    icons: buildCalendarIcons(),
    ...initialMonthState,
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  onShow() {
    if (!ensureBootstrapReady()) {
      return
    }
    this.refreshMonthState()
  },

  handleBack() {
    handlePageBack('/features/profile/home')
  },

  refreshMonthState() {
    this.setData(buildCalendarMonthState(this.data.monthIndex, this.data.selectedDay))
  },

  prevMonth() {
    if (this.data.monthIndex === 0) return
    this.setData({ monthIndex: this.data.monthIndex - 1 }, () => {
      this.refreshMonthState()
    })
  },

  nextMonth() {
    if (this.data.monthIndex >= this.data.months.length - 1) return
    this.setData({ monthIndex: this.data.monthIndex + 1 }, () => {
      this.refreshMonthState()
    })
  },

  selectDay(e: WechatMiniprogram.TouchEvent) {
    const day = String(e.currentTarget.dataset.day || '')
    if (!day) return
    this.setData(buildCalendarMonthState(this.data.monthIndex, day))
  },
})
