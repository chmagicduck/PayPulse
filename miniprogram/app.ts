// 微信小程序运行时对目录入口解析不如 Node 稳定，这里显式指向 index 文件。
import { defaultThemeId } from './theme/index'
import { setActiveThemeId } from './store/theme-store'

App({
  globalData: {
    activeThemeId: defaultThemeId,
  },
  onLaunch() {
    setActiveThemeId(defaultThemeId)
  },
})
