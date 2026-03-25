import { animatedIconPair, icon, type IconImagePair, type IconName } from '../../../lib/icons'
import { reportStaticViewModel } from '../model/static'

const vm = reportStaticViewModel
type TrendTabKey = (typeof vm.trend.tabs)[number]['key']
type RangeKey = (typeof vm.ratio.ranges)[number]['key']

const DEFAULT_TAB_KEY: TrendTabKey = vm.trend.tabs[0].key
const DEFAULT_RANGE_KEY: RangeKey = vm.ratio.ranges[1].key
const PRESS_DURATION = 220
const MODAL_ENTER_DELAY = 30
const MODAL_EXIT_DURATION = 280

type HistoryItem = {
  date: string
  displayDate: string
  duration: string
  income: string
}

type RatioItem = {
  work: number
  moyu: number
}

type AnnualCardItem = (typeof vm.annual.cards)[number] & {
  iconSrc: string
}

let reportTimers: Record<string, ReturnType<typeof setTimeout> | null> = {}

function buildSetDataPatch(path: string, value: unknown) {
  const patch: Record<string, unknown> = {}
  patch[path] = value
  return patch
}

function strToArrayBuffer(str: string): ArrayBuffer {
  const buffer = new ArrayBuffer(str.length)
  const view = new Uint8Array(buffer)
  for (let index = 0; index < str.length; index += 1) {
    view[index] = str.charCodeAt(index)
  }
  return buffer
}

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${wx.arrayBufferToBase64(strToArrayBuffer(svg))}`
}

function buildRatioRing(moyuPercent: number): string {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const progress = (moyuPercent / 100) * circumference
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112" fill="none">
    <g transform="translate(56 56) rotate(-90) translate(-56 -56)">
      <circle cx="56" cy="56" r="${radius}" fill="none" stroke="#f8fafc" stroke-width="10" />
      <circle cx="56" cy="56" r="${radius}" fill="none" stroke="#3b82f6" stroke-width="10" stroke-linecap="round" stroke-dasharray="${progress} ${circumference}" />
    </g>
  </svg>`

  return svgToDataUri(svg)
}

function buildAnnualIcon(name: IconName, color: string): string {
  return icon(name, color, 18)
}

function getAnnualToneColor(tone: string): string {
  switch (tone) {
    case 'amber':
      return '#d97706'
    case 'blue':
      return '#2563eb'
    case 'rose':
      return '#e11d48'
    case 'indigo':
    default:
      return '#4f46e5'
  }
}

function formatHistoryDate(date: string): string {
  const parts = date.split('-')
  const month = parts[0] || '0'
  const day = parts[1] || '0'
  return `${Number(month)}月${Number(day)}日`
}

function buildHistoryItem(item: (typeof vm.history.items)[number]): HistoryItem {
  return Object.assign({}, item, {
    displayDate: formatHistoryDate(item.date),
  })
}

Page({
  data: {
    vm,
    statusBarHeight: 0,
    activeTab: DEFAULT_TAB_KEY as TrendTabKey,
    timeRange: DEFAULT_RANGE_KEY as RangeKey,
    currentRatio: Object.assign({}, vm.ratio.stats[DEFAULT_RANGE_KEY]) as RatioItem,
    ratioRingSrc: '',
    annualCards: [] as AnnualCardItem[],
    historyItems: vm.history.items.map(item => buildHistoryItem(item)) as HistoryItem[],
    showEditModal: false,
    editModalVisible: false,
    editingIndex: -1,
    editH: '00',
    editM: '00',
    editS: '00',
    icons: {
      chartPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      filter: '',
      trendingUp: '',
      arrowUpRight: '',
      clock: '',
      chevronLeft: '',
      x: '',
    },
    iconAnimations: {
      chart: false,
    },
    pressStates: {
      filter: false,
      tabKey: '',
      rangeKey: '',
      chartBarIndex: -1,
      annualIndex: -1,
      historyIndex: -1,
      modalClose: false,
      modalConfirm: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    const annualCards = vm.annual.cards.map(item =>
      Object.assign({}, item, {
        iconSrc: buildAnnualIcon(item.iconName, getAnnualToneColor(item.tone)),
      }),
    )

    this.setData({
      statusBarHeight: statusBarHeight || 0,
      annualCards,
      ratioRingSrc: buildRatioRing(vm.ratio.stats[DEFAULT_RANGE_KEY].moyu),
      icons: {
        chartPair: animatedIconPair('bar-chart-3', {
          color: '#ffffff',
          animation: 'float',
          durationMs: 2400,
        }),
        filter: icon('filter', '#94a3b8', 16),
        trendingUp: icon('trending-up', '#10b981', 12),
        arrowUpRight: icon('arrow-up-right', '#cbd5e1', 16),
        clock: icon('clock', '#94a3b8', 10),
        chevronLeft: icon('chevron-left', '#cbd5e1', 14),
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
    duration: number = PRESS_DURATION,
  ) {
    const pending = reportTimers[timerKey]
    if (pending) {
      clearTimeout(pending)
      reportTimers[timerKey] = null
    }

    this.setData(buildSetDataPatch(path, activeValue), () => {
      reportTimers[timerKey] = setTimeout(() => {
        this.setData(buildSetDataPatch(path, restValue))
        reportTimers[timerKey] = null
      }, duration)
    })
  },

  playChartAnimation() {
    const pending = reportTimers.chart
    if (pending) {
      clearTimeout(pending)
      reportTimers.chart = null
    }

    this.setData({ 'iconAnimations.chart': true }, () => {
      reportTimers.chart = setTimeout(() => {
        this.setData({ 'iconAnimations.chart': false })
        reportTimers.chart = null
      }, 2200)
    })
  },

  pressFilter() {
    this.pulseState('report-filter', 'pressStates.filter', true, false)
  },

  switchTab(e: WechatMiniprogram.TouchEvent) {
    const { key } = e.currentTarget.dataset
    if (!key || key === this.data.activeTab) return

    const nextKey = String(key) as TrendTabKey

    this.setData({ activeTab: nextKey })
    this.pulseState('report-tab', 'pressStates.tabKey', nextKey, '')
    this.playChartAnimation()
  },

  pressChartBar(e: WechatMiniprogram.TouchEvent) {
    const barIndex = Number(e.currentTarget.dataset.index)
    this.pulseState('report-chart-bar', 'pressStates.chartBarIndex', barIndex, -1, 500)
  },

  pressAnnualCard(e: WechatMiniprogram.TouchEvent) {
    const cardIndex = Number(e.currentTarget.dataset.index)
    this.pulseState('report-annual-card', 'pressStates.annualIndex', cardIndex, -1)
  },

  switchRange(e: WechatMiniprogram.TouchEvent) {
    const { key } = e.currentTarget.dataset
    if (!key) return

    const nextKey = String(key) as RangeKey
    const nextRatio = Object.assign({}, vm.ratio.stats[nextKey]) as RatioItem

    this.setData({
      timeRange: nextKey,
      currentRatio: nextRatio,
      ratioRingSrc: buildRatioRing(nextRatio.moyu),
    })
    this.pulseState('report-range', 'pressStates.rangeKey', nextKey, '')
  },

  openEditModal(e: WechatMiniprogram.TouchEvent) {
    const cardIndex = Number(e.currentTarget.dataset.index)
    const item = this.data.historyItems[cardIndex]
    if (!item) return

    const durationParts = item.duration.split(':')
    const editH = durationParts[0] || '00'
    const editM = durationParts[1] || '00'
    const editS = durationParts[2] || '00'
    const pending = reportTimers['edit-modal']
    if (pending) {
      clearTimeout(pending)
      reportTimers['edit-modal'] = null
    }

    this.pulseState('report-history-card', 'pressStates.historyIndex', cardIndex, -1)
    this.setData(
      {
        showEditModal: true,
        editModalVisible: false,
        editingIndex: cardIndex,
        editH,
        editM,
        editS,
      },
      () => {
        reportTimers['edit-modal'] = setTimeout(() => {
          this.setData({ editModalVisible: true })
          reportTimers['edit-modal'] = null
        }, MODAL_ENTER_DELAY)
      },
    )
  },

  hideEditModal() {
    const pending = reportTimers['edit-modal']
    if (pending) {
      clearTimeout(pending)
      reportTimers['edit-modal'] = null
    }

    this.setData({ editModalVisible: false })
    reportTimers['edit-modal'] = setTimeout(() => {
      this.setData({
        showEditModal: false,
        editModalVisible: false,
        editingIndex: -1,
      })
      reportTimers['edit-modal'] = null
    }, MODAL_EXIT_DURATION)
  },

  closeEditModal() {
    this.pulseState('report-modal-close', 'pressStates.modalClose', true, false)
    this.hideEditModal()
  },

  updateTimeField(e: WechatMiniprogram.Input) {
    const { field, max } = e.currentTarget.dataset
    if (!field) return

    const safeMax = Number(max) || 59
    const parsed = Math.max(0, Math.min(safeMax, parseInt(e.detail.value, 10) || 0))
    this.setData(buildSetDataPatch(String(field), parsed.toString().padStart(2, '0')))
  },

  saveEditTime() {
    const index = this.data.editingIndex
    if (index < 0) return

    const nextHistory = this.data.historyItems.map((item, currentIndex) => {
      if (currentIndex !== index) return item
      return Object.assign({}, item, {
        displayDate: formatHistoryDate(item.date),
        duration: `${this.data.editH}:${this.data.editM}:${this.data.editS}`,
      })
    })

    this.pulseState('report-modal-confirm', 'pressStates.modalConfirm', true, false)
    this.setData({ historyItems: nextHistory })
    this.hideEditModal()
  },
})
