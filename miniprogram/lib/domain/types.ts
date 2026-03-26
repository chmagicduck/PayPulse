export type BootstrapStatus = 'needs_setup' | 'ready'

export interface AppBootstrapState {
  schemaVersion: '1.0.0'
  status: BootstrapStatus
  initializedAt: string | null
  lastResetAt: string | null
}

export type Gender = 'male' | 'female'
export type WorkMode = 'double' | 'single-sat' | 'single-sun' | 'big-small'
export type CalendarStatus = 'workday' | 'weekend' | 'holiday' | 'makeup'
export type AdjustmentSource = 'none' | 'home' | 'report'

export interface ProfileSettings {
  nickname: string
  birthday: string
  gender: Gender
  careerStartDate: string
  retirementAge: number
  expectedLifespan: number
  monthlySalaryCents: number
  payDay: number
  workMode: WorkMode
  isCurrentBigWeek: boolean
  startTime: string
  endTime: string
  lunchBreakEnabled: boolean
  lunchStartTime: string | null
  lunchEndTime: string | null
}

export interface DailyVoyageRecord {
  date: string
  scheduledWorkDurationSec: number
  moyuDurationSec: number
  manualAdjustmentDurationSec: number
  adjustmentSource: AdjustmentSource
  derivedIncomeCents: number
  calendarStatus: CalendarStatus
  updatedAt: string
}

export interface TimeAxisNotebook {
  id: 'all' | 'commemorative' | 'travel' | 'life' | 'career'
  name: string
  iconId: string
  tone: string
}

export interface TimeAxisEntry {
  id: string
  title: string
  date: string
  notebookId: Exclude<TimeAxisNotebook['id'], 'all'>
  isAnniversary: boolean
  createdAt: string
  updatedAt: string
}

export interface LabTaskState {
  taskId: string
  count: number
  limit: number
  rewardPoints: number
  updatedAt: string
}

export interface AchievementState {
  achievementId: string
  progress: number
  target: number
  completed: boolean
  rewarded: boolean
}

export interface LabProgress {
  totalPoints: number
  todayPoints: number
  selectedRankIndex: number
  lastDailyResetDate: string
  lastWeeklyResetDate: string
  tasks: LabTaskState[]
  achievements: AchievementState[]
}

export interface DataExportPackage {
  schemaVersion: '1.0.0'
  exportedAt: string
  bootstrap: AppBootstrapState
  settings: ProfileSettings | null
  avatar: string | null
  dailyRecords: DailyVoyageRecord[]
  timeAxisEntries: TimeAxisEntry[]
  labProgress: LabProgress | null
  reportAdjustments: Record<string, number>
  preferences: {
    amountVisible: boolean
  }
}
