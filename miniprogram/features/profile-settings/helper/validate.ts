import { getDurationSecFromTimeRange, now, parseDateString, startOfDay, toDateKey } from '../../../lib/domain/date'
import type { ProfileSettings } from '../../../lib/domain/types'
import { profileAgeLimits } from '../model/options'
import type { ProfileSettingsForm, ProfileSettingsValidationResult } from '../model/types'
import { syncProfileSettingsForm } from './form'

export function validateProfileSettings(form: ProfileSettingsForm): ProfileSettingsValidationResult {
  const normalizedForm = syncProfileSettingsForm(form)
  const today = toDateKey(startOfDay(now()))

  if (!normalizedForm.nickname.trim()) {
    return { ok: false, message: '请先填写正确的昵称' }
  }

  if (!normalizedForm.birthday || parseDateString(normalizedForm.birthday) >= startOfDay(now())) {
    return { ok: false, message: '请填写正确的生日' }
  }

  if (!normalizedForm.careerStartDate || parseDateString(normalizedForm.careerStartDate) > startOfDay(now())) {
    return { ok: false, message: '入职日期不能晚于今天' }
  }

  if (parseDateString(normalizedForm.careerStartDate) < parseDateString(normalizedForm.birthday)) {
    return { ok: false, message: '入职日期不能早于生日' }
  }

  const retirementAge = Number(normalizedForm.retirementAge)
  const expectedLifespan = Number(normalizedForm.expectedLifespan)
  const monthlySalary = Number(normalizedForm.monthlySalary)
  const payDay = Number(normalizedForm.payDay)

  if (!Number.isFinite(retirementAge) || retirementAge <= 0) {
    return { ok: false, message: '退休年龄必须大于 0' }
  }

  if (retirementAge > profileAgeLimits.retirementAgeMax) {
    return { ok: false, message: `退休年龄不能超过 ${profileAgeLimits.retirementAgeMax}` }
  }

  if (!Number.isFinite(expectedLifespan) || expectedLifespan <= 0) {
    return { ok: false, message: '预期寿龄必须大于 0' }
  }

  if (expectedLifespan > profileAgeLimits.expectedLifespanMax) {
    return { ok: false, message: `预期寿龄不能超过 ${profileAgeLimits.expectedLifespanMax}` }
  }

  if (expectedLifespan <= retirementAge) {
    return { ok: false, message: '预期寿龄必须大于退休年龄' }
  }

  if (!Number.isFinite(monthlySalary) || monthlySalary <= 0) {
    return { ok: false, message: '月薪必须大于 0' }
  }

  if (!Number.isFinite(payDay) || payDay <= 0 || payDay > 31) {
    return { ok: false, message: '发薪日必须在 1 到 31 之间' }
  }

  if (getDurationSecFromTimeRange(normalizedForm.startTime, normalizedForm.endTime) <= 0) {
    return { ok: false, message: '下班时间必须晚于上班时间' }
  }

  if (normalizedForm.lunchBreakEnabled) {
    if (!normalizedForm.lunchStartTime || !normalizedForm.lunchEndTime) {
      return { ok: false, message: '请填写完整的午休时间' }
    }

    if (getDurationSecFromTimeRange(normalizedForm.lunchStartTime, normalizedForm.lunchEndTime) <= 0) {
      return { ok: false, message: '午休结束时间必须晚于开始时间' }
    }

    if (
      getDurationSecFromTimeRange(normalizedForm.startTime, normalizedForm.lunchStartTime) < 0 ||
      getDurationSecFromTimeRange(normalizedForm.lunchEndTime, normalizedForm.endTime) < 0
    ) {
      return { ok: false, message: '午休时间必须落在工作区间内' }
    }
  }

  const settings: ProfileSettings = {
    nickname: normalizedForm.nickname.trim(),
    birthday: normalizedForm.birthday || today,
    gender: normalizedForm.gender,
    retirementProfile: normalizedForm.retirementProfile,
    careerStartDate: normalizedForm.careerStartDate || today,
    retirementAge: Number(normalizedForm.retirementAge),
    retirementAgeEditedByUser: normalizedForm.retirementAgeEditedByUser,
    expectedLifespan,
    monthlySalaryCents: Math.round(monthlySalary * 100),
    payDay,
    workMode: normalizedForm.workMode,
    isCurrentBigWeek: normalizedForm.isCurrentBigWeek,
    startTime: normalizedForm.startTime,
    endTime: normalizedForm.endTime,
    lunchBreakEnabled: normalizedForm.lunchBreakEnabled,
    lunchStartTime: normalizedForm.lunchBreakEnabled ? normalizedForm.lunchStartTime : null,
    lunchEndTime: normalizedForm.lunchBreakEnabled ? normalizedForm.lunchEndTime : null,
  }

  return {
    ok: true,
    settings,
  }
}
