import type { Gender, ProfileSettings, RetirementProfile, WorkMode } from '../../../lib/domain/types'

export type ProfileSettingsForm = {
  nickname: string
  birthday: string
  gender: Gender
  retirementProfile: RetirementProfile
  careerStartDate: string
  retirementAge: string
  retirementAgeEditedByUser: boolean
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

export type ProfileSettingsField =
  Exclude<keyof ProfileSettingsForm, 'gender' | 'retirementProfile' | 'retirementAgeEditedByUser' | 'isCurrentBigWeek' | 'lunchBreakEnabled'>

export type ProfileSettingsAgeLimits = {
  retirementAgeMin: number
  retirementAgeMax: number
  expectedLifespanMin: number
  expectedLifespanMax: number
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
