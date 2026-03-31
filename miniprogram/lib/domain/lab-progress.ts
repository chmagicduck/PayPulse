import { labDashboardModel } from '../../features/lab/model/index'

export function getLabRankIndexByPoints(totalPoints: number) {
  const nextIndex = labDashboardModel.ranks.findIndex(rank => totalPoints < rank.exp)
  if (nextIndex <= 0) {
    return nextIndex === -1 ? labDashboardModel.ranks.length - 1 : 0
  }

  return nextIndex - 1
}

export function getLabCurrentRank(totalPoints: number) {
  return labDashboardModel.ranks[getLabRankIndexByPoints(totalPoints)] || labDashboardModel.ranks[0]
}
