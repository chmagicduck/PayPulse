import { storageKeys } from '../constants/storage'
import { safeGetStorage, safeSetStorage } from '../wx/storage'
import { formatCurrency, formatDurationHMS, formatDurationHours } from './format'
import type {
  AdjustmentSource,
  CalendarStatus,
  DailyVoyageRecord,
  ProfileSettings,
  TimeAxisEntry,
} from './types'
import {
  addDays,
  clampInt,
  diffDays,
  formatDateTimeIso,
  formatMonthDay,
  getDurationSecFromTimeRange,
  now,
  parseDateString,
  startOfDay,
  toDateKey,
} from './date'
import { getPayDate, getRelativeDayText, isWorkday, resolveWorkdayStatus } from './calendar'

type DailyRecordMap = Record<string, DailyVoyageRecord>

export function readDailyRecordMap() {
  return safeGetStorage<DailyRecordMap>(storageKeys.homeDailySession, {})
}

function writeDailyRecordMap(value: DailyRecordMap) {
  safeSetStorage(storageKeys.homeDailySession, value)
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

export function readReportAdjustments() {
  return safeGetStorage<Record<string, number>>(storageKeys.reportHistoryAdjustments, {})
}

export function writeReportAdjustments(value: Record<string, number>) {
  safeSetStorage(storageKeys.reportHistoryAdjustments, value)
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

function getMonthWorkSeconds(date: Date, settings: ProfileSettings) {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
  const nextMonthStart = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  let total = 0

  for (let current = startOfDay(monthStart); current < nextMonthStart; current = addDays(current, 1)) {
    const status = resolveWorkdayStatus(current, settings)
    total += computeScheduledWorkDurationSec(settings, status)
  }

  return total
}

function computeDerivedIncomeCents(moyuDurationSec: number, settings: ProfileSettings, date: Date) {
  const monthWorkSeconds = getMonthWorkSeconds(date, settings)
  if (monthWorkSeconds <= 0) {
    return 0
  }

  return Math.round((settings.monthlySalaryCents * moyuDurationSec) / monthWorkSeconds)
}

function buildSeedMoyuDurationSec(date: Date, settings: ProfileSettings) {
  if (!isWorkday(date, settings)) {
    return 0
  }

  const day = date.getDate()
  const seededMinutes = 25 + ((day * 17) % 110)
  return seededMinutes * 60 + ((day * 13) % 60)
}

function buildRecord(date: Date, settings: ProfileSettings, source: AdjustmentSource = 'none', durationSec?: number): DailyVoyageRecord {
  const status = resolveWorkdayStatus(date, settings)
  const scheduledWorkDurationSec = computeScheduledWorkDurationSec(settings, status)
  const moyuDurationSec = clampInt(
    typeof durationSec === 'number' ? durationSec : buildSeedMoyuDurationSec(date, settings),
    0,
    scheduledWorkDurationSec,
  )

  return {
    date: toDateKey(date),
    scheduledWorkDurationSec,
    moyuDurationSec,
    manualAdjustmentDurationSec: source === 'none' ? 0 : moyuDurationSec,
    adjustmentSource: source,
    derivedIncomeCents: computeDerivedIncomeCents(moyuDurationSec, settings, date),
    calendarStatus: status,
    updatedAt: formatDateTimeIso(now()),
  }
}

export function ensureCurrentMonthRecords(settings: ProfileSettings, targetDate: Date = now()) {
  const nextMap = Object.assign({}, readDailyRecordMap())
  const firstDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
  const today = startOfDay(targetDate)

  for (let current = firstDay; current <= today; current = addDays(current, 1)) {
    const key = toDateKey(current)
    if (!nextMap[key]) {
      nextMap[key] = buildRecord(current, settings)
      continue
    }

    const refreshed = buildRecord(current, settings, nextMap[key].adjustmentSource, nextMap[key].moyuDurationSec)
    nextMap[key] = Object.assign({}, nextMap[key], refreshed, {
      manualAdjustmentDurationSec: nextMap[key].manualAdjustmentDurationSec,
      adjustmentSource: nextMap[key].adjustmentSource,
    })
  }

  writeDailyRecordMap(nextMap)
  return nextMap
}

export function upsertDailyRecord(record: DailyVoyageRecord) {
  const nextMap = Object.assign({}, readDailyRecordMap(), {
    [record.date]: record,
  })
  writeDailyRecordMap(nextMap)
}

export function adjustDailyRecordDuration(dateKey: string, durationSec: number, source: AdjustmentSource, settings: ProfileSettings) {
  const date = parseDateString(dateKey)
  const status = resolveWorkdayStatus(date, settings)
  const scheduledWorkDurationSec = computeScheduledWorkDurationSec(settings, status)
  const safeDuration = clampInt(durationSec, 0, scheduledWorkDurationSec)
  const record = buildRecord(date, settings, source, safeDuration)
  record.manualAdjustmentDurationSec = safeDuration
  record.adjustmentSource = source
  upsertDailyRecord(record)

  if (source === 'report') {
    const adjustments = Object.assign({}, readReportAdjustments(), {
      [dateKey]: safeDuration,
    })
    writeReportAdjustments(adjustments)
  }

  return record
}

export function getTodayRecord(settings: ProfileSettings) {
  const map = ensureCurrentMonthRecords(settings)
  return map[toDateKey(now())]
}

function formatRate(settings: ProfileSettings, targetDate: Date) {
  const monthWorkSeconds = getMonthWorkSeconds(targetDate, settings)
  if (monthWorkSeconds <= 0) {
    return '0.000'
  }

  const rate = settings.monthlySalaryCents / monthWorkSeconds / 100
  return rate.toFixed(3)
}

function getTimeLeftText(settings: ProfileSettings, targetDate: Date) {
  const [endH = 18, endM = 0] = settings.endTime.split(':').map(item => Number(item))
  const end = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), endH, endM, 0)
  const seconds = Math.max(0, Math.round((end.getTime() - targetDate.getTime()) / 1000))
  return formatDurationHMS(seconds)
}

export function getCheckInDays() {
  return listDailyRecords().filter(item => item.moyuDurationSec > 0).length
}

function buildRegularTides(settings: ProfileSettings) {
  const today = startOfDay(now())
  const payDate = getPayDate(today.getFullYear(), today.getMonth(), settings.payDay)
  const nextPayDate = payDate < today ? getPayDate(today.getFullYear(), today.getMonth() + 1, settings.payDay) : payDate

  let nextBreakDate = today
  for (let index = 0; index < 14; index += 1) {
    const candidate = addDays(today, index)
    if (!isWorkday(candidate, settings)) {
      nextBreakDate = candidate
      break
    }
  }

  return [
    {
      id: 'salary',
      title: '发薪大潮',
      days: String(Math.max(0, diffDays(today, nextPayDate))),
      suffix: '天',
      tone: 'blue',
      badge: '发薪 (PAY)',
      leadingText: '距',
      descriptionPrefix: '下一波',
      descriptionHighlight: '资金补给',
      descriptionSuffix: '正在加速。',
    },
    {
      id: 'weekend',
      title: '双休倒计时',
      days: String(Math.max(0, diffDays(today, nextBreakDate))),
      suffix: '天',
      tone: 'emerald',
      badge: '双休 (WKD)',
      leadingText: '剩',
      descriptionPrefix: '距离下个',
      descriptionHighlight: '港口休整',
      descriptionSuffix: '不远了。',
    },
  ]
}

function buildLifeJourney(settings: ProfileSettings) {
  const today = startOfDay(now())
  const birthday = parseDateString(settings.birthday)
  const careerStart = parseDateString(settings.careerStartDate)
  const retirement = new Date(birthday.getFullYear() + settings.retirementAge, birthday.getMonth(), birthday.getDate())
  const finalDay = new Date(birthday.getFullYear() + settings.expectedLifespan, birthday.getMonth(), birthday.getDate())

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
      descriptionHighlight: '诞生启航',
      descriptionSuffix: '至今走过的日夜。',
    },
    {
      id: 'career',
      eyebrow: '职场航程 (CAREER)',
      statusLabel: '已过',
      valueModes: buildValueModes(careerDays),
      descriptionPrefix: '自从步入',
      descriptionHighlight: '社会熔炉',
      descriptionSuffix: '起，你已交付的岁月。',
    },
    {
      id: 'retire',
      eyebrow: '退役倒计时 (RETIRE)',
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
      note: '* 基于预计 85 岁自然终点计算。每一秒都是该生命周期中不可再生的珍贵样本。',
    },
  ] as const
}

export function buildTodayDashboardState(settings: ProfileSettings, entries: readonly TimeAxisEntry[], taskCompleted: number, taskTotal: number) {
  const todayRecord = getTodayRecord(settings)
  const monthRecords = listDailyRecords().filter(item => item.date.startsWith(todayRecord.date.slice(0, 7)))
  const importantDates = entries
    .map(entry => {
      const relative = getRelativeDayText(parseDateString(entry.date), entry.isAnniversary)
      return {
        id: entry.id,
        title: entry.title,
        date: formatMonthDay(entry.date),
        remaining: relative.valueText,
        suffix: relative.unitText,
        tone: entry.notebookId === 'commemorative' ? 'rose' : entry.notebookId === 'travel' ? 'amber' : entry.notebookId === 'career' ? 'blue' : 'indigo',
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
      value: formatCurrency(todayRecord.derivedIncomeCents, 2),
      rate: formatRate(settings, now()),
      rateBadge: '自动折算',
      workPercent: todayRecord.scheduledWorkDurationSec > 0
        ? Math.round(((todayRecord.scheduledWorkDurationSec - todayRecord.moyuDurationSec) / todayRecord.scheduledWorkDurationSec) * 100)
        : 0,
      idlePercent: todayRecord.scheduledWorkDurationSec > 0
        ? Math.round((todayRecord.moyuDurationSec / todayRecord.scheduledWorkDurationSec) * 100)
        : 0,
      moyuIncome: formatCurrency(todayRecord.derivedIncomeCents, 2),
      monthlyIncome: formatCurrency(monthRecords.reduce((sum, item) => sum + item.derivedIncomeCents, 0), 2),
    },
    timer: {
      leftValue: getTimeLeftText(settings, now()),
      rightValue: formatDurationHMS(todayRecord.moyuDurationSec),
    },
    taskPreview: {
      completed: taskCompleted,
      total: taskTotal,
      rewardText: '待获取 200',
      description: '保持航道通畅，领取额外动力补给',
      segments: Array.from({ length: taskTotal }, (_, index) => ({ filled: index < taskCompleted })),
    },
    regularTides: buildRegularTides(settings),
    importantDates,
    lifeJourney: buildLifeJourney(settings),
  }
}

export function buildReportViewState(settings: ProfileSettings) {
  ensureCurrentMonthRecords(settings)
  const allRecords = listDailyRecords()
  const monthKey = toDateKey(now()).slice(0, 7)
  const monthRecords = allRecords.filter(item => item.date.startsWith(monthKey))
  const trendBase = monthRecords.length ? monthRecords : allRecords.slice(-30)
  const maxIncome = Math.max(1, ...trendBase.map(item => item.derivedIncomeCents))
  const maxDuration = Math.max(1, ...trendBase.map(item => item.moyuDurationSec))
  const previousWindowSize = trendBase.length
  const previousBase = allRecords.slice(Math.max(0, allRecords.length - previousWindowSize * 2), Math.max(0, allRecords.length - previousWindowSize))
  const sumByPredicate = (predicate: (item: DailyVoyageRecord) => boolean) =>
    allRecords.filter(predicate).reduce((sum, item) => ({
      work: sum.work + Math.max(0, item.scheduledWorkDurationSec - item.moyuDurationSec),
      moyu: sum.moyu + item.moyuDurationSec,
    }), { work: 0, moyu: 0 })

  const todayKey = toDateKey(now())
  const todayRecord = allRecords.find(item => item.date === todayKey)
  const weekStart = addDays(startOfDay(now()), -(startOfDay(now()).getDay() === 0 ? 6 : startOfDay(now()).getDay() - 1))
  const monthStart = new Date(now().getFullYear(), now().getMonth(), 1)
  const yearStart = new Date(now().getFullYear(), 0, 1)
  const currentIncomeTotal = trendBase.reduce((sum, item) => sum + item.derivedIncomeCents, 0)
  const previousIncomeTotal = previousBase.reduce((sum, item) => sum + item.derivedIncomeCents, 0)
  const risePercent = previousIncomeTotal > 0
    ? ((currentIncomeTotal - previousIncomeTotal) / previousIncomeTotal) * 100
    : 0
  const dayRatio = todayRecord
    ? { work: Math.max(0, todayRecord.scheduledWorkDurationSec - todayRecord.moyuDurationSec), moyu: todayRecord.moyuDurationSec }
    : { work: 0, moyu: 0 }
  const toPercent = (value: { work: number; moyu: number }) => {
    const total = Math.max(1, value.work + value.moyu)
    return {
      work: Math.round((value.work / total) * 100),
      moyu: Math.round((value.moyu / total) * 100),
    }
  }

  const yearIncomeTotal = allRecords.reduce((sum, item) => sum + item.derivedIncomeCents, 0)
  const yearDurationTotal = allRecords.reduce((sum, item) => sum + item.moyuDurationSec, 0)

  return {
    trend: {
      riseText: `${risePercent >= 0 ? '+' : ''}${risePercent.toFixed(1)}%`,
      bars: trendBase.map(item => ({
        day: item.date.slice(-2).replace(/^0/, ''),
        incomeHeight: `${Math.max(12, Math.round((item.derivedIncomeCents / maxIncome) * 100))}%`,
        durationHeight: `${Math.max(12, Math.round((item.moyuDurationSec / maxDuration) * 100))}%`,
        incomeText: formatCurrency(item.derivedIncomeCents, 0),
        durationText: formatDurationHours(item.moyuDurationSec),
      })),
      summary: {
        incomeTotal: formatCurrency(monthRecords.reduce((sum, item) => sum + item.derivedIncomeCents, 0), 0),
        durationTotal: formatDurationHours(monthRecords.reduce((sum, item) => sum + item.moyuDurationSec, 0)),
      },
    },
    annualCards: [
      { title: '年度摸鱼收入', value: formatCurrency(yearIncomeTotal, 2), tone: 'indigo', iconName: 'coins' },
      { title: '摸鱼打卡天数', value: `${allRecords.filter(item => item.moyuDurationSec > 0).length} 天`, tone: 'amber', iconName: 'calendar-days' },
      { title: '月均摸鱼收益', value: formatCurrency(Math.round(yearIncomeTotal / Math.max(1, new Set(allRecords.map(item => item.date.slice(0, 7))).size)), 2), tone: 'blue', iconName: 'trending-up' },
      { title: '年度航行收入', value: `${Math.min(99.9, 45 + yearDurationTotal / 3600 / 6).toFixed(1)}%`, tone: 'rose', iconName: 'trophy' },
    ],
    ratio: {
      stats: {
        day: toPercent(dayRatio),
        week: toPercent(sumByPredicate(item => parseDateString(item.date) >= weekStart)),
        month: toPercent(sumByPredicate(item => parseDateString(item.date) >= monthStart)),
        year: toPercent(sumByPredicate(item => parseDateString(item.date) >= yearStart)),
      },
    },
    historyItems: allRecords.slice(-5).reverse().map(item => ({
      fullDate: item.date,
      date: item.date.slice(5),
      duration: formatDurationHMS(item.moyuDurationSec),
      income: (item.derivedIncomeCents / 100).toFixed(1),
    })),
  }
}
