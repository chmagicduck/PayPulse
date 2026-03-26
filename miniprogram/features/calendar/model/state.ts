import { getCalendarYearConfig } from '../../../lib/domain/calendar-config'
import { buildCalendarDayView, buildCalendarDetail, buildNextReminder } from '../../../lib/domain/calendar'
import { buildMonthDate, getDaysInMonth } from '../../../lib/domain/date'
import { readProfileSettings } from '../../profile-settings/model/storage'
import { readTimeAxisEntries } from '../../time-axis/model/storage'

export function buildCalendarMonthState(year: number, monthIndex: number, selectedDay: string) {
  const settings = readProfileSettings()
  const entries = readTimeAxisEntries()
  const monthStart = buildMonthDate(year, monthIndex, 1)
  const daysInMonth = getDaysInMonth(year, monthIndex)
  const preferredDay = String(new Date().getDate())
  const days = Array.from({ length: daysInMonth }, (_, index) =>
    buildCalendarDayView(buildMonthDate(year, monthIndex, index + 1), settings),
  )
  const nextSelectedDay = days.some(day => day.day === selectedDay)
    ? selectedDay
    : (days.some(day => day.day === preferredDay) ? preferredDay : days[0]?.day || '')
  const selectedDate = buildMonthDate(year, monthIndex, Number(nextSelectedDay || 1))
  const selectedItem = days.find(day => day.day === nextSelectedDay)
  const selectedStatus = selectedItem?.status || 'default'
  const config = getCalendarYearConfig(year)

  return {
    currentMonth: {
      key: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
      title: `${year} ${monthIndex + 1}月`,
      reminder: buildNextReminder(year, monthIndex, settings, entries),
      year: String(year),
      monthLabel: `${monthIndex + 1}月`,
      days,
      offset: monthStart.getDay(),
      supportOfficialHoliday: config.supportOfficialHoliday,
    },
    emptySlots: Array.from({ length: monthStart.getDay() }, (_, index) => index),
    selectedDay: nextSelectedDay,
    selectedStatus,
    currentDetail: buildCalendarDetail(selectedDate, settings),
  }
}
