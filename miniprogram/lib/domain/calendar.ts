import type { CalendarStatus, ProfileSettings, TimeAxisEntry } from './types'
import { getCalendarYearConfig } from './calendar-config'
import {
  buildMonthDate,
  diffDays,
  getDaysInMonth,
  parseDateString,
  startOfDay,
  toWeekKey,
  toDateKey,
} from './date'

export type CalendarDayView = {
  day: string
  status?: 'holiday' | 'weekend' | 'makeup' | 'payday'
  badge?: string
}

export function getHolidayRange(value: Date) {
  const config = getCalendarYearConfig(value.getFullYear())
  const key = toDateKey(value)
  return config.holidayRanges.find(item => key >= item.from && key <= item.to) || null
}

export function getPayDate(year: number, monthIndex: number, payDay: number) {
  const daysInMonth = getDaysInMonth(year, monthIndex)
  return buildMonthDate(year, monthIndex, Math.min(daysInMonth, Math.max(1, payDay)))
}

function isBigWeekForDate(date: Date, settings: ProfileSettings) {
  const currentWeekStart = parseDateString(toWeekKey(new Date()))
  const targetWeekStart = parseDateString(toWeekKey(date))
  const weekOffset = Math.round(diffDays(currentWeekStart, targetWeekStart) / 7)
  return Math.abs(weekOffset) % 2 === 0
    ? settings.isCurrentBigWeek
    : !settings.isCurrentBigWeek
}

export function resolveWorkdayStatus(date: Date, settings: ProfileSettings): CalendarStatus {
  const config = getCalendarYearConfig(date.getFullYear())
  const dateKey = toDateKey(date)

  if (config.supportOfficialHoliday && config.makeupDays.includes(dateKey)) {
    return 'makeup'
  }
  if (config.supportOfficialHoliday && getHolidayRange(date)) {
    return 'holiday'
  }

  const weekday = date.getDay()
  const isWeekendDay = weekday === 0 || weekday === 6
  if (!isWeekendDay) {
    return 'workday'
  }

  switch (settings.workMode) {
    case 'single-sat':
      return weekday === 6 ? 'workday' : 'weekend'
    case 'single-sun':
      return weekday === 0 ? 'workday' : 'weekend'
    case 'big-small':
      return weekday === 6 && isBigWeekForDate(date, settings) ? 'workday' : 'weekend'
    case 'double':
    default:
      return 'weekend'
  }
}

export function isWorkday(date: Date, settings: ProfileSettings) {
  const status = resolveWorkdayStatus(date, settings)
  return status === 'workday' || status === 'makeup'
}

export function buildCalendarDayView(date: Date, settings: ProfileSettings): CalendarDayView {
  const config = getCalendarYearConfig(date.getFullYear())
  const holiday = config.supportOfficialHoliday ? getHolidayRange(date) : null
  const payDate = getPayDate(date.getFullYear(), date.getMonth(), settings.payDay)
  const dateKey = toDateKey(date)

  if (holiday) {
    return { day: String(date.getDate()), status: 'holiday', badge: holiday.badge }
  }
  if (config.supportOfficialHoliday && config.makeupDays.includes(dateKey)) {
    return { day: String(date.getDate()), status: 'makeup', badge: '班' }
  }
  if (toDateKey(payDate) === dateKey) {
    return { day: String(date.getDate()), status: 'payday', badge: '薪' }
  }
  if (resolveWorkdayStatus(date, settings) === 'weekend') {
    return { day: String(date.getDate()), status: 'weekend', badge: '休' }
  }

  return { day: String(date.getDate()) }
}

export function buildCalendarDetail(date: Date, settings: ProfileSettings) {
  const config = getCalendarYearConfig(date.getFullYear())
  const holiday = config.supportOfficialHoliday ? getHolidayRange(date) : null
  const dateKey = toDateKey(date)

  if (holiday) {
    return { title: holiday.title, desc: holiday.desc }
  }
  if (config.supportOfficialHoliday && config.makeupDays.includes(dateKey)) {
    return { title: '苦逼补班中', desc: '今天属于官方调休补班日，请合理安排摸鱼节奏，保重身体。' }
  }
  if (toDateKey(getPayDate(date.getFullYear(), date.getMonth(), settings.payDay)) === dateKey) {
    return { title: '宝藏日：工资到账', desc: '发薪日到了，快看看这笔钱对得起你受的委屈吗。' }
  }
  if (resolveWorkdayStatus(date, settings) === 'weekend') {
    return { title: '周末躺平中', desc: '今天是休息日，不谈工作，好好回血，暂停摸鱼计费。' }
  }

  return { title: '日常搬砖模式', desc: '当前处于正常工作日，工时与打工收益正常推进中。' }
}

function getNextTimeAxisEventInMonth(year: number, monthIndex: number, entries: readonly TimeAxisEntry[]) {
  const today = startOfDay(new Date())
  const monthStart = buildMonthDate(year, monthIndex, 1)
  const monthEnd = buildMonthDate(year, monthIndex, getDaysInMonth(year, monthIndex))

  return entries
    .filter(entry => entry.isAnniversary)
    .map(entry => {
      const target = parseDateString(entry.date)
      let nextTarget = target
      if (entry.isAnniversary) {
        nextTarget = new Date(year, target.getMonth(), target.getDate())
        if (nextTarget < today) {
          nextTarget = new Date(year + 1, target.getMonth(), target.getDate())
        }
      }

      return {
        title: entry.title,
        date: nextTarget,
      }
    })
    .filter(item => item.date >= today && item.date >= monthStart && item.date <= monthEnd)
    .sort((left, right) => left.date.getTime() - right.date.getTime())[0] || null
}

export function buildNextReminder(year: number, monthIndex: number, settings: ProfileSettings, entries: readonly TimeAxisEntry[]) {
  const config = getCalendarYearConfig(year)
  const today = startOfDay(new Date())
  const monthStart = buildMonthDate(year, monthIndex, 1)
  const monthEnd = buildMonthDate(year, monthIndex, getDaysInMonth(year, monthIndex))
  const candidates = [] as Array<{ date: Date; label: string }>

  const payDate = getPayDate(year, monthIndex, settings.payDay)
  if (payDate >= today && payDate >= monthStart && payDate <= monthEnd) {
    candidates.push({ date: payDate, label: `距离下次发工资还有 ${diffDays(today, payDate)} 天` })
  }

  if (config.supportOfficialHoliday) {
    config.holidayRanges.forEach(item => {
      const holidayDate = parseDateString(item.from)
      if (holidayDate >= today && holidayDate >= monthStart && holidayDate <= monthEnd) {
        candidates.push({ date: holidayDate, label: `距离${item.title.replace('中', '')}还有 ${diffDays(today, holidayDate)} 天` })
      }
    })

    config.makeupDays.forEach(item => {
      const makeupDate = parseDateString(item)
      if (makeupDate >= today && makeupDate >= monthStart && makeupDate <= monthEnd) {
        candidates.push({ date: makeupDate, label: `距离万恶的补班日还有 ${diffDays(today, makeupDate)} 天` })
      }
    })
  }

  const nextEvent = getNextTimeAxisEventInMonth(year, monthIndex, entries)
  if (nextEvent) {
    candidates.push({ date: nextEvent.date, label: `距离“${nextEvent.title}”还有 ${diffDays(today, nextEvent.date)} 天` })
  }

  candidates.sort((left, right) => left.date.getTime() - right.date.getTime())
  return candidates[0]?.label || `${year} 年 ${monthIndex + 1} 月暂无盼头，继续稳定搬砖吧。`
}

export function getRelativeDayText(target: Date, anniversary: boolean) {
  const today = startOfDay(new Date())
  let nextTarget = startOfDay(target)
  if (anniversary) {
    nextTarget = new Date(today.getFullYear(), target.getMonth(), target.getDate())
    if (nextTarget < today) {
      nextTarget = new Date(today.getFullYear() + 1, target.getMonth(), target.getDate())
    }
  }

  const delta = diffDays(today, nextTarget)
  return {
    valueText: String(Math.abs(delta)),
    unitText: delta < 0 && !anniversary ? '天前' : '天后',
    isPast: delta < 0 && !anniversary,
  }
}
