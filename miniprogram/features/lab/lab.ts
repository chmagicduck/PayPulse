import { clearTimerBag, createTimerBag, replayState } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'
import {
  buildLabPageState,
  type TaskRuntimeItem,
} from './lab.helper'
import { adjustTaskCount, updateSelectedRankIndex } from './model/actions'
import { buildLabRuntimeState } from './model/state'

const timers = createTimerBag()
const initialPageState = buildLabRuntimeState()

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

  onShow() {
    if (!ensureBootstrapReady()) {
      return
    }
    this.reloadRuntimeState()
  },

  onUnload() {
    clearTimerBag(timers)
  },

  triggerHeaderAnimation() {
    replayState(this, timers, 'header-icon', 'iconAnimations.header', true, false, 1800)
  },

  reloadRuntimeState() {
    this.setData(buildLabRuntimeState())
  },

  selectRank(e: WechatMiniprogram.TouchEvent) {
    const rankIndex = Number(e.currentTarget.dataset.index)
    if (Number.isNaN(rankIndex) || rankIndex < 0 || rankIndex >= this.data.ranks.length) {
      return
    }

    const nextProgress = updateSelectedRankIndex(rankIndex)
    const nextPageState = buildLabPageState(nextProgress)

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
    const currentTask = tasks.find(task => task.id === taskId)
    if (!currentTask) return

    const nextCount = Math.max(0, Math.min(currentTask.limit, currentTask.count + step))
    if (nextCount === currentTask.count) return

    const nextProgress = adjustTaskCount(taskId, step)
    const nextPageState = buildLabPageState(nextProgress)
    const actionKey = `${taskId}:${step > 0 ? 'plus' : 'minus'}`

    this.setData(nextPageState)
    replayState(this, timers, 'task-action', 'pressStates.taskActionKey', actionKey, '', 220)
    replayState(this, timers, 'task-icon', 'iconAnimations.activeTaskId', taskId, '', 1800)
  },
})
