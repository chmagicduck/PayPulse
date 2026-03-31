export const reportViewModel = {
  trend: {
    subtitle: '本月工作日摸鱼概览',
    summaryLabel: '本月总计',
    riseText: '+12.5%',
    bars: [
      { day: '1', incomeHeight: '32%', durationHeight: '26%', incomeText: '¥24', durationText: '1.2h', isIncomeEmpty: false, isDurationEmpty: false },
      { day: '2', incomeHeight: '0%', durationHeight: '0%', incomeText: '¥0', durationText: '0.0h', isIncomeEmpty: true, isDurationEmpty: true },
      { day: '3', incomeHeight: '46%', durationHeight: '34%', incomeText: '¥35', durationText: '1.7h', isIncomeEmpty: false, isDurationEmpty: false },
    ],
    summary: {
      incomeTotal: '¥1,824',
      durationTotal: '42.5h',
    },
  },
  annualCards: [
    { key: 'moyuIncome', title: '累计摸鱼收益', value: '¥12,480.50', tone: 'indigo', iconName: 'coins', badgeText: '累计摸鱼收益', desc: '所有摸鱼时长折算出的累计收益。' },
    { key: 'moyuDays', title: '累计摸鱼天数', value: '248 天', tone: 'amber', iconName: 'calendar-days', badgeText: '累计摸鱼天数', desc: '只要当天摸过鱼，就记作 1 天。' },
    { key: 'currentJobSalary', title: '当前工作累计工资', value: '¥38,420.00', tone: 'blue', iconName: 'wallet', badgeText: '当前工作累计工资', desc: '从当前工作入职起累计的应发工资。' },
    { key: 'currentJobCompensation', title: '当前工作预计赔偿金', value: '¥27,000.00', tone: 'rose', iconName: 'briefcase', badgeText: '当前工作预计赔偿金', desc: '按当前工龄套用 N+1 的估算值。' },
  ],
  annualInfoMap: {
    moyuIncome: {
      title: '累计摸鱼收益',
      rule: '基于全部摸鱼记录，按每个工作日对应的秒薪累计计算。',
      details: [
        { label: '累计摸鱼收益', value: '¥12,480.50' },
        { label: '累计摸鱼时长', value: '312小时18分' },
      ],
    },
    moyuDays: {
      title: '累计摸鱼天数',
      rule: '只统计有摸鱼时长的日期，时长大于 0 才会记作 1 天。',
      details: [
        { label: '有效摸鱼天数', value: '248 天' },
        { label: '累计摸鱼时长', value: '312小时18分' },
      ],
    },
    currentJobSalary: {
      title: '当前工作累计工资',
      rule: '从当前工作入职日期起，工作日按应发工资累计，今天只累计到当前时刻。',
      details: [
        { label: '累计应计工时', value: '1480小时36分' },
        { label: '当前工作开始', value: '2024-07-08' },
      ],
    },
    currentJobCompensation: {
      title: '当前工作预计赔偿金',
      rule: '按当前工作工龄估算 N+1，满 6 个月按 1 个月，不满 6 个月按 0.5 个月。',
      details: [
        { label: '当前工作工龄', value: '1年8个月23天' },
        { label: '赔偿口径', value: 'N+1（3个月）' },
      ],
    },
  },
  ratio: {
    stats: {
      day: { work: 75, moyu: 25 },
      week: { work: 68, moyu: 32 },
      month: { work: 60, moyu: 40 },
      year: { work: 82, moyu: 18 },
    },
  },
  historyItems: [
    { date: '09-18', duration: '02:15:20', income: '42.5' },
    { date: '09-17', duration: '01:45:10', income: '33.2' },
    { date: '09-16', duration: '03:10:00', income: '58.8' },
    { date: '09-15', duration: '00:55:30', income: '15.4' },
    { date: '09-14', duration: '02:30:15', income: '48.0' },
  ],
} as const
