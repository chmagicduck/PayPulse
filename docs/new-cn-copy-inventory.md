# 薪潮涌动 · 文案重写清单

## 重写说明

- **风格定位**：生命有限公司 / 存在主义轻讽刺
- **核心隐喻**：职场即有限责任经营，用户即自身生命的唯一股东
- **保留原则**：应用名「薪潮涌动」不变，功能结构不变
- **替换逻辑**：航海术语 → 商业/金融/存在主义术语

---

## Module Index

- Global And Shared Copy
- Home（股东大厅）
- Report（年度财报）
- Lab（体能股本）
- Profile（个人基地）
- Profile Settings（股东信息设置）
- Time Axis（人生里程碑）
- Calendar（交易日历）
- Community（股东大会）
- About（关于本司）
- Data Center（数据中心）

---

## Global And Shared Copy

跨页面文案：应用导航、标签栏、日历状态提示、共享域生成文本。

### app.json

- File role: 应用级页面注册与标签栏标签
- Copy type: Config Copy
- Entry count: 4

- L29 [Config Copy] "text": "股东大厅",
- L35 [Config Copy] "text": "年度财报",
- L41 [Config Copy] "text": "体能股本",
- L47 [Config Copy] "text": "个人基地",

### config/tabbar.ts

- File role: 类型化标签栏配置文案，需与 app.json 保持一致
- Copy type: Other Copy
- Entry count: 4

- L5 [Other Copy] text: '股东大厅',
- L14 [Other Copy] text: '年度财报',
- L23 [Other Copy] text: '体能股本',
- L32 [Other Copy] text: '个人基地',

### lib/domain/calendar-config.ts

- File role: 节假日配置文案，包括名称、徽章和描述
- Copy type: Domain And State Copy
- Entry count: 21

- L10 [Domain And State Copy] badge: '元',
- L11 [Domain And State Copy] title: '元旦休市期',
- L12 [Domain And State Copy] desc: '当前日期处于 2026 年元旦法定休市区间，股东可暂停交易。',- L17 [Domain And State Copy] badge: '春',
- L18 [Domain And State Copy] title: '春节休市期',
- L19 [Domain And State Copy] desc: '当前日期处于 2026 年春节法定休市区间，全体股东强制退市。',- L24 [Domain And State Copy] badge: '清',
- L25 [Domain And State Copy] title: '清明休市期',
- L26 [Domain And State Copy] desc: '当前日期处于 2026 年清明法定休市区间。',- L31 [Domain And State Copy] badge: '劳',
- L32 [Domain And State Copy] title: '劳动节休市期',
- L33 [Domain And State Copy] desc: '当前日期处于 2026 年劳动节法定休市区间。',- L38 [Domain And State Copy] badge: '端',
- L39 [Domain And State Copy] title: '端午休市期',
- L40 [Domain And State Copy] desc: '当前日期处于 2026 年端午法定休市区间。',- L45 [Domain And State Copy] badge: '秋',
- L46 [Domain And State Copy] title: '中秋休市期',
- L47 [Domain And State Copy] desc: '当前日期处于 2026 年中秋法定休市区间。',- L52 [Domain And State Copy] badge: '国',
- L53 [Domain And State Copy] title: '国庆休市期',
- L54 [Domain And State Copy] desc: '当前日期处于 2026 年国庆法定休市区间，长假模式已启动。',

### lib/domain/calendar.ts

- File role: 共享日历状态、提醒和节奏相关文案
- Copy type: Domain And State Copy
- Entry count: 13

- L84 [Domain And State Copy] return { day: String(date.getDate()), status: 'makeup', badge: '补' }
- L87 [Domain And State Copy] return { day: String(date.getDate()), status: 'payday', badge: '红' }
- L90 [Domain And State Copy] return { day: String(date.getDate()), status: 'weekend', status: '休' }
- L105 [Domain And State Copy] return { title: '强制补市日', desc: '今日为官方调休补市日，请按交易节奏完成股东权益兑现。' }
- L108 [Domain And State Copy] return { title: '分红日：资本到账', desc: '月度分红已到账，建议复盘本月人力资本 ROI。' }
- L111 [Domain And State Copy] return { title: '周末休市', desc: '当前为法定休市日，禁止开启股东权益兑现。' }
- L114 [Domain And State Copy] return { title: '正常交易模式', desc: '当前处于正常交易日，分红数据将按实时出勤推进。' }
- L152 [Domain And State Copy] candidates.push({ date: payDate, label: `距下次分红还有 ${diffDays(today, payDate)} 天` })
- L159 [Domain And State Copy] candidates.push({ date: holidayDate, label: `距${item.title.replace('期', '')}还有 ${diffDays(today, holidayDate)} 天` })
- L166 [Domain And State Copy] candidates.push({ date: makeupDate, label: `距下次强制补市还有 ${diffDays(today, makeupDate)} 天` })
- L173 [Domain And State Copy] candidates.push({ date: nextEvent.date, label: `距「${nextEvent.title}」还有 ${diffDays(today, nextEvent.date)} 天` })
- L177 [Domain And State Copy] return candidates[0]?.label || `${year} 年 ${monthIndex + 1} 月暂无额外提醒，请继续稳健经营。`
- L193 [Domain And State Copy] unitText: delta &lt; 0 && !anniversary ? '天前' : '天后',

### lib/domain/daily-records.ts

- File role: 收益/工时域文案和报告摘要
- Copy type: Domain And State Copy
- Entry count: 7

- L606 [Domain And State Copy] emptyTitle: monthRecords.length === 0 ? '本月无交易记录' : '本月数据不足完整周期',
- L608 [Domain And State Copy] ? '当前月份尚未产生真实股东权益兑现记录，完成首次有效出勤后将在此展示。'
- L609 [Domain And State Copy] : '当前月份仅展示已有自然日，不会填充未来日期或演示数据。',
- L626 [Domain And State Copy] { title: '年度权益兑现总额', value: formatCurrency(yearMoyuIncomeTotal, 2), tone: 'indigo', iconName: 'coins' },
- L627 [Domain And State Copy] { title: '权益兑现天数', value: `${checkInDays} 天`, tone: 'amber', iconName: 'calendar-days' },
- L628 [Domain And State Copy] { title: '月均权益兑现', value: formatCurrency(Math.round(yearMoyuIncomeTotal / recordedMonthCount), 2), tone: 'blue', iconName: 'trending-up' },
- L629 [Domain And State Copy] { title: '年度出勤分红', value: formatCurrency(yearVoyageIncomeTotal, 2), tone: 'rose', iconName: 'trophy' },

### lib/domain/date.ts

- File role: 中文日期格式化输出
- Copy type: Domain And State Copy
- Entry count: 1

- L46 [Domain And State Copy] return `${date.getMonth() + 1}月${date.getDate()}日`

---

## Home（股东大厅）

仪表盘文案：分红显示、权益兑现开关、任务预览、周期性提醒、重要节点、人生经营看板。

### features/home/home.wxml

- File role: 页面或组件模板中的直接用户可见文案
- Copy type: UI Copy
- Entry count: 74

- L3 [UI Copy] &lt;text class="{{valueClass}}"&gt;{{item.display.major}}天&lt;/text&gt;
- L6 [UI Copy] &lt;text class="{{valueClass}}"&gt;{{item.display.major}}年 {{item.display.middle}}个月 {{item.display.minor}}天&lt;/text&gt;
- L9 [UI Copy] &lt;text class="{{valueClass}}"&gt;{{item.display.major}}个月 {{item.display.minor}}天&lt;/text&gt;
- L12 [UI Copy] &lt;text class="{{valueClass}}"&gt;{{item.display.major}}周 {{item.display.minor}}天&lt;/text&gt;
- L24 [UI Copy] &lt;text class="nav-bar__title"&gt;薪潮涌动&lt;/text&gt;
- L36 [UI Copy] &lt;text class="income-card__label"&gt;今日股东权益兑现&lt;/text&gt;
- L47 [UI Copy] &lt;text class="income-card__badge-tag"&gt;实时分红速率 {{showAmount ? vm.income.rate : '***'}}/s&lt;/text&gt;
- L55 [UI Copy] data-blocked-message="当前状态无需权益兑现"
- L58 [UI Copy] &lt;text class="income-card__toggle-text"&gt;{{isMoYu ? '兑现中' : '开启兑现'}}&lt;/text&gt;
- L61 [UI Copy] &lt;text class="income-card__stay-text"&gt;手动校准: {{vm.timer.rightValue}}&lt;/text&gt;
- L72 [UI Copy] &lt;text class="income-card__progress-title"&gt;权益占比&lt;/text&gt;
- L75 [UI Copy] &lt;text class="income-card__progress-meta"&gt;/ 今日出勤 {{vm.income.workPercent}}%&lt;/text&gt;
- L82 [UI Copy] &lt;text&gt;退勤结算倒计时&lt;/text&gt;
- L88 [UI Copy] &lt;text class="income-card__countdown-value"&gt;未开盘&lt;/text&gt;
- L91 [UI Copy] &lt;text class="income-card__countdown-value"&gt;结算中&lt;/text&gt;
- L94 [UI Copy] &lt;text class="income-card__countdown-value"&gt;已退勤&lt;/text&gt;
- L97 [UI Copy] &lt;text class="income-card__countdown-value"&gt;休市中&lt;/text&gt;
- L109 [UI Copy] &lt;text class="income-card__footer-label"&gt;今日分红&lt;/text&gt;
- L113 [UI Copy] &lt;text class="income-card__footer-label"&gt;月度分红&lt;/text&gt;
- L123 [UI Copy] title="日常经营任务"
- L125 [UI Copy] manageText="查看体能股本"
- L137 [UI Copy] &lt;text class="task-card__title"&gt;人力资本维护・体能补给&lt;/text&gt;
- L138 [UI Copy] &lt;text class="task-card__desc"&gt;维护人力资产流动性，完成体能补给作业&lt;/text&gt;
- L144 [UI Copy] &lt;text class="task-card__reward-text"&gt;待获得{{vm.taskPreview.rewardValue}}股本积分&lt;/text&gt;
- L146 [UI Copy] &lt;text class="task-card__progress-text"&gt;今日任务完成度 {{vm.taskPreview.completed}}/{{vm.taskPreview.total}}&lt;/text&gt;
- L154 [UI Copy] title="常规波动"
- L156 [UI Copy] manageText="查看交易日历"
- L169 [UI Copy] &lt;text class="tide-card__badge tide-card__badge--blue"&gt;分红 (DIV)&lt;/text&gt;
- L173 [UI Copy] &lt;text class="tide-card__leading"&gt;距&lt;/text&gt;
- L174 [UI Copy] &lt;text class="tide-card__value"&gt;{{vm.regularTides[0].days}}天&lt;/text&gt;
- L176 [UI Copy] &lt;text class="tide-card__desc"&gt;下一次&lt;text class="tide-card__desc-strong tide-card__desc-strong--blue"&gt;资本分红&lt;/text&gt;正在临近。&lt;/text&gt;
- L188 [UI Copy] &lt;text class="tide-card__badge tide-card__badge--emerald"&gt;休市 (OFF)&lt;/text&gt;
- L192 [UI Copy] &lt;text class="tide-card__leading"&gt;距&lt;/text&gt;
- L193 [UI Copy] &lt;text class="tide-card__value"&gt;{{vm.regularTides[1].days}}天&lt;/text&gt;
- L195 [UI Copy] &lt;text class="tide-card__desc"&gt;距离下一次&lt;text class="tide-card__desc-strong tide-card__desc-strong--emerald"&gt;强制休市&lt;/text&gt;已经不远。&lt;/text&gt;
- L204 [UI Copy] title="人生里程碑"
- L206 [UI Copy] manageText="新增节点"
- L224 [UI Copy] &lt;block wx:if="{{vm.importantDates[0].notebookId === 'commemorative'}}"&gt;纪念册&lt;/block&gt;
- L225 [UI Copy] &lt;block wx:elif="{{vm.importantDates[0].notebookId === 'travel'}}"&gt;差旅册&lt;/block&gt;
- L226 [UI Copy] &lt;block wx:elif="{{vm.importantDates[0].notebookId === 'career'}}"&gt;职场册&lt;/block&gt;
- L227 [UI Copy] &lt;block wx:else&gt;人生账簿&lt;/block&gt;
- L235 [UI Copy] &lt;text class="date-item__suffix"&gt;{{vm.importantDates[0].isPast ? '天前' : '天后'}}&lt;/text&gt;
- L250 [UI Copy] &lt;block wx:if="{{vm.importantDates[1].notebookId === 'commemorative'}}"&gt;纪念册&lt;/block&gt;
- L251 [UI Copy] &lt;block wx:elif="{{vm.importantDates[1].notebookId === 'travel'}}"&gt;差旅册&lt;/block&gt;
- L252 [UI Copy] &lt;block wx:elif="{{vm.importantDates[1].notebookId === 'career'}}"&gt;职场册&lt;/block&gt;
- L253 [UI Copy] &lt;block wx:else&gt;人生账簿&lt;/block&gt;
- L261 [UI Copy] &lt;text class="date-item__suffix"&gt;{{vm.importantDates[1].isPast ? '天前' : '天后'}}&lt;/text&gt;
- L276 [UI Copy] &lt;block wx:if="{{vm.importantDates[2].notebookId === 'commemorative'}}"&gt;纪念册&lt;/block&gt;
- L277 [UI Copy] &lt;block wx:elif="{{vm.importantDates[2].notebookId === 'travel'}}"&gt;差旅册&lt;/block&gt;
- L278 [UI Copy] &lt;block wx:elif="{{vm.importantDates[2].notebookId === 'career'}}"&gt;职场册&lt;/block&gt;
- L279 [UI Copy] &lt;block wx:else&gt;人生账簿&lt;/block&gt;
- L287 [UI Copy] &lt;text class="date-item__suffix"&gt;{{vm.importantDates[2].isPast ? '天前' : '天后'}}&lt;/text&gt;
- L292 [UI Copy] &lt;text class="date-empty__text"&gt;尚无里程碑节点，点击新增一项。&lt;/text&gt;
- L298 [UI Copy] title="人生经营看板"
- L310 [UI Copy] &lt;text class="journey-card__eyebrow journey-card__eyebrow--indigo"&gt;生命股本 (LIFE)&lt;/text&gt;
- L313 [UI Copy] &lt;text class="journey-card__status"&gt;已折旧&lt;/text&gt;
- L316 [UI Copy] &lt;text class="journey-card__desc"&gt;这是你从&lt;text class="journey-card__desc-strong"&gt; IPO 上市&lt;/text&gt;至今消耗的时间成本。&lt;/text&gt;
- L325 [UI Copy] &lt;text class="journey-card__eyebrow journey-card__eyebrow--blue"&gt;职场股本 (CAREER)&lt;/text&gt;
- L328 [UI Copy] &lt;text class="journey-card__status"&gt;已投入&lt;/text&gt;
- L331 [UI Copy] &lt;text class="journey-card__desc"&gt;自从进入&lt;text class="journey-card__desc-strong journey-card__desc-strong--blue"&gt;社会交易所&lt;/text&gt;，你已锁定的资本。&lt;/text&gt;
- L340 [UI Copy] &lt;text class="journey-card__eyebrow journey-card__eyebrow--emerald"&gt;退出机制倒计时 (EXIT)&lt;/text&gt;
- L343 [UI Copy] &lt;text class="journey-card__status journey-card__status--emerald"&gt;剩余&lt;/text&gt;
- L346 [UI Copy] &lt;text class="journey-card__desc journey-card__desc--emerald"&gt;距离你可以&lt;text class="journey-card__desc-strong journey-card__desc-strong--emerald"&gt;正式退市&lt;/text&gt;，还有这些既定周期。&lt;/text&gt;
- L358 [UI Copy] &lt;text class="journey-card__eyebrow journey-card__eyebrow--rose"&gt;终局倒计时 (FINAL)&lt;/text&gt;
- L361 [UI Copy] &lt;text class="journey-card__status journey-card__status--rose"&gt;剩余&lt;/text&gt;
- L364 [UI Copy] &lt;text class="journey-card__quote"&gt;"警告：股本即将耗尽，此数据不可逆转。"&lt;/text&gt;
- L366 [UI Copy] &lt;text class="journey-card__note-text"&gt;* 基于预计 85 岁自然退市计算。每一秒都是不可再生的生命原始股。&lt;/text&gt;
- L377 [UI Copy] &lt;text class="modal-sheet__title"&gt;修正权益兑现时长&lt;/text&gt;
- L378 [UI Copy] &lt;text class="modal-sheet__subtitle"&gt;手动校准今日股东权益兑现的时长&lt;/text&gt;
- L387 [UI Copy] &lt;text class="time-input__label"&gt;时&lt;/text&gt;
- L392 [UI Copy] &lt;text class="time-input__label"&gt;分&lt;/text&gt;
- L397 [UI Copy] &lt;text class="time-input__label"&gt;秒&lt;/text&gt;
- L402 [UI Copy] &lt;text&gt;取消&lt;/text&gt;
- L405 [UI Copy] &lt;text&gt;确认保存&lt;/text&gt;

---

## Report（年度财报）

分析与报告文案：趋势、年度总结、比例标签、历史卡片及相关描述。

### features/report/model.ts

- File role: 静态页面内容、卡片标题、标签或示例文案
- Copy type: Static Content
- Entry count: 4

- L42 [Static Content] { title: '年度权益兑现额', value: '¥12,480.50', tone: 'indigo', iconName: 'coins' },
- L43 [Static Content] { title: '权益兑现天数', value: '248 天', tone: 'amber', iconName: 'calendar-days' },
- L44 [Static Content] { title: '月均权益兑现', value: '¥1,040.00', tone: 'blue', iconName: 'trending-up' },
- L45 [Static Content] { title: '年度出勤分红', value: '98.5%', tone: 'rose', iconName: 'trophy' },

### features/report/model/state.ts

- File role: 运行时视图模型文本，如标签、摘要和指标
- Copy type: Static Content
- Entry count: 3

- L13 [Static Content] ? `${now().getMonth() + 1} 月每日真实权益兑现概览`
- L14 [Static Content] : '当前月份暂无真实记录',
- L15 [Static Content] summaryLabel: monthRecords.length ? '本月总计' : '暂无汇总',

### features/report/ocean-report.helper.ts

- File role: 显示辅助输出，如标签、单位和组合 UI 文本
- Copy type: Domain And State Copy
- Entry count: 1

- L70 [Domain And State Copy] return `${Number(month)}月${Number(day)}日`

### features/report/report.ts

- File role: 页面逻辑、辅助函数或域模型发出的文案
- Copy type: Other Copy
- Entry count: 1

- L111 [Other Copy] title: '请前往股东大厅修正今日权益兑现时长',

### features/report/report.wxml

- File role: 页面或组件模板中的直接用户可见文案
- Copy type: UI Copy
- Entry count: 17

- L8 [UI Copy] &lt;text class="report-nav__title"&gt;年度财报&lt;/text&gt;
- L21 [UI Copy] title="分红趋势"
- L33 [UI Copy] &lt;text class="tab-switch__text"&gt;分红&lt;/text&gt;
- L40 [UI Copy] &lt;text class="tab-switch__text"&gt;时长&lt;/text&gt;
- L70 [UI Copy] &lt;text class="chart-card__unit"&gt;{{activeTab === 'income' ? 'RMB' : '小时'}}&lt;/text&gt;
- L84 [UI Copy] &lt;pp-section-header title="年度经营成就" barTone="amber" trimBottom="{{true}}" /&gt;
- L102 [UI Copy] &lt;pp-section-header title="时长占比统计" barTone="blue" trimBottom="{{true}}" /&gt;
- L106 [UI Copy] &lt;text class="range-switch__text"&gt;日&lt;/text&gt;
- L109 [UI Copy] &lt;text class="range-switch__text"&gt;周&lt;/text&gt;
- L112 [UI Copy] &lt;text class="range-switch__text"&gt;月&lt;/text&gt;
- L115 [UI Copy] &lt;text class="range-switch__text"&gt;年&lt;/text&gt;
- L125 [UI Copy] &lt;text class="ratio-card__ring-label"&gt;权益占比&lt;/text&gt;
- L132 [UI Copy] &lt;text class="ratio-stat__label"&gt;出勤时长&lt;/text&gt;
- L142 [UI Copy] &lt;text class="ratio-stat__label ratio-stat__label--blue"&gt;权益时长&lt;/text&gt;
- L155 [UI Copy] &lt;pp-section-header title="最近记录" barTone="slate" trimBottom="{{true}}" /&gt;
- L173 [UI Copy] &lt;text class="history-card__hint"&gt;仅支持在股东大厅修正今日权益兑现时长&lt;/text&gt;
- L180 [UI Copy] &lt;text class="history-card__income-label"&gt;分红&lt;/text&gt;

---

## Lab（体能股本）

进阶与任务系统文案：等级名称、每日任务、每周成就和股本积分反馈。

### features/lab/model.ts

- File role: 静态页面内容、卡片标题、标签或示例文案
- Copy type: Static Content
- Entry count: 32

- L3 [Static Content] title: '体能股本',
- L6 [Static Content] eyebrow: '人力资产舱',
- L7 [Static Content] stagePrefix: '第',
- L8 [Static Content] stageSuffix: '阶段',
- L9 [Static Content] todayLabel: '今日股本',
- L10 [Static Content] totalLabel: '总股本',
- L11 [Static Content] targetLabel: '下一等级',
- L12 [Static Content] maxLabel: '已抵达最高董事会',
- L16 [Static Content] title: '每日任务',
- L17 [Static Content] subtitle: '每日打开时自动按自然日重置',
- L18 [Static Content] progressLabel: '任务进度',
- L19 [Static Content] rewardSuffix: ' 股本',
- L20 [Static Content] doneText: '已达上限',
- L23 [Static Content] title: '每周成就',
- L28 [Static Content] { level: 1, name: '见习股东', exp: 0, iconName: 'shell', tone: 'slate', theme: 'basic', iconColor: '#94a3b8', cardIconColor: '#94a3b8' },
- L29 [Static Content] { level: 2, name: '流动股东', exp: 100, iconName: 'waves', tone: 'cyan', theme: 'basic', iconColor: '#0891b2', cardIconColor: '#0891b2' },
- L30 [Static Content] { level: 3, name: '茶水间董事', exp: 260, iconName: 'coffee', tone: 'orange', theme: 'basic', iconColor: '#ea580c', cardIconColor: '#ea580c' },
- L31 [Static Content] { level: 4, name: '平稳操盘手', exp: 520, iconName: 'wind', tone: 'emerald', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L32 [Static Content] { level: 5, name: '资深分析师', exp: 900, iconName: 'compass', tone: 'blue', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L33 [Static Content] { level: 6, name: '隐形大股东', exp: 1400, iconName: 'ghost', tone: 'indigo', theme: 'mid', iconColor: '#e2e8f0', cardIconColor: '#ffffff' },
- L34 [Static Content] { level: 7, name: '风险对冲者', exp: 2050, iconName: 'anchor', tone: 'violet', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L35 [Static Content] { level: 8, name: '核心控股人', exp: 2900, iconName: 'zap', tone: 'rose', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L36 [Static Content] { level: 9, name: '执行董事', exp: 3950, iconName: 'ship', tone: 'blue', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L37 [Static Content] { level: 10, name: '终身名誉主席', exp: 5200, iconName: 'crown', tone: 'amber', theme: 'ultra', iconColor: '#92400e', cardIconColor: '#92400e' },
- L45 [Static Content] { id: 'water', title: '流动性补充计划', desc: '喝一杯水，保持人力资产流动性。', reward: 1, count: 0, limit: 8, tone: 'blue', iconName: 'droplets' },
- L46 [Static Content] { id: 'move', title: '资产折旧对冲', desc: '起身活动一次，抵消久坐导致的资产减值。', reward: 1, count: 0, limit: 10, tone: 'emerald', iconName: 'accessibility' },
- L47 [Static Content] { id: 'eye', title: '远景价值投资', desc: '做一次远眺，给视觉资产放个假。', reward: 1, count: 0, limit: 10, tone: 'amber', iconName: 'eye' },
- L48 [Static Content] { id: 'leave', title: '准点退市执行', desc: '准点退勤一次，守住自己的边界。', reward: 12, count: 0, limit: 1, tone: 'rose', iconName: 'log-out' },
- L49 [Static Content] { id: 'toilet', title: '压力测试释放', desc: '离开工位放空一会儿，累计减压分钟。', reward: 4, count: 0, limit: 5, tone: 'indigo', iconName: 'navigation', rotate: true },
- L52 [Static Content] { id: 'discipline', title: '黄金边界守护者', desc: '本周连续 7 天准点退勤。', reward: 50, progress: 0, target: 7 },
- L53 [Static Content] { id: 'idle-master', title: '静默兑现专家', desc: '本周累计完成 120 分钟压力测试释放。', reward: 50, progress: 0, target: 120, unit: '分钟' },
- L54 [Static Content] { id: 'whale', title: '满点流动性管理', desc: '本周累计完成 40 次流动性补充计划。', reward: 50, progress: 0, target: 40 },

---

## Profile（个人基地）

个人中心文案：身份摘要、菜单项、头像操作和相关导航。

### features/profile/model.ts

- File role: 静态页面内容、卡片标题、标签或示例文案
- Copy type: Static Content
- Entry count: 8

- L3 [Static Content] name: '见习股东',
- L7 [Static Content] name: '终身名誉主席',
- L23 [Static Content] title: '股东信息设置',
- L30 [Static Content] title: '人生里程碑设置',
- L37 [Static Content] title: '查看交易日历',
- L46 [Static Content] title: '股东大会',
- L53 [Static Content] title: '公司通告',
- L62 [Static Content] title: '数据同步中心',

### features/profile/profile.ts

- File role: 个人页面头像相关交互反馈
- Copy type: Interaction Feedback
- Entry count: 2

- L117 [Interaction Feedback] title: '已切换微信头像演示',
- L127 [Interaction Feedback] title: '已切换上传头像演示',

### features/profile/profile.wxml

- File role: 页面或组件模板中的直接用户可见文案
- Copy type: UI Copy
- Entry count: 11

- L8 [UI Copy] &lt;text class="profile-nav__title"&gt;个人基地&lt;/text&gt;
- L37 [UI Copy] &lt;text class="profile-identity__pill-text"&gt;累计权益兑现：&lt;/text&gt;
- L38 [UI Copy] &lt;text class="profile-identity__pill-value"&gt;{{vm.user.checkInDays}}天&lt;/text&gt;
- L45 [UI Copy] &lt;pp-section-header title="经营控制台" barTone="blue" /&gt;
- L68 [UI Copy] &lt;pp-section-header title="董事会决议" barTone="indigo" /&gt;
- L91 [UI Copy] &lt;pp-section-header title="数据同步站" barTone="dark" /&gt;
- L118 [UI Copy] &lt;text class="avatar-sheet__title"&gt;修改头像&lt;/text&gt;
- L129 [UI Copy] &lt;text class="avatar-sheet__action-text"&gt;微信头像&lt;/text&gt;
- L133 [UI Copy] &lt;text class="avatar-sheet__action-text"&gt;上传图片&lt;/text&gt;
- L138 [UI Copy] &lt;text class="avatar-sheet__preset-title"&gt;预设形象&lt;/text&gt;
- L150 [UI Copy] &lt;text class="avatar-sheet__confirm-text"&gt;确认修改&lt;/text&gt;

---

## Profile Settings（股东信息设置）

个人资料和工作参数表单文案：字段标签、选项、验证和保存反馈。

### features/profile-settings/helper/validate.ts

- File role: 表单验证错误文案
- Copy type: Other Copy
- Entry count: 15

- L12 [Other Copy] return { ok: false, message: '请先填写正确的股东昵称' }
- L16 [Other Copy] return { ok: false, message: '请填写正确的上市日期' }
- L20 [Other Copy] return { ok: false, message: '入职日期不能晚于今天' }
- L24 [Other Copy] return { ok: false, message: '入职日期不能早于上市日期' }
- L33 [Other Copy] return { ok: false, message: '退市年龄必须大于 0' }
- L37 [Other Copy] return { ok: false, message: `退市年龄不能超过 ${profileAgeLimits.retirementAgeMax}` }
- L41 [Other Copy] return { ok: false, message: '预期清算年龄必须大于 0' }
- L45 [Other Copy] return { ok: false, message: `预期清算年龄不能超过 ${profileAgeLimits.expectedLifespanMax}` }
- L49 [Other Copy] return { ok: false, message: '预期清算年龄必须大于退市年龄' }
- L53 [Other Copy] return { ok: false, message: '月薪必须大于 0' }
- L57 [Other Copy] return { ok: false, message: '分红日必须在 1 到 31 之间' }
- L61 [Other Copy] return { ok: false, message: '退勤时间必须晚于出勤时间' }
- L66 [Other Copy] return { ok: false, message: '请填写完整的午休时段' }
- L70 [Other Copy] return { ok: false, message: '午休结束时间必须晚于开始时间' }
- L77 [Other Copy] return { ok: false, message: '午休时段必须落在出勤区间内' }

### features/profile-settings/model/options.ts

- File role: 表单控件使用的选项标签
- Copy type: Static Content
- Entry count: 6

- L4 [Static Content] { value: 'male', label: '男性' },
- L5 [Static Content] { value: 'female', label: '女性' },
- L9 [Static Content] { value: 'double', label: '双休' },
- L10 [Static Content] { value: 'single-sat', label: '休六' },
- L11 [Static Content] { value: 'single-sun', label: '休日' },
- L12 [Static Content] { value: 'big-small', label: '大小周' },

### features/profile-settings/profile-settings.ts

- File role: 数据中心的保存流程反馈，如审核结果和成功提示
- Copy type: Interaction Feedback
- Entry count: 3

- L119 [Interaction Feedback] title: '昵称审核中，请稍后确认',
- L127 [Interaction Feedback] title: '昵称未通过审核，请重新输入',
- L146 [Interaction Feedback] title: saveResult.initialized ? '初始化完成' : '保存成功',

### features/profile-settings/profile-settings.wxml

- File role: 页面或组件模板中的直接用户可见文案
- Copy type: UI Copy
- Entry count: 24

- L7 [UI Copy] &lt;text class="settings-nav__title"&gt;股东信息设置&lt;/text&gt;
- L14 [UI Copy] &lt;pp-section-header title="股东身份识别" barTone="blue" /&gt;
- L19 [UI Copy] &lt;text&gt;股东昵称&lt;/text&gt;
- L24 [UI Copy] placeholder="点击输入或使用微信昵称"
- L36 [UI Copy] &lt;text&gt;上市日期&lt;/text&gt;
- L46 [UI Copy] &lt;text&gt;性别&lt;/text&gt;
- L64 [UI Copy] &lt;pp-section-header title="职场股本坐标" barTone="blue" /&gt;
- L69 [UI Copy] &lt;text&gt;首次注资日期&lt;/text&gt;
- L80 [UI Copy] &lt;text&gt;税前月度分红&lt;/text&gt;
- L91 [UI Copy] &lt;text&gt;分红发放日&lt;/text&gt;
- L101 [UI Copy] &lt;text&gt;预计退市年龄&lt;/text&gt;
- L106 [UI Copy] placeholder="例如 {{ageLimits.retirementAgeMin}} - {{ageLimits.retirementAgeMax}}"
- L115 [UI Copy] &lt;text&gt;预期清算年龄&lt;/text&gt;
- L120 [UI Copy] placeholder="至少 {{ageLimits.expectedLifespanMin}} 岁"
- L131 [UI Copy] title="出勤排班计划"
- L132 [UI Copy] subtitle="{{dailyWorkDuration.hours}}小时{{dailyWorkDuration.minutes &lt; 10 ? '0' : ''}}{{dailyWorkDuration.minutes}}分"
- L140 [UI Copy] &lt;text&gt;休市模式&lt;/text&gt;
- L156 [UI Copy] &lt;text class="switch-row__label"&gt;本周是大周吗？&lt;/text&gt;
- L166 [UI Copy] &lt;text&gt;出勤打卡时间&lt;/text&gt;
- L176 [UI Copy] &lt;text&gt;退勤打卡时间&lt;/text&gt;
- L187 [UI Copy] &lt;text&gt;午休时段&lt;/text&gt;
- L199 [UI Copy] &lt;text&gt;午休开始时间&lt;/text&gt;
- L209 [UI Copy] &lt;text&gt;午休结束时间&lt;/text&gt;
- L223 [UI Copy] &lt;text class="save-bar__text"&gt;保存档案&lt;/text&gt;

---

## Time Axis（人生里程碑）

里程碑和时间轴文案：事件卡片、编辑流程、类别名称和提醒标签。

### features/time-axis/model.ts

- File role: 静态页面内容、卡片标题、标签或示例文案
- Copy type: Static Content
- Entry count: 8

- L3 [Static Content] { id: 'all', name: '全部', iconId: 'layers', tone: 'slate' },
- L4 [Static Content] { id: 'commemorative', name: '纪念日', iconId: 'heart', tone: 'rose' },
- L5 [Static Content] { id: 'travel', name: '差旅', iconId: 'map', tone: 'amber' },
- L6 [Static Content] { id: 'life', name: '人生', iconId: 'user', tone: 'blue' },
- L7 [Static Content] { id: 'career', name: '职场', iconId: 'briefcase', tone: 'indigo' },
- L12 [Static Content] title: '结婚纪念日',
- L19 [Static Content] title: '西藏差旅',
- L26 [Static Content] title: '获得高级架构师资质',

### features/time-axis/model/storage.ts

- File role: 页面逻辑、辅助函数或域模型发出的文案
- Copy type: Static Content
- Entry count: 3

- L18 [Static Content] title: '我的上市日',
- L25 [Static Content] title: '首次注资日',
- L32 [Static Content] title: '退市日',

### features/time-axis/time-axis-settings.helper.ts

- File role: 显示辅助输出，如标签、单位和组合 UI 文本
- Copy type: Domain And State Copy
- Entry count: 2

- L86 [Domain And State Copy] unitText: '天后',
- L96 [Domain And State Copy] unitText: difference &lt; 0 ? '天前' : '天后',

### features/time-axis/time-axis.ts

- File role: 时间轴操作的操作反馈，如系统卡片限制
- Copy type: Interaction Feedback
- Entry count: 2

- L111 [Interaction Feedback] title: '系统节点请在股东信息设置中修改',
- L205 [Interaction Feedback] title: '系统节点不可删除',

### features/time-axis/time-axis.wxml

- File role: 页面或组件模板中的直接用户可见文案
- Copy type: UI Copy
- Entry count: 11

- L7 [UI Copy] &lt;text class="time-axis-nav__title"&gt;人生里程碑设置&lt;/text&gt;
- L70 [UI Copy] &lt;text class="entry-empty__title"&gt;档案位暂时空缺&lt;/text&gt;
- L81 [UI Copy] &lt;text class="archive-cta__text"&gt;录入新里程碑&lt;/text&gt;
- L88 [UI Copy] &lt;text class="edit-sheet__title"&gt;{{editingId ? '编辑节点' : '新增里程碑'}}&lt;/text&gt;
- L95 [UI Copy] &lt;text class="edit-field__label"&gt;节点名称&lt;/text&gt;
- L100 [UI Copy] placeholder="记录此刻的 ROl..."
- L106 [UI Copy] &lt;text class="edit-field__label"&gt;发生日期&lt;/text&gt;
- L111 [UI Copy] &lt;text class="edit-field__picker-text"&gt;{{form.date || '请选择日期'}}&lt;/text&gt;
- L119 [UI Copy] &lt;text class="edit-switch__title"&gt;周年提醒模式&lt;/text&gt;
- L128 [UI Copy] &lt;text class="edit-field__label"&gt;归入账簿&lt;/text&gt;
- L158 [UI Copy] &lt;text class="edit-actions__primary-text"&gt;{{editingId ? '保存修改' : '确认录入'}}&lt;/text&gt;

---

## Calendar（交易日历）

日历和节假日状态文案：工作日、分红日、法定假日、周末和提醒。

### features/calendar/calendar.wxml

- File role: 页面或组件模板中的直接用户可见文案
- Copy type: UI Copy
- Entry count: 7

- L57 [UI Copy] &lt;text class="legend-item__text"&gt;分红日&lt;/text&gt;
- L61 [UI Copy] &lt;text class="legend-item__text"&gt;法定休市&lt;/text&gt;
- L65 [UI Copy] &lt;text class="legend-item__text"&gt;周末休市&lt;/text&gt;
- L69 [UI Copy] &lt;text class="legend-item__text"&gt;补市&lt;/text&gt;
- L75 [UI Copy] &lt;pp-section-header title="今日交易状态" barTone="blue" /&gt;
- L80 [UI Copy] &lt;text class="detail-card__eyebrow"&gt;{{currentMonth.monthLabel}}{{selectedDay}}日&lt;/text&gt;
- L90 [UI Copy] &lt;text class="reminder-card__title"&gt;下一关键提醒&lt;/text&gt;

### features/calendar/model.ts

- File role: 静态页面内容、卡片标题、标签或示例文案
- Copy type: Static Content
- Entry count: 32

- L4 [Static Content] title: '交易日历',
- L8 [Static Content] title: '2026 九月',
- L9 [Static Content] reminder: '距离国庆休市还有 6 天，股东请继续坚持。',
- L11 [Static Content] monthLabel: '九月',
- L15 [Static Content] { day: '8' }, { day: '9' }, { day: '10', status: 'payday', badge: '红' }, { day: '11' }, { day: '12' }, { day: '13', status: 'weekend', badge: '休' }, { day: '14', status: 'weekend', badge: '休' },
- L16 [Static Content] { day: '15' }, { day: '16' }, { day: '17' }, { day: '18' }, { day: '19' }, { day: '20', status: 'makeup', badge: '补' }, { day: '21' },
- L17 [Static Content] { day: '22' }, { day: '23' }, { day: '24' }, { day: '25', status: 'holiday', badge: '秋' }, { day: '26', status: 'holiday', badge: '秋' }, { day: '27', status: 'holiday', badge: '秋' }, { day: '28' },
- L22 [Static Content] title: '正常交易模式',
- L23 [Static Content] desc: '当前市场风平浪静，适合稳定经营与日常推进。',
- L26 [Static Content] title: '法定休市区间',
- L27 [Static Content] desc: '当前日期处于官方休市区间，适合休整与庆祝。',
- L30 [Static Content] title: '分红日：资本到账',
- L31 [Static Content] desc: '检测到账户有大额能量补充，建议今日适当提高权益兑现质量。',
- L34 [Static Content] title: '强制补市中',
- L35 [Static Content] desc: '今天属于官方调休补市日，节奏会比普通交易日更紧凑。',
- L41 [Static Content] title: '2026 十月',
- L42 [Static Content] reminder: '距离下次分红日还有 10 天，继续稳住节奏。',
- L44 [Static Content] monthLabel: '十月',
- L47 [Static Content] { day: '1', status: 'holiday', badge: '庆' }, { day: '2', status: 'holiday', badge: '庆' }, { day: '3', status: 'holiday', badge: '庆' }, { day: '4', status: 'holiday', badge: '庆' }, { day: '5', status: 'holiday', badge: '庆' }, { day: '6', status: 'holiday', badge: '庆' }, { day: '7', status: 'holiday', badge: '庆' },
- L48 [Static Content] { day: '8' }, { day: '9' }, { day: '10', status: 'makeup', badge: '补' }, { day: '11', status: 'weekend', badge: '休' }, { day: '12' }, { day: '13' }, { day: '14' },
- L49 [Static Content] { day: '15' }, { day: '16' }, { day: '17', status: 'weekend', badge: '休' }, { day: '18', status: 'weekend', badge: '休' }, { day: '19' }, { day: '20' }, { day: '21' },
- L50 [Static Content] { day: '22' }, { day: '23' }, { day: '24', status: 'weekend', badge: '休' }, { day: '25', status: 'weekend', badge: '休' }, { day: '26' }, { day: '27' }, { day: '28' },
- L51 [Static Content] { day: '29' }, { day: '30' }, { day: '31', status: 'weekend', badge: '休' },
- L55 [Static Content] title: '正常交易模式',
- L56 [Static Content] desc: '当前市场风平浪静，适合稳定经营与日常推进。',
- L59 [Static Content] title: '国庆休市期',
- L60 [Static Content] desc: '当前日期处于 2026 年国庆法定休市区间，适合放松与出游。',
- L63 [Static Content] title: '分红日：资本到账',
- L64 [Static Content] desc: '分红节点已到，适合复盘本月经营收获。',
- L67 [Static Content] title: '强制补市中',
- L68 [Static Content] desc: '今天属于 2026 年国庆调休补市日，请注意交易节奏切换。',
- L73 [Static Content] weekLabels: ['日', '一', '二', '三', '四', '五', '六'],

### features/calendar/model/state.ts

- File role: 运行时视图模型文本，如标签、摘要和指标
- Copy type: Static Content
- Entry count: 2

- L27 [Static Content] title: `${year} ${monthIndex + 1}月`,
- L30 [Static Content] monthLabel: `${monthIndex + 1}月`,

---

## Community（股东大会）

社区加入页面文案：品牌信息、权益描述、加入提示、错误和降级提示。

### features/community/community.ts

- File role: 加入流程的交互反馈、降级提示和 Toast 消息
- Copy type: Interaction Feedback
- Entry count: 13

- L9 [Interaction Feedback] [-3002]: '获取配置失败，请稍后重试',
- L10 [Interaction Feedback] [-3004]: '用户授权失败，无法继续拉取入会流程',
- L11 [Interaction Feedback] [-3005]: '入会失败，请稍后重试',
- L12 [Interaction Feedback] [-3006]: '你已经在会了',
- L13 [Interaction Feedback] [-3009]: '会场已满员，请联系管理员',
- L14 [Interaction Feedback] [-3010]: '会场已解散',
- L15 [Interaction Feedback] [-3011]: '当前无法加入该会场',
- L16 [Interaction Feedback] [-3012]: '你已在会，但该会场目前已满员',
- L33 [Interaction Feedback] joinHint: !wx.canIUse('openBusinessView') ? '当前微信版本暂不支持直接拉取入会，请先复制会场链接。' : '',
- L50 [Interaction Feedback] title: '已复制会场链接，请手动打开',
- L56 [Interaction Feedback] title: '当前无法直接拉取，请稍后重试',
- L71 [Interaction Feedback] title: '已拉取企微入会流程',
- L77 [Interaction Feedback] const message = COMMUNITY_ERROR_MESSAGES[detail.errcode] || '当前无法加入，请稍后重试'

### features/community/community.wxml

- File role: 页面或组件模板中的直接用户可见文案
- Copy type: UI Copy
- Entry count: 6

- L40 [UI Copy] &lt;text class="join-card__title"&gt;薪潮股东大会&lt;/text&gt;
- L41 [UI Copy] &lt;text class="join-card__subtitle"&gt;官方会场入口&lt;/text&gt;
- L50 [UI Copy] contactText="立即加入微信会场"
- L55 [UI Copy] &lt;text class="join-card__button-text"&gt;复制会场链接&lt;/text&gt;
- L59 [UI Copy] &lt;text class="join-card__note"&gt;{{joinHint || '点击主按钮后会拉取真实企微入会流程，若失败会提供明确提示与降级路径。'}}&lt;/text&gt;
- L62 [UI Copy] &lt;pp-section-header title="股东专属权益" barTone="blue" /&gt;

### features/community/model.ts

- File role: 静态页面内容、卡片标题、标签或示例文案
- Copy type: Static Content
- Entry count: 11

- L2 [Static Content] title: '加入股东大会',
- L3 [Static Content] badge: '薪潮涌动官方会场',
- L4 [Static Content] headline: '汇聚全球股东',
- L5 [Static Content] highlight: '共创经营盛世',
- L6 [Static Content] description: '加入会场，让每一次经营都不再孤单。与万千股东一起抵御职场风暴。',
- L10 [Static Content] { label: '活跃股东', value: '12,840+' },
- L11 [Static Content] { label: '经营心得', value: '85.6k' },
- L12 [Static Content] { label: '覆盖行业', value: '32 个' },
- L15 [Static Content] { title: '经营心得交流', desc: '万千资深股东在线，分享应对职场风暴的实战技巧。', tone: 'orange', iconLabel: '聊' },
- L16 [Static Content] { title: '新功能抢先看', desc: '优先获得内测资格，提前体验最新的经营工具与体能补给。', tone: 'blue', iconLabel: '新' },
- L17 [Static Content] { title: '需求直通车', desc: '你的每一个想法都直达核心董事会，参与定义未来经营方式。', tone: 'emerald', iconLabel: '需' },

---

## About（关于本司）

品牌和产品故事文案：应用名称、口号、更新日志、设计理念和法律文本。

### features/about/about.wxml

- File role: 页面或组件模板中的直接用户可见文案
- Copy type: UI Copy
- Entry count: 7

- L7 [UI Copy] &lt;text class="about-nav__title"&gt;关于本司&lt;/text&gt;
- L17 [UI Copy] &lt;text class="brand-hero__badge-text"&gt;版本 {{vm.currentVersion}}&lt;/text&gt;
- L35 [UI Copy] &lt;text class="tab-switch__text"&gt;更新日志&lt;/text&gt;
- L38 [UI Copy] &lt;text class="tab-switch__text"&gt;设计理念&lt;/text&gt;
- L48 [UI Copy] &lt;text class="timeline-item__version"&gt;版本 {{item.version}}&lt;/text&gt;
- L80 [UI Copy] &lt;text class="about-footer__copy"&gt;薪潮涌动工作室 · 深度定制&lt;/text&gt;
- L81 [UI Copy] &lt;text class="about-footer__legal"&gt;© 2026 版权所有&lt;/text&gt;

### features/about/model.ts

- File role: 静态页面内容、卡片标题、标签或示例文案
- Copy type: Static Content
- Entry count: 16

- L2 [Static Content] appName: '薪潮涌动',
- L3 [Static Content] slogan: '波涛之下，自有薪意',
- L5 [Static Content] featureBadges: ['跨平台支持', '数据加密保护'],
- L9 [Static Content] date: '2026年03月18日',
- L10 [Static Content] title: '正式挂牌：深海探索开启',
- L11 [Static Content] description: '薪潮涌动 v1.0.0 正式发布。我们致力于为每位在职场交易所中穿行的股东提供更可读的分红视角与情绪权益兑现。',
- L13 [Static Content] '【股东大厅】实时掌控分红水位与加薪趋势',
- L14 [Static Content] '【个人基地】全维度经营数据建模与等级体系',
- L15 [Static Content] '【体能股本】以卡片方式承载成长反馈与任务节奏',
- L16 [Static Content] '【人生里程碑】记录重要节点并回看生命 ROI',
- L22 [Static Content] title: '非线性时间观',
- L23 [Static Content] desc: '拒绝传统打卡叙事，将职场时间重新定义为经营周期，关注成长的复利而非秒针跳动。',
- L26 [Static Content] title: '算法驱动的关怀',
- L27 [Static Content] desc: '分红换算不仅是数字，还要转化成可被理解的节奏、提醒与回顾。',
- L30 [Static Content] title: '人文权益主义',
- L31 [Static Content] desc: '权益兑现不是目的，在繁忙市场中保持心理干爽与秩序感才是长期目标。',

---

## Data Center（数据中心）

数据管理文案：存储概览、导出/重置操作、风险警告和确认对话框。

### features/data-center/data-center.ts

- File role: 数据中心页面的导出/重置操作反馈
- Copy type: Interaction Feedback
- Entry count: 1

- L77 [Interaction Feedback] title: '导出失败',

### features/data-center/data-center.wxml

- File role: 页面或组件模板中的直接用户可见文案
- Copy type: UI Copy
- Entry count: 21

- L7 [UI Copy] &lt;text class="data-center-nav__title"&gt;数据管理中心&lt;/text&gt;
- L13 [UI Copy] &lt;pp-section-header title="本地存储概览" barTone="blue" /&gt;
- L22 [UI Copy] &lt;text class="storage-card__eyebrow"&gt;已使用空间&lt;/text&gt;
- L28 [UI Copy] &lt;text&gt;当前容量占比&lt;/text&gt;
- L35 [UI Copy] &lt;text&gt;总容量上限 {{vm.storage.capacity}} MB&lt;/text&gt;
- L38 [UI Copy] &lt;text&gt;安全加密中&lt;/text&gt;
- L47 [UI Copy] &lt;text class="sync-card__title"&gt;云端同步筹备中&lt;/text&gt;
- L48 [UI Copy] &lt;text class="sync-card__desc"&gt;当前版本优先完成本地数据管理，后续开放多设备同步能力。&lt;/text&gt;
- L50 [UI Copy] &lt;text class="sync-card__tag-text"&gt;功能规划中&lt;/text&gt;
- L55 [UI Copy] &lt;pp-section-header title="导出与重置" barTone="dark" /&gt;
- L64 [UI Copy] &lt;text class="action-item__title"&gt;{{exportStatus === 'success' ? '导出已完成' : '导出完整备份'}}&lt;/text&gt;
- L65 [UI Copy] &lt;text class="action-item__desc"&gt;生成完整 JSON 备份，并复制到用户剪贴板。&lt;/text&gt;
- L69 [UI Copy] &lt;text class="action-item__state" wx:if="{{exportStatus === 'exporting'}}"&gt;处理中&lt;/text&gt;
- L80 [UI Copy] &lt;text class="action-item__title action-item__title--rose"&gt;重置所有数据&lt;/text&gt;
- L81 [UI Copy] &lt;text class="action-item__desc action-item__desc--rose"&gt;擦除所有本地缓存与经营记录。&lt;/text&gt;
- L85 [UI Copy] &lt;text&gt;高风险操作&lt;/text&gt;
- L92 [UI Copy] &lt;text class="notice-card__text"&gt;所有数据均优先存储在设备本地。重置操作不可撤销，请在清理前确保已完成必要备份。&lt;/text&gt;
- L100 [UI Copy] &lt;text class="reset-sheet__title"&gt;确定要清空经营档案吗&lt;/text&gt;
- L101 [UI Copy] &lt;text class="reset-sheet__subtitle"&gt;此操作将永久删除股东信息、任务进度和分红记录。&lt;/text&gt;
- L114 [UI Copy] &lt;text&gt;暂不清理&lt;/text&gt;
- L117 [UI Copy] &lt;text&gt;继续重置&lt;/text&gt;