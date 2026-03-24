import { defaultThemeId } from './theme'
import { setActiveThemeId } from './store/theme-store'

App({
  globalData: {
    activeThemeId: defaultThemeId,
  },
  onLaunch() {
    setActiveThemeId(defaultThemeId)
  },
})
