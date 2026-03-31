import { clearTimerBag, closeModal, createTimerBag, openModal, pulseState, replayState } from '../../lib/wx/page'
import { buildAppShareMessage, buildAppTimelineShare, showAppShareMenu } from '../../lib/wx/share'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { buildAnnualCards, buildHistoryItems, buildRatioRing, buildReportIcons } from './helper/presentation'
import { buildReportRuntimeState } from './model/state'
import { reportViewModel } from './model/index'

type TrendTabKey = 'income' | 'duration'
type RangeKey = 'day' | 'week' | 'month' | 'year'
type RatioItem = { work: number; moyu: number }

const timers = createTimerBag()
const DEFAULT_TAB_KEY: TrendTabKey = 'income'
const DEFAULT_RANGE_KEY: RangeKey = 'week'
const HISTORY_PAGE_SIZE = 7

function buildHistoryPageState(historyItems: any[], page: number = 1) {
  const historyTotalPages = Math.max(1, Math.ceil(historyItems.length / HISTORY_PAGE_SIZE))
  const safePage = Math.min(historyTotalPages, Math.max(1, page))
  const startIndex = (safePage - 1) * HISTORY_PAGE_SIZE

  return {
    historyPage: safePage,
    historyTotalPages,
    visibleHistoryItems: historyItems.slice(startIndex, startIndex + HISTORY_PAGE_SIZE),
  }
}

Page({
  data: {
    vm: reportViewModel as any,
    statusBarHeight: 0,
    activeTab: DEFAULT_TAB_KEY as TrendTabKey,
    timeRange: DEFAULT_RANGE_KEY as RangeKey,
    currentRatio: Object.assign({}, reportViewModel.ratio.stats[DEFAULT_RANGE_KEY]) as RatioItem,
    ratioRingSrc: buildRatioRing(reportViewModel.ratio.stats[DEFAULT_RANGE_KEY].moyu),
    annualCards: buildAnnualCards(reportViewModel.annualCards as any) as any[],
    historyItems: buildHistoryItems(reportViewModel.historyItems as any) as any[],
    ...buildHistoryPageState(buildHistoryItems(reportViewModel.historyItems as any) as any[]),
    showAnnualInfoModal: false,
    annualInfoModalVisible: false,
    activeAnnualInfoKey: '',
    activeAnnualInfo: null as any,
    icons: buildReportIcons(),
    iconAnimations: {
      chart: false,
    },
    pressStates: {
      filter: false,
      tabKey: '',
      rangeKey: '',
      chartBarIndex: -1,
      annualIndex: -1,
      historyPrev: false,
      historyNext: false,
      annualInfoClose: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
    showAppShareMenu()
  },

  onShow() {
    if (!ensureBootstrapReady()) {
      return
    }
    showAppShareMenu()
    this.reloadRuntimeState()
  },

  onUnload() {
    clearTimerBag(timers)
  },

  reloadRuntimeState() {
    const vm = buildReportRuntimeState()
    const range = this.data.timeRange as RangeKey
    const currentRatio = Object.assign({}, vm.ratio.stats[range]) as RatioItem
    const historyItems = buildHistoryItems(vm.historyItems as any) as any[]
    this.setData({
      vm,
      currentRatio,
      ratioRingSrc: buildRatioRing(currentRatio.moyu),
      annualCards: buildAnnualCards(vm.annualCards as any) as any[],
      historyItems,
      ...buildHistoryPageState(historyItems, 1),
    })
  },

  playChartAnimation() {
    replayState(this, timers, 'chart', 'iconAnimations.chart', true, false, 2200)
  },

  pressFilter() {
    pulseState(this, timers, 'report-filter', 'pressStates.filter', true, false)
  },

  switchTab(e: WechatMiniprogram.TouchEvent) {
    const key = String(e.currentTarget.dataset.key || '') as TrendTabKey
    if (!key || key === this.data.activeTab) return

    this.setData({ activeTab: key })
    pulseState(this, timers, 'report-tab', 'pressStates.tabKey', key, '')
    this.playChartAnimation()
  },

  pressChartBar(e: WechatMiniprogram.TouchEvent) {
    pulseState(this, timers, 'report-chart-bar', 'pressStates.chartBarIndex', Number(e.currentTarget.dataset.index), -1, 500)
  },

  openAnnualInfo(e: WechatMiniprogram.CustomEvent<{ key?: string }>) {
    const key = String(e.detail?.key || e.currentTarget.dataset.key || '')
    const index = Number(e.currentTarget.dataset.index)
    if (!key) return

    const activeAnnualInfo = this.data.vm.annualInfoMap?.[key] || null
    if (!activeAnnualInfo) return

    if (!Number.isNaN(index)) {
      pulseState(this, timers, 'report-annual-card', 'pressStates.annualIndex', index, -1)
    }

    openModal(
      this,
      timers,
      'report-annual-info',
      {
        show: 'showAnnualInfoModal',
        visible: 'annualInfoModalVisible',
      },
      {
        activeAnnualInfoKey: key,
        activeAnnualInfo,
      },
    )
  },

  switchRange(e: WechatMiniprogram.TouchEvent) {
    const key = String(e.currentTarget.dataset.key || '') as RangeKey
    if (!key) return

    const nextRatio = Object.assign({}, this.data.vm.ratio.stats[key]) as RatioItem
    this.setData({
      timeRange: key,
      currentRatio: nextRatio,
      ratioRingSrc: buildRatioRing(nextRatio.moyu),
    })
    pulseState(this, timers, 'report-range', 'pressStates.rangeKey', key, '')
  },

  goPrevHistoryPage() {
    if (this.data.historyPage <= 1) {
      return
    }

    pulseState(this, timers, 'report-history-prev', 'pressStates.historyPrev', true, false)
    this.setData(buildHistoryPageState(this.data.historyItems, this.data.historyPage - 1))
  },

  goNextHistoryPage() {
    if (this.data.historyPage >= this.data.historyTotalPages) {
      return
    }

    pulseState(this, timers, 'report-history-next', 'pressStates.historyNext', true, false)
    this.setData(buildHistoryPageState(this.data.historyItems, this.data.historyPage + 1))
  },

  closeAnnualInfo() {
    pulseState(this, timers, 'report-annual-info-close', 'pressStates.annualInfoClose', true, false)
    closeModal(
      this,
      timers,
      'report-annual-info',
      {
        show: 'showAnnualInfoModal',
        visible: 'annualInfoModalVisible',
      },
      {
        activeAnnualInfoKey: '',
        activeAnnualInfo: null,
      },
    )
  },

  stopModalTap() {},

  onShareAppMessage() {
    return buildAppShareMessage()
  },

  onShareTimeline() {
    return buildAppTimelineShare()
  },
})
