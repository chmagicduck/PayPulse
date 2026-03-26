import type { Gender, ProfileSettings, WorkMode } from '../../../lib/domain/types'

export type ProfileSettingsForm = {
  nickname: string
  birthday: string
  gender: Gender
  careerStartDate: string
  retirementAge: string
  expectedLifespan: string
  monthlySalary: string
  payDay: string
  workMode: WorkMode
  isCurrentBigWeek: boolean
  startTime: string
  endTime: string
  lunchBreakEnabled: boolean
  lunchStartTime: string
  lunchEndTime: string
}

export type ProfileSettingsValidationResult =
  | {
      ok: true
      settings: ProfileSettings
    }
  | {
      ok: false
      message: string
    }
