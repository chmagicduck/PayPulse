import {
  animatedIconPair,
  icon,
  type IconImagePair,
  type IconName,
  type SvgAnimationPreset,
} from '../../../../lib/icons'
import { timeAxisStaticViewModel } from '../../model/static'

const vm = timeAxisStaticViewModel
const PRESS_DURATION = 220
const DRAWER_ENTER_DELAY = 30
const DRAWER_EXIT_DURATION = 280

type NotebookItem = {
  id: string
  name: string
  iconId: string
  tone: string
}

type StaticEntry = {
  id: string
  title: string
  date: string
  notebookId: string
  isAnniversary: boolean
}

type FormState = {
  title: string
  date: string
  notebookId: string
  isAnniversary: boolean
}

type RuntimeNotebook = NotebookItem & {
  iconPair: IconImagePair
}

type RuntimeEntry = StaticEntry & {
  dateText: string
  notebookName: string
  notebookTone: string
  iconSrc: string
  tone: string
  valueText: string
  unitText: string
  isPast: boolean
}

let timeAxisTimers: Record<string, ReturnType<typeof setTimeout> | null> = {}

function toMidnight(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate())
}

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(item => Number(item))
  return new Date(year || 1970, Math.max(0, (month || 1) - 1), day || 1)
}

function diffDays(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / 86400000)
}

function formatDate(value: string) {
  return value.replace(/-/g, '/')
}

function getDefaultNotebookId(selectedNotebookId: string) {
  return selectedNotebookId && selectedNotebookId !== 'all'
    ? selectedNotebookId
    : vm.draft.notebookId
}

function buildCountdown(date: string, isAnniversary: boolean) {
  const today = toMidnight(new Date())

  if (isAnniversary) {
    const target = parseDate(date)
    const anniversaryDate = new Date(today.getFullYear(), target.getMonth(), target.getDate())
    const nextTarget = diffDays(today, anniversaryDate) >= 0
      ? anniversaryDate
      : new Date(today.getFullYear() + 1, target.getMonth(), target.getDate())

    return {
      valueText: String(Math.max(0, diffDays(today, nextTarget))),
      unitText: '天后',
      isPast: false,
    }
  }

  const target = toMidnight(parseDate(date))
  const difference = diffDays(today, target)

  return {
    valueText: String(Math.abs(difference)),
    unitText: difference < 0 ? '天前' : '天后',
    isPast: difference < 0,
  }
}

Page({
  data: {
    vm,
    statusBarHeight: 0,
    selectedNotebookId: vm.notebooks[0].id as string,
    notebooks: [] as RuntimeNotebook[],
    drawerNotebooks: [] as RuntimeNotebook[],
    entries: [] as RuntimeEntry[],
    visibleEntries: [] as RuntimeEntry[],
    showDrawer: false,
    drawerVisible: false,
    editingId: '',
    form: {
      ...vm.draft,
    } as FormState,
    icons: {
      chevronLeft: '',
      close: '',
      calendar: '',
      trash2: '',
      addPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      emptyPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
    },
    pressStates: {
      notebookId: '',
      entryId: '',
      addCard: false,
      drawerNotebookId: '',
      closeButton: false,
      saveButton: false,
      deleteButton: false,
      anniversary: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    const notebooks = vm.notebooks.map(item => ({
      ...item,
      iconPair: animatedIconPair(item.iconId as IconName, {
        color: this.getToneColor(item.tone),
        size: 18,
        animation: this.getIconAnimation(item.iconId as IconName),
        durationMs: 2400,
      }),
    }))
    const entries = this.decorateEntries(vm.entries as readonly StaticEntry[], notebooks)

    this.setData({
      statusBarHeight: statusBarHeight || 0,
      notebooks,
      drawerNotebooks: notebooks.filter(item => item.id !== 'all'),
      entries,
      icons: {
        chevronLeft: icon('chevron-left', '#475569', 22),
        close: icon('x', '#94a3b8', 18),
        calendar: icon('calendar', '#94a3b8', 18),
        trash2: icon('trash-2', '#e11d48', 20),
        addPair: animatedIconPair('plus-circle', {
          color: '#2563eb',
          size: 24,
          animation: 'bounce',
          durationMs: 2200,
        }),
        emptyPair: animatedIconPair('star', {
          color: '#94a3b8',
          size: 28,
          animation: 'twinkle',
          durationMs: 2200,
        }),
      },
    }, () => {
      this.refreshVisibleEntries()
    })
  },

  onUnload() {
    Object.keys(timeAxisTimers).forEach(key => {
      const timer = timeAxisTimers[key]
      if (timer) clearTimeout(timer)
    })
    timeAxisTimers = {}
  },

  pulseState(
    timerKey: string,
    path: string,
    activeValue: string | boolean,
    restValue: string | boolean,
    duration: number = PRESS_DURATION,
  ) {
    const pending = timeAxisTimers[timerKey]
    if (pending) {
      clearTimeout(pending)
      timeAxisTimers[timerKey] = null
    }

    this.setData({ [path]: activeValue }, () => {
      timeAxisTimers[timerKey] = setTimeout(() => {
        this.setData({ [path]: restValue })
        timeAxisTimers[timerKey] = null
      }, duration)
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
    const visibleEntries = this.data.selectedNotebookId === 'all'
      ? this.data.entries
      : this.data.entries.filter(item => item.notebookId === this.data.selectedNotebookId)

    this.setData({ visibleEntries })
  },

  selectNotebook(e: WechatMiniprogram.TouchEvent) {
    const notebookId = String(e.currentTarget.dataset.id || '')
    if (!notebookId) return

    this.pulseState('notebook-press', 'pressStates.notebookId', notebookId, '')
    this.setData({ selectedNotebookId: notebookId }, () => {
      this.refreshVisibleEntries()
    })
  },

  openCreateDrawer() {
    this.pulseState('add-card-press', 'pressStates.addCard', true, false, 260)
    this.openDrawer({
      ...vm.draft,
      notebookId: getDefaultNotebookId(this.data.selectedNotebookId),
    })
  },

  openEditDrawer(e: WechatMiniprogram.TouchEvent) {
    const entryId = String(e.currentTarget.dataset.id || '')
    const target = this.data.entries.find(item => item.id === entryId)
    if (!target) return

    this.pulseState('entry-press', 'pressStates.entryId', entryId, '')
    this.openDrawer({
      title: target.title,
      date: target.date,
      notebookId: target.notebookId,
      isAnniversary: target.isAnniversary,
    }, target.id)
  },

  openDrawer(form: FormState, editingId: string = '') {
    const pending = timeAxisTimers['drawer-motion']
    if (pending) {
      clearTimeout(pending)
      timeAxisTimers['drawer-motion'] = null
    }

    this.setData({
      showDrawer: true,
      drawerVisible: false,
      editingId,
      form,
    }, () => {
      timeAxisTimers['drawer-motion'] = setTimeout(() => {
        this.setData({ drawerVisible: true })
        timeAxisTimers['drawer-motion'] = null
      }, DRAWER_ENTER_DELAY)
    })
  },

  closeDrawer() {
    const pending = timeAxisTimers['drawer-motion']
    if (pending) {
      clearTimeout(pending)
      timeAxisTimers['drawer-motion'] = null
    }

    this.setData({ drawerVisible: false })
    timeAxisTimers['drawer-motion'] = setTimeout(() => {
      this.setData({
        showDrawer: false,
        drawerVisible: false,
        editingId: '',
        form: {
          ...vm.draft,
          notebookId: getDefaultNotebookId(this.data.selectedNotebookId),
        },
      })
      timeAxisTimers['drawer-motion'] = null
    }, DRAWER_EXIT_DURATION)
  },

  pressCloseDrawer() {
    this.pulseState('drawer-close-press', 'pressStates.closeButton', true, false)
    this.closeDrawer()
  },

  updateTitle(e: WechatMiniprogram.Input) {
    this.setData({ 'form.title': e.detail.value })
  },

  updateDate(e: WechatMiniprogram.CustomEvent) {
    this.setData({ 'form.date': e.detail.value })
  },

  toggleAnniversary() {
    this.pulseState('drawer-anniversary-press', 'pressStates.anniversary', true, false)
    this.setData({ 'form.isAnniversary': !this.data.form.isAnniversary })
  },

  selectDrawerNotebook(e: WechatMiniprogram.TouchEvent) {
    const notebookId = String(e.currentTarget.dataset.id || '')
    if (!notebookId || notebookId === 'all') return

    this.pulseState('drawer-notebook-press', 'pressStates.drawerNotebookId', notebookId, '')
    this.setData({ 'form.notebookId': notebookId })
  },

  saveEntry() {
    this.pulseState('drawer-save-press', 'pressStates.saveButton', true, false, 260)

    if (!this.data.form.title || !this.data.form.date) return

    const entry: StaticEntry = {
      id: this.data.editingId || `time-axis-${Date.now()}`,
      title: this.data.form.title,
      date: this.data.form.date,
      notebookId: this.data.form.notebookId,
      isAnniversary: this.data.form.isAnniversary,
    }

    const nextEntry = this.decorateEntry(entry, this.data.notebooks)
    const entries = this.data.editingId
      ? this.data.entries.map(item => (item.id === this.data.editingId ? nextEntry : item))
      : [nextEntry, ...this.data.entries]

    this.setData({ entries }, () => {
      this.refreshVisibleEntries()
      this.closeDrawer()
    })
  },

  deleteEntry() {
    if (!this.data.editingId) return

    this.pulseState('drawer-delete-press', 'pressStates.deleteButton', true, false, 260)
    this.setData({
      entries: this.data.entries.filter(item => item.id !== this.data.editingId),
    }, () => {
      this.refreshVisibleEntries()
      this.closeDrawer()
    })
  },

  decorateEntries(entries: readonly StaticEntry[], notebooks: RuntimeNotebook[]) {
    return entries.map(item => this.decorateEntry(item, notebooks))
  },

  decorateEntry(entry: StaticEntry, notebooks: RuntimeNotebook[]): RuntimeEntry {
    const notebook = notebooks.find(item => item.id === entry.notebookId) || notebooks[0]
    const countdown = buildCountdown(entry.date, entry.isAnniversary)

    return {
      ...entry,
      dateText: formatDate(entry.date),
      notebookName: notebook?.name || '',
      notebookTone: notebook?.tone || 'slate',
      iconSrc: notebook?.iconPair.staticSrc || '',
      tone: notebook?.tone || 'blue',
      valueText: countdown.valueText,
      unitText: countdown.unitText,
      isPast: countdown.isPast,
    }
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

  getIconAnimation(iconName: IconName): SvgAnimationPreset {
    switch (iconName) {
      case 'rocket':
        return 'bounce'
      case 'music':
      case 'star':
        return 'twinkle'
      case 'map':
      case 'camera':
        return 'drift'
      case 'coffee':
      case 'calendar':
        return 'wave'
      default:
        return 'float'
    }
  },

  noop() {},
})
