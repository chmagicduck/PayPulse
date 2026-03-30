import type { Gender, RetirementProfile, WorkMode } from '../../../lib/domain/types'

export const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
]

export const workModeOptions: Array<{ value: WorkMode; label: string }> = [
  { value: 'double', label: '双休' },
  { value: 'single-sat', label: '休六' },
  { value: 'single-sun', label: '休日' },
  { value: 'big-small', label: '大小周' },
]

export const genderDefaults: Record<Gender, { retirementProfile: RetirementProfile; expectedLifespan: number }> = {
  male: {
    retirementProfile: 'male-60',
    expectedLifespan: 80,
  },
  female: {
    retirementProfile: 'female-55',
    expectedLifespan: 85,
  },
}

export const profileAgeLimits = {
  retirementAgeMin: 1,
  retirementAgeMax: 120,
  expectedLifespanMax: 120,
} as const
