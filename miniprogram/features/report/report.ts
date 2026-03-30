import { clearTimerBag, createTimerBag, pulseState, replayState } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { buildAnnualCards, buildHistoryItems, buildRatioRing, buildReportIcons } from './ocean-report.helper'
import { reportModel } from './model'
import { buildReportRuntimeState } from './model/state'

type TrendTabKey = 'income' | 'duration'
type RangeKey = 'day' | 'week' | 'month' | 'year'
type RatioItem = { work: number; moyu: number }

const timers = createTimerBag()
const DEFAULT_TAB_KEY: TrendTabKey = 'income'
const DEFAULT_RANGE_KEY: RangeKey = 'week'

Page({
  data: {
    vm: reportModel as any,
    statusBarHeight: 0,
    activeTab: DEFAULT_TAB_KEY as TrendTabKey,
    timeRange: DEFAULT_RANGE_KEY as RangeKey,
    currentRatio: Object.assign({}, reportModel.ratio.stats[DEFAULT_RANGE_KEY]) as RatioItem,
    ratioRingSrc: buildRatioRing(reportModel.ratio.stats[DEFAULT_RANGE_KEY].moyu),
    annualCards: buildAnnualCards() as any[],
    historyItems: buildHistoryItems() as any[],
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
      historyIndex: -1,
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
    const vm = buildReportRuntimeState()
    const range = this.data.timeRange as RangeKey
    const currentRatio = Object.assign({}, vm.ratio.stats[range]) as RatioItem
    this.setData({
      vm,
      currentRatio,
      ratioRingSrc: buildRatioRing(currentRatio.moyu),
      annualCards: buildAnnualCards(vm.annualCards as any) as any[],
      historyItems: buildHistoryItems(vm.historyItems as any) as any[],
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

  pressAnnualCard(e: WechatMiniprogram.TouchEvent) {
    pulseState(this, timers, 'report-annual-card', 'pressStates.annualIndex', Number(e.currentTarget.dataset.index), -1)
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

  pressHistoryCard(e: WechatMiniprogram.TouchEvent) {
    const cardIndex = Number(e.currentTarget.dataset.index)
    if (Number.isNaN(cardIndex)) return
    pulseState(this, timers, 'report-history-card', 'pressStates.historyIndex', cardIndex, -1)
    wx.showToast({
      title: '请前往“今日概览”修改今日摸鱼时长',
      icon: 'none',
    })
  },
})
