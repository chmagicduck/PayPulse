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
        ? `${now().getMonth() + 1} 月摸鱼战绩概览`
        : '这个月还没开始摸鱼呢',
      summaryLabel: monthRecords.length ? '本月总计' : '暂无数据',
    }),
  })
}
