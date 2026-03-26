import { labStaticViewModel } from '../../features/lab/model'

export function getLabRankIndexByPoints(totalPoints: number) {
  const nextIndex = labStaticViewModel.ranks.findIndex(rank => totalPoints < rank.exp)
  if (nextIndex <= 0) {
    return nextIndex === -1 ? labStaticViewModel.ranks.length - 1 : 0
  }

  return nextIndex - 1
}

export function getLabCurrentRank(totalPoints: number) {
  return labStaticViewModel.ranks[getLabRankIndexByPoints(totalPoints)] || labStaticViewModel.ranks[0]
}
