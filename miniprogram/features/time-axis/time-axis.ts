import { clearTimerBag, createTimerBag, handlePageBack, openModal, pulseState } from '../../lib/wx/page'
import { ensureBootstrapReady } from '../../store/bootstrap'
import { saveTimeAxisEntry, deleteTimeAxisEntry } from './model/actions'
import { readTimeAxisEntries } from './model/storage'
import { timeAxisViewModel, type TimeAxisEntryForm } from './model/index'
import { buildTimeAxisIcons, buildTimeAxisNotebooks, decorateEntries, getDefaultNotebookId } from './helper/presentation'

const timers = createTimerBag()

Page({
  data: {
    vm: timeAxisViewModel,
    statusBarHeight: 0,
    selectedNotebookId: timeAxisViewModel.notebooks[0].id as string,
    notebooks: [] as ReturnType<typeof buildTimeAxisNotebooks>,
    drawerNotebooks: [] as ReturnType<typeof buildTimeAxisNotebooks>,
    entries: [] as ReturnType<typeof decorateEntries>,
    visibleEntries: [] as ReturnType<typeof decorateEntries>,
    showEditModal: false,
    editModalVisible: false,
    editingId: '',
    form: {
      ...timeAxisViewModel.draft,
    } as TimeAxisEntryForm,
    icons: buildTimeAxisIcons(),
    pressStates: {
      notebookId: '',
      entryId: '',
      addCard: false,
      modalNotebookId: '',
      closeButton: false,
      saveButton: false,
      deleteButton: false,
      anniversary: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    const notebooks = buildTimeAxisNotebooks()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      notebooks,
      drawerNotebooks: notebooks.filter(item => item.id !== 'all'),
    })
  },

  onShow() {
    if (!ensureBootstrapReady()) {
      return
    }
    this.reloadEntries()
  },

  onUnload() {
    clearTimerBag(timers)
  },

  reloadEntries() {
    const entries = decorateEntries(readTimeAxisEntries(), this.data.notebooks)
    const visibleEntries = this.data.selectedNotebookId === 'all'
      ? entries
      : entries.filter(item => item.notebookId === this.data.selectedNotebookId)
    this.setData({ entries, visibleEntries })
  },

  handleBack() {
    handlePageBack('/features/profile/profile')
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

    pulseState(this, timers, 'notebook-press', 'pressStates.notebookId', notebookId, '')
    this.setData({ selectedNotebookId: notebookId }, () => {
      this.refreshVisibleEntries()
    })
  },

  openCreateModal() {
    pulseState(this, timers, 'add-card-press', 'pressStates.addCard', true, false, 260)
    this.openEditState({
      ...timeAxisViewModel.draft,
      notebookId: getDefaultNotebookId(this.data.selectedNotebookId),
    })
  },

  openEditModal(e: WechatMiniprogram.TouchEvent) {
    const entryId = String(e.currentTarget.dataset.id || '')
    const target = this.data.entries.find(item => item.id === entryId)
    if (!target) return

    if (target.locked) {
      wx.showToast({
        title: '这是系统自带的，去职场档案里改吧',
        icon: 'none',
      })
      return
    }

    pulseState(this, timers, 'entry-press', 'pressStates.entryId', entryId, '')
    this.openEditState(
      {
        title: target.title,
        date: target.date,
        notebookId: target.notebookId,
        isAnniversary: target.isAnniversary,
      },
      target.id,
    )
  },

  openEditState(form: TimeAxisEntryForm, editingId: string = '') {
    openModal(
      this,
      timers,
      'time-axis-modal',
      {
        show: 'showEditModal',
        visible: 'editModalVisible',
      },
      {
        editingId,
        form,
      },
    )
  },

  closeEditModal() {
    pulseState(this, timers, 'modal-close-press', 'pressStates.closeButton', true, false)
    this.setData({ editModalVisible: false })
    timers['time-axis-modal'] = setTimeout(() => {
      this.setData({
        showEditModal: false,
        editModalVisible: false,
        editingId: '',
        form: {
          ...timeAxisViewModel.draft,
          notebookId: getDefaultNotebookId(this.data.selectedNotebookId),
        },
      })
      timers['time-axis-modal'] = null
    }, 280)
  },

  stopModalTap() {},

  updateTitle(e: WechatMiniprogram.Input) {
    this.setData({ 'form.title': e.detail.value })
  },

  updateDate(e: WechatMiniprogram.CustomEvent) {
    this.setData({ 'form.date': e.detail.value })
  },

  toggleAnniversary() {
    pulseState(this, timers, 'modal-anniversary-press', 'pressStates.anniversary', true, false)
    this.setData({ 'form.isAnniversary': !this.data.form.isAnniversary })
  },

  selectModalNotebook(e: WechatMiniprogram.TouchEvent) {
    const notebookId = String(e.currentTarget.dataset.id || '')
    if (!notebookId || notebookId === 'all') return

    pulseState(this, timers, 'modal-notebook-press', 'pressStates.modalNotebookId', notebookId, '')
    this.setData({ 'form.notebookId': notebookId })
  },

  saveEntry() {
    pulseState(this, timers, 'modal-save-press', 'pressStates.saveButton', true, false, 260)
    if (!this.data.form.title.trim() || !this.data.form.date) {
      wx.showToast({
        title: 'Fill title and date',
        icon: 'none',
      })
      return
    }

    saveTimeAxisEntry(this.data.form, this.data.editingId)
    this.closeEditModal()
    this.reloadEntries()
  },

  deleteEntry() {
    if (!this.data.editingId) return
    const target = this.data.entries.find(item => item.id === this.data.editingId)
    if (target?.locked) {
      wx.showToast({
        title: '系统卡片不能删哦',
        icon: 'none',
      })
      return
    }

    pulseState(this, timers, 'modal-delete-press', 'pressStates.deleteButton', true, false, 260)
    deleteTimeAxisEntry(this.data.editingId)
    this.closeEditModal()
    this.reloadEntries()
  },
})
