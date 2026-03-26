import { formatDateTimeIso, now } from '../../../lib/domain/date'
import type { TimeAxisEntry } from '../../../lib/domain/types'
import type { TimeAxisEntryForm } from './types'
import { readTimeAxisEntries, writeTimeAxisEntries } from './storage'

export function saveTimeAxisEntry(form: TimeAxisEntryForm, editingId: string = '') {
  const entries = readTimeAxisEntries()
  const stamp = formatDateTimeIso(now())
  const entry: TimeAxisEntry = {
    id: editingId || `time-axis-${Date.now()}`,
    title: String(form.title),
    date: String(form.date),
    notebookId: form.notebookId as TimeAxisEntry['notebookId'],
    isAnniversary: Boolean(form.isAnniversary),
    createdAt: editingId
      ? entries.find(item => item.id === editingId)?.createdAt || stamp
      : stamp,
    updatedAt: stamp,
  }

  const nextEntries = editingId
    ? entries.map(item => (item.id === editingId ? entry : item))
    : [entry, ...entries]

  writeTimeAxisEntries(nextEntries)
  return nextEntries
}

export function deleteTimeAxisEntry(id: string) {
  const nextEntries = readTimeAxisEntries().filter(item => item.id !== id)
  writeTimeAxisEntries(nextEntries)
  return nextEntries
}
