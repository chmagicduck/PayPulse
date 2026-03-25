import { animatedIconPair, icon, type IconImagePair } from '../../lib/icons'
import { communityStaticViewModel } from './model'

export function buildCommunityPageState() {
  return {
    benefits: [
      { ...communityStaticViewModel.benefits[0], iconSrc: icon('coffee', '#ea580c', 22) },
      { ...communityStaticViewModel.benefits[1], iconSrc: icon('rocket', '#2563eb', 22) },
      { ...communityStaticViewModel.benefits[2], iconSrc: icon('wrench', '#10b981', 22) },
    ],
    icons: {
      arrowLeft: icon('arrow-left', '#475569', 20),
      share2: icon('share-2', '#475569', 20),
      star: icon('star', '#ffffff', 12),
      anchorPair: animatedIconPair('anchor', {
        color: '#3b82f6',
        animation: 'float',
        durationMs: 2600,
      }),
      users: icon('users', '#94a3b8', 14),
      messageSquare: icon('message-square', '#94a3b8', 14),
      globe: icon('globe', '#94a3b8', 14),
      chevronRight: icon('chevron-right', '#ffffff', 18),
    } as {
      arrowLeft: string
      share2: string
      star: string
      anchorPair: IconImagePair
      users: string
      messageSquare: string
      globe: string
      chevronRight: string
    },
  }
}
