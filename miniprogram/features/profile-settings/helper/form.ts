import { getDurationSecFromTimeRange } from '../../../lib/domain/date'
import { computeRetirementAge, getDefaultRetirementProfile } from '../../../lib/domain/retirement'
import type { Gender } from '../../../lib/domain/types'
import { genderDefaults, profileAgeLimits } from '../model/options'
import type { ProfileSettingsAgeLimits, ProfileSettingsDailyWorkDuration, ProfileSettingsField, ProfileSettingsForm } from '../model/types'

function resolveRetirementProfile(form: ProfileSettingsForm) {
  return form.gender === 'male'
    ? 'male-60'
    : (form.retirementProfile || getDefaultRetirementProfile(form.gender))
}

export function syncProfileSettingsForm(form: ProfileSettingsForm): ProfileSettingsForm {
  const retirementProfile = resolveRetirementProfile(form)
  const retirementAge = form.retirementAgeEditedByUser
    ? form.retirementAge
    : String(
        form.birthday
          ? computeRetirementAge(retirementProfile, form.birthday)
          : (form.retirementAge || computeRetirementAge(retirementProfile, '')),
      )

  return {
    ...form,
    retirementProfile,
    retirementAge,
  }
}

export function applyGenderDefaults(form: ProfileSettingsForm, gender: Gender): ProfileSettingsForm {
  const defaults = genderDefaults[gender]

  return syncProfileSettingsForm({
    ...form,
    gender,
    retirementProfile: defaults.retirementProfile,
    retirementAge: '',
    retirementAgeEditedByUser: false,
    expectedLifespan: String(defaults.expectedLifespan),
  })
}

export function patchProfileSettingsForm(
  form: ProfileSettingsForm,
  field: ProfileSettingsField,
  value: string,
): ProfileSettingsForm {
  return syncProfileSettingsForm({
    ...form,
    [field]: value,
  })
}

export function updateRetirementAgeValue(form: ProfileSettingsForm, retirementAge: string): ProfileSettingsForm {
  return syncProfileSettingsForm({
    ...form,
    retirementAge,
    retirementAgeEditedByUser: true,
  })
}

export function buildProfileAgeLimits(form: ProfileSettingsForm): ProfileSettingsAgeLimits {
  const retirementAge = Number(form.retirementAge)
  const expectedLifespan = Number(form.expectedLifespan)

  return {
    retirementAgeMin: profileAgeLimits.retirementAgeMin,
    retirementAgeMax: Number.isFinite(expectedLifespan)
      ? Math.max(profileAgeLimits.retirementAgeMin, expectedLifespan - 1)
      : profileAgeLimits.retirementAgeMax,
    expectedLifespanMin: Number.isFinite(retirementAge)
      ? Math.min(
          profileAgeLimits.expectedLifespanMax,
          Math.max(profileAgeLimits.retirementAgeMin + 1, retirementAge + 1),
        )
      : profileAgeLimits.retirementAgeMin + 1,
    expectedLifespanMax: profileAgeLimits.expectedLifespanMax,
  }
}

export function computeDailyWorkDurationSec(form: ProfileSettingsForm) {
  const totalSec = getDurationSecFromTimeRange(form.startTime, form.endTime)
  if (!form.lunchBreakEnabled) {
    return totalSec
  }

  const lunchSec = getDurationSecFromTimeRange(form.lunchStartTime, form.lunchEndTime)
  return Math.max(0, totalSec - lunchSec)
}

export function buildDailyWorkDuration(form: ProfileSettingsForm): ProfileSettingsDailyWorkDuration {
  const totalMinutes = Math.floor(computeDailyWorkDurationSec(form) / 60)
  return {
    totalMinutes,
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
  }
}
