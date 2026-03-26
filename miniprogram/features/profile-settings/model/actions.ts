import type { ProfileSettings } from '../../../lib/domain/types'
import { getDurationSecFromTimeRange, now, parseDateString, startOfDay, toDateKey } from '../../../lib/domain/date'
import type { ProfileSettingsForm, ProfileSettingsValidationResult } from './types'

export function validateProfileSettings(form: ProfileSettingsForm): ProfileSettingsValidationResult {
  const today = toDateKey(startOfDay(now()))
  if (!form.nickname.trim()) {
    return { ok: false, message: '请先填写专属代号' }
  }

  if (!form.birthday || parseDateString(form.birthday) >= startOfDay(now())) {
    return { ok: false, message: '出厂日期必须早于今天' }
  }

  if (!form.careerStartDate || parseDateString(form.careerStartDate) > startOfDay(now())) {
    return { ok: false, message: '首次入港日期不能晚于今天' }
  }

  if (parseDateString(form.careerStartDate) < parseDateString(form.birthday)) {
    return { ok: false, message: '首次入港日期不能早于出厂日期' }
  }

  const retirementAge = Number(form.retirementAge)
  const expectedLifespan = Number(form.expectedLifespan)
  const monthlySalary = Number(form.monthlySalary)
  const payDay = Number(form.payDay)

  if (!Number.isFinite(retirementAge) || retirementAge <= 0) {
    return { ok: false, message: '预计退休年龄必须大于 0' }
  }

  if (!Number.isFinite(expectedLifespan) || expectedLifespan <= 0) {
    return { ok: false, message: '预期寿命必须大于 0' }
  }

  if (!Number.isFinite(monthlySalary) || monthlySalary <= 0) {
    return { ok: false, message: '月度燃料必须大于 0' }
  }

  if (!Number.isFinite(payDay) || payDay <= 0 || payDay > 31) {
    return { ok: false, message: '燃料到账日必须在 1 到 31 之间' }
  }

  if (getDurationSecFromTimeRange(form.startTime, form.endTime) <= 0) {
    return { ok: false, message: '归港时间必须晚于启航时间' }
  }

  if (form.lunchBreakEnabled) {
    if (!form.lunchStartTime || !form.lunchEndTime) {
      return { ok: false, message: '请填写完整的午间补给时间' }
    }

    if (getDurationSecFromTimeRange(form.lunchStartTime, form.lunchEndTime) <= 0) {
      return { ok: false, message: '补给结束时间必须晚于补给开始时间' }
    }

    if (
      getDurationSecFromTimeRange(form.startTime, form.lunchStartTime) < 0 ||
      getDurationSecFromTimeRange(form.lunchEndTime, form.endTime) < 0
    ) {
      return { ok: false, message: '午间补给时间必须落在工作区间内' }
    }
  }

  const settings: ProfileSettings = {
    nickname: form.nickname.trim(),
    birthday: form.birthday || today,
    gender: form.gender,
    careerStartDate: form.careerStartDate || today,
    retirementAge,
    expectedLifespan,
    monthlySalaryCents: Math.round(monthlySalary * 100),
    payDay,
    workMode: form.workMode,
    isCurrentBigWeek: form.isCurrentBigWeek,
    startTime: form.startTime,
    endTime: form.endTime,
    lunchBreakEnabled: form.lunchBreakEnabled,
    lunchStartTime: form.lunchBreakEnabled ? form.lunchStartTime : null,
    lunchEndTime: form.lunchBreakEnabled ? form.lunchEndTime : null,
  }

  return {
    ok: true,
    settings,
  }
}
