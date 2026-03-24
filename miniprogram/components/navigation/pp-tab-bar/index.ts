Component({
  properties: {
    activeTab: {
      type: String,
      value: 'home',
    },
  },

  data: {
    tabs: [
      {
        key: 'home',
        label: '领潮中心',
        icon: '/assets/images/tabbar/tab-home.png',
        activeIcon: '/assets/images/tabbar/tab-home-active.png',
        url: '/features/home/pages/dashboard/index',
      },
      {
        key: 'report',
        label: '洋流战报',
        icon: '/assets/images/tabbar/tab-chart.png',
        activeIcon: '/assets/images/tabbar/tab-chart-active.png',
        url: '/features/report/pages/ocean-report/index',
      },
      {
        key: 'lab',
        label: '动力室',
        icon: '/assets/images/tabbar/tab-lab.png',
        activeIcon: '/assets/images/tabbar/tab-lab-active.png',
        url: '/features/lab/pages/lab/index',
      },
      {
        key: 'profile',
        label: '个人基地',
        icon: '/assets/images/tabbar/tab-profile.png',
        activeIcon: '/assets/images/tabbar/tab-profile-active.png',
        url: '/features/profile/pages/home/index',
      },
    ],
    safeAreaBottom: 0,
  },

  lifetimes: {
    attached() {
      const sysInfo = wx.getSystemInfoSync()
      const safeArea = sysInfo.safeArea
      if (safeArea) {
        const safeAreaBottom = sysInfo.screenHeight - safeArea.bottom
        this.setData({ safeAreaBottom })
      }
    },
  },

  methods: {
    onTabTap(e: WechatMiniprogram.TouchEvent) {
      const { key, url } = e.currentTarget.dataset
      if (key === this.data.activeTab) return
      wx.reLaunch({ url })
    },
  },
})
