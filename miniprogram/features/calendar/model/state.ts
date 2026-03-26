import { buildCalendarDayView, buildCalendarDetail, buildNextReminder } from '../../../lib/domain/calendar'
import { buildMonthDate, getDaysInMonth, now } from '../../../lib/domain/date'
import { readProfileSettings } from '../../profile-settings/model/storage'
import { readTimeAxisEntries } from '../../time-axis/model/storage'

export const CALENDAR_MONTHS_2026 = Array.from({ length: 12 }, (_, index) => ({
  year: 2026,
  monthIndex: index,
}))

export function buildCalendarMonthState(monthIndex: number, selectedDay: string) {
  const target = CALENDAR_MONTHS_2026[monthIndex]
  const settings = readProfileSettings()
  const entries = readTimeAxisEntries()
  const monthStart = buildMonthDate(target.year, target.monthIndex, 1)
  const today = now()
  const preferredDay = today.getFullYear() === target.year && today.getMonth() === target.monthIndex
    ? String(today.getDate())
    : ''
  const days = Array.from({ length: getDaysInMonth(target.year, target.monthIndex) }, (_, index) =>
    buildCalendarDayView(buildMonthDate(target.year, target.monthIndex, index + 1), settings),
  )
  const nextSelectedDay = days.some(day => day.day === selectedDay)
    ? selectedDay
    : (days.some(day => day.day === preferredDay) ? preferredDay : days[0]?.day || '')
  const selectedDate = buildMonthDate(target.year, target.monthIndex, Number(nextSelectedDay || 1))
  const selectedItem = days.find(day => day.day === nextSelectedDay)
  const selectedStatus = selectedItem?.status || 'default'

  return {
    currentMonth: {
      key: `${target.year}-${String(target.monthIndex + 1).padStart(2, '0')}`,
      title: `${target.year} ${target.monthIndex + 1}月`,
      reminder: buildNextReminder(target.year, target.monthIndex, settings, entries),
      year: String(target.year),
      monthLabel: `${target.monthIndex + 1}月`,
      days,
      offset: monthStart.getDay(),
    },
    emptySlots: Array.from({ length: monthStart.getDay() }, (_, index) => index),
    selectedDay: nextSelectedDay,
    selectedStatus,
    currentDetail: buildCalendarDetail(selectedDate, settings),
  }
}
