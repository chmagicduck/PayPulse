import { animatedIconPair, icon, type IconImagePair } from '../../lib/icons'

const JOURNEY_IDS = ['life', 'career', 'retire', 'final'] as const

export type JourneyId = (typeof JOURNEY_IDS)[number]

type JourneyItem = {
  id: JourneyId
  valueModes: readonly string[]
}

export type JourneyTimeModes = Record<JourneyId, number>

export const INITIAL_JOURNEY_TIME_MODES: JourneyTimeModes = {
  life: 0,
  career: 0,
  retire: 0,
  final: 0,
}

export function buildJourneyDisplayItems<T extends JourneyItem>(items: readonly T[], timeModes: JourneyTimeModes) {
  return items.map(item =>
    Object.assign({}, item, {
      displayValue: item.valueModes[timeModes[item.id]],
    }),
  )
}

export function buildDashboardIcons() {
  return {
    iconEye: icon('eye', '#bfdbfe', 14),
    iconEyeOff: icon('eye-off', '#bfdbfe', 14),
    iconLogOut: icon('log-out', '#bfdbfe', 12),
    iconSettingsSlate: icon('settings2', '#dbeafe', 16),
    iconListTodo: icon('list-todo', '#2563eb', 16),
    iconRadar: icon('target', '#3b82f6', 20),
    iconZapAmber: icon('zap', '#f59e0b', 12),
    iconChevronRightBlue: icon('chevron-right', '#2563eb', 12),
    iconX: icon('x', '#94a3b8', 18),
    iconPairs: {
      wavesWhite: animatedIconPair('waves', {
        color: '#ffffff',
        animation: 'wave',
        durationMs: 2800,
      }),
      coffeeWhite: animatedIconPair('coffee', {
        color: '#ffffff',
        animation: 'bounce',
        durationMs: 1800,
      }),
      coffeeBlue: animatedIconPair('coffee', {
        color: '#2563eb',
        animation: 'bounce',
        durationMs: 1800,
      }),
      walletWhite: animatedIconPair('wallet', {
        color: '#ffffff',
        animation: 'float',
        durationMs: 2200,
      }),
      walletBlue: animatedIconPair('wallet', {
        color: '#2563eb',
        animation: 'float',
        durationMs: 2200,
      }),
      calendarDaysWhite: animatedIconPair('calendar-days', {
        color: '#ffffff',
        animation: 'float',
        durationMs: 2200,
      }),
      calendarDaysEmerald: animatedIconPair('calendar-days', {
        color: '#10b981',
        animation: 'float',
        durationMs: 2200,
      }),
      heartRose: animatedIconPair('heart', {
        color: '#f43f5e',
        animation: 'pulse',
        durationMs: 1800,
      }),
      giftAmber: animatedIconPair('gift', {
        color: '#f59e0b',
        animation: 'bounce',
        durationMs: 2000,
      }),
      starBlue: animatedIconPair('star', {
        color: '#3b82f6',
        animation: 'twinkle',
        durationMs: 2000,
      }),
      babyWhite: animatedIconPair('baby', {
        color: '#ffffff',
        animation: 'bounce',
        durationMs: 2000,
      }),
      babyIndigo: animatedIconPair('baby', {
        color: '#6366f1',
        animation: 'bounce',
        durationMs: 2000,
      }),
      briefcaseWhite: animatedIconPair('briefcase', {
        color: '#ffffff',
        animation: 'float',
        durationMs: 2000,
      }),
      briefcaseBlue: animatedIconPair('briefcase', {
        color: '#2563eb',
        animation: 'float',
        durationMs: 2000,
      }),
      flagWhite: animatedIconPair('flag', {
        color: '#ffffff',
        animation: 'wave',
        durationMs: 2200,
      }),
      flagEmerald: animatedIconPair('flag', {
        color: '#059669',
        animation: 'wave',
        durationMs: 2200,
      }),
      skullWhite: animatedIconPair('skull', {
        color: '#ffffff',
        animation: 'pulse',
        durationMs: 2000,
      }),
      skullRose: animatedIconPair('skull', {
        color: '#e11d48',
        animation: 'pulse',
        durationMs: 2000,
      }),
    } satisfies Record<string, IconImagePair>,
  }
}
