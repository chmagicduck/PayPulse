import { buildTodayDashboardState, getWorkdayTimeline } from '../../../lib/domain/daily-records'
import { buildDailyMoyuTaskBadgeText, buildDailyMoyuTaskIconPair, DAILY_MOYU_TASKS } from '../../../lib/domain/lab-tasks'
import { now } from '../../../lib/domain/date'
import { syncMoyuSession } from '../../../lib/domain/moyu-session'
import { readCurrentLabProgress } from '../../lab/model/actions'
import { readProfileSettings } from '../../profile-settings/model/storage'
import { readTimeAxisEntries } from '../../time-axis/model/storage'
import type { HomeViewModel } from './index'

type HomeDashboardRuntimeBase = Omit<HomeViewModel, 'homeStatus'>

function getHomeStatus(
  settings: ReturnType<typeof readProfileSettings>,
  targetTime: Date,
): HomeViewModel['homeStatus'] {
  const timeline = getWorkdayTimeline(targetTime, settings)

  if (timeline.scheduledWorkDurationSec <= 0) {
    return {
      key: 'rest-day',
      allowStart: false,
    }
  }

  if (targetTime.getTime() < timeline.startAt.getTime()) {
    return {
      key: 'pre-work',
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
      allowStart: false,
    }
  }

  if (targetTime.getTime() >= timeline.endAt.getTime()) {
    return {
      key: 'off-duty',
      allowStart: false,
    }
  }

  return {
    key: 'working',
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
  const remainingTaskReward = labProgress.tasks.reduce(
    (total, item) => total + Math.max(0, item.limit - item.count) * item.rewardPoints,
    0,
  )
  const dailyTasks = DAILY_MOYU_TASKS.map(task => {
    const progressTask = labProgress.tasks.find(item => item.taskId === task.id)
    const count = progressTask?.count || 0
    const done = count >= task.limit

    return {
      id: task.id,
      title: task.title,
      desc: task.desc,
      reward: task.reward,
      tone: task.tone,
      badgeText: buildDailyMoyuTaskBadgeText(task.reward, done),
      iconSrc: buildDailyMoyuTaskIconPair(task).staticSrc,
      count,
      limit: task.limit,
      countText: `${count}/${task.limit}`,
      progressPercent: Math.round((count / task.limit) * 100),
      done,
      rotate: 'rotate' in task ? task.rotate : false,
      minusActionKey: `${task.id}:minus`,
      plusActionKey: `${task.id}:plus`,
    }
  })
  const runtimeState = buildTodayDashboardState(
    settings,
    timeAxisEntries,
    completedTasks,
    labProgress.tasks.length,
    remainingTaskReward,
    {
      targetDateTime: currentTime,
      activeMoyuDurationSec: syncedSession.status === 'active' ? syncedSession.accumulatedDurationSec : 0,
    },
  ) as unknown as HomeDashboardRuntimeBase
  const homeStatus = getHomeStatus(settings, currentTime)

  return {
    ...runtimeState,
    dailyTasks,
    homeStatus,
    isMoYu: syncedSession.status === 'active',
  }
}
