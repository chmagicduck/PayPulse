import { formatDateTimeIso, now, toDateKey, toWeekKey } from '../../../lib/domain/date'
import type { LabProgress } from '../../../lib/domain/types'
import { getCheckInDays } from '../../../lib/domain/daily-records'
import { labStaticViewModel } from '../model'
import { createDefaultLabProgress, readLabProgress, writeLabProgress } from './storage'

function findTaskReward(taskId: string) {
  return labStaticViewModel.tasks.find(item => item.id === taskId)?.reward || 0
}

function findTaskLimit(taskId: string) {
  return labStaticViewModel.tasks.find(item => item.id === taskId)?.limit || 0
}

function getRankIndex(totalPoints: number) {
  const nextIndex = labStaticViewModel.ranks.findIndex(rank => totalPoints < rank.exp)
  if (nextIndex <= 0) {
    return nextIndex === -1 ? labStaticViewModel.ranks.length - 1 : 0
  }
  return nextIndex - 1
}

export function resetLabIfNeeded(progress: LabProgress) {
  const todayKey = toDateKey(now())
  const weekKey = toWeekKey(now())
  let next = progress

  if (progress.lastDailyResetDate !== todayKey) {
    next = Object.assign({}, next, {
      todayPoints: 0,
      lastDailyResetDate: todayKey,
      tasks: next.tasks.map(task => Object.assign({}, task, {
        count: 0,
        updatedAt: formatDateTimeIso(now()),
      })),
    })
  }

  if (next.lastWeeklyResetDate !== weekKey) {
    next = Object.assign({}, next, {
      lastWeeklyResetDate: weekKey,
      achievements: next.achievements.map(item =>
        item.achievementId === 'whale'
          ? Object.assign({}, item, {
              progress: 0,
              completed: false,
              rewarded: false,
            })
          : item,
      ),
    })
  }

  next = recalculateAchievements(next)
  writeLabProgress(next)
  return next
}

export function readCurrentLabProgress() {
  return resetLabIfNeeded(readLabProgress())
}

export function recalculateAchievements(progress: LabProgress) {
  const leaveTask = progress.tasks.find(item => item.taskId === 'leave')
  const waterTask = progress.tasks.find(item => item.taskId === 'water')
  const checkInDays = getCheckInDays()

  const achievements = progress.achievements.map(item => {
    if (item.achievementId === 'discipline') {
      const progressValue = Math.min(item.target, leaveTask?.count ? checkInDays : Math.min(checkInDays, item.progress))
      return Object.assign({}, item, {
        progress: progressValue,
        completed: progressValue >= item.target,
      })
    }

    if (item.achievementId === 'idle-master') {
      const progressValue = Math.min(item.target, Math.round((progress.totalPoints / 2)))
      return Object.assign({}, item, {
        progress: progressValue,
        completed: progressValue >= item.target,
      })
    }

    if (item.achievementId === 'whale') {
      const progressValue = Math.min(item.target, waterTask?.count || 0)
      return Object.assign({}, item, {
        progress: progressValue,
        completed: progressValue >= item.target,
      })
    }

    return item
  })

  return Object.assign({}, progress, { achievements })
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
  const next = Object.assign({}, progress, {
    totalPoints: Math.max(0, progress.totalPoints + reward),
    todayPoints: Math.max(0, progress.todayPoints + reward),
    tasks: progress.tasks.map(item =>
      item.taskId === taskId
        ? Object.assign({}, item, {
            count: nextCount,
            updatedAt: formatDateTimeIso(now()),
          })
        : item,
    ),
  })

  const recalculated = recalculateAchievements(Object.assign({}, next, {
    selectedRankIndex: getRankIndex(next.totalPoints),
  }))
  writeLabProgress(recalculated)
  return recalculated
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
