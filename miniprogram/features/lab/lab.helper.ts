import { animatedIconPair, icon, type IconImagePair, type IconName } from '../../lib/icons'
import type { LabProgress } from '../../lib/domain/types'
import { labStaticViewModel } from './model'

type RankStaticItem = (typeof labStaticViewModel.ranks)[number]
type TaskStaticItem = (typeof labStaticViewModel.tasks)[number]
type AchievementStaticItem = (typeof labStaticViewModel.achievements)[number]

export type RankRuntimeItem = RankStaticItem & {
  axisActiveIconPair: IconImagePair
  axisInactiveIconPair: IconImagePair
  cardIconPair: IconImagePair
}

export type TaskRuntimeItem = TaskStaticItem & {
  iconPair: IconImagePair
  countText: string
  progressPercent: number
  badgeText: string
  done: boolean
  minusActionKey: string
  plusActionKey: string
}

export type AchievementRuntimeItem = AchievementStaticItem & {
  progressPercent: number
}

export type LabPageStateOptions = {
  totalHappiness?: number
  todayHappiness?: number
  rankIndex?: number
  taskCounts?: Record<string, number>
  achievementProgress?: Record<string, number>
}

type LabSnapshot = {
  totalHappiness: number
  todayHappiness: number
  rankIndex: number
  taskCounts: Record<string, number>
  achievementProgress: Record<string, number>
}

function getToneColor(tone: string) {
  switch (tone) {
    case 'cyan':
      return '#0891b2'
    case 'orange':
      return '#ea580c'
    case 'emerald':
      return '#10b981'
    case 'blue':
      return '#3b82f6'
    case 'indigo':
      return '#6366f1'
    case 'violet':
      return '#7c3aed'
    case 'rose':
      return '#e11d48'
    case 'amber':
      return '#f59e0b'
    case 'slate':
    default:
      return '#94a3b8'
  }
}

function getAxisIconColors(theme: string) {
  switch (theme) {
    case 'mid':
    case 'high':
      return {
        active: '#2563eb',
        inactive: '#ffffff',
      }
    case 'ultra':
      return {
        active: '#d97706',
        inactive: '#ffffff',
      }
    case 'basic':
    default:
      return {
        active: '#2563eb',
        inactive: '#94a3b8',
      }
  }
}

function buildTaskBadgeText(reward: number, done: boolean) {
  if (done) return labStaticViewModel.sections.tasks.doneText
  return `+${reward}${labStaticViewModel.sections.tasks.rewardSuffix}`
}

function buildDefaultTaskCounts() {
  const counts: Record<string, number> = {}

  labStaticViewModel.tasks.forEach(task => {
    counts[task.id] = task.count
  })

  return counts
}

function buildDefaultAchievementProgress() {
  const progress: Record<string, number> = {}

  labStaticViewModel.achievements.forEach(item => {
    progress[item.id] = item.progress
  })

  return progress
}

function isLabProgress(source: LabProgress | LabPageStateOptions | undefined): source is LabProgress {
  return !!source
    && typeof (source as LabProgress).totalPoints === 'number'
    && Array.isArray((source as LabProgress).tasks)
    && Array.isArray((source as LabProgress).achievements)
}

function resolveSnapshot(source?: LabProgress | LabPageStateOptions): LabSnapshot {
  const taskCounts = buildDefaultTaskCounts()
  const achievementProgress = buildDefaultAchievementProgress()

  let totalHappiness: number = labStaticViewModel.score.total
  let todayHappiness: number = labStaticViewModel.score.today
  let rankIndex: number = labStaticViewModel.score.selectedRankIndex

  if (isLabProgress(source)) {
    totalHappiness = source.totalPoints
    todayHappiness = source.todayPoints
    rankIndex = source.selectedRankIndex

    source.tasks.forEach(task => {
      taskCounts[task.taskId] = task.count
    })

    source.achievements.forEach(item => {
      achievementProgress[item.achievementId] = item.progress
    })
  } else if (source) {
    if (typeof source.totalHappiness === 'number') {
      totalHappiness = source.totalHappiness
    }
    if (typeof source.todayHappiness === 'number') {
      todayHappiness = source.todayHappiness
    }
    if (typeof source.rankIndex === 'number') {
      rankIndex = source.rankIndex
    }
    if (source.taskCounts) {
      Object.keys(source.taskCounts).forEach(taskId => {
        taskCounts[taskId] = source.taskCounts?.[taskId] ?? taskCounts[taskId] ?? 0
      })
    }
    if (source.achievementProgress) {
      Object.keys(source.achievementProgress).forEach(achievementId => {
        achievementProgress[achievementId] = source.achievementProgress?.[achievementId] ?? achievementProgress[achievementId] ?? 0
      })
    }
  }

  return {
    totalHappiness,
    todayHappiness,
    rankIndex,
    taskCounts,
    achievementProgress,
  }
}

export function buildRankDisplay(ranks: RankRuntimeItem[], rankIndex: number, totalHappiness: number) {
  const safeRankIndex = Math.max(0, Math.min(rankIndex, Math.max(0, ranks.length - 1)))
  const currentRank = ranks[safeRankIndex]
  const nextRank = ranks[safeRankIndex + 1] || null
  const pointsToNext = nextRank ? Math.max(nextRank.exp - totalHappiness, 0) : 0
  const currentBase = currentRank?.exp || 0
  const progressPercent = nextRank
    ? Math.min(100, Math.max(0, ((totalHappiness - currentBase) / Math.max(1, nextRank.exp - currentBase)) * 100))
    : 100

  return {
    rankIndex: safeRankIndex,
    currentRank,
    nextRank,
    pointsToNext,
    progressPercent,
  }
}

export function buildLabPageState(source?: LabProgress | LabPageStateOptions) {
  const snapshot = resolveSnapshot(source)
  const currentTheme = labStaticViewModel.ranks[
    Math.max(0, Math.min(snapshot.rankIndex, Math.max(0, labStaticViewModel.ranks.length - 1)))
  ]?.theme || 'basic'
  const axisIconColors = getAxisIconColors(currentTheme)

  const ranks = labStaticViewModel.ranks.map(rank =>
    Object.assign({}, rank, {
      axisActiveIconPair: animatedIconPair(rank.iconName as IconName, {
        color: axisIconColors.active,
        size: 12,
        animation: 'float',
        durationMs: 2200,
      }),
      axisInactiveIconPair: animatedIconPair(rank.iconName as IconName, {
        color: axisIconColors.inactive,
        size: 12,
        animation: 'float',
        durationMs: 2200,
      }),
      cardIconPair: animatedIconPair(rank.iconName as IconName, {
        color: rank.cardIconColor,
        size: 28,
        animation: rank.theme === 'ultra' ? 'twinkle' : 'float',
        durationMs: rank.theme === 'ultra' ? 1800 : 2200,
      }),
    }),
  )

  const tasks = labStaticViewModel.tasks.map(task => {
    const count = snapshot.taskCounts[task.id] ?? 0
    const done = count >= task.limit

    return Object.assign({}, task, {
      count,
      done,
      countText: `${count}/${task.limit}`,
      progressPercent: Math.round((count / task.limit) * 100),
      badgeText: buildTaskBadgeText(task.reward, done),
      minusActionKey: `${task.id}:minus`,
      plusActionKey: `${task.id}:plus`,
      iconPair: animatedIconPair(task.iconName as IconName, {
        color: getToneColor(task.tone),
        animation: 'rotate' in task && task.rotate ? 'drift' : 'bounce',
        durationMs: 1800,
      }),
    })
  })

  const achievements = labStaticViewModel.achievements.map(item => {
    const progress = snapshot.achievementProgress[item.id] ?? 0

    return Object.assign({}, item, {
      progress,
      progressPercent: Math.round((progress / item.target) * 100),
    })
  })

  const display = buildRankDisplay(ranks, snapshot.rankIndex, snapshot.totalHappiness)

  return {
    copy: {
      header: labStaticViewModel.header,
      rankPanel: labStaticViewModel.rankPanel,
      sections: labStaticViewModel.sections,
    },
    totalHappiness: snapshot.totalHappiness,
    todayHappiness: snapshot.todayHappiness,
    rankIndex: display.rankIndex,
    ranks,
    tasks,
    achievements,
    currentRank: display.currentRank,
    nextRank: display.nextRank,
    pointsToNext: display.pointsToNext,
    progressPercent: display.progressPercent,
    icons: {
      labPair: animatedIconPair('flask-conical', {
        color: '#ffffff',
        size: 18,
        animation: 'float',
        durationMs: 2400,
      }),
      trophyAmber: icon('trophy', '#f59e0b', 18),
      medalGhost: icon('medal', '#0f172a', 80),
      plusSlate: icon('plus', '#64748b', 14),
      minusSlate: icon('minus', '#64748b', 14),
      starPair: animatedIconPair('star', {
        color: '#fff8d6',
        size: 20,
        animation: 'twinkle',
        durationMs: 2000,
      }),
      sparklesPair: animatedIconPair('sparkles', {
        color: '#fff5c2',
        size: 16,
        animation: 'twinkle',
        durationMs: 1800,
        delayMs: 180,
      }),
    },
  }
}
