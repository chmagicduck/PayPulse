import { animatedIconPair, icon, type IconImagePair, type IconName } from '../../../lib/icons'
import { labStaticViewModel } from '../model/static'

const vm = labStaticViewModel
const PRESS_DURATION = 220
const ICON_ANIMATION_DURATION = 1800

type RankStaticItem = {
  level: number
  name: string
  exp: number
  iconName: IconName
  tone: string
  iconColor: string
}

type TaskStaticItem = {
  id: string
  title: string
  desc: string
  reward: number
  count: number
  limit: number
  tone: string
  iconName: IconName
  rotate?: boolean
}

type AchievementStaticItem = {
  id: string
  title: string
  desc: string
  reward: number
  progress: number
  target: number
}

type RankRuntimeItem = RankStaticItem & {
  axisIconPair: IconImagePair
}

type TaskRuntimeItem = TaskStaticItem & {
  iconPair: IconImagePair
  countText: string
  progressPercent: number
  badgeText: string
  done: boolean
  minusActionKey: string
  plusActionKey: string
}

type AchievementRuntimeItem = AchievementStaticItem & {
  progressPercent: number
}

let labTimeouts: Record<string, ReturnType<typeof setTimeout> | null> = {}

function buildSetDataPatch(path: string, value: unknown) {
  const patch: Record<string, unknown> = {}
  patch[path] = value
  return patch
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
  if (done) return vm.sections.tasks.doneText
  return `+${reward} ${vm.sections.tasks.rewardUnit}`
}

function buildRankDisplay(ranks: RankRuntimeItem[], rankIndex: number, totalHappiness: number) {
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

Page({
  data: {
    vm,
    statusBarHeight: 0,
    totalHappiness: Number(vm.score.total),
    todayHappiness: Number(vm.score.today),
    rankIndex: Number(vm.score.selectedRankIndex),
    ranks: [] as RankRuntimeItem[],
    currentRank: null as RankRuntimeItem | null,
    nextRank: null as RankRuntimeItem | null,
    pointsToNext: 0,
    progressPercent: 0,
    tasks: [] as TaskRuntimeItem[],
    achievements: [] as AchievementRuntimeItem[],
    icons: {
      labPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      trophyAmber: '',
      medalGhost: '',
      plusSlate: '',
      minusSlate: '',
    },
    iconAnimations: {
      header: false,
      activeRankIndex: -1,
      activeTaskId: '',
    },
    pressStates: {
      rankIndex: -1,
      taskActionKey: '',
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    const ranks = (vm.ranks as readonly RankStaticItem[]).map(rank =>
      Object.assign({}, rank, {
        axisIconPair: animatedIconPair(rank.iconName, {
          color: rank.iconColor,
          size: 12,
          animation: 'float',
          durationMs: 2200,
        }),
      }),
    )

    const tasks = (vm.tasks as readonly TaskStaticItem[]).map(task => {
      const done = task.count >= task.limit
      return Object.assign({}, task, {
        done,
        countText: `${task.count}/${task.limit}`,
        progressPercent: Math.round((task.count / task.limit) * 100),
        badgeText: buildTaskBadgeText(task.reward, done),
        minusActionKey: `${task.id}:minus`,
        plusActionKey: `${task.id}:plus`,
        iconPair: animatedIconPair(task.iconName, {
          color: getToneColor(task.tone),
          animation: task.rotate ? 'drift' : 'bounce',
          durationMs: 1800,
        }),
      })
    })

    const achievements = (vm.achievements as readonly AchievementStaticItem[]).map(item =>
      Object.assign({}, item, {
        progressPercent: Math.round((item.progress / item.target) * 100),
      }),
    )

    const rankDisplay = buildRankDisplay(ranks, vm.score.selectedRankIndex, vm.score.total)

    this.setData(
      Object.assign(
        {
          statusBarHeight: statusBarHeight || 0,
          ranks,
          tasks,
          achievements,
        },
        rankDisplay,
        {
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
        },
      ),
    )
  },

  onUnload() {
    Object.keys(labTimeouts).forEach(key => {
      const timer = labTimeouts[key]
      if (timer) clearTimeout(timer)
    })
    labTimeouts = {}
  },

  pulseState(
    timerKey: string,
    path: string,
    activeValue: string | number | boolean,
    restValue: string | number | boolean,
    duration: number,
  ) {
    const pending = labTimeouts[timerKey]

    if (pending) {
      clearTimeout(pending)
      labTimeouts[timerKey] = null
    }

    this.setData(buildSetDataPatch(path, activeValue), () => {
      labTimeouts[timerKey] = setTimeout(() => {
        this.setData(buildSetDataPatch(path, restValue))
        labTimeouts[timerKey] = null
      }, duration)
    })
  },

  triggerHeaderAnimation() {
    this.pulseState('header-icon', 'iconAnimations.header', true, false, ICON_ANIMATION_DURATION)
  },

  selectRank(e: WechatMiniprogram.TouchEvent) {
    const rankIndex = Number(e.currentTarget.dataset.index)
    const rankDisplay = buildRankDisplay(this.data.ranks, rankIndex, this.data.totalHappiness)

    this.setData(
      Object.assign(
        {
          rankIndex,
        },
        rankDisplay,
      ),
    )

    this.pulseState('rank-press', 'pressStates.rankIndex', rankIndex, -1, PRESS_DURATION)
    this.pulseState('rank-icon', 'iconAnimations.activeRankIndex', rankIndex, -1, ICON_ANIMATION_DURATION)
  },

  adjustTask(e: WechatMiniprogram.TouchEvent) {
    const { id, delta } = e.currentTarget.dataset
    const step = Number(delta)
    const targetTask = this.data.tasks.find(task => task.id === id)

    if (!targetTask) return
    if ((step > 0 && targetTask.count >= targetTask.limit) || (step < 0 && targetTask.count <= 0)) return

    let changedReward = 0

    const tasks = this.data.tasks.map(task => {
      if (task.id !== id) return task

      const count = Math.max(0, Math.min(task.limit, task.count + step))
      const done = count >= task.limit
      changedReward = task.reward * step

      return Object.assign({}, task, {
        count,
        done,
        countText: `${count}/${task.limit}`,
        progressPercent: Math.round((count / task.limit) * 100),
        badgeText: buildTaskBadgeText(task.reward, done),
      })
    })

    const totalHappiness = Math.max(0, this.data.totalHappiness + changedReward)
    const todayHappiness = Math.max(0, this.data.todayHappiness + changedReward)
    const rankDisplay = buildRankDisplay(this.data.ranks, this.data.rankIndex, totalHappiness)
    const actionKey = `${id}:${step > 0 ? 'plus' : 'minus'}`

    this.setData(
      Object.assign(
        {
          tasks,
          totalHappiness,
          todayHappiness,
        },
        rankDisplay,
      ),
    )

    this.pulseState('task-action', 'pressStates.taskActionKey', actionKey, '', PRESS_DURATION)
    this.pulseState('task-icon', 'iconAnimations.activeTaskId', String(id), '', ICON_ANIMATION_DURATION)
  },
})
