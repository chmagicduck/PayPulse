import { animatedIconPair, icon, type IconImagePair } from '../../lib/icons'

export function buildSettingsIcons() {
  return {
    chevronLeft: icon('chevron-left', '#475569', 22),
    compassPair: animatedIconPair('compass', {
      color: '#ffffff',
      animation: 'float',
      durationMs: 2600,
    }),
    anchor: icon('anchor', '#ffffff', 60),
    user: icon('user', '#3b82f6', 14),
    calendar: icon('calendar', '#3b82f6', 14),
    briefcase: icon('briefcase', '#3b82f6', 14),
    moon: icon('moon', '#3b82f6', 14),
    sun: icon('sun', '#3b82f6', 14),
    wallet: icon('wallet', '#3b82f6', 14),
    trendingUp: icon('trending-up', '#3b82f6', 14),
    calendarDays: icon('calendar-days', '#3b82f6', 14),
    clock: icon('clock', '#3b82f6', 14),
    coffee: icon('coffee', '#3b82f6', 14),
    checkCircle2: icon('check-circle-2', '#ffffff', 18),
  } as {
    chevronLeft: string
    compassPair: IconImagePair
    anchor: string
    user: string
    calendar: string
    briefcase: string
    moon: string
    sun: string
    wallet: string
    trendingUp: string
    calendarDays: string
    clock: string
    coffee: string
    checkCircle2: string
  }
}
