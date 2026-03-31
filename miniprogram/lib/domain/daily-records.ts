import { storageKeys } from '../constants/storage'
import { safeGetStorage, safeRemoveStorage, safeSetStorage } from '../wx/storage'
import { formatCurrency, formatDurationHM, formatDurationHMS, formatDurationHours } from './format'
import type {
  AdjustmentSource,
  CalendarStatus,
  DailyVoyageDerivedRecord,
  DailyVoyageRecord,
  ProfileSettings,
  TimeAxisEntry,
} from './types'
import {
  addDays,
  buildMonthDate,
  clampInt,
  diffDays,
  formatDateTimeIso,
  formatMonthDay,
  getDaysInMonth,
  getDurationSecFromTimeRange,
  now,
  parseDateString,
  startOfDay,
  toDateKey,
} from './date'
import { getPayDate, getRelativeDayText, isWorkday, resolveWorkdayStatus } from './calendar'
import { computeRetirementDate } from './retirement'

type DailyRecordMap = Record<string, DailyVoyageRecord>

type DerivedMetricsOptions = {
  targetDateTime?: Date
  activeMoyuDurationSec?: number
}

export type WorkdayTimeline = {
  calendarStatus: CalendarStatus
  scheduledWorkDurationSec: number
  startAt: Date
  endAt: Date
  lunchStartAt: Date | null
  lunchEndAt: Date | null
}

function writeDailyRecordMap(value: DailyRecordMap) {
  safeSetStorage(storageKeys.homeDailySession, value)
}

function normalizeStoredRecord(record: Partial<DailyVoyageRecord>): DailyVoyageRecord | null {
  if (!record.date) {
    return null
  }

  return {
    date: String(record.date),
    scheduledWorkDurationSec: Math.max(0, Math.round(Number(record.scheduledWorkDurationSec) || 0)),
    moyuDurationSec: Math.max(0, Math.round(Number(record.moyuDurationSec) || 0)),
    manualAdjustmentDurationSec: Math.max(0, Math.round(Number(record.manualAdjustmentDurationSec) || 0)),
    adjustmentSource: record.adjustmentSource === 'home' ? 'home' : 'none',
    calendarStatus: record.calendarStatus || 'workday',
    updatedAt: record.updatedAt || formatDateTimeIso(now()),
  }
}

export function readDailyRecordMap() {
  const rawMap = safeGetStorage<Record<string, Partial<DailyVoyageRecord>>>(storageKeys.homeDailySession, {})
  const normalized = Object.keys(rawMap).reduce<DailyRecordMap>((result, key) => {
    const normalizedRecord = normalizeStoredRecord(rawMap[key])
    if (normalizedRecord) {
      result[key] = normalizedRecord
    }
    return result
  }, {})

  if (JSON.stringify(rawMap) !== JSON.stringify(normalized)) {
    writeDailyRecordMap(normalized)
  }

  return normalized
}

export function listDailyRecords() {
  return Object.values(readDailyRecordMap()).sort((left, right) => left.date.localeCompare(right.date))
}

export function readAmountVisibility() {
  return safeGetStorage<boolean>(storageKeys.homeAmountVisibility, true)
}

export function writeAmountVisibility(value: boolean) {
  safeSetStorage(storageKeys.homeAmountVisibility, value)
}

export function clearLegacyReportAdjustments() {
  safeRemoveStorage(storageKeys.reportHistoryAdjustments)
}

export function computeScheduledWorkDurationSec(settings: ProfileSettings, status: CalendarStatus) {
  if (status === 'holiday' || status === 'weekend') {
    return 0
  }

  const raw = getDurationSecFromTimeRange(settings.startTime, settings.endTime)
  if (!settings.lunchBreakEnabled || !settings.lunchStartTime || !settings.lunchEndTime) {
    return raw
  }

  const lunch = getDurationSecFromTimeRange(settings.lunchStartTime, settings.lunchEndTime)
  return Math.max(0, raw - lunch)
}

export function getWorkdayTimeline(targetDate: Date, settings: ProfileSettings): WorkdayTimeline {
  const currentDate = startOfDay(targetDate)
  const status = resolveWorkdayStatus(currentDate, settings)
  const [startHour = 9, startMinute = 0] = settings.startTime.split(':').map(item => Number(item))
  const [endHour = 18, endMinute = 0] = settings.endTime.split(':').map(item => Number(item))
  const startAt = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    startHour,
    startMinute,
    0,
  )
  const endAt = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    endHour,
    endMinute,
    0,
  )

  const lunchStartAt = settings.lunchBreakEnabled && settings.lunchStartTime
    ? new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        Number(settings.lunchStartTime.split(':')[0] || 0),
        Number(settings.lunchStartTime.split(':')[1] || 0),
        0,
      )
    : null
  const lunchEndAt = settings.lunchBreakEnabled && settings.lunchEndTime
    ? new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        Number(settings.lunchEndTime.split(':')[0] || 0),
        Number(settings.lunchEndTime.split(':')[1] || 0),
        0,
      )
    : null

  return {
    calendarStatus: status,
    scheduledWorkDurationSec: computeScheduledWorkDurationSec(settings, status),
    startAt,
    endAt,
    lunchStartAt,
    lunchEndAt,
  }
}

export function getElapsedPlannedWorkDurationSec(targetDateTime: Date, settings: ProfileSettings) {
  const timeline = getWorkdayTimeline(targetDateTime, settings)
  if (!isWorkday(targetDateTime, settings) || timeline.scheduledWorkDurationSec <= 0) {
    return 0
  }

  if (targetDateTime.getTime() <= timeline.startAt.getTime()) {
    return 0
  }

  const effectiveEndAt = targetDateTime.getTime() >= timeline.endAt.getTime()
    ? timeline.endAt
    : targetDateTime

  const rawWorkedSec = Math.max(0, Math.round((effectiveEndAt.getTime() - timeline.startAt.getTime()) / 1000))
  if (!timeline.lunchStartAt || !timeline.lunchEndAt) {
    return Math.min(timeline.scheduledWorkDurationSec, rawWorkedSec)
  }

  const lunchOverlapStart = Math.max(timeline.lunchStartAt.getTime(), timeline.startAt.getTime())
  const lunchOverlapEnd = Math.min(timeline.lunchEndAt.getTime(), effectiveEndAt.getTime())
  const lunchOverlapSec = lunchOverlapEnd > lunchOverlapStart
    ? Math.round((lunchOverlapEnd - lunchOverlapStart) / 1000)
    : 0

  return Math.min(timeline.scheduledWorkDurationSec, Math.max(0, rawWorkedSec - lunchOverlapSec))
}

export function getMonthWorkSeconds(date: Date, settings: ProfileSettings) {
  let total = 0
  const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth())

  for (let day = 1; day <= daysInMonth; day += 1) {
    const current = buildMonthDate(date.getFullYear(), date.getMonth(), day)
    const status = resolveWorkdayStatus(current, settings)
    total += computeScheduledWorkDurationSec(settings, status)
  }

  return total
}

export function computeSecondSalaryCents(settings: ProfileSettings, date: Date) {
  const monthWorkSeconds = getMonthWorkSeconds(date, settings)
  if (monthWorkSeconds <= 0) {
    return 0
  }

  return settings.monthlySalaryCents / monthWorkSeconds
}

function buildRecord(date: Date, settings: ProfileSettings, durationSec: number = 0, source: AdjustmentSource = 'none'): DailyVoyageRecord {
  const status = resolveWorkdayStatus(date, settings)
  const scheduledWorkDurationSec = computeScheduledWorkDurationSec(settings, status)
  const safeDuration = clampInt(durationSec, 0, scheduledWorkDurationSec)

  return {
    date: toDateKey(date),
    calendarStatus: status,
    scheduledWorkDurationSec,
    moyuDurationSec: safeDuration,
    manualAdjustmentDurationSec: source === 'home' ? safeDuration : 0,
    adjustmentSource: source,
    updatedAt: formatDateTimeIso(now()),
  }
}

function refreshRecord(record: DailyVoyageRecord, settings: ProfileSettings) {
  const date = parseDateString(record.date)
  const next = buildRecord(date, settings, record.moyuDurationSec, record.adjustmentSource)

  return {
    ...record,
    ...next,
    manualAdjustmentDurationSec: record.adjustmentSource === 'home'
      ? clampInt(record.manualAdjustmentDurationSec || next.moyuDurationSec, 0, next.scheduledWorkDurationSec)
      : 0,
  }
}

export function ensureCurrentMonthRecords(settings: ProfileSettings, targetDate: Date = now()) {
  const nextMap = { ...readDailyRecordMap() }
  const firstDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
  const today = startOfDay(targetDate)

  for (let current = firstDay; current <= today; current = addDays(current, 1)) {
    const key = toDateKey(current)
    const existing = nextMap[key]
    nextMap[key] = existing ? refreshRecord(existing, settings) : buildRecord(current, settings)
  }

  writeDailyRecordMap(nextMap)
  return nextMap
}

export function rebuildAllDailyRecords(settings: ProfileSettings) {
  const currentMap = readDailyRecordMap()
  const nextMap = Object.keys(currentMap).reduce<DailyRecordMap>((result, key) => {
    result[key] = refreshRecord(currentMap[key], settings)
    return result
  }, {})

  const today = now()
  ensureCurrentMonthRecords(settings, today)
  writeDailyRecordMap({
    ...readDailyRecordMap(),
    ...nextMap,
  })

  return readDailyRecordMap()
}

export function upsertDailyRecord(record: DailyVoyageRecord) {
  writeDailyRecordMap({
    ...readDailyRecordMap(),
    [record.date]: normalizeStoredRecord(record) as DailyVoyageRecord,
  })
}

export function getDailyRecord(dateKey: string, settings: ProfileSettings) {
  const existing = readDailyRecordMap()[dateKey]
  if (existing) {
    return refreshRecord(existing, settings)
  }

  return buildRecord(parseDateString(dateKey), settings)
}

export function adjustDailyRecordDuration(dateKey: string, durationSec: number, source: AdjustmentSource, settings: ProfileSettings) {
  const nextRecord = buildRecord(parseDateString(dateKey), settings, durationSec, source)
  upsertDailyRecord(nextRecord)
  return nextRecord
}

export function addDailyRecordDuration(dateKey: string, deltaSec: number, settings: ProfileSettings) {
  const current = getDailyRecord(dateKey, settings)
  const nextDurationSec = clampInt(current.moyuDurationSec + deltaSec, 0, current.scheduledWorkDurationSec)
  const nextRecord: DailyVoyageRecord = {
    ...current,
    moyuDurationSec: nextDurationSec,
    adjustmentSource: 'none',
    manualAdjustmentDurationSec: current.adjustmentSource === 'home'
      ? clampInt(current.manualAdjustmentDurationSec, 0, current.scheduledWorkDurationSec)
      : 0,
    updatedAt: formatDateTimeIso(now()),
  }

  upsertDailyRecord(nextRecord)
  return nextRecord
}

export function getTodayRecord(settings: ProfileSettings) {
  ensureCurrentMonthRecords(settings)
  return getDailyRecord(toDateKey(now()), settings)
}

export function deriveDailyRecordMetrics(
  record: DailyVoyageRecord,
  settings: ProfileSettings,
  options: DerivedMetricsOptions = {},
): DailyVoyageDerivedRecord {
  const targetDate = parseDateString(record.date)
  const activeMoyuDurationSec = Math.max(0, Math.round(options.activeMoyuDurationSec || 0))
  const totalMoyuDurationSec = clampInt(
    record.moyuDurationSec + activeMoyuDurationSec,
    0,
    record.scheduledWorkDurationSec,
  )
  const actualWorkDurationSec = Math.max(0, record.scheduledWorkDurationSec - totalMoyuDurationSec)
  const rateCentsPerSec = computeSecondSalaryCents(settings, targetDate)
  const occurredTarget = options.targetDateTime || now()
  const occurredPlannedSec = record.date === toDateKey(occurredTarget)
    ? getElapsedPlannedWorkDurationSec(occurredTarget, settings)
    : record.scheduledWorkDurationSec
  const effectiveMoyuForOccurredSec = Math.min(totalMoyuDurationSec, occurredPlannedSec)
  const actualOccurredWorkDurationSec = Math.max(0, occurredPlannedSec - effectiveMoyuForOccurredSec)

  return {
    record: {
      ...record,
      moyuDurationSec: totalMoyuDurationSec,
    },
    actualWorkDurationSec,
    moyuIncomeCents: Math.round(effectiveMoyuForOccurredSec * rateCentsPerSec),
    voyageIncomeCents: Math.round(actualOccurredWorkDurationSec * rateCentsPerSec),
    moyuRatio: record.scheduledWorkDurationSec > 0
      ? totalMoyuDurationSec / record.scheduledWorkDurationSec
      : 0,
  }
}

export function getCheckInDays() {
  return listDailyRecords().filter(item => item.moyuDurationSec > 0).length
}

function isTrendWorkdayRecord(record: DailyVoyageRecord) {
  return record.calendarStatus === 'workday' || record.calendarStatus === 'makeup'
}

function buildCalendarSpan(start: Date, end: Date) {
  const safeStart = startOfDay(start)
  const safeEnd = startOfDay(end)
  if (safeEnd.getTime() < safeStart.getTime()) {
    return { years: 0, months: 0, days: 0 }
  }

  let years = safeEnd.getFullYear() - safeStart.getFullYear()
  let months = safeEnd.getMonth() - safeStart.getMonth()
  let days = safeEnd.getDate() - safeStart.getDate()

  if (days < 0) {
    months -= 1
    days += new Date(safeEnd.getFullYear(), safeEnd.getMonth(), 0).getDate()
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
  }
}

function formatSpanText(span: { years: number; months: number; days: number }) {
  const parts: string[] = []
  if (span.years > 0) {
    parts.push(`${span.years}年`)
  }
  if (span.months > 0 || parts.length > 0) {
    parts.push(`${span.months}个月`)
  }
  if (span.days > 0 || parts.length === 0) {
    parts.push(`${span.days}天`)
  }
  return parts.join('')
}

function computeCompensationBaseMonths(span: { years: number; months: number; days: number }) {
  if (span.years <= 0 && span.months <= 0 && span.days <= 0) {
    return 0.5
  }

  if (span.months <= 0 && span.days <= 0) {
    return span.years
  }

  return span.years + (span.months >= 6 ? 1 : 0.5)
}

function buildCurrentJobStats(settings: ProfileSettings, targetDateTime: Date) {
  if (!settings.currentJobStartDate) {
    return {
      accruedSalaryCents: 0,
      accruedWorkDurationSec: 0,
      tenureText: '0天',
      compensationBaseMonths: 0,
      compensationPayoutMonths: 0,
      compensationCents: 0,
    }
  }

  const startDate = startOfDay(parseDateString(settings.currentJobStartDate))
  const today = startOfDay(targetDateTime)
  if (startDate.getTime() > today.getTime()) {
    return {
      accruedSalaryCents: 0,
      accruedWorkDurationSec: 0,
      tenureText: '0天',
      compensationBaseMonths: 0,
      compensationPayoutMonths: 0,
      compensationCents: 0,
    }
  }

  let accruedSalaryCents = 0
  let accruedWorkDurationSec = 0
  const todayKey = toDateKey(targetDateTime)

  for (let current = startDate; current <= today; current = addDays(current, 1)) {
    const currentKey = toDateKey(current)
    const scheduledWorkDurationSec = computeScheduledWorkDurationSec(settings, resolveWorkdayStatus(current, settings))
    if (scheduledWorkDurationSec <= 0) {
      continue
    }

    const effectiveWorkDurationSec = currentKey === todayKey
      ? getElapsedPlannedWorkDurationSec(targetDateTime, settings)
      : scheduledWorkDurationSec

    accruedWorkDurationSec += effectiveWorkDurationSec
    accruedSalaryCents += Math.round(effectiveWorkDurationSec * computeSecondSalaryCents(settings, current))
  }

  const tenureSpan = buildCalendarSpan(startDate, today)
  const compensationBaseMonths = computeCompensationBaseMonths(tenureSpan)
  const compensationPayoutMonths = compensationBaseMonths + 1

  return {
    accruedSalaryCents,
    accruedWorkDurationSec,
    tenureText: formatSpanText(tenureSpan),
    compensationBaseMonths,
    compensationPayoutMonths,
    compensationCents: Math.round(settings.monthlySalaryCents * compensationPayoutMonths),
  }
}

function buildRegularTides(settings: ProfileSettings, targetDateTime: Date) {
  const today = startOfDay(targetDateTime)
  const payDate = getPayDate(today.getFullYear(), today.getMonth(), settings.payDay)
  const nextPayDate = payDate < today
    ? getPayDate(today.getFullYear(), today.getMonth() + 1, settings.payDay)
    : payDate

  let nextBreakDate = today
  for (let index = 0; index < 31; index += 1) {
    const candidate = addDays(today, index)
    if (!isWorkday(candidate, settings)) {
      nextBreakDate = candidate
      break
    }
  }

  const daysToPay = Math.max(0, diffDays(today, nextPayDate))
  const daysToBreak = Math.max(0, diffDays(today, nextBreakDate))

  return [
    {
      id: 'salary',
      days: String(daysToPay),
    },
    {
      id: 'weekend',
      days: String(daysToBreak),
    },
  ]
}

function buildLifeJourney(settings: ProfileSettings, targetDateTime: Date) {
  const today = startOfDay(targetDateTime)
  const birthday = parseDateString(settings.birthday)
  const careerStart = parseDateString(settings.careerStartDate)
  const retirement = computeRetirementDate(settings.retirementProfile, settings.birthday)
  const finalDay = new Date(
    birthday.getFullYear() + settings.expectedLifespan,
    birthday.getMonth(),
    birthday.getDate(),
  )

  const buildValueModes = (days: number) => {
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)
    const weeks = Math.floor(days / 7)
    return [
      {
        mode: 'days',
        major: days.toLocaleString('en-US'),
      },
      {
        mode: 'years',
        major: String(years),
        middle: String(Math.floor((days % 365) / 30)),
        minor: String(days % 30),
      },
      {
        mode: 'months',
        major: String(months),
        minor: String(days % 30),
      },
      {
        mode: 'weeks',
        major: String(weeks),
        minor: String(days % 7),
      },
    ]
  }

  const lifeDays = Math.max(0, diffDays(birthday, today))
  const careerDays = Math.max(0, diffDays(careerStart, today))
  const retireDays = Math.max(0, diffDays(today, retirement))
  const finalDays = Math.max(0, diffDays(today, finalDay))
  const lifeTotal = Math.max(1, diffDays(birthday, finalDay))

  return [
    {
      id: 'life',
      values: buildValueModes(lifeDays),
    },
    {
      id: 'career',
      values: buildValueModes(careerDays),
    },
    {
      id: 'retire',
      values: buildValueModes(retireDays),
      progress: Math.min(100, Math.round((lifeDays / lifeTotal) * 100)),
    },
    {
      id: 'final',
      values: buildValueModes(finalDays),
    },
  ] as const
}

export function buildTodayDashboardState(
  settings: ProfileSettings,
  entries: readonly TimeAxisEntry[],
  taskCompleted: number,
  taskTotal: number,
  taskRemainingReward: number,
  options: {
    activeMoyuDurationSec?: number
    targetDateTime?: Date
  } = {},
) {
  const targetDateTime = options.targetDateTime || now()
  ensureCurrentMonthRecords(settings, targetDateTime)

  const todayRecord = getDailyRecord(toDateKey(targetDateTime), settings)
  const derivedTodayRecord = deriveDailyRecordMetrics(todayRecord, settings, {
    activeMoyuDurationSec: options.activeMoyuDurationSec,
    targetDateTime,
  })
  const monthKey = toDateKey(targetDateTime).slice(0, 7)
  const monthRecords = listDailyRecords()
    .filter(item => item.date.startsWith(monthKey))
    .map(item => deriveDailyRecordMetrics(item, settings, {
      targetDateTime,
    }))

  const importantDates = entries
    .filter(entry => entry.isAnniversary)
    .map(entry => {
      const relative = getRelativeDayText(parseDateString(entry.date), entry.isAnniversary)
      return {
        id: entry.id,
        title: entry.title,
        date: formatMonthDay(entry.date),
        remaining: relative.valueText,
        isPast: relative.isPast,
        tone: entry.notebookId === 'commemorative'
          ? 'rose'
          : entry.notebookId === 'travel'
            ? 'amber'
            : entry.notebookId === 'career'
              ? 'blue'
              : 'indigo',
        notebookId: entry.notebookId === 'commemorative' || entry.notebookId === 'travel' || entry.notebookId === 'career'
          ? entry.notebookId
          : 'life',
      }
    })
    .sort((left, right) => Number(left.remaining) - Number(right.remaining))
    .slice(0, 3)

  const idlePercent = todayRecord.scheduledWorkDurationSec > 0
    ? Math.max(0, Math.min(100, Math.round(derivedTodayRecord.moyuRatio * 100)))
    : 0

  return {
    income: {
      value: formatCurrency(derivedTodayRecord.moyuIncomeCents, 2),
      rate: (computeSecondSalaryCents(settings, targetDateTime) / 100).toFixed(3),
      workPercent: todayRecord.scheduledWorkDurationSec > 0 ? 100 - idlePercent : 0,
      idlePercent,
      moyuIncome: formatCurrency(derivedTodayRecord.voyageIncomeCents, 2),
      monthlyIncome: formatCurrency(
        monthRecords.reduce((sum, item) => sum + item.voyageIncomeCents, 0),
        2,
      ),
    },
    timer: {
      leftValue: formatDurationHMS(
        Math.max(
          0,
          Math.round((getWorkdayTimeline(targetDateTime, settings).endAt.getTime() - targetDateTime.getTime()) / 1000),
        ),
      ),
      rightValue: formatDurationHMS(derivedTodayRecord.record.moyuDurationSec),
    },
    taskPreview: {
      completed: taskCompleted,
      total: taskTotal,
      rewardValue: taskRemainingReward,
    },
    regularTides: buildRegularTides(settings, targetDateTime),
    importantDates,
    lifeJourney: buildLifeJourney(settings, targetDateTime),
  }
}

export function buildReportViewState(settings: ProfileSettings, targetDateTime: Date = now()) {
  ensureCurrentMonthRecords(settings, targetDateTime)
  const allRecords = listDailyRecords()
  const monthKey = toDateKey(targetDateTime).slice(0, 7)
  const monthRecords = allRecords.filter(item => item.date.startsWith(monthKey))
  const trendBase = monthRecords
    .filter(isTrendWorkdayRecord)
    .map(item => deriveDailyRecordMetrics(item, settings, {
      targetDateTime,
    }))
  const maxIncome = Math.max(1, ...trendBase.map(item => item.moyuIncomeCents))
  const maxDuration = Math.max(1, ...trendBase.map(item => item.record.moyuDurationSec))
  const trendEligibleRecords = allRecords.filter(isTrendWorkdayRecord)
  const currentTrendStartIndex = trendBase.length > 0
    ? trendEligibleRecords.findIndex(item => item.date === trendBase[0].record.date)
    : -1
  const previousBase = currentTrendStartIndex > 0
    ? trendEligibleRecords
      .slice(Math.max(0, currentTrendStartIndex - trendBase.length), currentTrendStartIndex)
      .map(item => deriveDailyRecordMetrics(item, settings, {
        targetDateTime,
      }))
    : []

  const sumByPredicate = (predicate: (item: DailyVoyageRecord) => boolean) =>
    allRecords
      .filter(predicate)
      .map(item => deriveDailyRecordMetrics(item, settings, {
        targetDateTime,
      }))
      .reduce((sum, item) => ({
        work: sum.work + item.actualWorkDurationSec,
        moyu: sum.moyu + item.record.moyuDurationSec,
      }), { work: 0, moyu: 0 })

  const todayKey = toDateKey(targetDateTime)
  const todayRecord = allRecords.find(item => item.date === todayKey)
  const derivedTodayRecord = todayRecord ? deriveDailyRecordMetrics(todayRecord, settings, {
    targetDateTime,
  }) : null
  const weekStart = addDays(startOfDay(targetDateTime), -(startOfDay(targetDateTime).getDay() === 0 ? 6 : startOfDay(targetDateTime).getDay() - 1))
  const monthStart = new Date(targetDateTime.getFullYear(), targetDateTime.getMonth(), 1)
  const yearStart = new Date(targetDateTime.getFullYear(), 0, 1)
  const currentIncomeTotal = trendBase.reduce((sum, item) => sum + item.moyuIncomeCents, 0)
  const previousIncomeTotal = previousBase.reduce((sum, item) => sum + item.moyuIncomeCents, 0)
  const risePercent = previousIncomeTotal > 0
    ? ((currentIncomeTotal - previousIncomeTotal) / previousIncomeTotal) * 100
    : 0
  const dayRatio = derivedTodayRecord
    ? { work: derivedTodayRecord.actualWorkDurationSec, moyu: derivedTodayRecord.record.moyuDurationSec }
    : { work: 0, moyu: 0 }
  const toPercent = (value: { work: number; moyu: number }) => {
    const total = Math.max(1, value.work + value.moyu)
    return {
      work: Math.round((value.work / total) * 100),
      moyu: Math.round((value.moyu / total) * 100),
    }
  }

  const allDerived = allRecords.map(item => deriveDailyRecordMetrics(item, settings, {
    targetDateTime,
  }))
  const totalMoyuIncomeCents = allDerived.reduce((sum, item) => sum + item.moyuIncomeCents, 0)
  const totalMoyuDurationSec = allDerived.reduce((sum, item) => sum + item.record.moyuDurationSec, 0)
  const totalMoyuDays = allRecords.filter(item => item.moyuDurationSec > 0).length
  const currentJobStats = buildCurrentJobStats(settings, targetDateTime)
  const annualInfoMap = {
    moyuIncome: {
      title: '累计摸鱼收益',
      rule: '基于全部摸鱼记录，按每个工作日对应的秒薪累计计算。',
      details: [
        { label: '累计摸鱼收益', value: formatCurrency(totalMoyuIncomeCents, 2) },
        { label: '累计摸鱼时长', value: formatDurationHM(totalMoyuDurationSec) },
      ],
    },
    moyuDays: {
      title: '累计摸鱼天数',
      rule: '只统计有摸鱼时长的日期，时长大于 0 才会记作 1 天。',
      details: [
        { label: '有效摸鱼天数', value: `${totalMoyuDays} 天` },
        { label: '累计摸鱼时长', value: formatDurationHM(totalMoyuDurationSec) },
      ],
    },
    currentJobSalary: {
      title: '当前工作累计工资',
      rule: '从当前工作入职日期起，工作日按应发工资累计，今天只累计到当前时刻。',
      details: [
        { label: '累计应计工时', value: formatDurationHM(currentJobStats.accruedWorkDurationSec) },
        { label: '当前工作开始', value: settings.currentJobStartDate || '--' },
      ],
    },
    currentJobCompensation: {
      title: '当前工作预计赔偿金',
      rule: '按当前工作工龄估算 N+1，满 6 个月按 1 个月，不满 6 个月按 0.5 个月。',
      details: [
        { label: '当前工作工龄', value: currentJobStats.tenureText },
        { label: '赔偿口径', value: `N+1（${currentJobStats.compensationPayoutMonths}个月）` },
      ],
    },
  }

  return {
    trend: {
      isEmpty: trendBase.length === 0,
      emptyTitle: trendBase.length === 0 ? '本月暂无工作日趋势' : '本月数据未满一月',
      emptyDesc: trendBase.length === 0
        ? '只展示工作日和调休日的摸鱼趋势，等开始打工后就能看到了。'
        : '只展示当前已度过的工作日，不预支未来的打工时光。',
      riseText: `${risePercent >= 0 ? '+' : ''}${risePercent.toFixed(1)}%`,
      bars: trendBase.map(item => ({
        day: item.record.date.slice(-2).replace(/^0/, ''),
        incomeHeight: item.moyuIncomeCents > 0 ? `${Math.max(12, Math.round((item.moyuIncomeCents / maxIncome) * 100))}%` : '0%',
        durationHeight: item.record.moyuDurationSec > 0 ? `${Math.max(12, Math.round((item.record.moyuDurationSec / maxDuration) * 100))}%` : '0%',
        incomeText: formatCurrency(item.moyuIncomeCents, 0),
        durationText: formatDurationHours(item.record.moyuDurationSec),
        isIncomeEmpty: item.moyuIncomeCents <= 0,
        isDurationEmpty: item.record.moyuDurationSec <= 0,
      })),
      summary: {
        incomeTotal: formatCurrency(trendBase.reduce((sum, item) => sum + item.moyuIncomeCents, 0), 0),
        durationTotal: formatDurationHours(trendBase.reduce((sum, item) => sum + item.record.moyuDurationSec, 0)),
      },
    },
    annualCards: [
      {
        key: 'moyuIncome',
        title: '累计摸鱼收益',
        value: formatCurrency(totalMoyuIncomeCents, 2),
        tone: 'indigo',
        iconName: 'coins',
        badgeText: '摸鱼收益',
        desc: '所有摸鱼时长折算出的累计收益。',
      },
      {
        key: 'moyuDays',
        title: '累计摸鱼天数',
        value: `${totalMoyuDays} 天`,
        tone: 'amber',
        iconName: 'calendar-days',
        badgeText: '摸鱼天数',
        desc: '只要当天摸过鱼，就记作 1 天。',
      },
      {
        key: 'currentJobSalary',
        title: '当前工作累计工资',
        value: formatCurrency(currentJobStats.accruedSalaryCents, 2),
        tone: 'blue',
        iconName: 'wallet',
        badgeText: '当前工资',
        desc: '从当前工作入职起累计的应发工资。',
      },
      {
        key: 'currentJobCompensation',
        title: '当前工作预计赔偿金',
        value: formatCurrency(currentJobStats.compensationCents, 2),
        tone: 'rose',
        iconName: 'briefcase',
        badgeText: '赔偿估算',
        desc: '按当前工龄套用 N+1 的估算值。',
      },
    ],
    annualInfoMap,
    ratio: {
      stats: {
        day: toPercent(dayRatio),
        week: toPercent(sumByPredicate(item => parseDateString(item.date) >= weekStart)),
        month: toPercent(sumByPredicate(item => parseDateString(item.date) >= monthStart)),
        year: toPercent(sumByPredicate(item => parseDateString(item.date) >= yearStart)),
      },
    },
    historyItems: allDerived
      .filter(item => item.record.date.startsWith(monthKey) && item.record.moyuDurationSec > 0)
      .reverse()
      .map(item => ({
      fullDate: item.record.date,
      date: item.record.date.slice(5),
      duration: formatDurationHMS(item.record.moyuDurationSec),
      income: (item.moyuIncomeCents / 100).toFixed(1),
      })),
  }
}
