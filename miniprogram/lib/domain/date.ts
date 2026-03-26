const DAY_MS = 24 * 60 * 60 * 1000

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function now() {
  return new Date()
}

export function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

export function parseDateString(value: string) {
  const [year, month, day] = value.split('-').map(item => Number(item))
  return new Date(year || 1970, Math.max(0, (month || 1) - 1), day || 1)
}

export function toDateKey(value: Date) {
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

export function toWeekKey(value: Date) {
  const target = startOfDay(value)
  const weekday = target.getDay()
  const mondayOffset = weekday === 0 ? -6 : 1 - weekday
  const monday = addDays(target, mondayOffset)
  return toDateKey(monday)
}

export function addDays(value: Date, days: number) {
  return new Date(startOfDay(value).getTime() + days * DAY_MS)
}

export function diffDays(from: Date, to: Date) {
  return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS)
}

export function clampInt(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

export function formatMonthDay(value: string) {
  const date = parseDateString(value)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export function formatSlashDate(value: string) {
  return value.replace(/-/g, '/')
}

export function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate()
}

export function buildMonthDate(year: number, monthIndex: number, day: number) {
  return new Date(year, monthIndex, day)
}

export function formatDateTimeIso(value: Date) {
  return `${toDateKey(value)}T${pad(value.getHours())}:${pad(value.getMinutes())}:${pad(value.getSeconds())}`
}

export function getDurationSecFromTimeRange(start: string, end: string) {
  const [startH = 0, startM = 0] = start.split(':').map(item => Number(item))
  const [endH = 0, endM = 0] = end.split(':').map(item => Number(item))
  return Math.max(0, ((endH * 60 + endM) - (startH * 60 + startM)) * 60)
}
