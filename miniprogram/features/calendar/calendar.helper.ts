import { icon } from '../../lib/icons'
import { calendarStaticViewModel } from './model'

type CalendarMonth = (typeof calendarStaticViewModel.months)[number]
type CalendarDay = {
  day: string
  status?: string
}
type CalendarDetailMap = Record<string, { title: string; desc: string }>

export function buildCalendarIcons() {
  return {
    chevronLeft: icon('chevron-left', '#64748b', 18),
    chevronRight: icon('chevron-right', '#64748b', 18),
    coins: icon('coins', '#f59e0b', 14),
    anchor: icon('anchor', '#f43f5e', 14),
    waves: icon('waves', '#10b981', 14),
    zap: icon('zap', '#1e293b', 14),
    info: icon('info', '#94a3b8', 16),
  }
}

export function buildCalendarMonthState(monthIndex: number, selectedDay: string) {
  const currentMonth = calendarStaticViewModel.months[monthIndex] as CalendarMonth
  const monthDays = currentMonth.days as readonly CalendarDay[]
  const detailMap = currentMonth.detailMap as CalendarDetailMap
  const emptySlots = Array.from({ length: currentMonth.offset }, (_, index) => index)
  const nextSelectedDay = monthDays.some(day => day.day === selectedDay)
    ? selectedDay
    : monthDays[0]?.day || ''
  const selectedItem = monthDays.find(day => day.day === nextSelectedDay)
  const selectedStatus = selectedItem?.status || 'default'
  const currentDetail = detailMap[selectedStatus] || detailMap.default

  return {
    currentMonth,
    emptySlots,
    selectedDay: nextSelectedDay,
    selectedStatus,
    currentDetail,
  }
}
