import { clearTimerBag, createTimerBag, pulseState } from '../../lib/wx/page'
import { isBootstrapReady, finishInitialSetup } from '../../store/bootstrap'
import { applyGenderDefaults, buildProfileAgeLimits, patchProfileSettingsForm, syncProfileSettingsForm, updateRetirementAgeValue } from './helper/form'
import { buildSettingsIcons } from './helper/icons'
import { saveProfileSettings } from './helper/save'
import { validateProfileSettings } from './helper/validate'
import { genderOptions, workModeOptions } from './model/options'
import { defaultProfileSettingsForm, toProfileSettingsForm } from './model/schema'
import { readProfileSettings } from './model/storage'
import type { ProfileSettingsField, ProfileSettingsForm } from './model/types'

const timers = createTimerBag()

Page({
  data: {
    statusBarHeight: 0,
    bootstrapReady: false,
    form: syncProfileSettingsForm({ ...defaultProfileSettingsForm }),
    ageLimits: buildProfileAgeLimits(defaultProfileSettingsForm),
    genderOptions,
    workModeOptions,
    icons: buildSettingsIcons(),
    pressStates: {
      save: false,
    },
  },

  onLoad() {
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({ statusBarHeight: statusBarHeight || 0 })
  },

  onShow() {
    const bootstrapReady = isBootstrapReady()
    const form = bootstrapReady
      ? toProfileSettingsForm(readProfileSettings())
      : syncProfileSettingsForm({ ...defaultProfileSettingsForm })

    this.setData({
      bootstrapReady,
      form,
      ageLimits: buildProfileAgeLimits(form),
    })
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
    wx.switchTab({ url: '/features/home/home' })
  },

  updateField(e: WechatMiniprogram.Input | WechatMiniprogram.CustomEvent) {
    const field = e.currentTarget.dataset.field as ProfileSettingsField | undefined
    if (!field) return

    const value = 'detail' in e && 'value' in e.detail ? e.detail.value : ''
    const nextForm = patchProfileSettingsForm(this.data.form, field, value)

    this.setData({
      form: nextForm,
      ageLimits: buildProfileAgeLimits(nextForm),
    })
  },

  chooseGender(e: WechatMiniprogram.TouchEvent) {
    const value = String(e.currentTarget.dataset.value || '')
    if (!value) return

    const nextForm = applyGenderDefaults(this.data.form, value as ProfileSettingsForm['gender'])
    this.setData({
      form: nextForm,
      ageLimits: buildProfileAgeLimits(nextForm),
    })
  },

  chooseWorkMode(e: WechatMiniprogram.TouchEvent) {
    const value = String(e.currentTarget.dataset.value || '')
    if (!value) return

    this.setData({ 'form.workMode': value as ProfileSettingsForm['workMode'] })
  },

  updateRetirementAge(e: WechatMiniprogram.Input) {
    const nextForm = updateRetirementAgeValue(this.data.form, e.detail.value)
    this.setData({
      form: nextForm,
      ageLimits: buildProfileAgeLimits(nextForm),
    })
  },

  toggleBigWeek() {
    this.setData({ 'form.isCurrentBigWeek': !this.data.form.isCurrentBigWeek })
  },

  toggleLunchBreak() {
    this.setData({ 'form.lunchBreakEnabled': !this.data.form.lunchBreakEnabled })
  },

  handleNicknameReview(e: WechatMiniprogram.CustomEvent<{ pass: boolean; timeout: boolean }>) {
    if (e.detail.timeout) {
      wx.showToast({
        title: '昵称审核中，请稍后确认',
        icon: 'none',
      })
      return
    }

    if (!e.detail.pass) {
      wx.showToast({
        title: '昵称未通过审核，请重新输入',
        icon: 'none',
      })
    }
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
