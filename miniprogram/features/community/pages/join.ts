import { animatedIconPair, icon, type IconImagePair } from '../../../lib/icons'
import { communityStaticViewModel } from '../model/static'

const vm = communityStaticViewModel

Page({
  data: {
    vm,
    statusBarHeight: 0,
    benefits: [] as Array<(typeof vm.benefits)[number] & { iconSrc: string }>,
    icons: {
      arrowLeft: '',
      share2: '',
      star: '',
      anchorPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      users: '',
      messageSquare: '',
      globe: '',
      chevronRight: '',
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      benefits: [
        { ...vm.benefits[0], iconSrc: icon('coffee', '#ea580c', 22) },
        { ...vm.benefits[1], iconSrc: icon('rocket', '#2563eb', 22) },
        { ...vm.benefits[2], iconSrc: icon('wrench', '#10b981', 22) },
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
      },
    })
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }

    wx.reLaunch({ url: '/features/profile/pages/home' })
  },
})
