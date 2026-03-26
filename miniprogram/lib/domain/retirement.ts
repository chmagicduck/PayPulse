import type { RetirementProfile } from './types'

type RetirementRule = {
  originalAge: number
  delayStepMonths: number
  maxDelayMonths: number
}

const POLICY_START_YEAR = 2025
const POLICY_START_MONTH_INDEX = 0

const RETIREMENT_RULES: Record<RetirementProfile, RetirementRule> = {
  'male-60': {
    originalAge: 60,
    delayStepMonths: 4,
    maxDelayMonths: 36,
  },
  'female-55': {
    originalAge: 55,
    delayStepMonths: 4,
    maxDelayMonths: 36,
  },
  'female-50': {
    originalAge: 50,
    delayStepMonths: 2,
    maxDelayMonths: 60,
  },
}

function getMonthIndex(year: number, monthIndex: number) {
  return year * 12 + monthIndex
}

function getAgeInMonths(date: Date) {
  return date.getFullYear() * 12 + date.getMonth()
}

export function getDefaultRetirementProfile(gender: 'male' | 'female', current?: RetirementProfile): RetirementProfile {
  if (gender === 'male') {
    return 'male-60'
  }

  if (current === 'female-50' || current === 'female-55') {
    return current
  }

  return 'female-55'
}

export function getRetirementRule(profile: RetirementProfile) {
  return RETIREMENT_RULES[profile]
}

export function computeRetirementAge(profile: RetirementProfile, birthday: string) {
  if (!birthday) {
    return RETIREMENT_RULES[profile].originalAge
  }

  const birthDate = new Date(birthday)
  const rule = RETIREMENT_RULES[profile]
  const originalMonthIndex = getMonthIndex(
    birthDate.getFullYear() + rule.originalAge,
    birthDate.getMonth(),
  )
  const policyStartMonthIndex = getMonthIndex(POLICY_START_YEAR, POLICY_START_MONTH_INDEX)

  if (originalMonthIndex < policyStartMonthIndex) {
    return rule.originalAge
  }

  const diffMonths = originalMonthIndex - policyStartMonthIndex
  const delayMonths = Math.min(
    rule.maxDelayMonths,
    Math.floor(diffMonths / rule.delayStepMonths) + 1,
  )

  return Number(((rule.originalAge * 12 + delayMonths) / 12).toFixed(2))
}

export function computeRetirementDate(profile: RetirementProfile, birthday: string) {
  const birthDate = new Date(birthday)
  const rule = RETIREMENT_RULES[profile]
  const originalMonthIndex = getMonthIndex(
    birthDate.getFullYear() + rule.originalAge,
    birthDate.getMonth(),
  )
  const policyStartMonthIndex = getMonthIndex(POLICY_START_YEAR, POLICY_START_MONTH_INDEX)
  const diffMonths = originalMonthIndex < policyStartMonthIndex ? -1 : originalMonthIndex - policyStartMonthIndex
  const delayMonths = diffMonths < 0
    ? 0
    : Math.min(rule.maxDelayMonths, Math.floor(diffMonths / rule.delayStepMonths) + 1)
  const retirementMonthIndex = getAgeInMonths(birthDate) + rule.originalAge * 12 + delayMonths
  const year = Math.floor(retirementMonthIndex / 12)
  const monthIndex = retirementMonthIndex % 12

  return new Date(year, monthIndex, birthDate.getDate())
}
