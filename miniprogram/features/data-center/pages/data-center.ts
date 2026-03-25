import { animatedIconPair, icon, type IconImagePair } from '../../../lib/icons'
import { dataCenterStaticViewModel } from '../model/static'

const vm = dataCenterStaticViewModel
const MODAL_ENTER_DELAY = 30
const MODAL_EXIT_DURATION = 280

let exportTimer: ReturnType<typeof setTimeout> | null = null
let successTimer: ReturnType<typeof setTimeout> | null = null
let resetModalTimer: ReturnType<typeof setTimeout> | null = null

Page({
  data: {
    vm,
    statusBarHeight: 0,
    storageUsed: Number(vm.storage.used),
    storageCapacity: Number(vm.storage.capacity),
    storageUsedText: Number(vm.storage.used).toFixed(1),
    storagePercentText: `${((Number(vm.storage.used) / Number(vm.storage.capacity)) * 100).toFixed(1)}%`,
    exportStatus: 'idle',
    showResetModal: false,
    resetModalVisible: false,
    icons: {
      chevronLeft: '',
      x: '',
      databasePair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      hardDrive: '',
      cloud: '',
      download: '',
      trash2: '',
      alertTriangle: '',
      shieldCheck: '',
      checkCircle2: '',
      arrowRightLeft: '',
    },
    pressStates: {
      modalClose: false,
      modalConfirm: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      icons: {
        chevronLeft: icon('chevron-left', '#475569', 22),
        x: icon('x', '#94a3b8', 20),
        databasePair: animatedIconPair('database', {
          color: '#60a5fa',
          animation: 'float',
          durationMs: 2600,
        }),
        hardDrive: icon('hard-drive', '#2563eb', 22),
        cloud: icon('cloud', '#94a3b8', 22),
        download: icon('download', '#2563eb', 18),
        trash2: icon('trash-2', '#f43f5e', 18),
        alertTriangle: icon('alert-triangle', '#f43f5e', 30),
        shieldCheck: icon('shield-check', '#10b981', 14),
        checkCircle2: icon('check-circle-2', '#10b981', 18),
        arrowRightLeft: icon('arrow-right-left', '#cbd5e1', 14),
      },
    })
  },

  onUnload() {
    if (exportTimer) clearTimeout(exportTimer)
    if (successTimer) clearTimeout(successTimer)
    if (resetModalTimer) clearTimeout(resetModalTimer)
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }

    wx.reLaunch({ url: '/features/profile/pages/home' })
  },

  handleExport() {
    if (this.data.exportStatus === 'exporting') return

    this.setData({ exportStatus: 'exporting' })
    if (exportTimer) clearTimeout(exportTimer)
    if (successTimer) clearTimeout(successTimer)

    exportTimer = setTimeout(() => {
      this.setData({ exportStatus: 'success' })
      successTimer = setTimeout(() => {
        this.setData({ exportStatus: 'idle' })
      }, 3000)
    }, 2000)
  },

  openResetModal() {
    if (resetModalTimer) {
      clearTimeout(resetModalTimer)
      resetModalTimer = null
    }

    this.setData({
      showResetModal: true,
      resetModalVisible: false,
    }, () => {
      resetModalTimer = setTimeout(() => {
        this.setData({ resetModalVisible: true })
        resetModalTimer = null
      }, MODAL_ENTER_DELAY)
    })
  },

  closeResetModal() {
    if (resetModalTimer) {
      clearTimeout(resetModalTimer)
      resetModalTimer = null
    }

    this.setData({
      resetModalVisible: false,
      'pressStates.modalClose': true,
    }, () => {
      setTimeout(() => {
        this.setData({ 'pressStates.modalClose': false })
      }, 220)

      resetModalTimer = setTimeout(() => {
        this.setData({
          showResetModal: false,
          resetModalVisible: false,
        })
        resetModalTimer = null
      }, MODAL_EXIT_DURATION)
    })
  },

  confirmReset() {
    if (resetModalTimer) {
      clearTimeout(resetModalTimer)
      resetModalTimer = null
    }

    this.setData({
      resetModalVisible: false,
      'pressStates.modalConfirm': true,
    })

    setTimeout(() => {
      this.setData({ 'pressStates.modalConfirm': false })
    }, 220)

    resetModalTimer = setTimeout(() => {
      this.setData({
        storageUsed: 0,
        storageUsedText: '0.0',
        storagePercentText: '0.0%',
        showResetModal: false,
        resetModalVisible: false,
      })
      resetModalTimer = null
    }, MODAL_EXIT_DURATION)
  },
})
