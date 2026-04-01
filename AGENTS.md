# AGENTS.md

本文件面向在本仓库协作的智能体与开发者，作用是快速说明 `miniprogram/` 的目录边界、文件职责、样式入口与数据流落点，减少在错误目录改动代码的概率。内容以当前仓库真实结构为准。

## 工作范围

- 默认工作区是 `miniprogram/`，页面、局部模型、主题和共享组件都在这里。
- `features/` 是业务页面主战场，优先在目标 feature 内闭环修改。
- 当前大多数 feature 采用 `页面文件 + helper/ + model/` 分层，推荐结构以 `features/README.md` 为准；`onboarding/` 和 `profile-settings/` 是相对轻量的特例。
- 跨页面复用逻辑优先沉淀到 `lib/`、`components/`、`theme/` 或 `store/`。
- 视觉规范入口在 `theme/tokens.less`、`theme/foundations/typography.less`、`theme/foundations/mixins.less`。
- 应用初始化、重置、导出与存储登记入口分别在 `store/bootstrap.ts` 和 `store/storage-registry.ts`。
- 分享能力与默认分享图入口在 `lib/wx/share.ts` 和 `assets/images/share/`。

## `miniprogram/` 根目录

- `app.ts`：小程序全局入口，当前只挂载空的 `globalData`。
- `app.json`：全局页面注册、原生 `tabBar`、窗口样式、分享相关页面路由、插件与 Skyline 渲染配置。
- `app.less`：全局基础样式兜底，定义根级背景色、默认文字色和字体族。
- `sitemap.json`：小程序 sitemap 配置。

## `miniprogram/assets/`

- `images/profile/`：个人中心头像资源，当前是多套 SVG 头像预设，供 `profile` feature 选择或展示。
- `images/tabbar/`：底部导航 PNG 图标资源，给 `app.json` 的原生 tabBar 使用。
- `images/tabbar/svg/`：底部导航 SVG 版本图标，给页面内逻辑或配置构建使用。
- `images/share/`：分享封面资源，当前由 `lib/wx/share.ts` 统一引用。

## `miniprogram/components/`

### `components/ui/pp-section-header/`

- `index.ts`：通用分区标题组件逻辑，处理副标题、标签、管理态和色调等属性。
- `index.wxml`：分区标题组件结构。
- `index.less`：分区标题组件样式，依赖全局主题 token 与排版 mixin。
- `index.json`：组件声明文件。

### `components/ui/pp-menu-card/`

- `index.ts`：菜单卡片组件逻辑，处理点击、强调态和色调。
- `index.wxml`：菜单卡片组件结构。
- `index.less`：菜单卡片组件样式，封装图标区、标题、副标题和按压态。
- `index.json`：组件声明文件。

### `components/ui/pp-brand-header/`

- `index.ts`：品牌头部组件逻辑，处理标题、Logo、右侧动作图标与点击事件。
- `index.wxml`：品牌头部组件结构。
- `index.less`：品牌头部组件样式，服务首页、实验室、个人中心等自定义头部。
- `index.json`：组件声明文件。

### `components/ui/pp-metric-card/`

- `index.ts`：指标卡组件逻辑，处理卡片点击、色调、文案与图标入参。
- `index.wxml`：指标卡组件结构。
- `index.less`：指标卡组件样式，封装紧凑版与宽版两种视觉变体。
- `index.json`：组件声明文件。

### `components/ui/pp-task-card/`

- `index.ts`：任务卡组件逻辑，处理任务点击、加减操作与按钮禁用态。
- `index.wxml`：任务卡组件结构。
- `index.less`：任务卡组件样式，封装徽章、进度、计数与操作区。
- `index.json`：组件声明文件。

## `miniprogram/config/`

- `routes.ts`：应用全部页面路由清单，区分 tab 页与普通页，包含 `onboarding` 入口，是页面导航的静态事实源。
- `tabbar.ts`：底部 tab 配置的 TS 版本，补充 PNG、SVG 图标与文案元信息。
- `feature-manifest.ts`：预留的 feature 清单，目前为空。

## `miniprogram/features/`

- `README.md`：feature 目录约定说明，推荐页面文件、`helper/` 与 `model/` 的分层方式。

### 通用分层约定

- `<feature>.ts`：只保留页面生命周期、交互事件、导航和 `setData` 串联。
- `helper/page.ts`：页面层 UI 辅助状态，例如按压态、动效态或临时提示态。
- `helper/icons.ts` / `helper/presentation.ts` / `helper/journey.ts`：页面专属图标、展示拼装或文案格式化辅助。
- `model/index.ts`：当前 feature 的对外导出入口。
- `model/view.ts`：静态视图骨架和 view model 组装函数。
- `model/types.ts`：页面真正消费的局部视图类型。
- `model/state.ts`：运行时入口，组合 `storage`、领域层和 `view`，对页面输出最终状态。
- `model/storage.ts`：仅放该 feature 自己的本地读写封装。
- `model/actions.ts`：仅放有副作用的业务动作，例如增删改、重算、落缓存。

### `features/home/`

- `home.ts`：领航中心页面逻辑，处理首页生命周期、交互反馈、导航和数据刷新。
- `home.wxml`：首页结构。
- `home.less`：首页样式，也是当前视觉元素最丰富的页面之一。
- `home.json`：首页页面配置，注册 `pp-brand-header`、`pp-section-header`、`pp-metric-card` 和 `pp-task-card`。
- `helper/page.ts`：首页页面层辅助逻辑，负责图标动效态、按压态和指标卡数据拼装。
- `helper/icons.ts`：首页专属图标与动态图标对构建。
- `helper/journey.ts`：人生旅程展示值与文案格式化辅助。
- `model/index.ts`：首页模型导出入口。
- `model/view.ts`：首页静态骨架与视图模型定义。
- `model/types.ts`：首页 view model 与旅程展示类型定义。
- `model/state.ts`：首页运行时状态构建，基于 profile、daily-records 等域模型拼出页面数据。

### `features/report/`

- `report.ts`：航行报告页面逻辑，处理 tab 切换、范围切换、图表交互与弹层开关。
- `report.wxml`：报表页结构。
- `report.less`：报表页样式，包含趋势卡、比例条、历史卡和 sheet 等视觉实现。
- `report.json`：报表页配置，注册 `pp-brand-header` 和 `pp-section-header`。
- `helper/presentation.ts`：报表展示辅助层，负责环形 SVG、年度卡片、历史项和图标数据构建。
- `model/index.ts`：报表模型导出入口。
- `model/view.ts`：报表静态文案、年度卡片和历史示例等页面素材。
- `model/state.ts`：报表运行时状态构建，把日记录和设置数据转成图表与摘要展示状态。

### `features/lab/`

- `lab.ts`：动力实验室页面逻辑，处理任务计数、等级切换、成就弹层等交互。
- `lab.wxml`：实验室页面结构。
- `lab.less`：实验室样式，包含等级卡、任务卡、成就和轴线等复杂视觉。
- `lab.json`：实验室页面配置，注册 `pp-brand-header`、`pp-section-header` 和 `pp-task-card`。
- `helper/page.ts`：实验室页面层辅助逻辑，负责图标动效态与按压态。
- `model/index.ts`：实验室模型导出入口。
- `model/view.ts`：实验室静态视图数据源，并负责把进度拼成页面最终视图模型。
- `model/types.ts`：实验室等级、任务、成就与页面 VM 类型定义。
- `model/storage.ts`：实验室进度存储层，负责默认值、归一化和本地缓存读写。
- `model/state.ts`：实验室运行时状态入口，面向页面返回当前快照。
- `model/actions.ts`：实验室业务动作层，处理任务加减、成就重算、周维度重置、等级切换和初始化。

### `features/profile/`

- `profile.ts`：个人基地页面逻辑，处理菜单动作、头像选择、草稿应用和导航跳转。
- `profile.wxml`：个人中心页面结构。
- `profile.less`：个人中心样式，包含头像卡、菜单卡、统计卡和弹窗样式。
- `profile.json`：个人中心页面配置，注册 `pp-brand-header`、`pp-section-header` 和 `pp-menu-card`。
- `helper/page.ts`：个人页页面层辅助逻辑，负责图标动效态与按压态。
- `model/index.ts`：个人页模型导出入口。
- `model/view.ts`：个人中心静态配置，包含头像预设、菜单项、等级展示和页面状态组装。
- `model/types.ts`：个人中心菜单、头像、等级和页面状态类型定义。
- `model/state.ts`：个人页运行时摘要状态构建，包含用户等级、头像、菜单与统计区数据。
- `model/storage.ts`：个人头像本地读写封装，同时负责导出备份。
- `model/actions.ts`：头像选择动作层，处理相册选择、微信头像草稿解析和错误判断。

### `features/profile-settings/`

- `profile-settings.ts`：航行档案设置页逻辑，处理表单录入、退休字段联动、初始化保存与返回逻辑。
- `profile-settings.wxml`：档案设置页结构，承载资料、收入、排班与午休配置表单。
- `profile-settings.less`：档案设置页样式，目前以表单字段、分段器、模式网格和底部保存条为主。
- `profile-settings.json`：页面配置，注册 `pp-section-header`。
- `helper/icons.ts`：设置页图标构建与展示辅助逻辑。
- `helper/form.ts`：表单同步、字段归一化和联动辅助。
- `helper/validate.ts`：档案设置表单校验逻辑。
- `helper/save.ts`：设置保存入口，串联 bootstrap 初始化或普通保存。
- `model/schema.ts`：档案设置领域默认值、表单转换和退休规则映射。
- `model/options.ts`：性别、排班、默认退休规则和年龄边界等配置项。
- `model/storage.ts`：档案设置本地存储读写层。
- `model/types.ts`：档案设置表单类型与校验结果类型定义。

### `features/time-axis/`

- `time-axis.ts`：时间轴页面逻辑，处理列表切换、表单弹层、编辑与删除事件。
- `time-axis.wxml`：时间轴页面结构。
- `time-axis.less`：时间轴样式，包含笔记本切换、事件卡片、编辑 sheet 与 badge。
- `time-axis.json`：时间轴页面配置，注册 `pp-section-header`。
- `helper/presentation.ts`：时间轴展示辅助层，负责倒计时、笔记本装饰、图标和列表展示数据。
- `model/index.ts`：时间轴模型导出入口。
- `model/view.ts`：时间轴静态视图模型，定义笔记本、草稿和空态等页面素材。
- `model/types.ts`：时间轴表单类型定义。
- `model/storage.ts`：时间轴事件存储层，负责系统事件补全、归一化、默认数据与读写缓存。
- `model/actions.ts`：时间轴保存、删除等业务动作入口。

### `features/calendar/`

- `calendar.ts`：日历页逻辑，处理月份切换、选中日期与详情刷新。
- `calendar.wxml`：日历页结构。
- `calendar.less`：日历页样式，包含月历网格、选中态和统计提示。
- `calendar.json`：日历页配置。
- `helper/icons.ts`：日历页图标构建与轻量展示辅助。
- `model/index.ts`：日历模型导出入口。
- `model/view.ts`：日历静态页面模型，如标题与星期标签。
- `model/state.ts`：月历运行时状态构建，输出月份网格与选中日详情。

### `features/community/`

- `community.ts`：社区页逻辑，处理加入社群、错误反馈、分享与交互提示。
- `community.wxml`：社区页结构。
- `community.less`：社区页样式，含 hero、权益卡、CTA 区和页签样式。
- `community.json`：社区页配置。
- `model/index.ts`：社区页模型导出入口。
- `model/view.ts`：社区页静态数据源与页面展示态构建。
- `model/types.ts`：社区页 view model 与页面状态类型定义。
- `model/state.ts`：社区页运行时状态入口，目前主要封装 view model 输出。

### `features/about/`

- `about.ts`：关于页逻辑，处理 tab 切换、返回和分享数据绑定。
- `about.wxml`：关于页结构。
- `about.less`：关于页样式，涵盖品牌头图、版本信息、更新记录与理念模块。
- `about.json`：关于页配置。
- `helper/icons.ts`：关于页图标构建与展示辅助。
- `model/index.ts`：关于页模型导出入口。
- `model/view.ts`：关于页静态内容数据源，维护版本、更新记录和理念文案。

### `features/data-center/`

- `data-center.ts`：数据中心页面逻辑，处理导出、重置、弹层动画与交互反馈。
- `data-center.wxml`：数据中心页面结构。
- `data-center.less`：数据中心样式，覆盖统计卡、导出按钮、重置确认弹层等。
- `data-center.json`：数据中心页面配置。
- `helper/icons.ts`：数据中心图标与展示辅助构建。
- `model/index.ts`：数据中心模型导出入口。
- `model/view.ts`：数据中心静态文案、卡片信息和页面默认状态。
- `model/actions.ts`：数据中心业务动作层，负责存储占用测量、数据导出与业务数据清空。

### `features/onboarding/`

- `onboarding.ts`：首次进入与重置后引导页逻辑，处理引导文案切换、开始建档和分享菜单。
- `onboarding.wxml`：引导页结构。
- `onboarding.less`：引导页样式。
- `onboarding.json`：引导页页面配置。
- 当前该 feature 还未拆分 `helper/` 和 `model/`；如果后续交互继续增长，再按 `features/README.md` 的模板扩展。

## `miniprogram/lib/`

### `lib/constants/`

- `storage.ts`：统一声明本地缓存 key，供各 feature、`bootstrap` 与 `storage-registry` 共用。

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
- `lab-tasks.ts`：实验室任务静态定义、任务图标对和任务提示文案辅助。

### `lib/format/`

- `title.ts`：标题格式化工具，主要把 feature 标识转成人类可读标题。

### `lib/guards/`

- `is-object.ts`：对象类型守卫。

### `lib/wx/`

- `storage.ts`：对微信存储 API 的安全封装，统一 fallback 与异常处理。
- `page.ts`：页面层工具，封装 `setData` patch、计时器袋、按压态脉冲、弹层开关与返回处理。
- `share.ts`：分享菜单、默认分享文案与时间线分享数据构建。

### `lib/icons.ts`

- `icons.ts`：SVG 图标中心，提供静态图标、动态图标对和场景图标 data URI 构建能力。

## `miniprogram/store/`

- `bootstrap.ts`：应用启动总控，负责初始化、迁移、默认数据补齐、导出和重置。
- `storage-registry.ts`：受管存储注册表，负责统计占用、导出托管项和统一清空逻辑。
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
- 如果目标 feature 已经拆成 `helper/` 和 `model/`，优先在对应分层落代码，不要把静态文案、类型定义和复杂视图拼装重新塞回页面文件。
- 影响多个页面的视觉改动优先回收至 `theme/` 与共享组件，不要在多个 feature 重复写值。
- 头部、指标卡、任务卡、菜单卡等复用块优先改 `components/ui/`，不要在页面内复制结构。
- 图标、返回、弹层、分享等跨页行为优先复用 `lib/icons.ts`、`lib/wx/page.ts` 和 `lib/wx/share.ts`。
- 任何涉及本地缓存字段变更的改动，都要同步检查 `lib/constants/storage.ts`、`lib/domain/migrations.ts`、`store/storage-registry.ts` 和对应 feature 的 `model/storage.ts`。
- 任何涉及初始化、重置、导出流程的改动，都要同步检查 `store/bootstrap.ts`、`features/onboarding/` 与 `features/data-center/`。
- 任何新增页面都要同步更新 `app.json`、`config/routes.ts`；如果属于 tab 页，还要检查 `config/tabbar.ts` 与图标资源。
