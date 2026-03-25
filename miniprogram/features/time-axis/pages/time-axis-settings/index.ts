import { animatedIconPair, icon, type IconImagePair, type IconName } from '../../../../lib/icons'
import { timeAxisStaticViewModel } from '../../model/static'

const vm = timeAxisStaticViewModel

type EntryItem = {
  id: string
  title: string
  date: string
  group: string
  iconId: string
  tag: string
  countdown: string
  tone: string
}
type IconChoice = {
  id: string
  label: string
  tone: string
  iconPair: IconImagePair
}
type RuntimeEntry = EntryItem & {
  iconSrc: string
  isPast: boolean
}
type FormState = {
  title: string
  date: string
  group: string
  type: string
  isAnniversary: boolean
  iconId: string
}

Page({
  data: {
    vm,
    statusBarHeight: 0,
    selectedGroup: vm.groups[0] as string,
    entries: [] as RuntimeEntry[],
    visibleEntries: [] as RuntimeEntry[],
    iconChoices: [] as IconChoice[],
    isModalOpen: false,
    editingId: '',
    form: {
      ...vm.draft,
    } as FormState,
    icons: {
      chevronLeft: '',
      plus: '',
      chevronRight: '',
      x: '',
      calendar: '',
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    const iconChoices = vm.iconChoices.map(choice => ({
      ...choice,
      iconPair: animatedIconPair(choice.id as IconName, {
        color: this.getToneColor(choice.tone),
        animation: 'float',
        durationMs: 2200,
      }),
    }))

    this.setData({
      statusBarHeight: statusBarHeight || 0,
      entries: this.decorateEntries(vm.entries as readonly EntryItem[], iconChoices),
      iconChoices,
      icons: {
        chevronLeft: icon('chevron-left', '#475569', 22),
        plus: icon('plus', '#2563eb', 20),
        chevronRight: icon('chevron-right', '#cbd5e1', 14),
        x: icon('x', '#94a3b8', 18),
        calendar: icon('calendar', '#94a3b8', 16),
      },
    }, () => {
      this.refreshVisibleEntries()
    })
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }

    wx.reLaunch({ url: '/features/profile/pages/home/index' })
  },

  refreshVisibleEntries() {
    const visibleEntries = this.data.selectedGroup === '全部'
      ? this.data.entries
      : this.data.entries.filter(item => item.group === this.data.selectedGroup)

    this.setData({ visibleEntries })
  },

  selectGroup(e: WechatMiniprogram.TouchEvent) {
    const { value } = e.currentTarget.dataset
    if (!value) return
    this.setData({ selectedGroup: value }, () => {
      this.refreshVisibleEntries()
    })
  },

  openCreateModal() {
    this.setData({
      isModalOpen: true,
      editingId: '',
      form: {
        ...vm.draft,
      },
    })
  },

  openEditModal(e: WechatMiniprogram.TouchEvent) {
    const { id } = e.currentTarget.dataset
    const entry = this.data.entries.find(item => item.id === id)
    if (!entry) return

    this.setData({
      isModalOpen: true,
      editingId: entry.id,
      form: {
        title: entry.title,
        date: entry.date,
        group: entry.group,
        type: entry.tag === '农历' ? 'lunar' : 'solar',
        isAnniversary: !entry.countdown.includes('剩余'),
        iconId: entry.iconId,
      } as FormState,
    })
  },

  closeModal() {
    this.setData({
      isModalOpen: false,
      editingId: '',
      form: {
        ...vm.draft,
      },
    })
  },

  updateField(e: WechatMiniprogram.Input | WechatMiniprogram.CustomEvent) {
    const { field } = e.currentTarget.dataset
    if (!field) return
    const value = 'detail' in e && 'value' in e.detail ? e.detail.value : ''
    this.setData({ [`form.${field}`]: value })
  },

  toggleType(e: WechatMiniprogram.TouchEvent) {
    const { value } = e.currentTarget.dataset
    if (!value) return
    this.setData({ 'form.type': value })
  },

  toggleAnniversary() {
    this.setData({ 'form.isAnniversary': !this.data.form.isAnniversary })
  },

  selectIcon(e: WechatMiniprogram.TouchEvent) {
    const { value } = e.currentTarget.dataset
    if (!value) return
    this.setData({ 'form.iconId': value })
  },

  saveEntry() {
    if (!this.data.form.title || !this.data.form.date) return

    const iconChoice = this.data.iconChoices.find(item => item.id === this.data.form.iconId)
    const countdown = this.buildCountdownText(this.data.form.date, this.data.form.isAnniversary)
    const nextEntry: RuntimeEntry = {
      id: this.data.editingId || `entry-${Date.now()}`,
      title: this.data.form.title,
      date: this.data.form.date,
      group: this.data.form.group,
      iconId: this.data.form.iconId,
      tag: this.data.form.type === 'lunar' ? '农历' : '公历',
      countdown,
      tone: iconChoice?.tone || 'blue',
      iconSrc: iconChoice?.iconPair.staticSrc || '',
      isPast: !this.data.form.isAnniversary && countdown.includes('已过'),
    }

    const entries = this.data.editingId
      ? this.data.entries.map(item => (item.id === this.data.editingId ? nextEntry : item))
      : [nextEntry, ...this.data.entries]

    this.setData({ entries, isModalOpen: false, editingId: '' }, () => {
      this.refreshVisibleEntries()
      this.closeModal()
    })
  },

  deleteEntry() {
    if (!this.data.editingId) return

    this.setData({
      entries: this.data.entries.filter(item => item.id !== this.data.editingId),
      isModalOpen: false,
      editingId: '',
    }, () => {
      this.refreshVisibleEntries()
      this.closeModal()
    })
  },

  buildCountdownText(date: string, isAnniversary: boolean) {
    const target = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    target.setHours(0, 0, 0, 0)

    let diffDays = Math.ceil((target.getTime() - today.getTime()) / 86400000)
    if (isAnniversary && diffDays < 0) {
      diffDays = 365 + (diffDays % 365)
    }

    if (isAnniversary) {
      return `还有 ${Math.abs(diffDays)} 天`
    }

    return diffDays >= 0 ? `剩余 ${diffDays} 天` : `已过 ${Math.abs(diffDays)} 天`
  },

  getToneColor(tone: string) {
    switch (tone) {
      case 'rose':
        return '#f43f5e'
      case 'amber':
        return '#f59e0b'
      case 'yellow':
        return '#a16207'
      case 'indigo':
        return '#6366f1'
      case 'violet':
        return '#7c3aed'
      case 'orange':
        return '#ea580c'
      case 'emerald':
        return '#10b981'
      case 'pink':
        return '#ec4899'
      case 'slate':
        return '#64748b'
      case 'blue':
      default:
        return '#2563eb'
    }
  },

  decorateEntries(entries: readonly EntryItem[], iconChoices: IconChoice[]) {
    return entries.map(entry => ({
      ...entry,
      iconSrc: iconChoices.find(item => item.id === entry.iconId)?.iconPair.staticSrc || '',
      isPast: entry.countdown.includes('已过'),
    }))
  },
})
