import type { IconImagePair } from '../../../lib/icons'

export type CommunityBenefitTone = 'orange' | 'blue' | 'emerald'

export type CommunityViewModel = {
  title: string
  badge: string
  headline: string
  highlight: string
  description: string
  groupUrl: string
  benefits: Array<{
    title: string
    desc: string
    tone: CommunityBenefitTone
  }>
}

export type CommunityPageState = {
  vm: CommunityViewModel
  benefits: Array<CommunityViewModel['benefits'][number] & {
    iconSrc: string
  }>
  icons: {
    arrowLeft: string
    star: string
    anchorPair: IconImagePair
  }
}
