import { reportModel } from './model'
import {
  buildAnnualCards,
  buildHistoryItems,
  buildRatioRing,
  buildReportIcons,
  formatHistoryDate,
} from './ocean-report.helper'
import { clearTimerBag, createTimerBag, openModal, pulseState, replayState } from '../../lib/wx/page'

type TrendTabKey = 'income' | 'duration'
type RangeKey = 'day' | 'week' | 'month' | 'year'
type RatioItem = { work: number; moyu: number }

const timers = createTimerBag()
const DEFAULT_TAB_KEY: TrendTabKey = 'income'
const DEFAULT_RANGE_KEY: RangeKey = 'week'

Page({
  data: {
    vm: reportModel,
    statusBarHeight: 0,
    activeTab: DEFAULT_TAB_KEY as TrendTabKey,
    timeRange: DEFAULT_RANGE_KEY as RangeKey,
    currentRatio: Object.assign({}, reportModel.ratio.stats[DEFAULT_RANGE_KEY]) as RatioItem,
    ratioRingSrc: buildRatioRing(reportModel.ratio.stats[DEFAULT_RANGE_KEY].moyu),
    annualCards: buildAnnualCards(),
    historyItems: buildHistoryItems(),
    showEditModal: false,
    editModalVisible: false,
    editingIndex: -1,
    editH: '00',
    editM: '00',
    editS: '00',
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
      modalClose: false,
      modalConfirm: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  onUnload() {
    clearTimerBag(timers)
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

    const nextRatio = Object.assign({}, reportModel.ratio.stats[key]) as RatioItem
    this.setData({
      timeRange: key,
      currentRatio: nextRatio,
      ratioRingSrc: buildRatioRing(nextRatio.moyu),
    })
    pulseState(this, timers, 'report-range', 'pressStates.rangeKey', key, '')
  },

  openEditModal(e: WechatMiniprogram.TouchEvent) {
    const cardIndex = Number(e.currentTarget.dataset.index)
    const item = this.data.historyItems[cardIndex]
    if (!item) return

    const [editH = '00', editM = '00', editS = '00'] = item.duration.split(':')

    pulseState(this, timers, 'report-history-card', 'pressStates.historyIndex', cardIndex, -1)
    openModal(
      this,
      timers,
      'edit-modal',
      {
        show: 'showEditModal',
        visible: 'editModalVisible',
      },
      {
        editingIndex: cardIndex,
        editH,
        editM,
        editS,
      },
    )
  },

  hideEditModal() {
    this.setData({ editModalVisible: false })
    timers['edit-modal'] = setTimeout(() => {
      this.setData({
        showEditModal: false,
        editModalVisible: false,
        editingIndex: -1,
      })
      timers['edit-modal'] = null
    }, 280)
  },

  closeEditModal() {
    pulseState(this, timers, 'report-modal-close', 'pressStates.modalClose', true, false)
    this.hideEditModal()
  },

  updateTimeField(e: WechatMiniprogram.Input) {
    const { field, max } = e.currentTarget.dataset
    if (!field) return

    const parsed = Math.max(0, Math.min(Number(max) || 59, parseInt(e.detail.value, 10) || 0))
    this.setData({
      [String(field)]: parsed.toString().padStart(2, '0'),
    })
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

    pulseState(this, timers, 'report-modal-confirm', 'pressStates.modalConfirm', true, false)
    this.setData({ historyItems: nextHistory })
    this.hideEditModal()
  },
})
