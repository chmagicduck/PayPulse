import { storageKeys } from '../../../lib/constants/storage'
import { formatDateTimeIso, now, toDateKey, toWeekKey } from '../../../lib/domain/date'
import type { AchievementState, LabProgress, LabTaskState } from '../../../lib/domain/types'
import { safeGetStorage, safeSetStorage } from '../../../lib/wx/storage'
import { labStaticViewModel } from '../model'

function buildDefaultTasks(): LabTaskState[] {
  const stamp = formatDateTimeIso(now())
  return labStaticViewModel.tasks.map(task => ({
    taskId: task.id,
    count: 0,
    limit: task.limit,
    rewardPoints: task.reward,
    updatedAt: stamp,
  }))
}

function buildDefaultAchievements(): AchievementState[] {
  return labStaticViewModel.achievements.map(item => ({
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
  }
}

export function readLabProgress() {
  return safeGetStorage<LabProgress>(storageKeys.labProgress, createDefaultLabProgress())
}

export function writeLabProgress(progress: LabProgress) {
  safeSetStorage(storageKeys.labProgress, progress)
}
