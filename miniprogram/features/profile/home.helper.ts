import {
  animatedIconPair,
  icon,
  type IconImagePair,
  type IconName,
  type SvgAnimationPreset,
} from '../../lib/icons'
import { profileHomeModel } from './model'

function getProfileIconAnimation(name: IconName): SvgAnimationPreset {
  switch (name) {
    case 'user':
    case 'database':
      return 'float'
    case 'calendar':
      return 'bounce'
    case 'map-pin':
      return 'drift'
    case 'target':
      return 'pulse'
    case 'users':
      return 'wave'
    case 'info':
      return 'pulse'
    case 'ship':
      return 'float'
    default:
      return 'float'
  }
}

function buildProfileMenuItems<
  T extends ReadonlyArray<{
    iconName: IconName
    iconColor: string
    navMethod?: string
    badge?: string
    highlight?: boolean
  }>
>(group: string, items: T, size: number = 18, durationMs: number = 2200) {
  return items.map((item, index) =>
    Object.assign({}, item, {
      cardKey: `${group}-${index}`,
      navMethod: item.navMethod || 'navigateTo',
      badge: item.badge || '',
      highlight: Boolean(item.highlight),
      iconPair: animatedIconPair(item.iconName, {
        color: item.iconColor,
        size,
        animation: getProfileIconAnimation(item.iconName),
        durationMs,
      }),
    }),
  )
}

type ProfileCurrentRank = {
  level: number
  name: string
  tone: string
  iconPair: IconImagePair
}

export function buildProfilePageState() {
  const currentAvatar = String(profileHomeModel.avatarPresets[0].src)
  const currentRank: ProfileCurrentRank = {
    level: profileHomeModel.user.rank.level,
    name: profileHomeModel.user.rank.name,
    tone: profileHomeModel.user.rank.tone,
    iconPair: animatedIconPair(profileHomeModel.user.rank.iconName, {
      color: profileHomeModel.user.rank.iconColor,
      size: 12,
      animation: getProfileIconAnimation(profileHomeModel.user.rank.iconName),
      durationMs: 2200,
    }),
  }

  return {
    currentAvatar,
    draftAvatar: currentAvatar,
    currentRank,
    consoleItems: buildProfileMenuItems('console', profileHomeModel.consoleItems),
    aboutItems: buildProfileMenuItems('about', profileHomeModel.aboutItems),
    storageItems: buildProfileMenuItems('storage', profileHomeModel.storageItems),
    icons: {
      headerPair: animatedIconPair('user', {
        color: '#ffffff',
        size: 18,
        animation: 'float',
        durationMs: 2400,
      }),
      chevronRight: icon('chevron-right', '#cbd5e1', 18),
      camera: icon('camera', '#ffffff', 14),
      cameraBlue: icon('camera', '#2563eb', 18),
      messageSquare: icon('message-square', '#059669', 18),
      x: icon('x', '#94a3b8', 20),
    } as {
      headerPair: IconImagePair
      chevronRight: string
      camera: string
      cameraBlue: string
      messageSquare: string
      x: string
    },
  }
}
