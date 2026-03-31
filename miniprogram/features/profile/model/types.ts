import type { IconImagePair, IconName } from '../../../lib/icons'

export type ProfileTone = 'slate' | 'cyan' | 'orange' | 'emerald' | 'blue' | 'indigo' | 'violet' | 'rose' | 'amber'
export type ProfileMenuTone = 'slate' | 'emerald' | 'blue' | 'indigo' | 'amber'
export type ProfileNavMethod = 'navigateTo' | 'switchTab'

export type ProfileAvatarPreset = {
  id: string
  label: string
  src: string
}

export type ProfileMenuItem = {
  title: string
  desc?: string
  tone: ProfileMenuTone
  iconName: IconName
  iconColor: string
  url: string
  navMethod?: ProfileNavMethod
  badge?: string
  highlight?: boolean
}

export type ProfileMenuRuntimeItem = ProfileMenuItem & {
  cardKey: string
  navMethod: ProfileNavMethod
  badge: string
  highlight: boolean
  iconPair: IconImagePair
}

export type ProfileCurrentRank = {
  level: number
  name: string
  tone: ProfileTone
  iconPair: IconImagePair
}

export type ProfileViewModel = {
  user: {
    name: string
    checkInDays: number
    rank: {
      level: number
      name: string
      tone: ProfileTone
      iconName: IconName
      iconColor: string
    }
  }
  avatarPresets: ProfileAvatarPreset[]
  consoleItems: ProfileMenuItem[]
  aboutItems: ProfileMenuItem[]
  storageItems: ProfileMenuItem[]
}

export type ProfileRuntimeState = {
  user: {
    name: string
    checkInDays: number
  }
  currentAvatar: string
  currentRank: ProfileCurrentRank
}

export type ProfilePageState = {
  vm: ProfileViewModel
  currentAvatar: string
  draftAvatar: string
  currentRank: ProfileCurrentRank
  consoleItems: ProfileMenuRuntimeItem[]
  aboutItems: ProfileMenuRuntimeItem[]
  storageItems: ProfileMenuRuntimeItem[]
  icons: {
    headerPair: IconImagePair
    chevronRight: string
    camera: string
    cameraBlue: string
    messageSquare: string
    share2: string
    x: string
  }
}
