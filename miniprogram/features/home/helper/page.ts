import { homeDashboardModel, type HomeViewModel } from '../model/index'

const HOME_ICON_ANIMATION_KEYS = [
  'logo',
  'moyu',
  'tideWallet',
  'tideWeekend',
  'dateHeart',
  'dateGift',
  'dateStar',
  'journeyLife',
  'journeyCareer',
  'journeyRetire',
  'journeyFinal',
] as const

const HOME_PRESS_STATE_KEYS = [
  'task',
  'tideWallet',
  'tideWeekend',
  'dateHeart',
  'dateGift',
  'dateStar',
  'journeyLife',
  'journeyCareer',
  'journeyRetire',
  'journeyFinal',
  'modalConfirm',
  'modalClose',
] as const

type BooleanStateKeys = readonly string[]

function createBooleanState<T extends BooleanStateKeys>(keys: T): Record<T[number], boolean> {
  const result = {} as Record<T[number], boolean>

  keys.forEach(key => {
    result[key as T[number]] = false
  })

  return result
}

export type HomeIconAnimationKey = (typeof HOME_ICON_ANIMATION_KEYS)[number]
export type HomePressStateKey = (typeof HOME_PRESS_STATE_KEYS)[number]

export function createHomeIconAnimations() {
  return createBooleanState(HOME_ICON_ANIMATION_KEYS)
}

export function createHomePressStates() {
  return createBooleanState(HOME_PRESS_STATE_KEYS)
}

export function buildHomeViewModel(runtimeState: HomeViewModel): HomeViewModel {
  return {
    ...homeDashboardModel,
    ...runtimeState,
    importantDates: runtimeState.importantDates.filter(item => !String(item.id).startsWith('placeholder-')),
  }
}
