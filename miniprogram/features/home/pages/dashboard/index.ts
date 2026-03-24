import { dashboardStaticViewModel } from '../../model/static'
import { icon } from '../../../../lib/icons'

const vm = dashboardStaticViewModel

Page({
  data: {
    vm,
    statusBarHeight: 0,
    showAmount: true,
    isMoYu: false,
    isEditModalOpen: false,
    editH: '00',
    editM: '00',
    editS: '00',
    // 图标 data URI — 在 onLoad 中生成
    iconWavesWhite: '',
    iconEye: '',
    iconEyeOff: '',
    iconCompassBlue: '',
    iconCoffeeBlue: '',
    iconBriefcaseBlue: '',
    iconLogOut: '',
    iconCoffeeWhite: '',
    iconSettingsSlate: '',
    iconListTodo: '',
    iconWallet: '',
    iconCompassEmerald: '',
    iconHeartRose: '',
    iconGiftAmber: '',
    iconStarBlue: '',
    iconChevronRight: '',
    iconPlus: '',
    iconHistorySlate: '',
    iconAnchorAmber: '',
    iconShipBlue: '',
    iconSunsetRose: '',
    iconX: '',
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      iconWavesWhite: icon('waves', '#ffffff', 18),
      iconEye: icon('eye', '#bfdbfe', 14),
      iconEyeOff: icon('eye-off', '#bfdbfe', 14),
      iconCompassBlue: icon('compass', '#2563eb', 12),
      iconCoffeeBlue: icon('coffee', '#bfdbfe', 10),
      iconBriefcaseBlue: icon('briefcase', '#bfdbfe', 10),
      iconLogOut: icon('log-out', '#94a3b8', 18),
      iconCoffeeWhite: icon('coffee', '#ffffff', 18),
      iconSettingsSlate: icon('settings2', '#cbd5e1', 16),
      iconListTodo: icon('list-todo', '#2563eb', 16),
      iconWallet: icon('wallet', '#2563eb', 16),
      iconCompassEmerald: icon('compass', '#059669', 16),
      iconHeartRose: icon('heart', '#f43f5e', 16),
      iconGiftAmber: icon('gift', '#f59e0b', 16),
      iconStarBlue: icon('star', '#3b82f6', 16),
      iconChevronRight: icon('chevron-right', '#cbd5e1', 12),
      iconPlus: icon('plus', '#cbd5e1', 16),
      iconHistorySlate: icon('history', '#94a3b8', 14),
      iconAnchorAmber: icon('anchor', '#f59e0b', 14),
      iconShipBlue: icon('ship', '#3b82f6', 14),
      iconSunsetRose: icon('sunset', '#f43f5e', 14),
      iconX: icon('x', '#94a3b8', 18),
    })
  },

  toggleAmount() {
    this.setData({ showAmount: !this.data.showAmount })
  },

  toggleMoYu() {
    this.setData({ isMoYu: !this.data.isMoYu })
  },

  openEditModal() {
    this.setData({
      isEditModalOpen: true,
      editH: '01',
      editM: '24',
      editS: '16',
    })
  },

  closeEditModal() {
    this.setData({ isEditModalOpen: false })
  },

  saveEditTime() {
    this.setData({ isEditModalOpen: false })
  },

  onEditHInput(e: WechatMiniprogram.Input) {
    const val = Math.min(23, Math.max(0, parseInt(e.detail.value) || 0))
    this.setData({ editH: val.toString().padStart(2, '0') })
  },

  onEditMInput(e: WechatMiniprogram.Input) {
    const val = Math.min(59, Math.max(0, parseInt(e.detail.value) || 0))
    this.setData({ editM: val.toString().padStart(2, '0') })
  },

  onEditSInput(e: WechatMiniprogram.Input) {
    const val = Math.min(59, Math.max(0, parseInt(e.detail.value) || 0))
    this.setData({ editS: val.toString().padStart(2, '0') })
  },
})
