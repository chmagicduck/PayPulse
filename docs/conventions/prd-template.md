# PRD 模板规则

现在的 PRD 使用目录式版本文档：

- `docs/prd/<version>/README.md`

建议结构：

```text
docs/prd/<version>/
  README.md
  overview.md
  glossary.md
  domain-model.md
  data-model.md
  page-map.md
  acceptance.md
  pages/
    <page-name>.md
```

各文件职责：

- `README.md`：版本入口、阅读顺序、文档清单
- `overview.md`：版本目标、范围、非目标
- `glossary.md`：统一术语
- `domain-model.md`：共享业务逻辑、计算口径、跨页面依赖
- `data-model.md`：共享状态、持久化 key、字段约束、派生关系
- `page-map.md`：页面路由、入口、跳转和依赖链
- `acceptance.md`：版本级验收链路和回归重点
- `pages/*.md`：页面级 PRD

页面文档统一结构：

1. 页面目标
2. 入口与前置条件
3. 信息结构
4. 核心交互
5. 页面状态
6. 依赖的共享数据 / 共享规则
7. 空态 / 异常态 / 边界情况
8. 验收清单

要求：

- 共享业务规则不在页面文档重复抄写
- 共享数据结构不在页面文档重复贴字段表
- 页面文档只保留页面局部状态，例如弹层开关、草稿值、筛选态
- 只写当前版本要做的内容，不补大段背景故事
