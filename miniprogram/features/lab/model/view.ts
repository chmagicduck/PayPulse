import { getLabRankIndexByPoints } from '../../../lib/domain/lab-progress'
import { buildDailyMoyuTaskBadgeText, buildDailyMoyuTaskIconPair, DAILY_MOYU_TASKS } from '../../../lib/domain/lab-tasks'
import type { LabProgress } from '../../../lib/domain/types'
import { animatedIconPair, icon } from '../../../lib/icons'
import type {
  LabAchievementRuntimeItem,
  LabRankRuntimeItem,
  LabStaticViewModel,
  LabTaskRuntimeItem,
  LabViewModel,
} from './types'

export const labDashboardModel: LabStaticViewModel = {
  header: {
    title: '摸鱼任务',
  },
  rankPanel: {
    eyebrow: '摸鱼值',
    stagePrefix: 'Lv.',
    stageSuffix: '',
    todayLabel: '今日获取',
    totalLabel: '总摸鱼值',
    targetLabel: '距离下一级',
    maxLabel: '已达到摸鱼天花板',
  },
  sections: {
    tasks: {
      title: '每日摸鱼任务',
      subtitle: '每天按自然日自动重置，别忘了做',
      progressLabel: '完成进度',
      rewardSuffix: ' 摸鱼值',
      doneText: '已刷满',
    },
    achievements: {
      title: '每周打工成就',
      rewardPrefix: '+',
    },
  },
  ranks: [
    { level: 1, name: '职场小透明', exp: 0, iconName: 'shell', tone: 'slate', theme: 'basic', iconColor: '#94a3b8', cardIconColor: '#94a3b8' },
    { level: 2, name: '摸鱼见习生', exp: 100, iconName: 'waves', tone: 'cyan', theme: 'basic', iconColor: '#0891b2', cardIconColor: '#0891b2' },
    { level: 3, name: '带薪喝水员', exp: 260, iconName: 'coffee', tone: 'orange', theme: 'basic', iconColor: '#ea580c', cardIconColor: '#ea580c' },
    { level: 4, name: '厕所所长', exp: 520, iconName: 'wind', tone: 'emerald', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 5, name: '老油条', exp: 900, iconName: 'compass', tone: 'blue', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 6, name: '薪水小偷', exp: 1400, iconName: 'ghost', tone: 'indigo', theme: 'mid', iconColor: '#e2e8f0', cardIconColor: '#ffffff' },
    { level: 7, name: '反内卷斗士', exp: 2050, iconName: 'anchor', tone: 'violet', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 8, name: '带薪拉屎大王', exp: 2900, iconName: 'zap', tone: 'rose', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 9, name: '职场摸鱼学大师', exp: 3950, iconName: 'ship', tone: 'blue', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
    { level: 10, name: '摸鱼祖师爷', exp: 5200, iconName: 'crown', tone: 'amber', theme: 'ultra', iconColor: '#92400e', cardIconColor: '#92400e' },
  ],
  tasks: DAILY_MOYU_TASKS,
  achievements: [
    { id: 'discipline', title: '下班急先锋', desc: '本周连续 7 天到点就跑，绝不加班。', reward: 50, progress: 0, target: 7 },
    { id: 'idle-master', title: '厕所钉子户', desc: '本周累计带薪拉屎 120 分钟以上。', reward: 50, progress: 0, target: 120, unit: '分钟' },
    { id: 'whale', title: '水遁大师', desc: '本周累计完成 40 次带薪喝水。', reward: 50, progress: 0, target: 40 },
  ],
}

function clampRankIndex(rankIndex: number, actualRankIndex: number) {
  return Math.max(0, Math.min(rankIndex, actualRankIndex, Math.max(0, labDashboardModel.ranks.length - 1)))
}

function getAxisIconColors(theme: LabRankRuntimeItem['theme']) {
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

function buildRankDisplay(ranks: LabRankRuntimeItem[], rankIndex: number, totalHappiness: number) {
  const safeRankIndex = Math.max(0, Math.min(rankIndex, Math.max(0, ranks.length - 1)))
  const currentRank = ranks[safeRankIndex] || ranks[0]
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

function buildRanks(progress: LabProgress, selectedRankIndex: number): LabRankRuntimeItem[] {
  const actualRankIndex = getLabRankIndexByPoints(progress.totalPoints)
  const axisIconColors = getAxisIconColors(labDashboardModel.ranks[selectedRankIndex]?.theme || 'basic')

  return labDashboardModel.ranks.map((rank, index) => {
    const unlockGap = Math.max(rank.exp - progress.totalPoints, 0)

    return {
      ...rank,
      axisActiveIconPair: animatedIconPair(rank.iconName, {
        color: axisIconColors.active,
        size: 12,
        animation: 'float',
        durationMs: 2200,
      }),
      axisInactiveIconPair: animatedIconPair(rank.iconName, {
        color: axisIconColors.inactive,
        size: 12,
        animation: 'float',
        durationMs: 2200,
      }),
      cardIconPair: animatedIconPair(rank.iconName, {
        color: rank.cardIconColor,
        size: 28,
        animation: rank.theme === 'ultra' ? 'twinkle' : 'float',
        durationMs: rank.theme === 'ultra' ? 1800 : 2200,
      }),
      locked: index > actualRankIndex,
      lockHint: unlockGap > 0
        ? `还差 ${unlockGap} 摸鱼值解锁 ${rank.name}`
        : `${rank.name} 已解锁`,
    }
  })
}

function buildTasks(progress: LabProgress): LabTaskRuntimeItem[] {
  const taskCounts = progress.tasks.reduce<Record<string, number>>((result, task) => {
    result[task.taskId] = task.count
    return result
  }, {})

  return labDashboardModel.tasks.map(task => {
    const count = taskCounts[task.id] ?? 0
    const done = count >= task.limit

    return {
      ...task,
      count,
      done,
      countText: `${count}/${task.limit}`,
      progressPercent: task.limit > 0 ? Math.min(100, Math.round((count / task.limit) * 100)) : 0,
      badgeText: buildDailyMoyuTaskBadgeText(task.reward, done, {
        doneText: labDashboardModel.sections.tasks.doneText,
        rewardSuffix: labDashboardModel.sections.tasks.rewardSuffix,
      }),
      minusActionKey: `${task.id}:minus`,
      plusActionKey: `${task.id}:plus`,
      iconPair: buildDailyMoyuTaskIconPair(task),
    }
  })
}

function buildAchievements(progress: LabProgress): LabAchievementRuntimeItem[] {
  const achievementProgress = progress.achievements.reduce<Record<string, number>>((result, item) => {
    result[item.achievementId] = item.progress
    return result
  }, {})

  return labDashboardModel.achievements.map(item => {
    const progressValue = achievementProgress[item.id] ?? 0

    return {
      ...item,
      progress: progressValue,
      progressPercent: item.target > 0 ? Math.min(100, Math.round((progressValue / item.target) * 100)) : 0,
    }
  })
}

export function buildLabViewModel(progress: LabProgress): LabViewModel {
  const actualRankIndex = getLabRankIndexByPoints(progress.totalPoints)
  const selectedRankIndex = clampRankIndex(progress.selectedRankIndex, actualRankIndex)
  const ranks = buildRanks(progress, selectedRankIndex)
  const display = buildRankDisplay(ranks, selectedRankIndex, progress.totalPoints)

  return {
    copy: {
      header: labDashboardModel.header,
      rankPanel: labDashboardModel.rankPanel,
      sections: labDashboardModel.sections,
    },
    totalHappiness: progress.totalPoints,
    todayHappiness: progress.todayPoints,
    rankIndex: display.rankIndex,
    ranks,
    tasks: buildTasks(progress),
    achievements: buildAchievements(progress),
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
