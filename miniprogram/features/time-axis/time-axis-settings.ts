import { timeAxisModel } from './model'
import {
  buildTimeAxisIcons,
  buildTimeAxisNotebooks,
  decorateEntries,
  decorateEntry,
  getDefaultNotebookId,
} from './time-axis-settings.helper'
import { clearTimerBag, createTimerBag, handlePageBack, openModal, pulseState } from '../../lib/wx/page'

const timers = createTimerBag()
type FormState = {
  title: string
  date: string
  notebookId: string
  isAnniversary: boolean
}

Page({
  data: {
    vm: timeAxisModel,
    statusBarHeight: 0,
    selectedNotebookId: timeAxisModel.notebooks[0].id as string,
    notebooks: [] as ReturnType<typeof buildTimeAxisNotebooks>,
    drawerNotebooks: [] as ReturnType<typeof buildTimeAxisNotebooks>,
    entries: [] as ReturnType<typeof decorateEntries>,
    visibleEntries: [] as ReturnType<typeof decorateEntries>,
    showEditModal: false,
    editModalVisible: false,
    editingId: '',
    form: {
      ...timeAxisModel.draft,
    } as FormState,
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
    const entries = decorateEntries(timeAxisModel.entries, notebooks)

    this.setData({
      statusBarHeight: statusBarHeight || 0,
      notebooks,
      drawerNotebooks: notebooks.filter(item => item.id !== 'all'),
      entries,
      visibleEntries: entries,
    })
  },

  onUnload() {
    clearTimerBag(timers)
  },

  handleBack() {
    handlePageBack('/features/profile/home')
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
      ...timeAxisModel.draft,
      notebookId: getDefaultNotebookId(this.data.selectedNotebookId),
    })
  },

  openEditModal(e: WechatMiniprogram.TouchEvent) {
    const entryId = String(e.currentTarget.dataset.id || '')
    const target = this.data.entries.find(item => item.id === entryId)
    if (!target) return

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

  openEditState(form: FormState, editingId: string = '') {
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
          ...timeAxisModel.draft,
          notebookId: getDefaultNotebookId(this.data.selectedNotebookId),
        },
      })
      timers['time-axis-modal'] = null
    }, 280)
  },

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
    if (!this.data.form.title || !this.data.form.date) return

    const entry = {
      id: this.data.editingId || `time-axis-${Date.now()}`,
      title: String(this.data.form.title),
      date: String(this.data.form.date),
      notebookId: String(this.data.form.notebookId),
      isAnniversary: Boolean(this.data.form.isAnniversary),
    }

    const nextEntry = decorateEntry(entry, this.data.notebooks)
    const entries = this.data.editingId
      ? this.data.entries.map(item => (item.id === this.data.editingId ? nextEntry : item))
      : [nextEntry, ...this.data.entries]

    this.setData({ entries }, () => {
      this.refreshVisibleEntries()
      this.closeEditModal()
    })
  },

  deleteEntry() {
    if (!this.data.editingId) return

    pulseState(this, timers, 'modal-delete-press', 'pressStates.deleteButton', true, false, 260)
    this.setData({
      entries: this.data.entries.filter(item => item.id !== this.data.editingId),
    }, () => {
      this.refreshVisibleEntries()
      this.closeEditModal()
    })
  },
})
