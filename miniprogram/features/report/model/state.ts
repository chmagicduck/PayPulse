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
        ? `${now().getMonth() + 1} 月每日真实避风概览`
        : '当前月份暂无真实记录',
      summaryLabel: monthRecords.length ? '本月总计' : '暂无汇总',
    }),
  })
}
