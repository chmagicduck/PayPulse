import { buildTodayDashboardState, getWorkdayTimeline } from '../../../lib/domain/daily-records'
import { formatDurationHMS } from '../../../lib/domain/format'
import { now } from '../../../lib/domain/date'
import { syncMoyuSession } from '../../../lib/domain/moyu-session'
import { readCurrentLabProgress } from '../../lab/model/actions'
import { readProfileSettings } from '../../profile-settings/model/storage'
import { readTimeAxisEntries } from '../../time-axis/model/storage'

function getHomeStatusLabel(settings: ReturnType<typeof readProfileSettings>, targetTime: Date) {
  const timeline = getWorkdayTimeline(targetTime, settings)

  if (timeline.scheduledWorkDurationSec <= 0) {
    return {
      key: 'rest-day',
      leftValue: '充电中',
      allowStart: false,
    }
  }

  if (targetTime.getTime() < timeline.startAt.getTime()) {
    return {
      key: 'pre-work',
      leftValue: '待启航',
      allowStart: false,
    }
  }

  if (
    timeline.lunchStartAt
    && timeline.lunchEndAt
    && targetTime.getTime() >= timeline.lunchStartAt.getTime()
    && targetTime.getTime() < timeline.lunchEndAt.getTime()
  ) {
    return {
      key: 'lunch-break',
      leftValue: '午休中',
      allowStart: false,
    }
  }

  if (targetTime.getTime() >= timeline.endAt.getTime()) {
    return {
      key: 'off-duty',
      leftValue: '已离岗',
      allowStart: false,
    }
  }

  return {
    key: 'working',
    leftValue: formatDurationHMS(Math.max(0, Math.round((timeline.endAt.getTime() - targetTime.getTime()) / 1000))),
    allowStart: true,
  }
}

export function buildHomeDashboardRuntimeState() {
  const settings = readProfileSettings()
  const timeAxisEntries = readTimeAxisEntries()
  const labProgress = readCurrentLabProgress()
  const currentTime = now()
  const syncedSession = syncMoyuSession(settings, currentTime)
  const completedTasks = labProgress.tasks.filter(item => item.count >= item.limit).length
  const runtimeState = buildTodayDashboardState(settings, timeAxisEntries, completedTasks, labProgress.tasks.length, {
    targetDateTime: currentTime,
    activeMoyuDurationSec: syncedSession.status === 'active' ? syncedSession.accumulatedDurationSec : 0,
  })
  const homeStatus = getHomeStatusLabel(settings, currentTime)

  return {
    ...runtimeState,
    timer: {
      ...runtimeState.timer,
      leftValue: homeStatus.leftValue,
    },
    session: syncedSession,
    homeStatus,
    isMoYu: syncedSession.status === 'active',
    moyuButtonText: syncedSession.status === 'active' ? '结束摸鱼' : '开启摸鱼',
  }
}
