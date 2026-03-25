import { animatedIconPair, icon, type IconImagePair } from '../../../../lib/icons'
import { dataCenterStaticViewModel } from '../../model/static'

const vm = dataCenterStaticViewModel

let exportTimer: ReturnType<typeof setTimeout> | null = null
let successTimer: ReturnType<typeof setTimeout> | null = null

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
    icons: {
      chevronLeft: '',
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
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      icons: {
        chevronLeft: icon('chevron-left', '#475569', 22),
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
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }

    wx.reLaunch({ url: '/features/profile/pages/home/index' })
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
    this.setData({ showResetModal: true })
  },

  closeResetModal() {
    this.setData({ showResetModal: false })
  },

  confirmReset() {
    this.setData({
      storageUsed: 0,
      storageUsedText: '0.0',
      storagePercentText: '0.0%',
      showResetModal: false,
    })
  },
})
