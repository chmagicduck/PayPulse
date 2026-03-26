import { clearTimerBag, createTimerBag, replayState } from '../../lib/wx/page'
import {
  buildLabPageState,
  type AchievementRuntimeItem,
  type TaskRuntimeItem,
} from './lab.helper'

const timers = createTimerBag()
const initialPageState = buildLabPageState()

function buildTaskCountMap(tasks: TaskRuntimeItem[]) {
  const nextCounts: Record<string, number> = {}

  tasks.forEach(task => {
    nextCounts[task.id] = task.count
  })

  return nextCounts
}

function buildAchievementProgressMap(achievements: AchievementRuntimeItem[]) {
  const nextProgress: Record<string, number> = {}

  achievements.forEach(item => {
    nextProgress[item.id] = item.progress
  })

  return nextProgress
}

Page({
  data: Object.assign({}, initialPageState, {
    statusBarHeight: 0,
    iconAnimations: {
      header: false,
      activeRankIndex: -1,
      activeTaskId: '',
    },
    pressStates: {
      rankIndex: -1,
      taskActionKey: '',
    },
  }),

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  onUnload() {
    clearTimerBag(timers)
  },

  triggerHeaderAnimation() {
    replayState(this, timers, 'header-icon', 'iconAnimations.header', true, false, 1800)
  },

  selectRank(e: WechatMiniprogram.TouchEvent) {
    const rankIndex = Number(e.currentTarget.dataset.index)
    const tasks = this.data.tasks as TaskRuntimeItem[]
    const achievements = this.data.achievements as AchievementRuntimeItem[]

    if (Number.isNaN(rankIndex) || rankIndex < 0 || rankIndex >= this.data.ranks.length) {
      return
    }

    const nextPageState = buildLabPageState({
      totalHappiness: this.data.totalHappiness,
      todayHappiness: this.data.todayHappiness,
      rankIndex,
      taskCounts: buildTaskCountMap(tasks),
      achievementProgress: buildAchievementProgressMap(achievements),
    })

    this.setData(nextPageState)
    replayState(this, timers, 'rank-press', 'pressStates.rankIndex', rankIndex, -1, 220)
    replayState(this, timers, 'rank-icon', 'iconAnimations.activeRankIndex', rankIndex, -1, 1800)
  },

  adjustTask(e: WechatMiniprogram.TouchEvent) {
    const { id, delta } = e.currentTarget.dataset
    const step = Number(delta)
    const taskId = String(id || '')
    if (!taskId || Number.isNaN(step) || step === 0) return

    const tasks = this.data.tasks as TaskRuntimeItem[]
    const achievements = this.data.achievements as AchievementRuntimeItem[]
    const currentTask = tasks.find(task => task.id === taskId)
    if (!currentTask) return

    const nextCount = Math.max(0, Math.min(currentTask.limit, currentTask.count + step))
    if (nextCount === currentTask.count) return

    const nextTaskCounts = buildTaskCountMap(tasks)
    nextTaskCounts[taskId] = nextCount

    const pointsDelta = currentTask.reward * (nextCount - currentTask.count)
    const nextPageState = buildLabPageState({
      totalHappiness: Math.max(0, this.data.totalHappiness + pointsDelta),
      todayHappiness: Math.max(0, this.data.todayHappiness + pointsDelta),
      rankIndex: this.data.rankIndex,
      taskCounts: nextTaskCounts,
      achievementProgress: buildAchievementProgressMap(achievements),
    })
    const actionKey = `${taskId}:${step > 0 ? 'plus' : 'minus'}`

    this.setData(nextPageState)
    replayState(this, timers, 'task-action', 'pressStates.taskActionKey', actionKey, '', 220)
    replayState(this, timers, 'task-icon', 'iconAnimations.activeTaskId', taskId, '', 1800)
  },
})
