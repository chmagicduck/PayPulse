import type { IconImagePair, IconName } from '../../../lib/icons'

export type LabRankTheme = 'basic' | 'mid' | 'high' | 'ultra'
export type LabRankTone = 'slate' | 'cyan' | 'orange' | 'emerald' | 'blue' | 'indigo' | 'violet' | 'rose' | 'amber'
export type LabTaskTone = 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo'

export type LabRankStaticItem = {
  level: number
  name: string
  exp: number
  iconName: IconName
  tone: LabRankTone
  theme: LabRankTheme
  iconColor: string
  cardIconColor: string
}

export type LabTaskStaticItem = {
  id: string
  title: string
  desc: string
  reward: number
  count: number
  limit: number
  tone: LabTaskTone
  iconName: IconName
  rotate?: boolean
}

export type LabAchievementStaticItem = {
  id: string
  title: string
  desc: string
  reward: number
  progress: number
  target: number
  unit?: string
}

export type LabStaticViewModel = {
  header: {
    title: string
  }
  rankPanel: {
    eyebrow: string
    stagePrefix: string
    stageSuffix: string
    todayLabel: string
    totalLabel: string
    targetLabel: string
    maxLabel: string
  }
  sections: {
    tasks: {
      title: string
      subtitle: string
      progressLabel: string
      rewardSuffix: string
      doneText: string
    }
    achievements: {
      title: string
      rewardPrefix: string
    }
  }
  ranks: LabRankStaticItem[]
  tasks: readonly LabTaskStaticItem[]
  achievements: LabAchievementStaticItem[]
}

export type LabRankRuntimeItem = LabRankStaticItem & {
  axisActiveIconPair: IconImagePair
  axisInactiveIconPair: IconImagePair
  cardIconPair: IconImagePair
  locked: boolean
  lockHint: string
}

export type LabTaskRuntimeItem = LabTaskStaticItem & {
  iconPair: IconImagePair
  countText: string
  progressPercent: number
  badgeText: string
  done: boolean
  minusActionKey: string
  plusActionKey: string
}

export type LabAchievementRuntimeItem = LabAchievementStaticItem & {
  progressPercent: number
}

export type LabViewModel = {
  copy: {
    header: LabStaticViewModel['header']
    rankPanel: LabStaticViewModel['rankPanel']
    sections: LabStaticViewModel['sections']
  }
  totalHappiness: number
  todayHappiness: number
  rankIndex: number
  ranks: LabRankRuntimeItem[]
  tasks: LabTaskRuntimeItem[]
  achievements: LabAchievementRuntimeItem[]
  currentRank: LabRankRuntimeItem
  nextRank: LabRankRuntimeItem | null
  pointsToNext: number
  progressPercent: number
  icons: {
    labPair: IconImagePair
    trophyAmber: string
    medalGhost: string
    starPair: IconImagePair
    sparklesPair: IconImagePair
  }
}
