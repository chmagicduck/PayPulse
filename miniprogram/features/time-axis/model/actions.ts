import { formatDateTimeIso, now } from '../../../lib/domain/date'
import type { TimeAxisEntry } from '../../../lib/domain/types'
import type { TimeAxisEntryForm } from './types'
import { readTimeAxisEntries, writeTimeAxisEntries } from './storage'

export function saveTimeAxisEntry(form: TimeAxisEntryForm, editingId: string = '') {
  const entries = readTimeAxisEntries()
  const currentEntry = editingId ? entries.find(item => item.id === editingId) : null
  if (currentEntry?.locked) {
    return entries
  }

  const stamp = formatDateTimeIso(now())
  const entry: TimeAxisEntry = {
    id: editingId || `time-axis-${Date.now()}`,
    title: String(form.title),
    date: String(form.date),
    notebookId: form.notebookId as TimeAxisEntry['notebookId'],
    isAnniversary: Boolean(form.isAnniversary),
    sourceType: currentEntry?.sourceType || 'user',
    systemType: currentEntry?.systemType || null,
    locked: currentEntry?.locked || false,
    createdAt: editingId
      ? currentEntry?.createdAt || stamp
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
  const entries = readTimeAxisEntries()
  if (entries.find(item => item.id === id)?.locked) {
    return entries
  }

  const nextEntries = entries.filter(item => item.id !== id)
  writeTimeAxisEntries(nextEntries)
  return nextEntries
}
