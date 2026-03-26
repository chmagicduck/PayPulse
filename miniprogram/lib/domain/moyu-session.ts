import { storageKeys } from '../constants/storage'
import { safeGetStorage, safeRemoveStorage, safeSetStorage } from '../wx/storage'
import { addDailyRecordDuration, getWorkdayTimeline, readDailyRecordMap } from './daily-records'
import { formatDateTimeIso, now, parseDateString, toDateKey } from './date'
import type { MoyuSession, ProfileSettings } from './types'

function createIdleSession(): MoyuSession {
  return {
    sessionId: '',
    status: 'idle',
    date: '',
    startedAt: null,
    lastTickAt: null,
    accumulatedDurationSec: 0,
    stopReason: null,
  }
}

export function readMoyuSession() {
  const session = safeGetStorage<Partial<MoyuSession> | null>(storageKeys.moyuSession, null)
  if (!session) {
    return createIdleSession()
  }

  return {
    sessionId: String(session.sessionId || ''),
    status: session.status === 'active' || session.status === 'auto-stopped' ? session.status : 'idle',
    date: String(session.date || ''),
    startedAt: session.startedAt || null,
    lastTickAt: session.lastTickAt || null,
    accumulatedDurationSec: Math.max(0, Math.round(Number(session.accumulatedDurationSec) || 0)),
    stopReason: session.stopReason || null,
  } satisfies MoyuSession
}

export function writeMoyuSession(session: MoyuSession) {
  safeSetStorage(storageKeys.moyuSession, session)
}

export function clearMoyuSession() {
  safeRemoveStorage(storageKeys.moyuSession)
}

export function startMoyuSession(targetDate: Date = now()) {
  const stamp = formatDateTimeIso(targetDate)
  const session: MoyuSession = {
    sessionId: `moyu-${targetDate.getTime()}`,
    status: 'active',
    date: toDateKey(targetDate),
    startedAt: stamp,
    lastTickAt: stamp,
    accumulatedDurationSec: 0,
    stopReason: null,
  }

  writeMoyuSession(session)
  return session
}

function finalizeSession(
  session: MoyuSession,
  settings: ProfileSettings,
  stopReason: MoyuSession['stopReason'],
  shouldPersistStopped: boolean,
) {
  if (session.accumulatedDurationSec > 0 || readDailyRecordMap()[session.date]) {
    addDailyRecordDuration(session.date, session.accumulatedDurationSec, settings)
  }

  const nextSession: MoyuSession = {
    ...session,
    status: shouldPersistStopped ? 'auto-stopped' : 'idle',
    stopReason,
    sessionId: shouldPersistStopped ? session.sessionId : '',
    startedAt: shouldPersistStopped ? session.startedAt : null,
    lastTickAt: shouldPersistStopped ? session.lastTickAt : null,
    accumulatedDurationSec: shouldPersistStopped ? session.accumulatedDurationSec : 0,
  }

  writeMoyuSession(nextSession)
  return nextSession
}

export function syncMoyuSession(
  settings: ProfileSettings,
  currentTime: Date = now(),
  options: {
    persistStopped?: boolean
  } = {},
) {
  const session = readMoyuSession()
  if (session.status !== 'active' || !session.lastTickAt || !session.date) {
    return session
  }

  const lastTickAt = new Date(session.lastTickAt)
  const timeline = getWorkdayTimeline(parseDateString(session.date), settings)
  const boundaryCandidates = [
    timeline.lunchStartAt,
    timeline.endAt,
  ].filter((value): value is Date => !!value && value.getTime() > lastTickAt.getTime())
  const sameDate = toDateKey(currentTime) === session.date
  const nextBoundary = boundaryCandidates.find(value => value.getTime() <= currentTime.getTime()) || null

  if (!sameDate) {
    const stopAt = timeline.endAt.getTime() > lastTickAt.getTime() ? timeline.endAt : lastTickAt
    const deltaSec = Math.max(0, Math.round((stopAt.getTime() - lastTickAt.getTime()) / 1000))
    const nextSession: MoyuSession = {
      ...session,
      accumulatedDurationSec: session.accumulatedDurationSec + deltaSec,
      lastTickAt: formatDateTimeIso(stopAt),
    }

    return finalizeSession(
      nextSession,
      settings,
      nextBoundary && timeline.lunchStartAt && nextBoundary.getTime() === timeline.lunchStartAt.getTime()
        ? 'cross-lunch'
        : 'off-duty',
      options.persistStopped ?? true,
    )
  }

  if (nextBoundary) {
    const deltaSec = Math.max(0, Math.round((nextBoundary.getTime() - lastTickAt.getTime()) / 1000))
    const nextSession: MoyuSession = {
      ...session,
      accumulatedDurationSec: session.accumulatedDurationSec + deltaSec,
      lastTickAt: formatDateTimeIso(nextBoundary),
    }

    return finalizeSession(
      nextSession,
      settings,
      timeline.lunchStartAt && nextBoundary.getTime() === timeline.lunchStartAt.getTime()
        ? 'cross-lunch'
        : 'off-duty',
      options.persistStopped ?? true,
    )
  }

  const deltaSec = Math.max(0, Math.round((currentTime.getTime() - lastTickAt.getTime()) / 1000))
  const nextSession: MoyuSession = {
    ...session,
    accumulatedDurationSec: session.accumulatedDurationSec + deltaSec,
    lastTickAt: formatDateTimeIso(currentTime),
  }

  writeMoyuSession(nextSession)
  return nextSession
}

export function stopMoyuSession(settings: ProfileSettings, stopReason: MoyuSession['stopReason'], currentTime: Date = now()) {
  const session = syncMoyuSession(settings, currentTime, {
    persistStopped: false,
  })

  if (session.status === 'active') {
    return finalizeSession(
      {
        ...session,
        status: 'active',
      },
      settings,
      stopReason,
      false,
    )
  }

  return session
}

export function recoverStaleMoyuSession(settings: ProfileSettings) {
  const session = readMoyuSession()
  if (session.status !== 'active') {
    return session
  }

  return finalizeSession(session, settings, 'cold-start-recover', true)
}
