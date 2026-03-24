import type { HomeDashboardSection } from './types'

export const homeDashboardSectionsSchema: HomeDashboardSection[] = [
  {
    id: 'docs-first',
    title: '先文档后实现',
    description: '任何正式页面开发都应先补 PRD，再进入 UI 还原。',
  },
  {
    id: 'feature-boundary',
    title: '按 Feature 收口',
    description: '业务状态和动作沉淀在 feature 自己的 model 目录中。',
  },
  {
    id: 'theme-layer',
    title: '主题统一收口',
    description: '视觉变化优先通过 theme token 与 recipe 实现。',
  },
]
