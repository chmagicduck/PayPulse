import { storageKeys } from '../../../lib/constants/storage'
import { formatDateTimeIso, now, toDateKey, toWeekKey } from '../../../lib/domain/date'
import type { AchievementState, LabProgress, LabTaskDailyLedgerEntry, LabTaskState } from '../../../lib/domain/types'
import { safeGetStorage, safeSetStorage } from '../../../lib/wx/storage'
import { labDashboardModel } from './view'

function buildDefaultTasks(): LabTaskState[] {
  const stamp = formatDateTimeIso(now())
  return labDashboardModel.tasks.map(task => ({
    taskId: task.id,
    count: 0,
    limit: task.limit,
    rewardPoints: task.reward,
    updatedAt: stamp,
  }))
}

function buildDefaultAchievements(): AchievementState[] {
  return labDashboardModel.achievements.map(item => ({
    achievementId: item.id,
    progress: 0,
    target: item.target,
    completed: false,
    rewarded: false,
  }))
}

export function createDefaultLabProgress(): LabProgress {
  return {
    totalPoints: 0,
    todayPoints: 0,
    selectedRankIndex: 0,
    lastDailyResetDate: toDateKey(now()),
    lastWeeklyResetDate: toWeekKey(now()),
    tasks: buildDefaultTasks(),
    achievements: buildDefaultAchievements(),
    taskDailyLedger: [],
  }
}

function normalizeLedgerItem(entry: Partial<LabTaskDailyLedgerEntry>): LabTaskDailyLedgerEntry | null {
  if (!entry.date) {
    return null
  }

  return {
    date: String(entry.date),
    counts: Object.keys(entry.counts || {}).reduce<Record<string, number>>((result, key) => {
      result[key] = Math.max(0, Math.round(Number(entry.counts?.[key]) || 0))
      return result
    }, {}),
  }
}

function normalizeLabProgress(progress: Partial<LabProgress>): LabProgress {
  const fallback = createDefaultLabProgress()
  return {
    totalPoints: Math.max(0, Math.round(Number(progress.totalPoints) || 0)),
    todayPoints: Math.max(0, Math.round(Number(progress.todayPoints) || 0)),
    selectedRankIndex: Math.max(0, Math.round(Number(progress.selectedRankIndex) || 0)),
    lastDailyResetDate: progress.lastDailyResetDate || fallback.lastDailyResetDate,
    lastWeeklyResetDate: progress.lastWeeklyResetDate || fallback.lastWeeklyResetDate,
    tasks: Array.isArray(progress.tasks) && progress.tasks.length ? progress.tasks : fallback.tasks,
    achievements: Array.isArray(progress.achievements) && progress.achievements.length ? progress.achievements : fallback.achievements,
    taskDailyLedger: Array.isArray(progress.taskDailyLedger)
      ? progress.taskDailyLedger.map(normalizeLedgerItem).filter((item): item is LabTaskDailyLedgerEntry => Boolean(item))
      : [],
  }
}

export function readLabProgress() {
  const progress = safeGetStorage<Partial<LabProgress>>(storageKeys.labProgress, createDefaultLabProgress())
  const normalized = normalizeLabProgress(progress)
  if (JSON.stringify(progress) !== JSON.stringify(normalized)) {
    writeLabProgress(normalized)
  }
  return normalized
}

export function writeLabProgress(progress: LabProgress) {
  safeSetStorage(storageKeys.labProgress, normalizeLabProgress(progress))
}
