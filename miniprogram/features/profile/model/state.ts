import { animatedIconPair } from '../../../lib/icons'
import { getLabCurrentRank } from '../../../lib/domain/lab-progress'
import { profileHomeModel } from '../model'
import { getCheckInDays } from '../../../lib/domain/daily-records'
import { readProfileSettings } from '../../profile-settings/model/storage'
import { readCurrentLabProgress } from '../../lab/model/actions'
import { readProfileAvatar } from './storage'

export function buildProfileSummaryState() {
  const settings = readProfileSettings()
  const currentAvatar = readProfileAvatar() || String(profileHomeModel.avatarPresets[0]?.src || '')
  const labProgress = readCurrentLabProgress()
  const runtimeRank = getLabCurrentRank(labProgress.totalPoints)
  const currentRank = runtimeRank
      ? {
          level: runtimeRank.level,
          name: runtimeRank.name,
          tone: runtimeRank.tone,
          iconPair: animatedIconPair(runtimeRank.iconName as any, {
            color: runtimeRank.cardIconColor,
            size: 12,
            animation: 'float',
            durationMs: 2200,
          }),
      }
    : {
        level: profileHomeModel.user.rank.level,
        name: profileHomeModel.user.rank.name,
        tone: profileHomeModel.user.rank.tone,
        iconPair: animatedIconPair(profileHomeModel.user.rank.iconName, {
          color: profileHomeModel.user.rank.iconColor,
          size: 12,
          animation: 'float',
          durationMs: 2200,
        }),
      }

  return {
    user: {
      name: settings.nickname,
      checkInDays: getCheckInDays(),
    },
    currentAvatar,
    currentRank,
  }
}
