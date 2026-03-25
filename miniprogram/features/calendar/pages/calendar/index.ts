import { icon } from '../../../../lib/icons'
import { calendarStaticViewModel } from '../../model/static'

const vm = calendarStaticViewModel

type CalendarDay = {
  day: string
  status?: string
  badge?: string
}

type CalendarDetail = {
  title: string
  desc: string
}

type CalendarMonth = {
  key: string
  title: string
  reminder: string
  year: string
  monthLabel: string
  offset: number
  days: CalendarDay[]
  detailMap: Record<string, CalendarDetail>
}

Page({
  data: {
    vm,
    statusBarHeight: 0,
    monthIndex: 0,
    selectedDay: '10',
    emptySlots: [] as number[],
    currentMonth: vm.months[0] as unknown as CalendarMonth,
    currentDetail: vm.months[0].detailMap.payday as CalendarDetail,
    selectedStatus: 'payday',
    icons: {
      chevronLeft: '',
      chevronRight: '',
      coins: '',
      anchor: '',
      waves: '',
      zap: '',
      info: '',
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      icons: {
        chevronLeft: icon('chevron-left', '#64748b', 18),
        chevronRight: icon('chevron-right', '#64748b', 18),
        coins: icon('coins', '#f59e0b', 14),
        anchor: icon('anchor', '#f43f5e', 14),
        waves: icon('waves', '#10b981', 14),
        zap: icon('zap', '#1e293b', 14),
        info: icon('info', '#94a3b8', 16),
      },
    }, () => {
      this.refreshMonthState()
    })
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }

    wx.reLaunch({ url: '/features/profile/pages/home/index' })
  },

  refreshMonthState() {
    const currentMonth = this.data.vm.months[this.data.monthIndex] as unknown as CalendarMonth
    const emptySlots = Array.from({ length: currentMonth.offset }, (_, index) => index)
    const selectedDay = currentMonth.days.some(day => day.day === this.data.selectedDay)
      ? this.data.selectedDay
      : currentMonth.days[0]?.day || ''
    const selectedItem = currentMonth.days.find(day => day.day === selectedDay)
    const selectedStatus = selectedItem?.status || 'default'
    const currentDetail = currentMonth.detailMap[selectedStatus] || currentMonth.detailMap.default

    this.setData({
      currentMonth,
      emptySlots,
      selectedDay,
      selectedStatus,
      currentDetail,
    })
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
    const { day } = e.currentTarget.dataset
    if (!day) return
    const currentMonth = this.data.vm.months[this.data.monthIndex] as unknown as CalendarMonth
    const selectedItem = currentMonth.days.find(item => item.day === day)
    const selectedStatus = selectedItem?.status || 'default'
    const currentDetail = currentMonth.detailMap[selectedStatus] || currentMonth.detailMap.default
    this.setData({
      selectedDay: day,
      selectedStatus,
      currentDetail,
    })
  },
})
