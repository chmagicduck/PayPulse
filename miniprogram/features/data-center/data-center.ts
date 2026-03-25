import { dataCenterModel } from './model'
import { buildDataCenterIcons } from './data-center.helper'
import { clearTimerBag, createTimerBag, handlePageBack, openModal, pulseState } from '../../lib/wx/page'

const timers = createTimerBag()

Page({
  data: {
    vm: dataCenterModel,
    statusBarHeight: 0,
    storageUsed: Number(dataCenterModel.storage.used),
    storageCapacity: Number(dataCenterModel.storage.capacity),
    storageUsedText: dataCenterModel.storage.used.toFixed(1),
    storagePercentText: `${((dataCenterModel.storage.used / dataCenterModel.storage.capacity) * 100).toFixed(1)}%`,
    exportStatus: 'idle',
    showResetModal: false,
    resetModalVisible: false,
    icons: buildDataCenterIcons(),
    pressStates: {
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

  handleBack() {
    handlePageBack('/features/profile/home')
  },

  handleExport() {
    if (this.data.exportStatus === 'exporting') return

    this.setData({ exportStatus: 'exporting' })
    if (timers.export) clearTimeout(timers.export)
    if (timers.success) clearTimeout(timers.success)

    timers.export = setTimeout(() => {
      this.setData({ exportStatus: 'success' })
      timers.success = setTimeout(() => {
        this.setData({ exportStatus: 'idle' })
        timers.success = null
      }, 3000)
      timers.export = null
    }, 2000)
  },

  openResetModal() {
    openModal(
      this,
      timers,
      'reset-modal',
      {
        show: 'showResetModal',
        visible: 'resetModalVisible',
      },
    )
  },

  closeResetModal() {
    pulseState(this, timers, 'reset-modal-close', 'pressStates.modalClose', true, false)
    this.setData({ resetModalVisible: false })
    timers['reset-modal'] = setTimeout(() => {
      this.setData({
        showResetModal: false,
        resetModalVisible: false,
      })
      timers['reset-modal'] = null
    }, 280)
  },

  confirmReset() {
    pulseState(this, timers, 'reset-modal-confirm', 'pressStates.modalConfirm', true, false)
    this.setData({ resetModalVisible: false })
    timers['reset-modal'] = setTimeout(() => {
      this.setData({
        storageUsed: 0,
        storageUsedText: '0.0',
        storagePercentText: '0.0%',
        showResetModal: false,
        resetModalVisible: false,
      })
      timers['reset-modal'] = null
    }, 280)
  },
})
