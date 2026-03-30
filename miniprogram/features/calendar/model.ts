// 这里预置了 2026 年官方节假日样例月份，后续正式阶段会演进为可计算的完整日历模型。
// 节假日安排依据国务院办公厅 2025 年 11 月 5 日发布的 2026 年部分节假日安排通知。
export const calendarStaticViewModel = {
  title: '打工日历',
  months: [
    {
      key: '2026-09',
      title: '2026 九月',
      reminder: '距离国庆长假还有 6 天，挺住。',
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
          title: '日常搬砖模式',
          desc: '风平浪静的工作日，适合老老实实摸鱼。',
        },
        holiday: {
          title: '法定快乐日',
          desc: '现在是国家规定的假期，尽情玩耍吧！',
        },
        payday: {
          title: '宝藏日：工资到账',
          desc: '今天老板发钱了，中午给自己加个鸡腿。',
        },
        makeup: {
          title: '苦逼补班中',
          desc: '今天可是调休补班日，少干点活，多摸会儿鱼。',
        },
      },
    },
    {
      key: '2026-10',
      title: '2026 十月',
      reminder: '距离下一次发工资还有 10 天，稳住我们能赢。',
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
          title: '日常搬砖模式',
          desc: '平平无奇的工作日，请继续你的摸鱼表演。',
        },
        holiday: {
          title: '国庆长假中',
          desc: '别看手机了，好好享受难得的长假吧。',
        },
        payday: {
          title: '宝藏日：工资到账',
          desc: '来钱了！快看看工资条上的数字。',
        },
        makeup: {
          title: '苦逼补班中',
          desc: '长假过后的连轴转，请开启最高级别摸鱼模式。',
        },
      },
    },
  ],
  weekLabels: ['日', '一', '二', '三', '四', '五', '六'],
} as const
