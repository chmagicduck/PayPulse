import { getLabRankIndexByPoints } from '../../../lib/domain/lab-progress'
import { buildLabPageState, buildRankDisplay } from '../lab.helper'
import { ensureLabProgressInitialized } from './actions'

export function buildLabRuntimeState() {
  const progress = ensureLabProgressInitialized()
  const actualRankIndex = getLabRankIndexByPoints(progress.totalPoints)
  const pageState = buildLabPageState(progress)
  const rankDisplay = buildRankDisplay(pageState.ranks, progress.selectedRankIndex, progress.totalPoints)

  return Object.assign({}, pageState, rankDisplay, {
    totalHappiness: progress.totalPoints,
    todayHappiness: progress.todayPoints,
    rankIndex: progress.selectedRankIndex,
    actualRankIndex,
    actualRank: pageState.ranks[actualRankIndex],
  })
}
