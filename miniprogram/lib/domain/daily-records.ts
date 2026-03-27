import { storageKeys } from '../constants/storage'
import { safeGetStorage, safeRemoveStorage, safeSetStorage } from '../wx/storage'
import { formatCurrency, formatDurationHMS, formatDurationHours } from './format'
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

type RegularTideCard = {
  id: string
  title: string
  days: string
  suffix: string
  tone: string
  badge: string
  leadingText: string
  descriptionPrefix: string
  descriptionHighlight: string
  descriptionSuffix: string
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
      title: '发薪大潮',
      days: String(daysToPay),
      suffix: '天',
      tone: 'blue',
      badge: '发薪 (PAY)',
      leadingText: '距',
      descriptionPrefix: '下一次',
      descriptionHighlight: '资金补给',
      descriptionSuffix: '正在靠近。',
    },
    {
      id: 'weekend',
      title: '休息倒计时',
      days: String(daysToBreak),
      suffix: '天',
      tone: 'emerald',
      badge: '休息 (WKD)',
      leadingText: '距',
      descriptionPrefix: '距离下一次',
      descriptionHighlight: '靠岸补能',
      descriptionSuffix: '已经不远了。',
    },
  ] satisfies RegularTideCard[]
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
      `${days.toLocaleString('en-US')}天`,
      `${years}年 ${Math.floor((days % 365) / 30)}个月 ${days % 30}天`,
      `${months}个月 ${days % 30}天`,
      `${weeks}周 ${days % 7}天`,
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
      eyebrow: '生命航程 (LIFE)',
      statusLabel: '已过',
      valueModes: buildValueModes(lifeDays),
      descriptionPrefix: '这是你从',
      descriptionHighlight: '出生启航',
      descriptionSuffix: '至今走过的日数。',
    },
    {
      id: 'career',
      eyebrow: '职场航程 (CAREER)',
      statusLabel: '已过',
      valueModes: buildValueModes(careerDays),
      descriptionPrefix: '自从步入',
      descriptionHighlight: '社会海域',
      descriptionSuffix: '以后，你已投入的岁月。',
    },
    {
      id: 'retire',
      eyebrow: '退休倒计时 (RETIRE)',
      statusLabel: '还剩',
      valueModes: buildValueModes(retireDays),
      descriptionPrefix: '距离你可以',
      descriptionHighlight: '正式卸甲',
      descriptionSuffix: '，还有这些既定航程。',
      progress: Math.min(100, Math.round((lifeDays / lifeTotal) * 100)),
    },
    {
      id: 'final',
      eyebrow: '终点倒计时 (FINAL)',
      statusLabel: '还剩',
      valueModes: buildValueModes(finalDays),
      quote: '"警告：航线即将耗尽，此数据不可逆转。"',
      note: '* 基于预计 85 岁自然终点计算。每一秒都属于不可再生的生命样本。',
    },
  ] as const
}

export function buildTodayDashboardState(
  settings: ProfileSettings,
  entries: readonly TimeAxisEntry[],
  taskCompleted: number,
  taskTotal: number,
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
        suffix: relative.unitText,
        tone: entry.notebookId === 'commemorative'
          ? 'rose'
          : entry.notebookId === 'travel'
            ? 'amber'
            : entry.notebookId === 'career'
              ? 'blue'
              : 'indigo',
        notebookLabel: entry.notebookId === 'commemorative'
          ? '纪念本'
          : entry.notebookId === 'travel'
            ? '旅行本'
            : entry.notebookId === 'career'
              ? '职场本'
              : '人生本',
      }
    })
    .sort((left, right) => Number(left.remaining) - Number(right.remaining))
    .slice(0, 3)

  return {
    income: {
      value: formatCurrency(derivedTodayRecord.moyuIncomeCents, 2),
      rate: (computeSecondSalaryCents(settings, targetDateTime) / 100).toFixed(3),
      rateBadge: '实时折算',
      workPercent: Math.max(0, Math.round((1 - derivedTodayRecord.moyuRatio) * 100)),
      idlePercent: Math.max(0, Math.round(derivedTodayRecord.moyuRatio * 100)),
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
      rewardText: '待获得动能',
      description: '保持每日任务节奏，获取额外成长加成。',
      segments: Array.from({ length: taskTotal }, (_, index) => ({ filled: index < taskCompleted })),
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
  const trendBase = monthRecords.map(item => deriveDailyRecordMetrics(item, settings, {
    targetDateTime,
  }))
  const maxIncome = Math.max(1, ...trendBase.map(item => item.moyuIncomeCents))
  const maxDuration = Math.max(1, ...trendBase.map(item => item.record.moyuDurationSec))
  const previousWindowSize = Math.max(1, trendBase.length)
  const previousBase = allRecords
    .slice(Math.max(0, allRecords.length - previousWindowSize * 2), Math.max(0, allRecords.length - previousWindowSize))
    .map(item => deriveDailyRecordMetrics(item, settings, {
      targetDateTime,
    }))

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
  const yearMoyuIncomeTotal = allDerived.reduce((sum, item) => sum + item.moyuIncomeCents, 0)
  const yearVoyageIncomeTotal = allDerived.reduce((sum, item) => sum + item.voyageIncomeCents, 0)
  const checkInDays = allRecords.filter(item => item.moyuDurationSec > 0).length
  const recordedMonthCount = Math.max(1, new Set(allRecords.map(item => item.date.slice(0, 7))).size)

  return {
    trend: {
      isEmpty: trendBase.length === 0,
      emptyTitle: monthRecords.length === 0 ? '本月无数据' : '本月数据不足完整月',
      emptyDesc: monthRecords.length === 0
        ? '当前月份还没有真实摸鱼记录，开始一次有效记录后会出现在这里。'
        : '当前月份只展示已有自然日，不会补齐未来日期或演示数据。',
      riseText: `${risePercent >= 0 ? '+' : ''}${risePercent.toFixed(1)}%`,
      bars: trendBase.map(item => ({
        day: item.record.date.slice(-2).replace(/^0/, ''),
        incomeHeight: `${Math.max(12, Math.round((item.moyuIncomeCents / maxIncome) * 100))}%`,
        durationHeight: `${Math.max(12, Math.round((item.record.moyuDurationSec / maxDuration) * 100))}%`,
        incomeText: formatCurrency(item.moyuIncomeCents, 0),
        durationText: formatDurationHours(item.record.moyuDurationSec),
      })),
      summary: {
        incomeTotal: formatCurrency(monthRecords
          .map(item => deriveDailyRecordMetrics(item, settings, { targetDateTime }))
          .reduce((sum, item) => sum + item.moyuIncomeCents, 0), 0),
        durationTotal: formatDurationHours(monthRecords.reduce((sum, item) => sum + item.moyuDurationSec, 0)),
      },
    },
    annualCards: [
      { title: '年度摸鱼收益', value: formatCurrency(yearMoyuIncomeTotal, 2), tone: 'indigo', iconName: 'coins' },
      { title: '摸鱼打卡天数', value: `${checkInDays} 天`, tone: 'amber', iconName: 'calendar-days' },
      { title: '月均摸鱼收益', value: formatCurrency(Math.round(yearMoyuIncomeTotal / recordedMonthCount), 2), tone: 'blue', iconName: 'trending-up' },
      { title: '年度航行收益', value: formatCurrency(yearVoyageIncomeTotal, 2), tone: 'rose', iconName: 'trophy' },
    ],
    ratio: {
      stats: {
        day: toPercent(dayRatio),
        week: toPercent(sumByPredicate(item => parseDateString(item.date) >= weekStart)),
        month: toPercent(sumByPredicate(item => parseDateString(item.date) >= monthStart)),
        year: toPercent(sumByPredicate(item => parseDateString(item.date) >= yearStart)),
      },
    },
    historyItems: allDerived.slice(-5).reverse().map(item => ({
      fullDate: item.record.date,
      date: item.record.date.slice(5),
      duration: formatDurationHMS(item.record.moyuDurationSec),
      income: (item.moyuIncomeCents / 100).toFixed(1),
    })),
  }
}
