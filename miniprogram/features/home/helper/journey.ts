import { HOME_JOURNEY_IDS, type HomeJourneyDisplayItem, type HomeJourneyDisplayValue, type HomeJourneyItem, type JourneyId } from '../model/index'

export type JourneyTimeModes = Record<JourneyId, number>

export const INITIAL_JOURNEY_TIME_MODES: JourneyTimeModes = HOME_JOURNEY_IDS.reduce((result, id) => {
  result[id] = 1
  return result
}, {} as JourneyTimeModes)

export function buildJourneyDisplayItems(
  items: readonly HomeJourneyItem[],
  timeModes: JourneyTimeModes,
): HomeJourneyDisplayItem[] {
  return items.map(item => ({
    ...item,
    display: item.values[timeModes[item.id]] || item.values[0],
  }))
}

export function formatJourneyDisplayValue(display?: HomeJourneyDisplayValue) {
  if (!display) {
    return '0天'
  }

  switch (display.mode) {
    case 'years':
      return `${display.major}年 ${display.middle || '0'}个月 ${display.minor || '0'}天`
    case 'months':
      return `${display.major}个月 ${display.minor || '0'}天`
    case 'weeks':
      return `${display.major}周 ${display.minor || '0'}天`
    case 'days':
    default:
      return `${display.major}天`
  }
}
