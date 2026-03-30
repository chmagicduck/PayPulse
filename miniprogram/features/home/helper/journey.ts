import { HOME_JOURNEY_IDS, type HomeJourneyDisplayItem, type HomeJourneyItem, type JourneyId } from '../model/index'

export type JourneyTimeModes = Record<JourneyId, number>

export const INITIAL_JOURNEY_TIME_MODES: JourneyTimeModes = HOME_JOURNEY_IDS.reduce((result, id) => {
  result[id] = 0
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
