import { animatedIconPair, icon, type IconImagePair, type IconName } from '../../lib/icons'
import { labStaticViewModel } from './model'

type RankStaticItem = (typeof labStaticViewModel.ranks)[number]
type TaskStaticItem = (typeof labStaticViewModel.tasks)[number]
type AchievementStaticItem = (typeof labStaticViewModel.achievements)[number]

export type RankRuntimeItem = RankStaticItem & {
  axisIconPair: IconImagePair
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
    case 'yellow':
      return '#a16207'
    case 'rose':
      return '#e11d48'
    case 'amber':
      return '#d97706'
    case 'slate':
    default:
      return '#94a3b8'
  }
}

function buildTaskBadgeText(reward: number, done: boolean) {
  if (done) return '已达成'
  return `+${reward} PTS`
}

export function buildRankDisplay(ranks: RankRuntimeItem[], rankIndex: number, totalHappiness: number) {
  const currentRank = ranks[rankIndex]
  const nextRank = ranks[rankIndex + 1] || null
  const pointsToNext = nextRank ? Math.max(nextRank.exp - totalHappiness, 0) : 0
  const progressPercent = nextRank
    ? Math.min(100, Math.max(0, (totalHappiness / nextRank.exp) * 100))
    : 100

  return {
    currentRank,
    nextRank,
    pointsToNext,
    progressPercent,
  }
}

export function buildLabPageState() {
  const ranks = labStaticViewModel.ranks.map(rank =>
    Object.assign({}, rank, {
      axisIconPair: animatedIconPair(rank.iconName as IconName, {
        color: rank.iconColor,
        size: 12,
        animation: 'float',
        durationMs: 2200,
      }),
    }),
  )

  const tasks = labStaticViewModel.tasks.map(task => {
    const done = task.count >= task.limit
    return Object.assign({}, task, {
      done,
      countText: `${task.count}/${task.limit}`,
      progressPercent: Math.round((task.count / task.limit) * 100),
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

  const achievements = labStaticViewModel.achievements.map(item =>
    Object.assign({}, item, {
      progressPercent: Math.round((item.progress / item.target) * 100),
    }),
  )

  return {
    ranks,
    tasks,
    achievements,
    icons: {
      labPair: animatedIconPair('flask-conical', {
        color: '#ffffff',
        animation: 'float',
        durationMs: 2400,
      }),
      trophyAmber: icon('trophy', '#f59e0b', 18),
      medalGhost: icon('medal', '#0f172a', 80),
      plusSlate: icon('plus', '#64748b', 14),
      minusSlate: icon('minus', '#64748b', 14),
    },
  }
}
