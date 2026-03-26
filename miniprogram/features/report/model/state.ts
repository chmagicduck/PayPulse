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
        ? `${now().getMonth() + 1}月每日航行概览`
        : `近 ${state.trend.bars.length} 日航行概览`,
      summaryLabel: monthRecords.length
        ? '本月总计'
        : `近 ${state.trend.bars.length} 日总计`,
    }),
  })
}
