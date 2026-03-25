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

## 版本文档职责

- `README.md`：版本入口、阅读顺序、事实来源标签说明
- `overview.md`：版本目标、范围、非目标
- `glossary.md`：统一术语
- `domain-model.md`：共享业务逻辑、计算口径、跨页面依赖、启动和重置流程
- `data-model.md`：共享状态、持久化 key、字段约束、派生关系
- `page-map.md`：页面路由、入口、跳转和依赖链
- `acceptance.md`：版本级验收链路和回归重点
- `pages/*.md`：页面级 PRD

## 事实来源标签

PRD 中的关键结论必须标注来源：

- `页面直接事实`
- `跨页推理`
- `闭环假设`

推荐写法：

```text
来源：页面直接事实
来源：跨页推理
来源：闭环假设
```

## 页面文档统一结构

1. 页面目标
2. 入口与前置条件
3. 信息结构
4. 核心交互
5. 页面状态
6. 依赖的共享数据 / 共享规则
7. 空态 / 异常态 / 边界情况
8. 验收清单

## 编写要求

- 共享业务规则不在页面文档重复抄写
- 共享数据结构不在页面文档重复贴字段表
- 页面文档只保留页面局部状态，例如弹层开关、草稿值、筛选态
- 只写当前版本要做的内容，不补大段背景故事
- 遇到静态 mock 数字时，优先转译成字段、规则、默认值和假设，而不是原样照抄
