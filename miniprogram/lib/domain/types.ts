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
export type AdjustmentSource = 'none' | 'home'
export type TimeAxisEntrySourceType = 'system' | 'user'
export type TimeAxisSystemType = 'birthday' | 'career-anniversary' | 'retirement-day' | null
export type RetirementProfile = 'male-60' | 'female-55' | 'female-50'
export type MoyuSessionStatus = 'idle' | 'active' | 'auto-stopped'
export type MoyuStopReason = 'manual' | 'cross-lunch' | 'off-duty' | 'holiday' | 'cold-start-recover' | null

export interface ProfileSettings {
  nickname: string
  birthday: string
  gender: Gender
  retirementProfile: RetirementProfile
  careerStartDate: string
  currentJobStartDate: string
  retirementAge: number
  retirementAgeEditedByUser: boolean
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
  calendarStatus: CalendarStatus
  updatedAt: string
}

export interface DailyVoyageDerivedRecord {
  record: DailyVoyageRecord
  actualWorkDurationSec: number
  moyuIncomeCents: number
  voyageIncomeCents: number
  moyuRatio: number
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
  sourceType: TimeAxisEntrySourceType
  systemType: TimeAxisSystemType
  locked: boolean
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

export interface LabTaskDailyLedgerEntry {
  date: string
  counts: Record<string, number>
}

export interface LabProgress {
  totalPoints: number
  todayPoints: number
  selectedRankIndex: number
  lastDailyResetDate: string
  lastWeeklyResetDate: string
  tasks: LabTaskState[]
  achievements: AchievementState[]
  taskDailyLedger: LabTaskDailyLedgerEntry[]
}

export interface MoyuSession {
  sessionId: string
  status: MoyuSessionStatus
  date: string
  startedAt: string | null
  lastTickAt: string | null
  accumulatedDurationSec: number
  stopReason: MoyuStopReason
}

export interface CalendarHolidayRange {
  from: string
  to: string
  badge: string
  title: string
  desc: string
}

export interface CalendarYearConfig {
  year: number
  holidayRanges: CalendarHolidayRange[]
  makeupDays: string[]
  supportOfficialHoliday: boolean
}

export interface ManagedStorageExportItem {
  key: string
  label: string
  exists: boolean
  legacy: boolean
  value: unknown
}

export interface DataExportPackage {
  schemaVersion: '1.0.0'
  exportedAt: string
  bootstrap: AppBootstrapState
  settings: ProfileSettings | null
  avatar: string | null
  avatarBackup: string | null
  dailyRecords: DailyVoyageRecord[]
  timeAxisEntries: TimeAxisEntry[]
  labProgress: LabProgress | null
  moyuSession: MoyuSession | null
  preferences: {
    amountVisible: boolean
  }
  managedStorage: ManagedStorageExportItem[]
}
