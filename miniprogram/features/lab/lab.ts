import { clearTimerBag, createTimerBag, replayState } from '../../lib/wx/page'
import type { LabProgress } from '../../lib/domain/types'
import { buildDailyMoyuTaskNotice } from '../../lib/domain/lab-tasks'
import { ensureBootstrapReady } from '../../store/bootstrap'
import {
  createLabIconAnimations,
  createLabPressStates,
  type TaskRuntimeItem,
} from './lab.helper'
import { adjustTaskCount, updateSelectedRankIndex } from './model/actions'
import { buildLabRuntimeState } from './model/state'

const timers = createTimerBag()
const initialPageState = buildLabRuntimeState()
const TASK_NOTICE_HIDE_DURATION = 1680
const TASK_NOTICE_EXIT_DURATION = 220

Page({
  data: Object.assign({}, initialPageState, {
    statusBarHeight: 0,
    iconAnimations: createLabIconAnimations(),
    pressStates: createLabPressStates(),
    taskNotice: {
      text: '',
      tone: 'blue',
      active: false,
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

  reloadRuntimeState(progress?: LabProgress) {
    this.setData(buildLabRuntimeState(progress))
  },

  playRankPress(rankIndex: number) {
    replayState(this, timers, 'rank-press', 'pressStates.rankIndex', rankIndex, -1, 220)
  },

  playRankIcon(rankIndex: number) {
    replayState(this, timers, 'rank-icon', 'iconAnimations.activeRankIndex', rankIndex, -1, 1800)
  },

  playTaskPress(actionKey: string) {
    replayState(this, timers, 'task-action', 'pressStates.taskActionKey', actionKey, '', 220)
  },

  playTaskIcon(taskId: string) {
    replayState(this, timers, 'task-icon', 'iconAnimations.activeTaskId', taskId, '', 1800)
  },

  showTaskNotice(text: string, tone: string = 'blue') {
    const hideTimer = timers['task-notice-hide']
    const clearTimer = timers['task-notice-clear']

    if (hideTimer) {
      clearTimeout(hideTimer)
      timers['task-notice-hide'] = null
    }

    if (clearTimer) {
      clearTimeout(clearTimer)
      timers['task-notice-clear'] = null
    }

    this.setData({
      taskNotice: {
        text,
        tone,
        active: false,
      },
    }, () => {
      this.setData({ 'taskNotice.active': true })

      timers['task-notice-hide'] = setTimeout(() => {
        this.setData({ 'taskNotice.active': false })
        timers['task-notice-hide'] = null
      }, TASK_NOTICE_HIDE_DURATION)

      timers['task-notice-clear'] = setTimeout(() => {
        this.setData({
          taskNotice: {
            text: '',
            tone: 'blue',
            active: false,
          },
        })
        timers['task-notice-clear'] = null
      }, TASK_NOTICE_HIDE_DURATION + TASK_NOTICE_EXIT_DURATION)
    })
  },

  selectRank(e: WechatMiniprogram.TouchEvent) {
    const rankIndex = Number(e.currentTarget.dataset.index)
    if (Number.isNaN(rankIndex) || rankIndex < 0 || rankIndex >= this.data.ranks.length) {
      return
    }

    const targetRank = this.data.ranks[rankIndex]
    if (!targetRank || targetRank.locked) {
      if (targetRank?.lockHint) {
        wx.showToast({
          title: targetRank.lockHint,
          icon: 'none',
        })
      }
      return
    }

    const nextProgress = updateSelectedRankIndex(rankIndex)

    this.reloadRuntimeState(nextProgress)
    this.playRankPress(rankIndex)
    this.playRankIcon(rankIndex)
  },

  adjustTask(e: WechatMiniprogram.TouchEvent) {
    const detail = e.detail as { id?: string; delta?: number } | undefined
    const step = Number(detail?.delta)
    const taskId = String(detail?.id || '')
    if (!taskId || Number.isNaN(step) || step === 0) return

    const tasks = this.data.tasks as TaskRuntimeItem[]
    const currentTask = tasks.find(task => task.id === taskId)
    if (!currentTask) return

    const nextCount = Math.max(0, Math.min(currentTask.limit, currentTask.count + step))
    if (nextCount === currentTask.count) return

    const nextProgress = adjustTaskCount(taskId, step)
    const actionKey = `${taskId}:${step > 0 ? 'plus' : 'minus'}`
    const notice = buildDailyMoyuTaskNotice(currentTask, nextCount)

    this.reloadRuntimeState(nextProgress)
    this.playTaskPress(actionKey)
    this.playTaskIcon(taskId)
    this.showTaskNotice(notice.text, notice.tone)
  },
})
