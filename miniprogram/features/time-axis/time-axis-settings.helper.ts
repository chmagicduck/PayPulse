import {
  animatedIconPair,
  icon,
  type IconImagePair,
  type IconName,
  type SvgAnimationPreset,
} from '../../lib/icons'
import type { TimeAxisEntry } from '../../lib/domain/types'
import { timeAxisModel } from './model'

type NotebookItem = (typeof timeAxisModel.notebooks)[number]
type StaticEntry = Pick<
  TimeAxisEntry,
  'id' | 'title' | 'date' | 'notebookId' | 'isAnniversary' | 'sourceType' | 'systemType' | 'locked'
>

type RuntimeNotebook = NotebookItem & {
  iconPair: IconImagePair
}

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

function getToneColor(tone: string) {
  switch (tone) {
    case 'rose':
      return '#f43f5e'
    case 'amber':
      return '#f59e0b'
    case 'blue':
      return '#2563eb'
    case 'indigo':
      return '#4f46e5'
    default:
      return '#94a3b8'
  }
}

function getIconAnimation(name: IconName): SvgAnimationPreset {
  switch (name) {
    case 'heart':
      return 'pulse'
    case 'map':
      return 'drift'
    case 'user':
      return 'bounce'
    case 'briefcase':
      return 'float'
    default:
      return 'float'
  }
}

export function getDefaultNotebookId(selectedNotebookId: string) {
  return selectedNotebookId && selectedNotebookId !== 'all'
    ? selectedNotebookId
    : timeAxisModel.draft.notebookId
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

export function buildTimeAxisNotebooks() {
  return timeAxisModel.notebooks.map(item => ({
    ...item,
    iconPair: animatedIconPair(item.iconId as IconName, {
      color: getToneColor(item.tone),
      size: 18,
      animation: getIconAnimation(item.iconId as IconName),
      durationMs: 2400,
    }),
  }))
}

export function decorateEntry(entry: StaticEntry, notebooks: RuntimeNotebook[]) {
  const notebook = notebooks.find(item => item.id === entry.notebookId)
  const countdown = buildCountdown(entry.date, entry.isAnniversary)

  return {
    ...entry,
    dateText: formatDate(entry.date),
    notebookName: notebook?.name || '',
    notebookTone: notebook?.tone || 'slate',
    iconSrc: icon(notebook?.iconId as IconName || 'layers', getToneColor(notebook?.tone || 'slate'), 20),
    tone: notebook?.tone || 'slate',
    ...countdown,
  }
}

export function decorateEntries(entries: readonly StaticEntry[], notebooks: RuntimeNotebook[]) {
  return entries.map(entry => decorateEntry(entry, notebooks))
}

export function buildTimeAxisIcons() {
  return {
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
  } as {
    chevronLeft: string
    close: string
    calendar: string
    trash2: string
    addPair: IconImagePair
    emptyPair: IconImagePair
  }
}
