import { buildReportViewState, listDailyRecords } from '../../../lib/domain/daily-records'
import { now, toDateKey } from '../../../lib/domain/date'
import { readProfileSettings } from '../../profile-settings/model/storage'

export function buildReportRuntimeState() {
  const state = buildReportViewState(readProfileSettings())
  const monthKey = toDateKey(now()).slice(0, 7)
  const monthRecords = listDailyRecords().filter(item => item.date.startsWith(monthKey))

  return Object.assign({}, state, {
    trend: Object.assign({}, state.trend, {
      subtitle: monthRecords.length
        ? `M${now().getMonth() + 1} Daily Voyage`
        : `Recent ${state.trend.bars.length} Days`,
      summaryLabel: monthRecords.length
        ? 'Month Total'
        : `Recent ${state.trend.bars.length}d Total`,
    }),
  })
}
