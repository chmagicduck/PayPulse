import { HOME_JOURNEY_IDS, type HomeJourneyDisplayValue, type HomeJourneyItem, type HomeViewModel, type JourneyId } from './types'

function createJourneyValues(): HomeJourneyDisplayValue[] {
  return [
    { mode: 'days', major: '0' },
    { mode: 'years', major: '0', middle: '0', minor: '0' },
    { mode: 'months', major: '0', minor: '0' },
    { mode: 'weeks', major: '0', minor: '0' },
  ]
}

function createJourneyItem(id: JourneyId): HomeJourneyItem {
  return {
    id,
    values: createJourneyValues(),
  }
}

export const homeDashboardModel: HomeViewModel = {
  income: {
    value: '¥0.00',
    rate: '0.000',
    workPercent: 0,
    idlePercent: 0,
    moyuIncome: '¥0.00',
    monthlyIncome: '¥0.00',
  },
  timer: {
    leftValue: '00:00:00',
    rightValue: '00:00:00',
  },
  taskPreview: {
    completed: 0,
    total: 0,
    rewardValue: 0,
  },
  regularTides: [
    { id: 'salary', days: '0' },
    { id: 'weekend', days: '0' },
  ],
  importantDates: [],
  lifeJourney: HOME_JOURNEY_IDS.map(createJourneyItem),
  homeStatus: {
    key: 'working',
    allowStart: false,
  },
}
