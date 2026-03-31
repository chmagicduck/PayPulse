import { getDurationSecFromTimeRange, now, parseDateString, startOfDay, toDateKey } from '../../../lib/domain/date'
import type { ProfileSettings } from '../../../lib/domain/types'
import { profileAgeLimits } from '../model/options'
import type { ProfileSettingsForm, ProfileSettingsValidationResult } from '../model/types'
import { syncProfileSettingsForm } from './form'

export function validateProfileSettings(form: ProfileSettingsForm): ProfileSettingsValidationResult {
  const normalizedForm = syncProfileSettingsForm(form)
  const today = toDateKey(startOfDay(now()))

  if (!normalizedForm.nickname.trim()) {
    return { ok: false, message: '好歹填个昵称吧' }
  }

  if (!normalizedForm.birthday || parseDateString(normalizedForm.birthday) >= startOfDay(now())) {
    return { ok: false, message: '生日填错了哦' }
  }

  if (!normalizedForm.careerStartDate || parseDateString(normalizedForm.careerStartDate) > startOfDay(now())) {
    return { ok: false, message: '你难道是穿越去未来入职的？' }
  }

  if (parseDateString(normalizedForm.careerStartDate) < parseDateString(normalizedForm.birthday)) {
    return { ok: false, message: '童工犯法！入职时间不能早于生日' }
  }

  if (!normalizedForm.currentJobStartDate || parseDateString(normalizedForm.currentJobStartDate) > startOfDay(now())) {
    return { ok: false, message: '当前工作入职日期不能晚于今天' }
  }

  if (parseDateString(normalizedForm.currentJobStartDate) < parseDateString(normalizedForm.birthday)) {
    return { ok: false, message: '当前工作入职日期不能早于生日' }
  }

  const retirementAge = Number(normalizedForm.retirementAge)
  const expectedLifespan = Number(normalizedForm.expectedLifespan)
  const monthlySalary = Number(normalizedForm.monthlySalary)
  const payDay = Number(normalizedForm.payDay)

  if (!Number.isFinite(retirementAge) || retirementAge <= 0) {
    return { ok: false, message: '退休年龄填错啦' }
  }

  if (retirementAge > profileAgeLimits.retirementAgeMax) {
    return { ok: false, message: `太长寿了吧，系统最高只支持 ${profileAgeLimits.retirementAgeMax} 岁退休` }
  }

  if (!Number.isFinite(expectedLifespan) || expectedLifespan <= 0) {
    return { ok: false, message: '预期寿命填错啦' }
  }

  if (expectedLifespan > profileAgeLimits.expectedLifespanMax) {
    return { ok: false, message: `系统最高只支持活到 ${profileAgeLimits.expectedLifespanMax} 岁` }
  }

  if (expectedLifespan <= retirementAge) {
    return { ok: false, message: '总不能还没退休就挂了吧？' }
  }

  if (!Number.isFinite(monthlySalary) || monthlySalary <= 0) {
    return { ok: false, message: '月薪不能填0，倒贴上班可不行' }
  }

  if (!Number.isFinite(payDay) || payDay <= 0 || payDay > 31) {
    return { ok: false, message: '发薪日只能是 1 到 31 号' }
  }

  if (getDurationSecFromTimeRange(normalizedForm.startTime, normalizedForm.endTime) <= 0) {
    return { ok: false, message: '下班时间不能比上班时间还早呀' }
  }

  if (normalizedForm.lunchBreakEnabled) {
    if (!normalizedForm.lunchStartTime || !normalizedForm.lunchEndTime) {
      return { ok: false, message: '把午休时间填完整呗' }
    }

    if (getDurationSecFromTimeRange(normalizedForm.lunchStartTime, normalizedForm.lunchEndTime) <= 0) {
      return { ok: false, message: '午休结束时间得比开始时间晚' }
    }

    if (
      getDurationSecFromTimeRange(normalizedForm.startTime, normalizedForm.lunchStartTime) < 0 ||
      getDurationSecFromTimeRange(normalizedForm.lunchEndTime, normalizedForm.endTime) < 0
    ) {
      return { ok: false, message: '午休时间得在你的上班时间内' }
    }
  }

  const settings: ProfileSettings = {
    nickname: normalizedForm.nickname.trim(),
    birthday: normalizedForm.birthday || today,
    gender: normalizedForm.gender,
    retirementProfile: normalizedForm.retirementProfile,
    careerStartDate: normalizedForm.careerStartDate || today,
    currentJobStartDate: normalizedForm.currentJobStartDate || today,
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
