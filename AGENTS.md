# AGENTS.md

本文件面向在本仓库协作的智能体与开发者，作用是快速说明 `miniprogram/` 的目录边界、文件职责、样式入口与数据流落点，减少在错误目录改动代码的概率。

## 工作范围

- 默认工作区是 `miniprogram/`，页面、局部模型、主题和共享组件都在这里。
- `features/` 是业务页面主战场，优先在目标 feature 内闭环修改。
- 跨页面复用逻辑优先沉淀到 `lib/`、`components/`、`theme/` 或 `store/`。
- 视觉规范入口在 `theme/tokens.less`、`theme/foundations/typography.less`、`theme/foundations/mixins.less`。
- 应用初始化与存储修复入口在 `store/bootstrap.ts`。

## `miniprogram/` 根目录

- `app.ts`：小程序全局入口，当前只挂载空的 `globalData`。
- `app.json`：全局页面注册、`tabBar`、窗口样式、插件与 Skyline 渲染配置。
- `app.less`：全局基础样式兜底，定义根级背景色、默认文字色和字体族。
- `sitemap.json`：小程序 sitemap 配置。

## `miniprogram/assets/`

- `images/profile/`：个人中心头像资源，当前是多套 SVG 头像预设，供 `profile` feature 选择或展示。
- `images/tabbar/`：底部导航 PNG 图标资源，给 `app.json` 的原生 tabBar 使用。
- `images/tabbar/svg/`：底部导航 SVG 版本图标，给页面内或辅助构建逻辑使用。

## `miniprogram/components/`

### `components/ui/pp-section-header/`

- `index.ts`：通用分区标题组件逻辑，处理副标题、标签、管理态、色调等属性。
- `index.wxml`：分区标题组件结构。
- `index.less`：分区标题组件样式，依赖全局主题 token 与排版 mixin。
- `index.json`：组件声明文件。

### `components/ui/pp-menu-card/`

- `index.ts`：菜单卡片组件逻辑，处理点击、强调态和色调。
- `index.wxml`：菜单卡片组件结构。
- `index.less`：菜单卡片组件样式，封装图标区、标题、副标题和按压态。
- `index.json`：组件声明文件。

## `miniprogram/config/`

- `routes.ts`：应用全部页面路由清单，区分 tab 页与普通页，是页面导航的静态事实源。
- `tabbar.ts`：底部 tab 配置的 TS 版本，包含图标与文案元信息。
- `feature-manifest.ts`：预留的 feature 清单，目前为空。

## `miniprogram/features/`

- `README.md`：feature 目录约定说明，强调每个 feature 以页面文件、`model.ts` 和局部逻辑为单位组织。

### `features/home/`

- `home.ts`：领航中心页面逻辑，处理首页生命周期、交互反馈、弹层与卡片动作。
- `home.wxml`：首页结构。
- `home.less`：首页样式，也是当前字号和颜色使用最丰富的页面之一。
- `home.json`：首页页面配置，注册 `pp-section-header`。
- `model.ts`：首页 feature 的静态结构定义与 scaffold 标记读写。
- `public.ts`：对外暴露首页视图模型构建函数与类型，供其他模块引用。
- `dashboard.helper.ts`：首页展示辅助层，负责图标、旅程展示项、状态映射等 UI 组装。
- `model/state.ts`：首页运行时状态构建，基于 profile、daily-records 等域模型拼出页面数据。

### `features/report/`

- `report.ts`：洋流战报页面逻辑，处理 tab 切换、范围切换、图表交互与弹层开关。
- `report.wxml`：报表页结构。
- `report.less`：报表页样式，包含趋势卡、比例条、历史卡、sheet 等视觉实现。
- `report.json`：报表页配置，注册 `pp-section-header`。
- `model.ts`：报表静态文案、年度卡片和历史示例等页面素材。
- `ocean-report.helper.ts`：报表展示辅助层，生成环形 SVG、年度卡片、图标与历史项展示数据。
- `model/state.ts`：报表运行时状态构建，把日记录和设置数据转成图表与摘要展示状态。

### `features/lab/`

- `lab.ts`：动力实验室页面逻辑，处理任务计数、榜单切换、成就弹层等交互。
- `lab.wxml`：实验室页面结构。
- `lab.less`：实验室样式，包含等级卡、任务卡、成就、轴线等复杂视觉。
- `lab.json`：实验室页面配置。
- `model.ts`：实验室静态数据源，定义等级、任务、成就等基础模型。
- `lab.helper.ts`：实验室展示辅助层，把静态模型和运行时进度拼成页面需要的最终数据。
- `lab.helper.ts` 还负责等级色调、徽章文案、默认快照与图标颜色推导。
- `model/storage.ts`：实验室进度存储层，负责默认值、归一化、读写本地缓存。
- `model/state.ts`：实验室运行时状态入口，面向页面返回当前快照。
- `model/actions.ts`：实验室业务动作层，处理任务加减、成就重算、周维度重置与选中等级更新。

### `features/profile/`

- `profile.ts`：个人基地页面逻辑，处理菜单动作、头像选择弹层和导航跳转。
- `profile.wxml`：个人中心页面结构。
- `profile.less`：个人中心样式，包含头像卡、菜单卡、统计卡和弹窗样式。
- `profile.json`：个人中心页面配置，注册 `pp-section-header` 和 `pp-menu-card`。
- `model.ts`：个人中心静态配置，包含头像预设、菜单项与页面静态内容。
- `home.helper.ts`：个人页展示辅助层，组装菜单项、图标动画和页面展示数据。
- `model/state.ts`：个人页运行时摘要状态构建，包含用户等级、头像、菜单与统计区数据。
- `model/storage.ts`：个人头像的本地读写封装。

### `features/profile-settings/`

- `profile-settings.ts`：航行档案设置页逻辑，处理表单录入、退休字段联动、初始化保存与返回逻辑。
- `profile-settings.wxml`：档案设置页结构，承载资料、收入、排班与午休配置表单。
- `profile-settings.less`：档案设置页样式，目前以表单字段、分段器、模式网格和底部保存条为主。
- `profile-settings.json`：页面配置，注册 `pp-section-header`。
- `model.ts`：档案设置 feature 的静态文案与配置入口。
- `settings.helper.ts`：设置页图标构建与展示辅助逻辑。
- `README.md`：该 feature 的职责说明。
- `model/schema.ts`：档案设置领域默认值、表单转换和退休规则映射。
- `model/state.ts`：对 `schema.ts` 的状态导出封装。
- `model/storage.ts`：档案设置本地存储读写层。
- `model/actions.ts`：档案设置表单校验逻辑。
- `model/save.ts`：档案设置保存入口，串联 bootstrap 初始化或普通保存流程。
- `model/types.ts`：档案设置表单类型与校验结果类型定义。

### `features/time-axis/`

- `time-axis.ts`：时间轴页面逻辑，处理列表切换、表单弹层、编辑与删除事件。
- `time-axis.wxml`：时间轴页面结构。
- `time-axis.less`：时间轴样式，包含笔记本切换、事件卡片、编辑 sheet 与 badge。
- `time-axis.json`：时间轴页面配置，注册 `pp-section-header`。
- `model.ts`：时间轴静态模型，定义页面级静态内容或展示素材。
- `time-axis-settings.helper.ts`：时间轴展示辅助层，处理倒计时、色调映射、图标与列表装饰。
- `model/storage.ts`：时间轴事件存储层，负责系统事件补全、归一化、默认数据与读写缓存。
- `model/actions.ts`：时间轴保存、删除等业务动作入口。
- `model/types.ts`：时间轴表单类型定义。

### `features/calendar/`

- `calendar.ts`：日历页逻辑，处理月份切换、选中日期与详情刷新。
- `calendar.wxml`：日历页结构。
- `calendar.less`：日历页样式，包含月历网格、选中态和统计提示。
- `calendar.json`：日历页配置。
- `model.ts`：日历静态页面模型。
- `calendar.helper.ts`：日历图标与轻量展示辅助逻辑。
- `model/state.ts`：月历运行时状态构建，输出月份网格与选中日详情。

### `features/community/`

- `community.ts`：社区页逻辑，处理加入社群、复制、分享与交互反馈。
- `community.wxml`：社区页结构。
- `community.less`：社区页样式，含 hero、权益卡、CTA 区和页签样式。
- `community.json`：社区页配置。
- `model.ts`：社区页静态数据源，如权益项和文案。
- `join.helper.ts`：社区页图标与展示态辅助构建。

### `features/about/`

- `about.ts`：关于页逻辑，处理 tab 切换和页面展示数据绑定。
- `about.wxml`：关于页结构。
- `about.less`：关于页样式，涵盖品牌头图、版本信息、更新记录与理念模块。
- `about.json`：关于页配置。
- `model.ts`：关于页静态内容数据源。
- `about.helper.ts`：关于页图标构建与展示辅助。

### `features/data-center/`

- `data-center.ts`：数据中心页面逻辑，处理导出、重置、弹层动画与交互反馈。
- `data-center.wxml`：数据中心页面结构。
- `data-center.less`：数据中心样式，覆盖统计卡、导出按钮、重置确认弹层等。
- `data-center.json`：数据中心页面配置。
- `model.ts`：数据中心静态文案和页面配置。
- `data-center.helper.ts`：数据中心图标与展示辅助构建。
- `model/actions.ts`：数据中心业务动作层，负责存储占用测量、数据导出与业务数据清空。

## `miniprogram/lib/`

### `lib/constants/`

- `storage.ts`：统一声明本地缓存 key，供各 feature 与 bootstrap 共用。

### `lib/domain/`

- `types.ts`：全局领域类型中心，定义设置、日记录、时间轴、实验室、导出包等核心类型。
- `date.ts`：日期与时间基础函数，提供 key 格式化、日期偏移、月份计算和时段秒数计算。
- `format.ts`：时长和金额格式化工具。
- `calendar-config.ts`：节假日与特殊日期配置源，目前包含按年份的日历配置。
- `calendar.ts`：工作日历域逻辑，负责工作日判定、详情构建、提醒与相对日期文案。
- `daily-records.ts`：核心业务域，负责航行记录读写、工资秒值、今日仪表盘与报表状态构建。
- `retirement.ts`：退休规则计算域，处理法定退休口径、退休年龄与退休日期。
- `moyu-session.ts`：摸鱼会话状态机，负责开始、同步、恢复和结束摸鱼计时。
- `migrations.ts`：缓存迁移入口，处理历史数据结构升级。
- `time-fields.ts`：时间输入字段的清洗和格式化。
- `lab-progress.ts`：实验室等级进度计算辅助。

### `lib/format/`

- `title.ts`：标题格式化工具，主要把 feature 标识转成人类可读标题。

### `lib/guards/`

- `is-object.ts`：对象类型守卫。

### `lib/wx/`

- `storage.ts`：对微信存储 API 的安全封装，统一 fallback 与异常处理。
- `page.ts`：页面层工具，封装 `setData` patch、计时器袋、按压态脉冲、弹层开关与返回处理。

### `lib/icons.ts`

- `icons.ts`：SVG 图标中心，提供图标路径、动画图标对、场景图标和 data URI 构建能力。

## `miniprogram/store/`

- `bootstrap.ts`：应用启动总控，负责初始化、迁移、默认数据补齐、导出和重置。
- `app-store.ts`：轻量级内存态，当前只记录最后访问路由。

## `miniprogram/theme/`

- `tokens.less`：全局设计 token，集中定义颜色、间距、圆角、卡片 padding、字号、阴影和动效时长。

### `theme/entries/`

- `core.less`：核心样式入口，汇总 token、mixins、animation 与 typography。
- `static-page.less`：静态页面入口，在 `core.less` 基础上叠加 `base.less`。

### `theme/foundations/`

- `base.less`：页面基础 reset，定义 `page` 默认背景、文字色、字体族和通用 icon 尺寸类。
- `typography.less`：排版工具与常用标题/副标题 mixin。
- `mixins.less`：卡片、弹层、按钮、按压态等复用 mixin。
- `animation.less`：全局动效定义。
- `rank-panel.less`：实验室等级面板等场景的样式基座。

## `miniprogram/types/`

- `feature.ts`：feature 元信息类型定义。

## 协作提示

- 页面级交互优先修改对应 feature 的 `*.ts`、`*.wxml`、`*.less`。
- 影响多个页面的视觉改动优先回收至 `theme/` 与共享组件，不要在多个 feature 重复写值。
- 任何涉及本地缓存字段变更的改动，都要同步检查 `lib/constants/storage.ts`、`lib/domain/migrations.ts` 和对应 feature 的 `model/storage.ts`。
- 任何新增页面都要同步更新 `app.json`、`config/routes.ts`，如果属于 tab 页，还要检查 `config/tabbar.ts` 与图标资源。
