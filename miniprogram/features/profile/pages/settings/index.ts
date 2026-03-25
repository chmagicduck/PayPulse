import { animatedIconPair, icon, type IconImagePair } from '../../../../lib/icons'
import { profileSettingsStaticViewModel } from '../../model/static'

const vm = profileSettingsStaticViewModel

Page({
  data: {
    vm,
    statusBarHeight: 0,
    form: {
      ...vm.form,
    },
    icons: {
      chevronLeft: '',
      compassPair: { staticSrc: '', animatedSrc: '' } as IconImagePair,
      anchor: '',
      user: '',
      calendar: '',
      briefcase: '',
      moon: '',
      sun: '',
      wallet: '',
      trendingUp: '',
      calendarDays: '',
      clock: '',
      coffee: '',
      checkCircle2: '',
    },
    iconAnimations: {
      banner: false,
    },
    pressStates: {
      save: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight: statusBarHeight || 0,
      icons: {
        chevronLeft: icon('chevron-left', '#475569', 22),
        compassPair: animatedIconPair('compass', {
          color: '#ffffff',
          animation: 'float',
          durationMs: 2600,
        }),
        anchor: icon('anchor', '#ffffff', 60),
        user: icon('user', '#3b82f6', 14),
        calendar: icon('calendar', '#3b82f6', 14),
        briefcase: icon('briefcase', '#3b82f6', 14),
        moon: icon('moon', '#3b82f6', 14),
        sun: icon('sun', '#3b82f6', 14),
        wallet: icon('wallet', '#3b82f6', 14),
        trendingUp: icon('trending-up', '#3b82f6', 14),
        calendarDays: icon('calendar-days', '#3b82f6', 14),
        clock: icon('clock', '#3b82f6', 14),
        coffee: icon('coffee', '#3b82f6', 14),
        checkCircle2: icon('check-circle-2', '#ffffff', 18),
      },
    })
  },

  handleBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }

    wx.reLaunch({ url: '/features/profile/pages/home/index' })
  },

  updateField(e: WechatMiniprogram.Input | WechatMiniprogram.CustomEvent) {
    const { field } = e.currentTarget.dataset
    if (!field) return

    const value = 'detail' in e && 'value' in e.detail ? e.detail.value : ''
    this.setData({
      [`form.${field}`]: value,
    })
  },

  chooseGender(e: WechatMiniprogram.TouchEvent) {
    const { value } = e.currentTarget.dataset
    if (!value) return
    this.setData({ 'form.gender': value })
  },

  chooseWorkMode(e: WechatMiniprogram.TouchEvent) {
    const { value } = e.currentTarget.dataset
    if (!value) return
    this.setData({ 'form.workMode': value })
  },

  toggleBigWeek() {
    this.setData({ 'form.isCurrentBigWeek': !this.data.form.isCurrentBigWeek })
  },

  toggleLunchBreak() {
    this.setData({ 'form.lunchBreakEnabled': !this.data.form.lunchBreakEnabled })
  },

  triggerBannerAnimation() {
    this.setData({ 'iconAnimations.banner': true })
    setTimeout(() => {
      this.setData({ 'iconAnimations.banner': false })
    }, 2200)
  },

  pressSave() {
    this.setData({ 'pressStates.save': true }, () => {
      setTimeout(() => {
        this.setData({ 'pressStates.save': false })
      }, 220)
    })
  },
})
