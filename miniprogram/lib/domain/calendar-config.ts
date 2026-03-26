import type { CalendarYearConfig } from './types'

const CALENDAR_2026: CalendarYearConfig = {
  year: 2026,
  supportOfficialHoliday: true,
  holidayRanges: [
    {
      from: '2026-01-01',
      to: '2026-01-03',
      badge: '元',
      title: '元旦假期中',
      desc: '当前日期位于 2026 年元旦法定假期内。',
    },
    {
      from: '2026-02-15',
      to: '2026-02-23',
      badge: '春',
      title: '春节假期中',
      desc: '当前日期位于 2026 年春节法定假期内。',
    },
    {
      from: '2026-04-04',
      to: '2026-04-06',
      badge: '清',
      title: '清明假期中',
      desc: '当前日期位于 2026 年清明法定假期内。',
    },
    {
      from: '2026-05-01',
      to: '2026-05-05',
      badge: '劳',
      title: '劳动节假期中',
      desc: '当前日期位于 2026 年劳动节法定假期内。',
    },
    {
      from: '2026-06-19',
      to: '2026-06-21',
      badge: '端',
      title: '端午假期中',
      desc: '当前日期位于 2026 年端午法定假期内。',
    },
    {
      from: '2026-09-25',
      to: '2026-09-27',
      badge: '秋',
      title: '中秋假期中',
      desc: '当前日期位于 2026 年中秋法定假期内。',
    },
    {
      from: '2026-10-01',
      to: '2026-10-07',
      badge: '国',
      title: '国庆假期中',
      desc: '当前日期位于 2026 年国庆法定假期内。',
    },
  ],
  makeupDays: [
    '2026-01-04',
    '2026-02-14',
    '2026-02-28',
    '2026-05-09',
    '2026-09-20',
    '2026-10-10',
  ],
}

export function getCalendarYearConfig(year: number): CalendarYearConfig {
  if (year === 2026) {
    return CALENDAR_2026
  }

  return {
    year,
    holidayRanges: [],
    makeupDays: [],
    supportOfficialHoliday: false,
  }
}
