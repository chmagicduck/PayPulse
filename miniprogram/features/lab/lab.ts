import { labStaticViewModel } from './model'
import { buildLabPageState, buildRankDisplay } from './lab.helper'
import { clearTimerBag, createTimerBag, replayState } from '../../lib/wx/page'

const timers = createTimerBag()
const pageState = buildLabPageState()
const rankDisplay = buildRankDisplay(pageState.ranks, labStaticViewModel.score.selectedRankIndex, labStaticViewModel.score.total)

Page({
  data: {
    vm: labStaticViewModel,
    statusBarHeight: 0,
    totalHappiness: Number(labStaticViewModel.score.total),
    todayHappiness: Number(labStaticViewModel.score.today),
    rankIndex: Number(labStaticViewModel.score.selectedRankIndex),
    ...pageState,
    ...rankDisplay,
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

  onUnload() {
    clearTimerBag(timers)
  },

  triggerHeaderAnimation() {
    replayState(this, timers, 'header-icon', 'iconAnimations.header', true, false, 1800)
  },

  selectRank(e: WechatMiniprogram.TouchEvent) {
    const rankIndex = Number(e.currentTarget.dataset.index)
    const nextDisplay = buildRankDisplay(this.data.ranks, rankIndex, this.data.totalHappiness)

    this.setData(Object.assign({ rankIndex }, nextDisplay))
    replayState(this, timers, 'rank-press', 'pressStates.rankIndex', rankIndex, -1, 220)
    replayState(this, timers, 'rank-icon', 'iconAnimations.activeRankIndex', rankIndex, -1, 1800)
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
        badgeText: done ? '已达成' : `+${task.reward} PTS`,
      })
    })

    const totalHappiness = Math.max(0, this.data.totalHappiness + changedReward)
    const todayHappiness = Math.max(0, this.data.todayHappiness + changedReward)
    const nextDisplay = buildRankDisplay(this.data.ranks, this.data.rankIndex, totalHappiness)
    const actionKey = `${id}:${step > 0 ? 'plus' : 'minus'}`

    this.setData(
      Object.assign(
        {
          tasks,
          totalHappiness,
          todayHappiness,
        },
        nextDisplay,
      ),
    )

    replayState(this, timers, 'task-action', 'pressStates.taskActionKey', actionKey, '', 220)
    replayState(this, timers, 'task-icon', 'iconAnimations.activeTaskId', String(id), '', 1800)
  },
})
