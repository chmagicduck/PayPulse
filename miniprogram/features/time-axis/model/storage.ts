import { storageKeys } from '../../../lib/constants/storage'
import { formatDateTimeIso, now } from '../../../lib/domain/date'
import { computeRetirementDate } from '../../../lib/domain/retirement'
import type {
  ProfileSettings,
  TimeAxisEntry,
  TimeAxisEntrySourceType,
  TimeAxisSystemType,
} from '../../../lib/domain/types'
import { safeGetStorage, safeSetStorage } from '../../../lib/wx/storage'

const SYSTEM_ENTRY_META: Record<
  Exclude<TimeAxisSystemType, null>,
  Pick<TimeAxisEntry, 'id' | 'title' | 'notebookId' | 'isAnniversary' | 'systemType'>
> = {
  birthday: {
    id: 'birthday',
    title: '我的破壳日',
    notebookId: 'life',
    isAnniversary: true,
    systemType: 'birthday',
  },
  'career-anniversary': {
    id: 'career-anniversary',
    title: '踏入职场的日子',
    notebookId: 'career',
    isAnniversary: true,
    systemType: 'career-anniversary',
  },
  'retirement-day': {
    id: 'retirement-day',
    title: '重获自由的退休日',
    notebookId: 'career',
    isAnniversary: false,
    systemType: 'retirement-day',
  },
}

function resolveEntrySourceType(entry: Partial<TimeAxisEntry>): TimeAxisEntrySourceType {
  if (entry.sourceType === 'system' || entry.sourceType === 'user') {
    return entry.sourceType
  }

  if (entry.id === 'birthday' || entry.id === 'career-anniversary' || entry.id === 'retirement-day') {
    return 'system'
  }

  return 'user'
}

function resolveEntrySystemType(entry: Partial<TimeAxisEntry>): TimeAxisSystemType {
  if (
    entry.systemType === 'birthday'
    || entry.systemType === 'career-anniversary'
    || entry.systemType === 'retirement-day'
  ) {
    return entry.systemType
  }

  switch (entry.id) {
    case 'birthday':
      return 'birthday'
    case 'career-anniversary':
      return 'career-anniversary'
    case 'retirement-day':
      return 'retirement-day'
    default:
      return null
  }
}

function normalizeStoredEntry(entry: Partial<TimeAxisEntry>): TimeAxisEntry {
  const sourceType = resolveEntrySourceType(entry)
  const systemType = resolveEntrySystemType(entry)
  const systemMeta = systemType ? SYSTEM_ENTRY_META[systemType] : null
  const stamp = entry.updatedAt || entry.createdAt || formatDateTimeIso(now())

  return {
    id: String(entry.id || `time-axis-${Date.now()}`),
    title: String(entry.title || systemMeta?.title || ''),
    date: String(entry.date || ''),
    notebookId: (entry.notebookId || systemMeta?.notebookId || 'commemorative') as TimeAxisEntry['notebookId'],
    isAnniversary: typeof entry.isAnniversary === 'boolean'
      ? entry.isAnniversary
      : Boolean(systemMeta?.isAnniversary),
    sourceType,
    systemType,
    locked: typeof entry.locked === 'boolean' ? entry.locked : sourceType === 'system',
    createdAt: entry.createdAt || stamp,
    updatedAt: entry.updatedAt || stamp,
  }
}

function buildDefaultEntries(settings: ProfileSettings): TimeAxisEntry[] {
  const stamp = formatDateTimeIso(now())
  const retirementDate = computeRetirementDate(settings.retirementProfile, settings.birthday)

  return [
    {
      id: SYSTEM_ENTRY_META.birthday.id,
      title: SYSTEM_ENTRY_META.birthday.title,
      date: settings.birthday,
      notebookId: SYSTEM_ENTRY_META.birthday.notebookId,
      isAnniversary: SYSTEM_ENTRY_META.birthday.isAnniversary,
      sourceType: 'system',
      systemType: SYSTEM_ENTRY_META.birthday.systemType,
      locked: true,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: SYSTEM_ENTRY_META['career-anniversary'].id,
      title: SYSTEM_ENTRY_META['career-anniversary'].title,
      date: settings.careerStartDate,
      notebookId: SYSTEM_ENTRY_META['career-anniversary'].notebookId,
      isAnniversary: SYSTEM_ENTRY_META['career-anniversary'].isAnniversary,
      sourceType: 'system',
      systemType: SYSTEM_ENTRY_META['career-anniversary'].systemType,
      locked: true,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: SYSTEM_ENTRY_META['retirement-day'].id,
      title: SYSTEM_ENTRY_META['retirement-day'].title,
      date: `${retirementDate.getFullYear()}-${String(retirementDate.getMonth() + 1).padStart(2, '0')}-${String(retirementDate.getDate()).padStart(2, '0')}`,
      notebookId: SYSTEM_ENTRY_META['retirement-day'].notebookId,
      isAnniversary: SYSTEM_ENTRY_META['retirement-day'].isAnniversary,
      sourceType: 'system',
      systemType: SYSTEM_ENTRY_META['retirement-day'].systemType,
      locked: true,
      createdAt: stamp,
      updatedAt: stamp,
    },
  ]
}

export function readTimeAxisEntries() {
  const entries = safeGetStorage<Partial<TimeAxisEntry>[]>(storageKeys.timeAxisEntries, [])
  const normalized = entries.map(normalizeStoredEntry)
  const changed = JSON.stringify(entries) !== JSON.stringify(normalized)

  if (changed) {
    safeSetStorage(storageKeys.timeAxisEntries, normalized)
  }

  return normalized
}

export function writeTimeAxisEntries(entries: TimeAxisEntry[]) {
  safeSetStorage(storageKeys.timeAxisEntries, entries.map(normalizeStoredEntry))
}

export function ensureDefaultTimeAxisEntries(settings: ProfileSettings) {
  const current = readTimeAxisEntries()
  const seededEntries = buildDefaultEntries(settings)
  if (!current.length) {
    writeTimeAxisEntries(seededEntries)
    return seededEntries
  }

  const entryMap = current.reduce<Record<string, TimeAxisEntry>>((result, entry) => {
    result[entry.id] = entry
    return result
  }, {})

  seededEntries.forEach(seed => {
    const currentEntry = entryMap[seed.id]
    entryMap[seed.id] = currentEntry
      ? normalizeStoredEntry(Object.assign({}, currentEntry, {
          title: seed.title,
          date: seed.date,
          notebookId: seed.notebookId,
          isAnniversary: seed.isAnniversary,
          sourceType: 'system',
          systemType: seed.systemType,
          locked: true,
          updatedAt: seed.updatedAt,
        }))
      : seed
  })

  const next = Object.values(entryMap).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  writeTimeAxisEntries(next)
  return next
}
