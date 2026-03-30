import { animatedIconPair, icon, type IconImagePair, type IconName } from '../../lib/icons'
import { getLabRankIndexByPoints } from '../../lib/domain/lab-progress'
import type { LabProgress } from '../../lib/domain/types'
import { buildDailyMoyuTaskBadgeText, buildDailyMoyuTaskIconPair } from '../../lib/domain/lab-tasks'
import { labStaticViewModel } from './model'

type RankStaticItem = (typeof labStaticViewModel.ranks)[number]
type TaskStaticItem = (typeof labStaticViewModel.tasks)[number]
type AchievementStaticItem = (typeof labStaticViewModel.achievements)[number]

export type RankRuntimeItem = RankStaticItem & {
  axisActiveIconPair: IconImagePair
  axisInactiveIconPair: IconImagePair
  cardIconPair: IconImagePair
  locked: boolean
  unlockGap: number
  lockHint: string
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

const LAB_ICON_ANIMATIONS = {
  header: false,
  activeRankIndex: -1,
  activeTaskId: '',
}

const LAB_PRESS_STATES = {
  rankIndex: -1,
  taskActionKey: '',
}

export function createLabIconAnimations() {
  return { ...LAB_ICON_ANIMATIONS }
}

export function createLabPressStates() {
  return { ...LAB_PRESS_STATES }
}

function getAxisIconColors(theme: RankStaticItem['theme']) {
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

function clampRankIndex(rankIndex: number, actualRankIndex: number) {
  return Math.max(0, Math.min(rankIndex, actualRankIndex, Math.max(0, labStaticViewModel.ranks.length - 1)))
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

export function buildLabPageState(progress: LabProgress) {
  const actualRankIndex = getLabRankIndexByPoints(progress.totalPoints)
  const selectedRankIndex = clampRankIndex(progress.selectedRankIndex, actualRankIndex)
  const currentTheme = labStaticViewModel.ranks[selectedRankIndex]?.theme || 'basic'
  const axisIconColors = getAxisIconColors(currentTheme)
  const taskCountMap = progress.tasks.reduce<Record<string, number>>((result, task) => {
    result[task.taskId] = task.count
    return result
  }, {})
  const achievementProgressMap = progress.achievements.reduce<Record<string, number>>((result, item) => {
    result[item.achievementId] = item.progress
    return result
  }, {})

  const ranks = labStaticViewModel.ranks.map((rank, index) => {
    const unlockGap = Math.max(rank.exp - progress.totalPoints, 0)

    return Object.assign({}, rank, {
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
      locked: index > actualRankIndex,
      unlockGap,
      lockHint: unlockGap > 0
        ? `还差 ${unlockGap} 摸鱼值解锁 ${rank.name}`
        : `${rank.name} 已解锁`,
    })
  })

  const tasks = labStaticViewModel.tasks.map(task => {
    const count = taskCountMap[task.id] ?? 0
    const done = count >= task.limit

    return Object.assign({}, task, {
      count,
      done,
      countText: `${count}/${task.limit}`,
      progressPercent: task.limit > 0 ? Math.min(100, Math.round((count / task.limit) * 100)) : 0,
      badgeText: buildDailyMoyuTaskBadgeText(task.reward, done, {
        doneText: labStaticViewModel.sections.tasks.doneText,
        rewardSuffix: labStaticViewModel.sections.tasks.rewardSuffix,
      }),
      minusActionKey: `${task.id}:minus`,
      plusActionKey: `${task.id}:plus`,
      iconPair: buildDailyMoyuTaskIconPair(task),
    })
  })

  const achievements = labStaticViewModel.achievements.map(item => {
    const progressValue = achievementProgressMap[item.id] ?? 0

    return Object.assign({}, item, {
      progress: progressValue,
      progressPercent: item.target > 0 ? Math.min(100, Math.round((progressValue / item.target) * 100)) : 0,
    })
  })

  const display = buildRankDisplay(ranks, selectedRankIndex, progress.totalPoints)

  return {
    copy: {
      header: labStaticViewModel.header,
      rankPanel: labStaticViewModel.rankPanel,
      sections: labStaticViewModel.sections,
    },
    totalHappiness: progress.totalPoints,
    todayHappiness: progress.todayPoints,
    rankIndex: display.rankIndex,
    selectedRankIndex: display.rankIndex,
    actualRankIndex,
    ranks,
    tasks,
    achievements,
    currentRank: display.currentRank,
    nextRank: display.nextRank,
    pointsToNext: display.pointsToNext,
    progressPercent: display.progressPercent,
    actualRank: ranks[actualRankIndex] || ranks[0],
    icons: {
      labPair: animatedIconPair('flask-conical', {
        color: '#ffffff',
        size: 18,
        animation: 'float',
        durationMs: 2400,
      }),
      trophyAmber: icon('trophy', '#f59e0b', 18),
      medalGhost: icon('medal', '#0f172a', 80),
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
