import { clearTimerBag, createTimerBag, replayState, pulseState } from '../../lib/wx/page'
import { isBootstrapReady, finishInitialSetup } from '../../store/bootstrap'
import { buildSettingsIcons } from './settings.helper'
import { validateProfileSettings } from './model/actions'
import { saveProfileSettings } from './model/save'
import { defaultProfileSettingsForm, toProfileSettingsForm } from './model/state'
import { readProfileSettings } from './model/storage'

const timers = createTimerBag()

Page({
  data: {
    statusBarHeight: 0,
    form: {
      ...defaultProfileSettingsForm,
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

  onShow() {
    if (isBootstrapReady()) {
      this.setData({
        form: toProfileSettingsForm(readProfileSettings()),
      })
    }
  },

  onUnload() {
    clearTimerBag(timers)
  },

  handleBack() {
    if (!isBootstrapReady()) {
      return
    }
    if (getCurrentPages().length > 1) {
      wx.navigateBack({ delta: 1 })
      return
    }
    wx.switchTab({ url: '/features/home/dashboard' })
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
    const result = validateProfileSettings(this.data.form)
    if (!result.ok) {
      wx.showToast({
        title: result.message,
        icon: 'none',
      })
      return
    }

    const saveResult = saveProfileSettings(result.settings)
    wx.showToast({
      title: saveResult.initialized ? '初始化完成' : '保存成功',
      icon: 'success',
    })

    if (saveResult.initialized) {
      setTimeout(() => {
        finishInitialSetup()
      }, 180)
    }
  },
})
