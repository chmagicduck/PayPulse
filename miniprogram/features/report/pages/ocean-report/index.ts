import { animatedIconPair, icon, type IconImagePair } from '../../../../lib/icons'
import { reportStaticViewModel } from '../../model/static'

const vm = reportStaticViewModel
const CARD_FEEDBACK_DURATION = 220

let reportTimers: Record<string, ReturnType<typeof setTimeout> | null> = {}

type HistoryItem = {
  date: string
  duration: string
  income: string
}

type RatioItem = {
  work: string
  moyu: string
}

Page({
  data: {
    vm,
    statusBarHeight: 0,
    activeTab: vm.tabs[0].key,
    timeRange: vm.rangeTabs[1].key,
    currentRatio: { ...vm.ratioStats[vm.rangeTabs[1].key] } as RatioItem,
    historyDetails: vm.historyDetails.map(item => ({ ...item })) as HistoryItem[],
    isEditModalOpen: false,
    editingIndex: -1,
    editH: '00',
    editM: '00',
    editS: '00',
    icons: {
      chartPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      filter: '',
      calendarDays: '',
      wallet: '',
      clock: '',
      pieChart: '',
      trendingUp: '',
      arrowUpRight: '',
      coins: '',
      medal: '',
      x: '',
    },
    iconAnimations: {
      chart: false,
    },
    pressStates: {
      rangeKey: '',
      historyIndex: -1,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      icons: {
        chartPair: animatedIconPair('bar-chart-3', {
          color: '#ffffff',
          animation: 'float',
          durationMs: 2600,
        }),
        filter: icon('filter', '#94a3b8', 16),
        calendarDays: icon('calendar-days', '#6366f1', 18),
        wallet: icon('wallet', '#2563eb', 18),
        clock: icon('clock', '#f59e0b', 18),
        pieChart: icon('pie-chart', '#2563eb', 18),
        trendingUp: icon('trending-up', '#10b981', 16),
        arrowUpRight: icon('arrow-up-right', '#6366f1', 14),
        coins: icon('coins', '#f59e0b', 18),
        medal: icon('medal', '#e11d48', 18),
        x: icon('x', '#94a3b8', 18),
      },
    })
  },

  onUnload() {
    Object.keys(reportTimers).forEach(key => {
      const timer = reportTimers[key]
      if (timer) clearTimeout(timer)
    })
    reportTimers = {}
  },

  pulseState(
    timerKey: string,
    path: string,
    activeValue: string | number | boolean,
    restValue: string | number | boolean,
    duration: number = CARD_FEEDBACK_DURATION,
  ) {
    const pending = reportTimers[timerKey]
    if (pending) {
      clearTimeout(pending)
      reportTimers[timerKey] = null
    }

    this.setData({ [path]: activeValue }, () => {
      reportTimers[timerKey] = setTimeout(() => {
        this.setData({ [path]: restValue })
        reportTimers[timerKey] = null
      }, duration)
    })
  },

  playChartAnimation() {
    const pending = reportTimers.chart
    if (pending) {
      clearTimeout(pending)
    }

    this.setData({ 'iconAnimations.chart': true })
    reportTimers.chart = setTimeout(() => {
      this.setData({ 'iconAnimations.chart': false })
      reportTimers.chart = null
    }, 2400)
  },

  switchTab(e: WechatMiniprogram.TouchEvent) {
    const { key } = e.currentTarget.dataset
    if (!key || key === this.data.activeTab) return
    this.setData({ activeTab: key })
    this.playChartAnimation()
  },

  switchRange(e: WechatMiniprogram.TouchEvent) {
    const { key } = e.currentTarget.dataset
    if (!key) return
    this.setData({
      timeRange: key,
      currentRatio: { ...vm.ratioStats[String(key) as keyof typeof vm.ratioStats] } as RatioItem,
    })
    this.pulseState('report-range', 'pressStates.rangeKey', String(key), '')
  },

  openEditModal(e: WechatMiniprogram.TouchEvent) {
    const { index } = e.currentTarget.dataset
    const nextIndex = Number(index)
    const item = this.data.historyDetails[nextIndex]

    if (!item) return

    const [editH, editM, editS] = item.duration.split(':')

    this.pulseState('report-history', 'pressStates.historyIndex', nextIndex, -1)
    this.setData({
      isEditModalOpen: true,
      editingIndex: nextIndex,
      editH,
      editM,
      editS,
    })
  },

  closeEditModal() {
    this.setData({
      isEditModalOpen: false,
      editingIndex: -1,
    })
  },

  updateTimeField(e: WechatMiniprogram.Input) {
    const { field, max } = e.currentTarget.dataset
    const value = Math.min(Number(max) || 59, Math.max(0, parseInt(e.detail.value, 10) || 0))
    if (!field) return

    this.setData({
      [field]: value.toString().padStart(2, '0'),
    })
  },

  saveEditTime() {
    const index = this.data.editingIndex
    if (index < 0) return

    const nextHistory = this.data.historyDetails.map((item, currentIndex) => {
      if (currentIndex !== index) return item

      return {
        ...item,
        duration: `${this.data.editH}:${this.data.editM}:${this.data.editS}`,
      }
    })

    this.setData({
      historyDetails: nextHistory,
      isEditModalOpen: false,
      editingIndex: -1,
    })
  },
})
