import {
  animatedIconPair,
  icon,
  type IconName,
  type SvgAnimationPreset,
} from '../../../lib/icons'
import type {
  ProfileCurrentRank,
  ProfileMenuItem,
  ProfileMenuRuntimeItem,
  ProfilePageState,
  ProfileRuntimeState,
  ProfileViewModel,
} from './types'

export const profileDashboardModel: ProfileViewModel = {
  user: {
    name: '摸鱼小队长',
    checkInDays: 10,
    rank: {
      level: 9,
      name: '摸鱼霸主',
      tone: 'rose',
      iconName: 'ship',
      iconColor: '#e11d48',
    },
  },
  avatarPresets: [
    { id: 'preset-1', label: 'Felix', src: '/assets/images/profile/avatar-felix.svg' },
    { id: 'preset-2', label: 'Aneka', src: '/assets/images/profile/avatar-aneka.svg' },
    { id: 'preset-3', label: 'Jasper', src: '/assets/images/profile/avatar-jasper.svg' },
    { id: 'preset-4', label: 'Milo', src: '/assets/images/profile/avatar-milo.svg' },
    { id: 'preset-5', label: 'Luna', src: '/assets/images/profile/avatar-luna.svg' },
    { id: 'preset-6', label: 'Zoe', src: '/assets/images/profile/avatar-zoe.svg' },
  ],
  consoleItems: [
    {
      title: '我的职场档案',
      desc: '管理生日薪资和作息',
      tone: 'blue',
      iconName: 'user',
      iconColor: '#3b82f6',
      url: '/features/profile-settings/profile-settings',
    },
    {
      title: '纪念日设置',
      desc: '把重要日子都记下来',
      tone: 'emerald',
      iconName: 'map-pin',
      iconColor: '#10b981',
      url: '/features/time-axis/time-axis',
    },
    {
      title: '查看打工日历',
      desc: '休假补班发薪一眼看清',
      tone: 'indigo',
      iconName: 'calendar',
      iconColor: '#4f46e5',
      url: '/features/calendar/calendar',
    },
  ],
  aboutItems: [
    {
      title: '加入组织',
      desc: '和群友交流摸鱼心得',
      tone: 'indigo',
      iconName: 'users',
      iconColor: '#6366f1',
      url: '/features/community/community',
    },
    {
      title: '关于薪潮涌动',
      desc: '看看版本理念和来路',
      tone: 'slate',
      iconName: 'info',
      iconColor: '#64748b',
      url: '/features/about/about',
    },
  ],
  storageItems: [
    {
      title: '数据同步中心',
      desc: '备份导出清空都在这',
      tone: 'amber',
      iconName: 'database',
      iconColor: '#f59e0b',
      highlight: true,
      url: '/features/data-center/data-center',
    },
  ],
}

function getProfileIconAnimation(name: IconName): SvgAnimationPreset {
  switch (name) {
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

function truncateProfileCardDesc(text: string, maxLength: number = 20) {
  const chars = Array.from(String(text || ''))
  if (chars.length <= maxLength) {
    return text
  }

  if (maxLength <= 1) {
    return '…'
  }

  return `${chars.slice(0, maxLength - 1).join('')}…`
}

function buildProfileMenuItems(group: string, items: ProfileMenuItem[], size: number = 18, durationMs: number = 2200): ProfileMenuRuntimeItem[] {
  return items.map((item, index) => ({
    ...item,
    desc: truncateProfileCardDesc(item.desc || ''),
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
  }))
}

export function getDefaultProfileAvatar() {
  return String(profileDashboardModel.avatarPresets[0]?.src || '')
}

export function buildProfileCurrentRank(rank: ProfileViewModel['user']['rank']): ProfileCurrentRank {
  return {
    level: rank.level,
    name: rank.name,
    tone: rank.tone,
    iconPair: animatedIconPair(rank.iconName, {
      color: rank.iconColor,
      size: 12,
      animation: getProfileIconAnimation(rank.iconName),
      durationMs: 2200,
    }),
  }
}

export function buildProfilePageState(runtimeState?: Partial<ProfileRuntimeState>): ProfilePageState {
  const currentAvatar = runtimeState?.currentAvatar || getDefaultProfileAvatar()
  const currentRank = runtimeState?.currentRank || buildProfileCurrentRank(profileDashboardModel.user.rank)

  return {
    vm: {
      ...profileDashboardModel,
      user: {
        ...profileDashboardModel.user,
        ...runtimeState?.user,
      },
    },
    currentAvatar,
    draftAvatar: currentAvatar,
    currentRank,
    consoleItems: buildProfileMenuItems('console', profileDashboardModel.consoleItems),
    aboutItems: buildProfileMenuItems('about', profileDashboardModel.aboutItems),
    storageItems: buildProfileMenuItems('storage', profileDashboardModel.storageItems),
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
      share2: icon('share-2', '#2563eb', 18),
      x: icon('x', '#94a3b8', 20),
    },
  }
}
