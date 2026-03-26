import type { ProfileSettings } from '../../../lib/domain/types'
import { computeRetirementAge, getDefaultRetirementProfile } from '../../../lib/domain/retirement'
import type { ProfileSettingsForm } from './types'

export const defaultProfileSettings: ProfileSettings = {
  nickname: '',
  birthday: '',
  gender: 'male',
  retirementProfile: 'male-60',
  careerStartDate: '',
  retirementAge: 60,
  retirementAgeEditedByUser: false,
  expectedLifespan: 85,
  monthlySalaryCents: 0,
  payDay: 10,
  workMode: 'double',
  isCurrentBigWeek: true,
  startTime: '09:00',
  endTime: '18:00',
  lunchBreakEnabled: true,
  lunchStartTime: '12:00',
  lunchEndTime: '13:30',
}

function resolveRetirementProfile(settings: ProfileSettings) {
  return settings.retirementProfile || getDefaultRetirementProfile(settings.gender)
}

export function toProfileSettingsForm(settings: ProfileSettings): ProfileSettingsForm {
  const retirementProfile = resolveRetirementProfile(settings)
  const birthday = settings.birthday || ''

  return {
    nickname: settings.nickname,
    birthday,
    gender: settings.gender,
    retirementProfile,
    careerStartDate: settings.careerStartDate,
    retirementAge: String(
      settings.retirementAgeEditedByUser
        ? settings.retirementAge
        : (birthday ? computeRetirementAge(retirementProfile, birthday) : settings.retirementAge),
    ),
    retirementAgeEditedByUser: Boolean(settings.retirementAgeEditedByUser),
    expectedLifespan: String(settings.expectedLifespan),
    monthlySalary: settings.monthlySalaryCents > 0 ? String(Math.round(settings.monthlySalaryCents / 100)) : '',
    payDay: String(settings.payDay),
    workMode: settings.workMode,
    isCurrentBigWeek: settings.isCurrentBigWeek,
    startTime: settings.startTime,
    endTime: settings.endTime,
    lunchBreakEnabled: settings.lunchBreakEnabled,
    lunchStartTime: settings.lunchStartTime || '12:00',
    lunchEndTime: settings.lunchEndTime || '13:30',
  }
}

export const defaultProfileSettingsForm = toProfileSettingsForm(defaultProfileSettings)
