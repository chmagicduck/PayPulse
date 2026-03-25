import { animatedIconPair, icon, type IconImagePair, type IconName } from '../../../../lib/icons'
import { labStaticViewModel } from '../../model/static'

const vm = labStaticViewModel
const DEFAULT_RANK_INDEX = 2
const AUTO_PLAY_INTERVAL = 3000
const CARD_FEEDBACK_DURATION = 260

type RankRuntimeItem = (typeof vm.ranks)[number] & {
  iconPair: IconImagePair
  axisIcon: string
}

type TaskRuntimeItem = {
  id: string
  title: string
  desc: string
  reward: string
  count: string
  progress: string
  done: boolean
  tone: string
  current: number
  total: number
  rewardValue: number
  progressPercent: number
  iconPair: IconImagePair
}

let labTimer: ReturnType<typeof setInterval> | null = null
let labTimeouts: Record<string, ReturnType<typeof setTimeout> | null> = {}

function getLabTaskIconName(id: string): IconName {
  switch (id) {
    case 'water':
      return 'droplets'
    case 'move':
      return 'accessibility'
    case 'eye':
      return 'eye'
    case 'leave':
      return 'log-out'
    default:
      return 'sparkles'
  }
}

Page({
  data: {
    vm,
    statusBarHeight: 0,
    totalHappiness: Number(vm.rank.total),
    todayHappiness: Number(vm.rank.todayGain),
    rankIndex: DEFAULT_RANK_INDEX,
    currentRank: {
      ...vm.ranks[DEFAULT_RANK_INDEX],
      iconPair: { staticSrc: '', animatedSrc: '' },
      axisIcon: '',
    } as RankRuntimeItem,
    nextRank: null as RankRuntimeItem | null,
    rankProgress: 0,
    nextLabel: '',
    isAutoPlay: false,
    ranks: [] as RankRuntimeItem[],
    tasks: [] as TaskRuntimeItem[],
    icons: {
      labPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      medal: '',
      arrowUpRight: '',
      checkCircle2: '',
    },
    iconAnimations: {
      lab: false,
    },
    pressStates: {
      rankIndex: -1,
      taskId: '',
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    const ranks = vm.ranks.map(rank => ({
      ...rank,
      iconPair: animatedIconPair(rank.iconName, {
        color: rank.iconColor,
        animation: 'float',
        durationMs: 2600,
      }),
      axisIcon: icon(rank.iconName, rank.iconColor, 12),
    }))

    const tasks = vm.tasks.map(task => {
      const [currentText, totalText] = task.count.split('/')
      const current = Number(currentText)
      const total = Number(totalText)
      const rewardValue = Number(task.reward.replace(/[^0-9]/g, ''))

      return {
        ...task,
        current,
        total,
        rewardValue,
        progressPercent: Math.round((current / total) * 100),
        iconPair: animatedIconPair(getLabTaskIconName(task.id), {
          color:
            task.tone === 'blue'
              ? '#2563eb'
              : task.tone === 'emerald'
                ? '#10b981'
                : task.tone === 'amber'
                  ? '#f59e0b'
                  : '#f43f5e',
          animation: 'bounce',
          durationMs: 1800,
        }),
      }
    })

    this.setData({
      statusBarHeight: statusBarHeight || 0,
      ranks,
      currentRank: ranks[DEFAULT_RANK_INDEX],
      nextRank: ranks[DEFAULT_RANK_INDEX + 1] || null,
      rankProgress: this.getRankProgress(ranks, DEFAULT_RANK_INDEX, Number(vm.rank.total)),
      nextLabel: this.getNextLabel(ranks, DEFAULT_RANK_INDEX, Number(vm.rank.total)),
      tasks,
      icons: {
        labPair: animatedIconPair('flask-conical', {
          color: '#ffffff',
          animation: 'float',
          durationMs: 2600,
        }),
        medal: icon('medal', '#2563eb', 18),
        arrowUpRight: icon('arrow-up-right', '#cbd5e1', 14),
        checkCircle2: icon('check-circle-2', '#10b981', 20),
      },
    })
  },

  onShow() {
    if (this.data.isAutoPlay) {
      this.startAutoPlay()
    }
  },

  onHide() {
    this.stopAutoPlay()
  },

  onUnload() {
    this.stopAutoPlay()
    Object.keys(labTimeouts).forEach(key => {
      const timer = labTimeouts[key]
      if (timer) clearTimeout(timer)
    })
    labTimeouts = {}
  },

  startAutoPlay() {
    if (!this.data.isAutoPlay || labTimer || this.data.ranks.length === 0) return

    labTimer = setInterval(() => {
      const nextIndex = (this.data.rankIndex + 1) % this.data.ranks.length
      this.setData({
        rankIndex: nextIndex,
        currentRank: this.data.ranks[nextIndex],
        nextRank: this.data.ranks[nextIndex + 1] || null,
        rankProgress: this.getRankProgress(this.data.ranks, nextIndex, this.data.totalHappiness),
        nextLabel: this.getNextLabel(this.data.ranks, nextIndex, this.data.totalHappiness),
      })
    }, AUTO_PLAY_INTERVAL)
  },

  stopAutoPlay() {
    if (labTimer) {
      clearInterval(labTimer)
      labTimer = null
    }
  },

  toggleAutoPlay() {
    const nextValue = !this.data.isAutoPlay
    this.playLabIcon()
    this.setData({ isAutoPlay: nextValue })

    if (nextValue) {
      this.startAutoPlay()
      return
    }

    this.stopAutoPlay()
  },

  playLabIcon() {
    const pending = labTimeouts.lab
    if (pending) clearTimeout(pending)

    this.setData({ 'iconAnimations.lab': true })
    labTimeouts.lab = setTimeout(() => {
      this.setData({ 'iconAnimations.lab': false })
      labTimeouts.lab = null
    }, 2200)
  },

  pulseState(
    timerKey: string,
    path: string,
    activeValue: string | number | boolean,
    restValue: string | number | boolean,
    duration: number = CARD_FEEDBACK_DURATION,
  ) {
    const pending = labTimeouts[timerKey]
    if (pending) {
      clearTimeout(pending)
      labTimeouts[timerKey] = null
    }

    this.setData({ [path]: activeValue }, () => {
      labTimeouts[timerKey] = setTimeout(() => {
        this.setData({ [path]: restValue })
        labTimeouts[timerKey] = null
      }, duration)
    })
  },

  selectRank(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    const nextIndex = Number(index)
    this.stopAutoPlay()
    this.setData({
      rankIndex: nextIndex,
      currentRank: this.data.ranks[nextIndex],
      nextRank: this.data.ranks[nextIndex + 1] || null,
      rankProgress: this.getRankProgress(this.data.ranks, nextIndex, this.data.totalHappiness),
      nextLabel: this.getNextLabel(this.data.ranks, nextIndex, this.data.totalHappiness),
      isAutoPlay: false,
    })
    this.pulseState('lab-rank', 'pressStates.rankIndex', nextIndex, -1)
  },

  completeTask(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset
    const target = this.data.tasks.find(item => item.id === id)
    if (!target || target.current >= target.total) return

    const nextTasks = this.data.tasks.map(task => {
      if (task.id !== id || task.current >= task.total) return task
      const current = task.current + 1
      return {
        ...task,
        current,
        count: `${current}/${task.total}`,
        progressPercent: Math.round((current / task.total) * 100),
        done: current >= task.total,
      }
    })

    this.pulseState('lab-task', 'pressStates.taskId', String(id), '')
    this.setData({
      tasks: nextTasks,
      totalHappiness: this.data.totalHappiness + target.rewardValue,
      todayHappiness: this.data.todayHappiness + target.rewardValue,
      rankProgress: this.getRankProgress(this.data.ranks, this.data.rankIndex, this.data.totalHappiness + target.rewardValue),
      nextLabel: this.getNextLabel(this.data.ranks, this.data.rankIndex, this.data.totalHappiness + target.rewardValue),
    })
  },

  getRankProgress(ranks: RankRuntimeItem[], index: number, totalHappiness: number) {
    if (index >= ranks.length - 1) return 100

    const current = ranks[index]
    const next = ranks[index + 1]
    const raw = ((totalHappiness - current.exp) / (next.exp - current.exp)) * 100
    return Math.max(0, Math.min(100, raw))
  },

  getNextLabel(ranks: RankRuntimeItem[], index: number, totalHappiness: number) {
    if (index >= ranks.length - 1) return '已达最高等级'
    return `距离 Lv.${ranks[index + 1].level} 还差 ${Math.max(ranks[index + 1].exp - totalHappiness, 0)}`
  },
})
