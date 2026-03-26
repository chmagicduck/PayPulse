import { profileHomeModel } from '../model'
import { getCheckInDays } from '../../../lib/domain/daily-records'
import { readProfileSettings } from '../../profile-settings/model/storage'
import { readProfileAvatar } from './storage'

export function buildProfileSummaryState() {
  const settings = readProfileSettings()
  const currentAvatar = readProfileAvatar() || String(profileHomeModel.avatarPresets[0]?.src || '')
  return {
    user: {
      name: settings.nickname,
      checkInDays: getCheckInDays(),
    },
    currentAvatar,
  }
}
