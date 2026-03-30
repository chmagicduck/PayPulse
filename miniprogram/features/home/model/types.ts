export const HOME_JOURNEY_IDS = ['life', 'career', 'retire', 'final'] as const

export type JourneyId = (typeof HOME_JOURNEY_IDS)[number]

export type HomeStatusKey = 'working' | 'pre-work' | 'lunch-break' | 'off-duty' | 'rest-day'
export type HomeRegularTideId = 'salary' | 'weekend'
export type HomeNotebookId = 'commemorative' | 'travel' | 'career' | 'life'
export type HomeTone = 'blue' | 'emerald' | 'rose' | 'amber' | 'indigo'
export type HomeJourneyDisplayMode = 'days' | 'years' | 'months' | 'weeks'

export type HomeJourneyDisplayValue = {
  mode: HomeJourneyDisplayMode
  major: string
  middle?: string
  minor?: string
}

export type HomeJourneyItem = {
  id: JourneyId
  values: HomeJourneyDisplayValue[]
  progress?: number
}

export type HomeJourneyDisplayItem = HomeJourneyItem & {
  display: HomeJourneyDisplayValue
}

export type HomeViewModel = {
  income: {
    value: string
    rate: string
    workPercent: number
    idlePercent: number
    moyuIncome: string
    monthlyIncome: string
  }
  timer: {
    leftValue: string
    rightValue: string
  }
  taskPreview: {
    completed: number
    total: number
    rewardValue: number
  }
  regularTides: Array<{
    id: HomeRegularTideId
    days: string
  }>
  importantDates: Array<{
    id: string
    title: string
    date: string
    remaining: string
    isPast: boolean
    tone: HomeTone
    notebookId: HomeNotebookId
  }>
  lifeJourney: HomeJourneyItem[]
  homeStatus: {
    key: HomeStatusKey
    allowStart: boolean
  }
}
