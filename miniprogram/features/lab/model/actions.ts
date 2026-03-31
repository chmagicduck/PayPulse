import { formatDateTimeIso, now, toDateKey, toWeekKey } from '../../../lib/domain/date'
import { getLabRankIndexByPoints } from '../../../lib/domain/lab-progress'
import type { LabProgress } from '../../../lib/domain/types'
import { labDashboardModel } from './view'
import { createDefaultLabProgress, readLabProgress, writeLabProgress } from './storage'

function findTaskReward(taskId: string) {
  return labDashboardModel.tasks.find(item => item.id === taskId)?.reward || 0
}

function findTaskLimit(taskId: string) {
  return labDashboardModel.tasks.find(item => item.id === taskId)?.limit || 0
}

function getCurrentWeekDates() {
  const monday = toWeekKey(now())
  const mondayDate = new Date(monday)
  return Array.from({ length: 7 }, (_, index) => toDateKey(new Date(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate() + index)))
}

function sumLedgerCount(progress: LabProgress, taskId: string) {
  const weekDates = new Set(getCurrentWeekDates())
  return progress.taskDailyLedger
    .filter(item => weekDates.has(item.date))
    .reduce((sum, item) => sum + Math.max(0, item.counts[taskId] || 0), 0)
}

function getCurrentWeekLeaveStreak(progress: LabProgress) {
  const weekDates = getCurrentWeekDates()
  let streak = 0
  for (const date of weekDates) {
    const ledger = progress.taskDailyLedger.find(item => item.date === date)
    if ((ledger?.counts.leave || 0) > 0) {
      streak += 1
      continue
    }

    if (date > toDateKey(now())) {
      break
    }

    streak = 0
  }

  return streak
}

export function recalculateAchievements(progress: LabProgress) {
  const achievements = progress.achievements.map(item => {
    if (item.achievementId === 'discipline') {
      const progressValue = Math.min(item.target, getCurrentWeekLeaveStreak(progress))
      return {
        ...item,
        progress: progressValue,
        completed: progressValue >= item.target,
      }
    }

    if (item.achievementId === 'idle-master') {
      const progressValue = Math.min(item.target, sumLedgerCount(progress, 'toilet') * 10)
      return {
        ...item,
        progress: progressValue,
        completed: progressValue >= item.target,
      }
    }

    if (item.achievementId === 'whale') {
      const progressValue = Math.min(item.target, sumLedgerCount(progress, 'water'))
      return {
        ...item,
        progress: progressValue,
        completed: progressValue >= item.target,
      }
    }

    return item
  })

  return {
    ...progress,
    achievements,
  }
}

export function resetLabIfNeeded(progress: LabProgress) {
  const todayKey = toDateKey(now())
  const weekKey = toWeekKey(now())
  let next = progress

  if (progress.lastDailyResetDate !== todayKey) {
    next = {
      ...next,
      todayPoints: 0,
      lastDailyResetDate: todayKey,
      tasks: next.tasks.map(task => ({
        ...task,
        count: 0,
        updatedAt: formatDateTimeIso(now()),
      })),
    }
  }

  if (next.lastWeeklyResetDate !== weekKey) {
    next = {
      ...next,
      lastWeeklyResetDate: weekKey,
      achievements: next.achievements.map(item => ({
        ...item,
        progress: 0,
        completed: false,
        rewarded: false,
      })),
      taskDailyLedger: next.taskDailyLedger.filter(item => item.date >= weekKey),
    }
  }

  next = recalculateAchievements(next)
  writeLabProgress(next)
  return next
}

export function readCurrentLabProgress() {
  return resetLabIfNeeded(readLabProgress())
}

function updateTaskLedger(progress: LabProgress, taskId: string, count: number) {
  const todayKey = toDateKey(now())
  const existing = progress.taskDailyLedger.find(item => item.date === todayKey)
  const nextEntry = existing
    ? {
        ...existing,
        counts: {
          ...existing.counts,
          [taskId]: count,
        },
      }
    : {
        date: todayKey,
        counts: {
          [taskId]: count,
        },
      }

  return progress.taskDailyLedger.some(item => item.date === todayKey)
    ? progress.taskDailyLedger.map(item => (item.date === todayKey ? nextEntry : item))
    : [...progress.taskDailyLedger, nextEntry]
}

export function adjustTaskCount(taskId: string, delta: number) {
  const progress = readCurrentLabProgress()
  const targetTask = progress.tasks.find(item => item.taskId === taskId)
  if (!targetTask) {
    return progress
  }

  const limit = findTaskLimit(taskId)
  const nextCount = Math.max(0, Math.min(limit, targetTask.count + delta))
  if (nextCount === targetTask.count) {
    return progress
  }

  const reward = findTaskReward(taskId) * (nextCount - targetTask.count)
  const next = {
    ...progress,
    totalPoints: Math.max(0, progress.totalPoints + reward),
    todayPoints: Math.max(0, progress.todayPoints + reward),
    tasks: progress.tasks.map(item =>
      item.taskId === taskId
        ? {
            ...item,
            count: nextCount,
            updatedAt: formatDateTimeIso(now()),
          }
        : item,
    ),
    taskDailyLedger: updateTaskLedger(progress, taskId, nextCount),
  }

  const recalculated = recalculateAchievements({
    ...next,
    selectedRankIndex: getLabRankIndexByPoints(next.totalPoints),
  })
  writeLabProgress(recalculated)
  return recalculated
}

export function updateSelectedRankIndex(rankIndex: number) {
  const progress = readCurrentLabProgress()
  const unlockedRankIndex = getLabRankIndexByPoints(progress.totalPoints)
  const safeIndex = Math.max(0, Math.min(rankIndex, unlockedRankIndex, labDashboardModel.ranks.length - 1))
  const next = {
    ...progress,
    selectedRankIndex: safeIndex,
  }
  writeLabProgress(next)
  return next
}

export function ensureLabProgressInitialized() {
  const progress = readLabProgress()
  if (!progress.tasks.length) {
    const seeded = createDefaultLabProgress()
    writeLabProgress(seeded)
    return seeded
  }
  return resetLabIfNeeded(progress)
}
