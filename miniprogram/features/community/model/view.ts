import { animatedIconPair, icon } from '../../../lib/icons'
import type { CommunityPageState, CommunityViewModel } from './types'

export const communityViewModel: CommunityViewModel = {
  title: '加入组织',
  badge: '薪潮涌动官方摸鱼群',
  headline: '汇聚天下打工人',
  highlight: '共商摸鱼大计',
  description: '别一个人默默受苦了，加入组织，和大家一起交流摸鱼心得、抢先体验新功能。',
  groupUrl: 'https://work.weixin.qq.com/gm/fd6f1bdd86a54ac96a1254f542d23a8e',
  benefits: [
    { title: '摸鱼心得交流', desc: '各路职场老油条在线传授如何带薪划水，稳如老狗。', tone: 'orange' },
    { title: '新功能内测', desc: '好玩的新功能先发给群里体验，一起搞点有意思的。', tone: 'blue' },
    { title: '给开发者提需求', desc: '觉得哪里不好用？直接在群里吼一声，你的建议就是我们的排期。', tone: 'emerald' },
  ],
}

export function buildCommunityPageState(): CommunityPageState {
  return {
    vm: communityViewModel,
    benefits: [
      { ...communityViewModel.benefits[0], iconSrc: icon('coffee', '#ea580c', 22) },
      { ...communityViewModel.benefits[1], iconSrc: icon('rocket', '#2563eb', 22) },
      { ...communityViewModel.benefits[2], iconSrc: icon('wrench', '#10b981', 22) },
    ],
    icons: {
      arrowLeft: icon('arrow-left', '#475569', 20),
      star: icon('star', '#ffffff', 12),
      anchorPair: animatedIconPair('anchor', {
        color: '#3b82f6',
        animation: 'float',
        durationMs: 2600,
      }),
    },
  }
}
