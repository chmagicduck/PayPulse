import { profileSettingsModel } from './model'
import { buildSettingsIcons } from './settings.helper'
import { clearTimerBag, createTimerBag, handlePageBack, pulseState, replayState } from '../../lib/wx/page'

const timers = createTimerBag()

Page({
  data: {
    vm: profileSettingsModel,
    statusBarHeight: 0,
    form: {
      ...profileSettingsModel.form,
    },
    icons: buildSettingsIcons(),
    iconAnimations: {
      banner: false,
    },
    pressStates: {
      save: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  onUnload() {
    clearTimerBag(timers)
  },

  handleBack() {
    handlePageBack('/features/profile/home')
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
    const value = String(e.currentTarget.dataset.value || '')
    if (!value) return
    this.setData({ 'form.gender': value })
  },

  chooseWorkMode(e: WechatMiniprogram.TouchEvent) {
    const value = String(e.currentTarget.dataset.value || '')
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
    replayState(this, timers, 'settings-banner', 'iconAnimations.banner', true, false, 2200)
  },

  pressSave() {
    pulseState(this, timers, 'settings-save', 'pressStates.save', true, false)
  },
})
