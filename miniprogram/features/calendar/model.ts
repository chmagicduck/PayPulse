// 这里预置了 2026 年官方节假日样例月份，后续正式阶段会演进为可计算的完整日历模型。
// 节假日安排依据国务院办公厅 2025 年 11 月 5 日发布的 2026 年部分节假日安排通知。
export const calendarStaticViewModel = {
  title: '日历',
  months: [
    {
      key: '2026-09',
      title: '2026 九月',
      reminder: '距离国庆长假还有 6 天，舵手请继续坚持。',
      year: '2026',
      monthLabel: '九月',
      offset: 2,
      days: [
        { day: '1' }, { day: '2' }, { day: '3' }, { day: '4' }, { day: '5' }, { day: '6' }, { day: '7' },
        { day: '8' }, { day: '9' }, { day: '10', status: 'payday', badge: '薪' }, { day: '11' }, { day: '12' }, { day: '13', status: 'weekend', badge: '休' }, { day: '14', status: 'weekend', badge: '休' },
        { day: '15' }, { day: '16' }, { day: '17' }, { day: '18' }, { day: '19' }, { day: '20', status: 'makeup', badge: '班' }, { day: '21' },
        { day: '22' }, { day: '23' }, { day: '24' }, { day: '25', status: 'holiday', badge: '秋' }, { day: '26', status: 'holiday', badge: '秋' }, { day: '27', status: 'holiday', badge: '秋' }, { day: '28' },
        { day: '29' }, { day: '30' },
      ],
      detailMap: {
        default: {
          title: '正常航行模式',
          desc: '当前海域风平浪静，适合稳定航行与日常推进。',
        },
        holiday: {
          title: '法定摸鱼港',
          desc: '当前日期位于官方节假日区间，适合休整与庆祝。',
        },
        payday: {
          title: '宝藏日：薪水到账',
          desc: '检测到账户有大额能量补充，建议今日适当提高摸鱼质量。',
        },
        makeup: {
          title: '强力补班中',
          desc: '今天属于官方调休补班日，节奏会比普通工作日更紧凑。',
        },
      },
    },
    {
      key: '2026-10',
      title: '2026 十月',
      reminder: '距离下一次发薪日还有 10 天，继续稳住节奏。',
      year: '2026',
      monthLabel: '十月',
      offset: 4,
      days: [
        { day: '1', status: 'holiday', badge: '庆' }, { day: '2', status: 'holiday', badge: '庆' }, { day: '3', status: 'holiday', badge: '庆' }, { day: '4', status: 'holiday', badge: '庆' }, { day: '5', status: 'holiday', badge: '庆' }, { day: '6', status: 'holiday', badge: '庆' }, { day: '7', status: 'holiday', badge: '庆' },
        { day: '8' }, { day: '9' }, { day: '10', status: 'makeup', badge: '班' }, { day: '11', status: 'weekend', badge: '休' }, { day: '12' }, { day: '13' }, { day: '14' },
        { day: '15' }, { day: '16' }, { day: '17', status: 'weekend', badge: '休' }, { day: '18', status: 'weekend', badge: '休' }, { day: '19' }, { day: '20' }, { day: '21' },
        { day: '22' }, { day: '23' }, { day: '24', status: 'weekend', badge: '休' }, { day: '25', status: 'weekend', badge: '休' }, { day: '26' }, { day: '27' }, { day: '28' },
        { day: '29' }, { day: '30' }, { day: '31', status: 'weekend', badge: '休' },
      ],
      detailMap: {
        default: {
          title: '正常航行模式',
          desc: '当前海域风平浪静，适合稳定航行与日常推进。',
        },
        holiday: {
          title: '国庆长假中',
          desc: '当前日期位于 2026 年国庆法定假期区间，适合放松与出游。',
        },
        payday: {
          title: '宝藏日：薪水到账',
          desc: '薪资节点已到，适合回顾本月航行收获。',
        },
        makeup: {
          title: '强力补班中',
          desc: '今天属于 2026 年国庆调休补班日，请注意工作节奏切换。',
        },
      },
    },
  ],
  weekLabels: ['日', '一', '二', '三', '四', '五', '六'],
} as const
