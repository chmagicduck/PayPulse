import { getLabCurrentRank } from '../../../lib/domain/lab-progress'
import { getCheckInDays } from '../../../lib/domain/daily-records'
import { readProfileSettings } from '../../profile-settings/model/storage'
import { readCurrentLabProgress } from '../../lab/model/actions'
import { readProfileAvatar } from './storage'
import { buildProfileCurrentRank, buildProfilePageState, getDefaultProfileAvatar, profileDashboardModel } from './view'

export function buildProfileRuntimeState() {
  const settings = readProfileSettings()
  const currentAvatar = readProfileAvatar() || getDefaultProfileAvatar()
  const labProgress = readCurrentLabProgress()
  const runtimeRank = getLabCurrentRank(labProgress.totalPoints)
  const currentRank = runtimeRank
    ? buildProfileCurrentRank({
        level: runtimeRank.level,
        name: runtimeRank.name,
        tone: runtimeRank.tone,
        iconName: runtimeRank.iconName,
        iconColor: runtimeRank.cardIconColor,
      })
    : buildProfileCurrentRank(profileDashboardModel.user.rank)

  return buildProfilePageState({
    user: {
      name: settings.nickname || profileDashboardModel.user.name,
      checkInDays: getCheckInDays(),
    },
    currentAvatar,
    currentRank,
  })
}
