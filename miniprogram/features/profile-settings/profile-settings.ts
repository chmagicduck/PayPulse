import { clearTimerBag, createTimerBag, replayState, pulseState } from '../../lib/wx/page'
import { computeRetirementAge, getDefaultRetirementProfile } from '../../lib/domain/retirement'
import { isBootstrapReady, finishInitialSetup } from '../../store/bootstrap'
import { buildSettingsIcons } from './settings.helper'
import { validateProfileSettings } from './model/actions'
import { saveProfileSettings } from './model/save'
import { defaultProfileSettingsForm, toProfileSettingsForm } from './model/state'
import { readProfileSettings } from './model/storage'
import type { ProfileSettingsForm } from './model/types'

const timers = createTimerBag()

function syncRetirementFields(form: ProfileSettingsForm) {
  const retirementProfile = form.gender === 'male'
    ? 'male-60'
    : (form.retirementProfile || getDefaultRetirementProfile(form.gender, form.retirementProfile))

  return {
    ...form,
    retirementProfile,
    retirementAge: (!form.retirementAgeEditedByUser && form.birthday)
      ? String(computeRetirementAge(retirementProfile, form.birthday))
      : form.retirementAge,
  }
}

Page({
  data: {
    statusBarHeight: 0,
    bootstrapReady: false,
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
    const bootstrapReady = isBootstrapReady()
    if (bootstrapReady) {
      this.setData({
        bootstrapReady,
        form: toProfileSettingsForm(readProfileSettings()),
      })
    } else {
      this.setData({
        bootstrapReady,
        form: syncRetirementFields({ ...defaultProfileSettingsForm }),
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
    wx.switchTab({ url: '/features/home/home' })
  },

  updateField(e: WechatMiniprogram.Input | WechatMiniprogram.CustomEvent) {
    const { field } = e.currentTarget.dataset
    if (!field) return

    const value = 'detail' in e && 'value' in e.detail ? e.detail.value : ''
    const nextForm = {
      ...this.data.form,
      [String(field)]: value,
    }

    this.setData({
      form: field === 'birthday'
        ? syncRetirementFields(nextForm)
        : nextForm,
    })
  },

  chooseGender(e: WechatMiniprogram.TouchEvent) {
    const value = String(e.currentTarget.dataset.value || '')
    if (!value) return

    const nextForm = syncRetirementFields({
      ...this.data.form,
      gender: value as ProfileSettingsForm['gender'],
      retirementProfile: value === 'male' ? 'male-60' : getDefaultRetirementProfile('female', this.data.form.retirementProfile),
    })
    this.setData({ form: nextForm })
  },

  chooseRetirementProfile(e: WechatMiniprogram.TouchEvent) {
    const value = String(e.currentTarget.dataset.value || '')
    if (!value) return

    this.setData({
      form: syncRetirementFields({
        ...this.data.form,
        retirementProfile: value as ProfileSettingsForm['retirementProfile'],
      }),
    })
  },

  chooseWorkMode(e: WechatMiniprogram.TouchEvent) {
    const value = String(e.currentTarget.dataset.value || '')
    if (!value) return
    this.setData({ 'form.workMode': value })
  },

  updateRetirementAge(e: WechatMiniprogram.Input) {
    this.setData({
      'form.retirementAge': e.detail.value,
      'form.retirementAgeEditedByUser': true,
    })
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
