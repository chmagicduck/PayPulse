import { clearTimerBag, createTimerBag, pulseState } from '../../lib/wx/page'
import { buildAppShareMessage, buildAppTimelineShare, showAppShareMenu } from '../../lib/wx/share'
import { isBootstrapReady, finishInitialSetup } from '../../store/bootstrap'
import { applyGenderDefaults, buildDailyWorkDuration, buildProfileAgeLimits, patchProfileSettingsForm, syncProfileSettingsForm, updateRetirementAgeValue } from './helper/form'
import { buildSettingsIcons } from './helper/icons'
import { saveProfileSettings } from './helper/save'
import { validateProfileSettings } from './helper/validate'
import { genderOptions, workModeOptions } from './model/options'
import { defaultProfileSettingsForm, toProfileSettingsForm } from './model/schema'
import { readProfileSettings } from './model/storage'
import type { ProfileSettingsField, ProfileSettingsForm } from './model/types'

const timers = createTimerBag()
const defaultForm = syncProfileSettingsForm({ ...defaultProfileSettingsForm })

function buildPageState(form: ProfileSettingsForm) {
  return {
    form,
    ageLimits: buildProfileAgeLimits(form),
    dailyWorkDuration: buildDailyWorkDuration(form),
  }
}

Page({
  data: {
    statusBarHeight: 0,
    bootstrapReady: false,
    ...buildPageState(defaultForm),
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
    showAppShareMenu()
  },

  onShow() {
    showAppShareMenu()
    const bootstrapReady = isBootstrapReady()
    const form = bootstrapReady
      ? toProfileSettingsForm(readProfileSettings())
      : defaultForm

    this.setData({
      bootstrapReady,
      ...buildPageState(form),
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
      ...buildPageState(nextForm),
    })
  },

  chooseGender(e: WechatMiniprogram.TouchEvent) {
    const value = String(e.currentTarget.dataset.value || '')
    if (!value) return

    const nextForm = applyGenderDefaults(this.data.form, value as ProfileSettingsForm['gender'])
    this.setData({
      ...buildPageState(nextForm),
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
      ...buildPageState(nextForm),
    })
  },

  toggleBigWeek() {
    this.setData({ 'form.isCurrentBigWeek': !this.data.form.isCurrentBigWeek })
  },

  toggleLunchBreak() {
    const nextForm = {
      ...this.data.form,
      lunchBreakEnabled: !this.data.form.lunchBreakEnabled,
    }
    this.setData(buildPageState(nextForm))
  },

  handleNicknameReview(e: WechatMiniprogram.CustomEvent<{ pass: boolean; timeout: boolean }>) {
    if (e.detail.timeout) {
      wx.showToast({
        title: '昵称审核中，等一会儿就好',
        icon: 'none',
      })
      return
    }

    if (!e.detail.pass) {
      wx.showToast({
        title: '这昵称不行，换一个吧',
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
      title: saveResult.initialized ? '档案建立成功' : '保存成功',
      icon: 'success',
    })

    if (saveResult.initialized) {
      setTimeout(() => {
        finishInitialSetup()
      }, 180)
    }
  },

  onShareAppMessage() {
    return buildAppShareMessage()
  },

  onShareTimeline() {
    return buildAppTimelineShare()
  },
})
