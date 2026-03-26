import { storageKeys } from '../../../lib/constants/storage'
import { formatDateTimeIso, now } from '../../../lib/domain/date'
import type { ProfileSettings, TimeAxisEntry } from '../../../lib/domain/types'
import { safeGetStorage, safeSetStorage } from '../../../lib/wx/storage'

function buildDefaultEntries(settings: ProfileSettings): TimeAxisEntry[] {
  const stamp = formatDateTimeIso(now())
  const birthday = new Date(settings.birthday)
  const retirementDate = new Date(birthday.getFullYear() + settings.retirementAge, birthday.getMonth(), birthday.getDate())

  return [
    {
      id: 'birthday',
      title: '我的生日',
      date: settings.birthday,
      notebookId: 'life',
      isAnniversary: true,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'career-anniversary',
      title: '入职纪念日',
      date: settings.careerStartDate,
      notebookId: 'career',
      isAnniversary: true,
      createdAt: stamp,
      updatedAt: stamp,
    },
    {
      id: 'retirement-day',
      title: '退休日',
      date: `${retirementDate.getFullYear()}-${String(retirementDate.getMonth() + 1).padStart(2, '0')}-${String(retirementDate.getDate()).padStart(2, '0')}`,
      notebookId: 'career',
      isAnniversary: false,
      createdAt: stamp,
      updatedAt: stamp,
    },
  ]
}

export function readTimeAxisEntries() {
  return safeGetStorage<TimeAxisEntry[]>(storageKeys.timeAxisEntries, [])
}

export function writeTimeAxisEntries(entries: TimeAxisEntry[]) {
  safeSetStorage(storageKeys.timeAxisEntries, entries)
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
      ? Object.assign({}, currentEntry, {
          title: seed.title,
          date: seed.date,
          notebookId: seed.notebookId,
          isAnniversary: seed.isAnniversary,
          updatedAt: seed.updatedAt,
        })
      : seed
  })

  const next = Object.values(entryMap).sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  writeTimeAxisEntries(next)
  return next
}
