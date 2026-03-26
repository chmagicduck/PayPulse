import type { ProfileSettings } from '../../../lib/domain/types'
import type { ProfileSettingsForm } from './types'

export const defaultProfileSettings: ProfileSettings = {
  nickname: '摸鱼小队长',
  birthday: '1995-06-15',
  gender: 'male',
  careerStartDate: '2018-07-01',
  retirementAge: 60,
  expectedLifespan: 85,
  monthlySalaryCents: 1500000,
  payDay: 10,
  workMode: 'double',
  isCurrentBigWeek: true,
  startTime: '09:00',
  endTime: '18:00',
  lunchBreakEnabled: false,
  lunchStartTime: '12:00',
  lunchEndTime: '13:30',
}

export function toProfileSettingsForm(settings: ProfileSettings): ProfileSettingsForm {
  return {
    nickname: settings.nickname,
    birthday: settings.birthday,
    gender: settings.gender,
    careerStartDate: settings.careerStartDate,
    retirementAge: String(settings.retirementAge),
    expectedLifespan: String(settings.expectedLifespan),
    monthlySalary: String(Math.round(settings.monthlySalaryCents / 100)),
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
