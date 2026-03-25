import { calendarStaticViewModel } from './model'
import { buildCalendarIcons, buildCalendarMonthState } from './calendar.helper'
import { handlePageBack } from '../../lib/wx/page'

const initialMonthState = buildCalendarMonthState(0, '10')

Page({
  data: {
    vm: calendarStaticViewModel,
    statusBarHeight: 0,
    monthIndex: 0,
    icons: buildCalendarIcons(),
    ...initialMonthState,
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
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
    if (this.data.monthIndex >= this.data.vm.months.length - 1) return
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
