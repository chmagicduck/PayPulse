import type { CalendarStatus, ProfileSettings, TimeAxisEntry } from './types'
import {
  buildMonthDate,
  diffDays,
  getDaysInMonth,
  parseDateString,
  startOfDay,
  toWeekKey,
  toDateKey,
} from './date'

const HOLIDAY_RANGES_2026 = [
  { from: '2026-01-01', to: '2026-01-03', badge: '元', title: '元旦假期中', desc: '当前日期位于 2026 年元旦假期区间。' },
  { from: '2026-02-15', to: '2026-02-23', badge: '春', title: '春节假期中', desc: '当前日期位于 2026 年春节假期区间。' },
  { from: '2026-04-04', to: '2026-04-06', badge: '清', title: '清明假期中', desc: '当前日期位于 2026 年清明假期区间。' },
  { from: '2026-05-01', to: '2026-05-05', badge: '劳', title: '劳动节假期中', desc: '当前日期位于 2026 年劳动节假期区间。' },
  { from: '2026-06-19', to: '2026-06-21', badge: '端', title: '端午假期中', desc: '当前日期位于 2026 年端午假期区间。' },
  { from: '2026-09-25', to: '2026-09-27', badge: '秋', title: '中秋假期中', desc: '当前日期位于 2026 年中秋假期区间。' },
  { from: '2026-10-01', to: '2026-10-07', badge: '庆', title: '国庆长假中', desc: '当前日期位于 2026 年国庆法定假期区间。' },
] as const

const MAKEUP_DAYS_2026 = new Set([
  '2026-01-04',
  '2026-02-14',
  '2026-02-28',
  '2026-05-09',
  '2026-09-20',
  '2026-10-10',
])

export type CalendarDayView = {
  day: string
  status?: 'holiday' | 'weekend' | 'makeup' | 'payday'
  badge?: string
}

export function getHolidayRange(value: Date) {
  const key = toDateKey(value)
  return HOLIDAY_RANGES_2026.find(item => key >= item.from && key <= item.to) || null
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
  const dateKey = toDateKey(date)
  if (MAKEUP_DAYS_2026.has(dateKey)) return 'makeup'
  if (getHolidayRange(date)) return 'holiday'

  const weekday = date.getDay()
  const isWeekend = weekday === 0 || weekday === 6
  if (!isWeekend) return 'workday'

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
  const holiday = getHolidayRange(date)
  const payDate = getPayDate(date.getFullYear(), date.getMonth(), settings.payDay)
  const dateKey = toDateKey(date)
  if (holiday) return { day: String(date.getDate()), status: 'holiday', badge: holiday.badge }
  if (MAKEUP_DAYS_2026.has(dateKey)) return { day: String(date.getDate()), status: 'makeup', badge: '班' }
  if (toDateKey(payDate) === dateKey) return { day: String(date.getDate()), status: 'payday', badge: '薪' }
  if (resolveWorkdayStatus(date, settings) === 'weekend') return { day: String(date.getDate()), status: 'weekend', badge: '休' }
  return { day: String(date.getDate()) }
}

export function buildCalendarDetail(date: Date, settings: ProfileSettings) {
  const holiday = getHolidayRange(date)
  const dateKey = toDateKey(date)
  if (holiday) return { title: holiday.title, desc: holiday.desc }
  if (MAKEUP_DAYS_2026.has(dateKey)) return { title: '强力补班中', desc: '今天属于 2026 年官方调休补班日，请注意工作节奏切换。' }
  if (toDateKey(getPayDate(date.getFullYear(), date.getMonth(), settings.payDay)) === dateKey) {
    return { title: '宝藏日：薪水到账', desc: '薪资节点已到，适合回顾本月航行收获。' }
  }
  if (resolveWorkdayStatus(date, settings) === 'weekend') {
    return { title: '周末避风港', desc: '当前日期位于常规休息日，适合短暂补能与自由安排。' }
  }
  return { title: '正常航行模式', desc: '当前海域风平浪静，适合稳定航行与日常推进。' }
}

function getNextTimeAxisEventInMonth(year: number, monthIndex: number, entries: readonly TimeAxisEntry[]) {
  const today = startOfDay(new Date())
  const monthStart = buildMonthDate(year, monthIndex, 1)
  const monthEnd = buildMonthDate(year, monthIndex, getDaysInMonth(year, monthIndex))

  return entries
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
  const today = startOfDay(new Date())
  const monthStart = buildMonthDate(year, monthIndex, 1)
  const monthEnd = buildMonthDate(year, monthIndex, getDaysInMonth(year, monthIndex))
  const candidates = [] as Array<{ date: Date; label: string }>

  const payDate = getPayDate(year, monthIndex, settings.payDay)
  if (payDate >= today && payDate >= monthStart && payDate <= monthEnd) {
    candidates.push({ date: payDate, label: `距离下一次发薪日还有 ${diffDays(today, payDate)} 天。` })
  }

  HOLIDAY_RANGES_2026.forEach(item => {
    const holidayDate = parseDateString(item.from)
    if (holidayDate >= today && holidayDate >= monthStart && holidayDate <= monthEnd) {
      candidates.push({ date: holidayDate, label: `距离${item.title.replace('中', '')}还有 ${diffDays(today, holidayDate)} 天。` })
    }
  })

  Array.from(MAKEUP_DAYS_2026).forEach(item => {
    const makeupDate = parseDateString(item)
    if (makeupDate >= today && makeupDate >= monthStart && makeupDate <= monthEnd) {
      candidates.push({ date: makeupDate, label: `距离下一次补班日还有 ${diffDays(today, makeupDate)} 天。` })
    }
  })

  const nextEvent = getNextTimeAxisEventInMonth(year, monthIndex, entries)
  if (nextEvent) {
    candidates.push({ date: nextEvent.date, label: `距离“${nextEvent.title}”还有 ${diffDays(today, nextEvent.date)} 天。` })
  }

  candidates.sort((left, right) => left.date.getTime() - right.date.getTime())
  return candidates[0]?.label || `${year}年${monthIndex + 1}月暂无额外提醒，请继续稳定航行。`
}

export function getRelativeDayText(target: Date, anniversary: boolean) {
  const today = startOfDay(new Date())
  let nextTarget = startOfDay(target)
  if (anniversary) {
    nextTarget = new Date(today.getFullYear(), target.getMonth(), target.getDate())
    if (nextTarget < today) nextTarget = new Date(today.getFullYear() + 1, target.getMonth(), target.getDate())
  }

  const delta = diffDays(today, nextTarget)
  return {
    valueText: String(Math.abs(delta)),
    unitText: delta < 0 && !anniversary ? '天前' : '天后',
    isPast: delta < 0 && !anniversary,
  }
}
