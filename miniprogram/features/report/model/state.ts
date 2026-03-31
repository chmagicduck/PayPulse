import { buildReportViewState, listDailyRecords } from '../../../lib/domain/daily-records'
import { now, toDateKey } from '../../../lib/domain/date'
import { readProfileSettings } from '../../profile-settings/model/storage'

export function buildReportRuntimeState() {
  const state = buildReportViewState(readProfileSettings())
  const monthKey = toDateKey(now()).slice(0, 7)
  const monthRecords = listDailyRecords().filter(item => item.date.startsWith(monthKey))
  const trendDayCount = state.trend.bars.length

  return Object.assign({}, state, {
    trend: Object.assign({}, state.trend, {
      subtitle: trendDayCount
        ? `${now().getMonth() + 1} 月工作日摸鱼概览`
        : (monthRecords.length ? '本月暂时还没有可统计的工作日' : '这个月还没开始记录呢'),
      summaryLabel: trendDayCount ? '本月总计' : '暂无数据',
    }),
  })
}
