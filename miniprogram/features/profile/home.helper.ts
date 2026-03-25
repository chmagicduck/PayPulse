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
    case 'users':
      return 'wave'
    case 'info':
      return 'pulse'
    default:
      return 'float'
  }
}

export function buildProfilePageState() {
  const currentAvatar = String(profileHomeModel.avatarPresets[0].src)

  return {
    currentAvatar,
    draftAvatar: currentAvatar,
    consoleItems: profileHomeModel.consoleItems.map(item =>
      Object.assign({}, item, {
        iconPair: animatedIconPair(item.iconName, {
          color: item.iconColor,
          size: 18,
          animation: getProfileIconAnimation(item.iconName),
          durationMs: 2200,
        }),
      }),
    ),
    aboutItems: profileHomeModel.aboutItems.map(item =>
      Object.assign({}, item, {
        iconPair: animatedIconPair(item.iconName, {
          color: item.iconColor,
          size: 18,
          animation: getProfileIconAnimation(item.iconName),
          durationMs: 2200,
        }),
      }),
    ),
    storageCard: Object.assign({}, profileHomeModel.storageCard, {
      iconPair: animatedIconPair(profileHomeModel.storageCard.iconName, {
        color: profileHomeModel.storageCard.iconColor,
        size: 20,
        animation: getProfileIconAnimation(profileHomeModel.storageCard.iconName),
        durationMs: 2400,
      }),
    }),
    icons: {
      headerPair: animatedIconPair('user', {
        color: '#ffffff',
        size: 18,
        animation: 'float',
        durationMs: 2400,
      }),
      chevronRight: icon('chevron-right', '#cbd5e1', 18),
      x: icon('x', '#94a3b8', 20),
      checkCircle2: icon('check-circle-2', '#2563eb', 24),
      badgeSpark: animatedIconPair('sparkles', {
        color: '#2563eb',
        size: 12,
        animation: 'twinkle',
        durationMs: 2200,
      }),
    } as {
      headerPair: IconImagePair
      chevronRight: string
      x: string
      checkCircle2: string
      badgeSpark: IconImagePair
    },
  }
}
