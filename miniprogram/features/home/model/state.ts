import { buildTodayDashboardState } from '../../../lib/domain/daily-records'
import { readCurrentLabProgress } from '../../lab/model/actions'
import { readProfileSettings } from '../../profile-settings/model/storage'
import { readTimeAxisEntries } from '../../time-axis/model/storage'

export function buildHomeDashboardRuntimeState() {
  const settings = readProfileSettings()
  const timeAxisEntries = readTimeAxisEntries()
  const labProgress = readCurrentLabProgress()
  const completedTasks = labProgress.tasks.filter(item => item.count >= item.limit).length

  return buildTodayDashboardState(settings, timeAxisEntries, completedTasks, labProgress.tasks.length)
}
