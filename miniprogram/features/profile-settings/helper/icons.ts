import { icon } from '../../../lib/icons'

const accent = '#3b82f6'

export function buildSettingsIcons() {
  return {
    chevronLeft: icon('chevron-left', '#475569', 22),
    user: icon('user', accent, 14),
    calendar: icon('calendar', accent, 14),
    briefcase: icon('briefcase', accent, 14),
    moon: icon('moon', accent, 14),
    sun: icon('sun', accent, 14),
    wallet: icon('wallet', accent, 14),
    trendingUp: icon('trending-up', accent, 14),
    calendarDays: icon('calendar-days', accent, 14),
    clock: icon('clock', accent, 14),
    coffee: icon('coffee', accent, 14),
    checkCircle2: icon('check-circle-2', '#ffffff', 18),
  }
}
