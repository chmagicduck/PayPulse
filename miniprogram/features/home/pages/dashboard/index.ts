import { homeDashboardPageMeta } from './page.config'
import { buildHomeDashboardViewModel } from '../../model/state'

Page({
  data: {
    meta: homeDashboardPageMeta,
    sections: buildHomeDashboardViewModel(),
  },
})
