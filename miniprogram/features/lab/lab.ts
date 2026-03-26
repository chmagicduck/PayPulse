import { clearTimerBag, createTimerBag, replayState } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { buildLabPageState, buildRankDisplay } from './lab.helper'
import { adjustTaskCount } from './model/actions'
import { buildLabRuntimeState } from './model/state'

const timers = createTimerBag()

Page({
  data: {
    vm: null,
    statusBarHeight: 0,
    totalHappiness: 0,
    todayHappiness: 0,
    rankIndex: 0,
    ranks: [] as any[],
    tasks: [] as any[],
    achievements: [] as any[],
    currentRank: null as any,
    nextRank: null as any,
    pointsToNext: 0,
    progressPercent: 0,
    icons: null as any,
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
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  onShow() {
    if (!ensureBootstrapReady()) {
      return
    }
    this.reloadRuntimeState()
  },

  onUnload() {
    clearTimerBag(timers)
  },

  reloadRuntimeState() {
    this.setData(buildLabRuntimeState())
  },

  triggerHeaderAnimation() {
    replayState(this, timers, 'header-icon', 'iconAnimations.header', true, false, 1800)
  },

  selectRank(e: WechatMiniprogram.TouchEvent) {
    const rankIndex = Number(e.currentTarget.dataset.index)
    const nextPageState = buildLabPageState({
      totalPoints: this.data.totalHappiness,
      todayPoints: this.data.todayHappiness,
      selectedRankIndex: rankIndex,
      lastDailyResetDate: '',
      lastWeeklyResetDate: '',
      tasks: this.data.tasks.map((task: any) => ({
        taskId: task.id,
        count: task.count,
        limit: task.limit,
        rewardPoints: task.reward,
        updatedAt: '',
      })),
      achievements: this.data.achievements.map((item: any) => ({
        achievementId: item.id,
        progress: item.progress,
        target: item.target,
        completed: item.progress >= item.target,
        rewarded: false,
      })),
    })
    const nextDisplay = buildRankDisplay(nextPageState.ranks, rankIndex, this.data.totalHappiness)

    this.setData(Object.assign({}, nextDisplay, { rankIndex }))
    replayState(this, timers, 'rank-press', 'pressStates.rankIndex', rankIndex, -1, 220)
    replayState(this, timers, 'rank-icon', 'iconAnimations.activeRankIndex', rankIndex, -1, 1800)
  },

  adjustTask(e: WechatMiniprogram.TouchEvent) {
    const { id, delta } = e.currentTarget.dataset
    const step = Number(delta)
    if (!id || !step) return

    const progress = adjustTaskCount(String(id), step)
    const nextDisplay = buildLabRuntimeState()
    const actionKey = `${id}:${step > 0 ? 'plus' : 'minus'}`

    this.setData(Object.assign({}, nextDisplay, {
      totalHappiness: progress.totalPoints,
      todayHappiness: progress.todayPoints,
      rankIndex: progress.selectedRankIndex,
    }))

    replayState(this, timers, 'task-action', 'pressStates.taskActionKey', actionKey, '', 220)
    replayState(this, timers, 'task-icon', 'iconAnimations.activeTaskId', String(id), '', 1800)
  },
})
