import type { IconImagePair } from '../../../lib/icons'
import { formatJourneyDisplayValue } from './journey'
import { homeDashboardModel, type HomeJourneyDisplayItem, type HomeTone, type HomeViewModel } from '../model/index'

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

export type HomeMetricCard = {
  key: string
  variant: 'compact' | 'wide'
  tone: HomeTone
  badgeText: string
  valuePrefix: string
  valueText: string
  descPrefix: string
  descStrong: string
  descSuffix: string
  descStrongTone: HomeTone | 'primary'
  iconSrc: string
  animatedIconSrc: string
  ghostSrc: string
  animatedGhostSrc: string
}

type HomeMetricCardSet = {
  tideCards: HomeMetricCard[]
  journeyCards: HomeMetricCard[]
}

type HomeIconPairMap = Record<string, IconImagePair>

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

export function buildHomeMetricCards(
  vm: HomeViewModel,
  journeyDisplayItems: readonly HomeJourneyDisplayItem[],
  iconPairs: HomeIconPairMap,
): HomeMetricCardSet {
  const regularTides = {
    salary: vm.regularTides.find(item => item.id === 'salary'),
    weekend: vm.regularTides.find(item => item.id === 'weekend'),
  }
  const journeys = {
    life: journeyDisplayItems.find(item => item.id === 'life'),
    career: journeyDisplayItems.find(item => item.id === 'career'),
  }

  return {
    tideCards: [
      {
        key: 'salary',
        variant: 'compact',
        tone: 'blue',
        badgeText: '发薪日',
        valuePrefix: '剩',
        valueText: `${regularTides.salary?.days || '0'}天`,
        descPrefix: '距离下次',
        descStrong: '发工资',
        descSuffix: '越来越近了。',
        descStrongTone: 'blue',
        iconSrc: iconPairs.walletWhite.staticSrc,
        animatedIconSrc: iconPairs.walletWhite.animatedSrc,
        ghostSrc: iconPairs.walletBlue.staticSrc,
        animatedGhostSrc: iconPairs.walletBlue.animatedSrc,
      },
      {
        key: 'weekend',
        variant: 'compact',
        tone: 'emerald',
        badgeText: '放假',
        valuePrefix: '剩',
        valueText: `${regularTides.weekend?.days || '0'}天`,
        descPrefix: '马上就能迎来',
        descStrong: '休息日',
        descSuffix: '了。',
        descStrongTone: 'emerald',
        iconSrc: iconPairs.calendarDaysWhite.staticSrc,
        animatedIconSrc: iconPairs.calendarDaysWhite.animatedSrc,
        ghostSrc: iconPairs.calendarDaysEmerald.staticSrc,
        animatedGhostSrc: iconPairs.calendarDaysEmerald.animatedSrc,
      },
    ],
    journeyCards: [
      {
        key: 'life',
        variant: 'wide',
        tone: 'indigo',
        badgeText: '人生进程',
        valuePrefix: '已度过',
        valueText: formatJourneyDisplayValue(journeys.life?.display),
        descPrefix: '这是你从',
        descStrong: '出生降临',
        descSuffix: '至今在这个世界的体验时长。',
        descStrongTone: 'indigo',
        iconSrc: iconPairs.babyWhite.staticSrc,
        animatedIconSrc: iconPairs.babyWhite.animatedSrc,
        ghostSrc: iconPairs.babyIndigo.staticSrc,
        animatedGhostSrc: iconPairs.babyIndigo.animatedSrc,
      },
      {
        key: 'career',
        variant: 'wide',
        tone: 'blue',
        badgeText: '打工时长',
        valuePrefix: '已出卖',
        valueText: formatJourneyDisplayValue(journeys.career?.display),
        descPrefix: '自从步入',
        descStrong: '职场江湖',
        descSuffix: '以后，你被消耗的岁月。',
        descStrongTone: 'blue',
        iconSrc: iconPairs.briefcaseWhite.staticSrc,
        animatedIconSrc: iconPairs.briefcaseWhite.animatedSrc,
        ghostSrc: iconPairs.briefcaseBlue.staticSrc,
        animatedGhostSrc: iconPairs.briefcaseBlue.animatedSrc,
      },
    ],
  }
}
