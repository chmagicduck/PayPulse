# Chinese Copy Inventory

## Notes

- Scope: scans `*.ts`, `*.wxml`, and `*.json` files under `miniprogram/` for Chinese copy.
- Goal: provide a rewrite-ready inventory for another AI, while keeping enough product context to understand what each string does.
- Excluded: code comments, repository docs, style-only files, `sitemap.json`, and anything outside `miniprogram/`.
- Retention rule: the same phrase is kept multiple times when it appears in different pages or different semantic positions.
- Extraction stats: 35 files, 393 Chinese-copy records.

## Module Index

- Global And Shared Copy
- Home
- Report
- Lab
- Profile
- Profile Settings
- Time Axis
- Calendar
- Community
- About
- Data Center

## Global And Shared Copy

Cross-page copy such as app navigation, tab labels, calendar status prompts, and shared domain-generated text.

### app.json

- File role: App-level page registration and tab bar labels.
- Copy type: Config Copy
- Entry count: 4

- L29 [Config Copy] "text": "领潮中心",
- L35 [Config Copy] "text": "航行报告",
- L41 [Config Copy] "text": "动力舱",
- L47 [Config Copy] "text": "个人基地",

### config/tabbar.ts

- File role: Typed tab bar config copy, expected to stay aligned with app.json tab labels.
- Copy type: Other Copy
- Entry count: 4

- L5 [Other Copy] text: '领潮中心',
- L14 [Other Copy] text: '航行报告',
- L23 [Other Copy] text: '动力舱',
- L32 [Other Copy] text: '个人基地',

### lib/domain/calendar-config.ts

- File role: Holiday config copy including names, badges, and descriptions.
- Copy type: Domain And State Copy
- Entry count: 21

- L10 [Domain And State Copy] badge: '元',
- L11 [Domain And State Copy] title: '元旦假期中',
- L12 [Domain And State Copy] desc: '当前日期位于 2026 年元旦法定假期内。',
- L17 [Domain And State Copy] badge: '春',
- L18 [Domain And State Copy] title: '春节假期中',
- L19 [Domain And State Copy] desc: '当前日期位于 2026 年春节法定假期内。',
- L24 [Domain And State Copy] badge: '清',
- L25 [Domain And State Copy] title: '清明假期中',
- L26 [Domain And State Copy] desc: '当前日期位于 2026 年清明法定假期内。',
- L31 [Domain And State Copy] badge: '劳',
- L32 [Domain And State Copy] title: '劳动节假期中',
- L33 [Domain And State Copy] desc: '当前日期位于 2026 年劳动节法定假期内。',
- L38 [Domain And State Copy] badge: '端',
- L39 [Domain And State Copy] title: '端午假期中',
- L40 [Domain And State Copy] desc: '当前日期位于 2026 年端午法定假期内。',
- L45 [Domain And State Copy] badge: '秋',
- L46 [Domain And State Copy] title: '中秋假期中',
- L47 [Domain And State Copy] desc: '当前日期位于 2026 年中秋法定假期内。',
- L52 [Domain And State Copy] badge: '国',
- L53 [Domain And State Copy] title: '国庆假期中',
- L54 [Domain And State Copy] desc: '当前日期位于 2026 年国庆法定假期内。',

### lib/domain/calendar.ts

- File role: Shared calendar status, reminders, and pacing-related copy.
- Copy type: Domain And State Copy
- Entry count: 13

- L84 [Domain And State Copy] return { day: String(date.getDate()), status: 'makeup', badge: '班' }
- L87 [Domain And State Copy] return { day: String(date.getDate()), status: 'payday', badge: '薪' }
- L90 [Domain And State Copy] return { day: String(date.getDate()), status: 'weekend', badge: '休' }
- L105 [Domain And State Copy] return { title: '调休补班中', desc: '今天属于官方调休补班日，请按工作节奏安排摸鱼与航行。' }
- L108 [Domain And State Copy] return { title: '宝藏日：薪水到账', desc: '发薪节点已到，可以顺手回顾本月的真实航行与摸鱼记录。' }
- L111 [Domain And State Copy] return { title: '周末休整中', desc: '当前日期属于休息日，适合补能、休整，不能开启摸鱼会话。' }
- L114 [Domain And State Copy] return { title: '正常航行模式', desc: '当前处于正常工作日，页面中的工时与收益都会按真实时间推进。' }
- L152 [Domain And State Copy] candidates.push({ date: payDate, label: `距离下次发薪还有 ${diffDays(today, payDate)} 天` })
- L159 [Domain And State Copy] candidates.push({ date: holidayDate, label: `距离${item.title.replace('中', '')}还有 ${diffDays(today, holidayDate)} 天` })
- L166 [Domain And State Copy] candidates.push({ date: makeupDate, label: `距离下一次补班日还有 ${diffDays(today, makeupDate)} 天` })
- L173 [Domain And State Copy] candidates.push({ date: nextEvent.date, label: `距离“${nextEvent.title}”还有 ${diffDays(today, nextEvent.date)} 天` })
- L177 [Domain And State Copy] return candidates[0]?.label || `${year} 年 ${monthIndex + 1} 月暂无额外提醒，继续保持稳定航行。`
- L193 [Domain And State Copy] unitText: delta < 0 && !anniversary ? '天前' : '天后',

### lib/domain/daily-records.ts

- File role: Income/work-time domain copy and report summaries.
- Copy type: Domain And State Copy
- Entry count: 7

- L606 [Domain And State Copy] emptyTitle: monthRecords.length === 0 ? '本月无数据' : '本月数据不足完整月',
- L608 [Domain And State Copy] ? '当前月份还没有真实摸鱼记录，开始一次有效记录后会出现在这里。'
- L609 [Domain And State Copy] : '当前月份只展示已有自然日，不会补齐未来日期或演示数据。',
- L626 [Domain And State Copy] { title: '年度摸鱼收益', value: formatCurrency(yearMoyuIncomeTotal, 2), tone: 'indigo', iconName: 'coins' },
- L627 [Domain And State Copy] { title: '摸鱼打卡天数', value: `${checkInDays} 天`, tone: 'amber', iconName: 'calendar-days' },
- L628 [Domain And State Copy] { title: '月均摸鱼收益', value: formatCurrency(Math.round(yearMoyuIncomeTotal / recordedMonthCount), 2), tone: 'blue', iconName: 'trending-up' },
- L629 [Domain And State Copy] { title: '年度航行收益', value: formatCurrency(yearVoyageIncomeTotal, 2), tone: 'rose', iconName: 'trophy' },

### lib/domain/date.ts

- File role: Chinese date-formatting output.
- Copy type: Domain And State Copy
- Entry count: 1

- L46 [Domain And State Copy] return `${date.getMonth() + 1}月${date.getDate()}日`

## Home

Dashboard copy for income display, session toggle, task preview, recurring reminders, important dates, and life journey cards.

### features/home/home.wxml

- File role: Direct user-visible copy in page or component templates.
- Copy type: UI Copy
- Entry count: 74

- L3 [UI Copy] <text class="{{valueClass}}">{{item.display.major}}天</text>
- L6 [UI Copy] <text class="{{valueClass}}">{{item.display.major}}年 {{item.display.middle}}个月 {{item.display.minor}}天</text>
- L9 [UI Copy] <text class="{{valueClass}}">{{item.display.major}}个月 {{item.display.minor}}天</text>
- L12 [UI Copy] <text class="{{valueClass}}">{{item.display.major}}周 {{item.display.minor}}天</text>
- L24 [UI Copy] <text class="nav-bar__title">薪潮涌动</text>
- L36 [UI Copy] <text class="income-card__label">今日累计避风收益</text>
- L47 [UI Copy] <text class="income-card__badge-tag">即时航速 {{showAmount ? vm.income.rate : '***'}}/s</text>
- L55 [UI Copy] data-blocked-message="当前状态不需要避风"
- L58 [UI Copy] <text class="income-card__toggle-text">{{isMoYu ? '避风中' : '开启避风'}}</text>
- L61 [UI Copy] <text class="income-card__stay-text">手动校准: {{vm.timer.rightValue}}</text>
- L72 [UI Copy] <text class="income-card__progress-title">避风占比</text>
- L75 [UI Copy] <text class="income-card__progress-meta">/ 今日航程 {{vm.income.workPercent}}%</text>
- L82 [UI Copy] <text>返航倒计时</text>
- L88 [UI Copy] <text class="income-card__countdown-value">待启航</text>
- L91 [UI Copy] <text class="income-card__countdown-value">补给中</text>
- L94 [UI Copy] <text class="income-card__countdown-value">已返港</text>
- L97 [UI Copy] <text class="income-card__countdown-value">补能中</text>
- L109 [UI Copy] <text class="income-card__footer-label">今日补给</text>
- L113 [UI Copy] <text class="income-card__footer-label">月度补给</text>
- L123 [UI Copy] title="日常巡航任务"
- L125 [UI Copy] manageText="查看动力舱"
- L137 [UI Copy] <text class="task-card__title">航道清理・动力补给</text>
- L138 [UI Copy] <text class="task-card__desc">保障航行通畅，完成动力补给作业</text>
- L144 [UI Copy] <text class="task-card__reward-text">待获得{{vm.taskPreview.rewardValue}}动能</text>
- L146 [UI Copy] <text class="task-card__progress-text">今日任务完成度 {{vm.taskPreview.completed}}/{{vm.taskPreview.total}}</text>
- L154 [UI Copy] title="常规波动"
- L156 [UI Copy] manageText="查看日历"
- L169 [UI Copy] <text class="tide-card__badge tide-card__badge--blue">发薪 (PAY)</text>
- L173 [UI Copy] <text class="tide-card__leading">距</text>
- L174 [UI Copy] <text class="tide-card__value">{{vm.regularTides[0].days}}天</text>
- L176 [UI Copy] <text class="tide-card__desc">下一次<text class="tide-card__desc-strong tide-card__desc-strong--blue">资金补给</text>正在靠近。</text>
- L188 [UI Copy] <text class="tide-card__badge tide-card__badge--emerald">休息 (WKD)</text>
- L192 [UI Copy] <text class="tide-card__leading">距</text>
- L193 [UI Copy] <text class="tide-card__value">{{vm.regularTides[1].days}}天</text>
- L195 [UI Copy] <text class="tide-card__desc">距离下一次<text class="tide-card__desc-strong tide-card__desc-strong--emerald">靠岸补能</text>已经不远了。</text>
- L204 [UI Copy] title="岁月坐标"
- L206 [UI Copy] manageText="新增坐标"
- L224 [UI Copy] <block wx:if="{{vm.importantDates[0].notebookId === 'commemorative'}}">纪念本</block>
- L225 [UI Copy] <block wx:elif="{{vm.importantDates[0].notebookId === 'travel'}}">旅行本</block>
- L226 [UI Copy] <block wx:elif="{{vm.importantDates[0].notebookId === 'career'}}">职场本</block>
- L227 [UI Copy] <block wx:else>人生本</block>
- L235 [UI Copy] <text class="date-item__suffix">{{vm.importantDates[0].isPast ? '天前' : '天后'}}</text>
- L250 [UI Copy] <block wx:if="{{vm.importantDates[1].notebookId === 'commemorative'}}">纪念本</block>
- L251 [UI Copy] <block wx:elif="{{vm.importantDates[1].notebookId === 'travel'}}">旅行本</block>
- L252 [UI Copy] <block wx:elif="{{vm.importantDates[1].notebookId === 'career'}}">职场本</block>
- L253 [UI Copy] <block wx:else>人生本</block>
- L261 [UI Copy] <text class="date-item__suffix">{{vm.importantDates[1].isPast ? '天前' : '天后'}}</text>
- L276 [UI Copy] <block wx:if="{{vm.importantDates[2].notebookId === 'commemorative'}}">纪念本</block>
- L277 [UI Copy] <block wx:elif="{{vm.importantDates[2].notebookId === 'travel'}}">旅行本</block>
- L278 [UI Copy] <block wx:elif="{{vm.importantDates[2].notebookId === 'career'}}">职场本</block>
- L279 [UI Copy] <block wx:else>人生本</block>
- L287 [UI Copy] <text class="date-item__suffix">{{vm.importantDates[2].isPast ? '天前' : '天后'}}</text>
- L292 [UI Copy] <text class="date-empty__text">还没有坐标卡片，点击新增一张。</text>
- L298 [UI Copy] title="人生航程看板"
- L310 [UI Copy] <text class="journey-card__eyebrow journey-card__eyebrow--indigo">生命航程 (LIFE)</text>
- L313 [UI Copy] <text class="journey-card__status">已过</text>
- L316 [UI Copy] <text class="journey-card__desc">这是你从<text class="journey-card__desc-strong">出生启航</text>至今走过的日数。</text>
- L325 [UI Copy] <text class="journey-card__eyebrow journey-card__eyebrow--blue">职场航程 (CAREER)</text>
- L328 [UI Copy] <text class="journey-card__status">已过</text>
- L331 [UI Copy] <text class="journey-card__desc">自从步入<text class="journey-card__desc-strong journey-card__desc-strong--blue">社会海域</text>以后，你已投入的岁月。</text>
- L340 [UI Copy] <text class="journey-card__eyebrow journey-card__eyebrow--emerald">退休倒计时 (RETIRE)</text>
- L343 [UI Copy] <text class="journey-card__status journey-card__status--emerald">还剩</text>
- L346 [UI Copy] <text class="journey-card__desc journey-card__desc--emerald">距离你可以<text class="journey-card__desc-strong journey-card__desc-strong--emerald">正式卸甲</text>，还有这些既定航程。</text>
- L358 [UI Copy] <text class="journey-card__eyebrow journey-card__eyebrow--rose">终点倒计时 (FINAL)</text>
- L361 [UI Copy] <text class="journey-card__status journey-card__status--rose">还剩</text>
- L364 [UI Copy] <text class="journey-card__quote">"警告：航线即将耗尽，此数据不可逆转。"</text>
- L366 [UI Copy] <text class="journey-card__note-text">* 基于预计 85 岁自然终点计算。每一秒都属于不可再生的生命样本。</text>
- L377 [UI Copy] <text class="modal-sheet__title">修正摸鱼时长</text>
- L378 [UI Copy] <text class="modal-sheet__subtitle">手动校准今日摸鱼港停留的时间</text>
- L387 [UI Copy] <text class="time-input__label">时</text>
- L392 [UI Copy] <text class="time-input__label">分</text>
- L397 [UI Copy] <text class="time-input__label">秒</text>
- L402 [UI Copy] <text>取消</text>
- L405 [UI Copy] <text>确认保存</text>

## Report

Analytics and report copy for trends, annual summaries, ratio labels, historical cards, and related descriptions.

### features/report/model.ts

- File role: Static page content, card titles, tags, or sample copy.
- Copy type: Static Content
- Entry count: 4

- L42 [Static Content] { title: '年度摸鱼收入', value: '¥12,480.50', tone: 'indigo', iconName: 'coins' },
- L43 [Static Content] { title: '摸鱼打卡天数', value: '248 天', tone: 'amber', iconName: 'calendar-days' },
- L44 [Static Content] { title: '月均摸鱼收益', value: '¥1,040.00', tone: 'blue', iconName: 'trending-up' },
- L45 [Static Content] { title: '年度航行收入', value: '98.5%', tone: 'rose', iconName: 'trophy' },

### features/report/model/state.ts

- File role: Runtime view-model text such as labels, summaries, and metrics.
- Copy type: Static Content
- Entry count: 3

- L13 [Static Content] ? `${now().getMonth() + 1} 月每日真实摸鱼概览`
- L14 [Static Content] : '当前月份暂无真实记录',
- L15 [Static Content] summaryLabel: monthRecords.length ? '本月总计' : '暂无汇总',

### features/report/ocean-report.helper.ts

- File role: Display helper output such as labels, units, and assembled UI text.
- Copy type: Domain And State Copy
- Entry count: 1

- L70 [Domain And State Copy] return `${Number(month)}月${Number(day)}日`

### features/report/report.ts

- File role: Copy emitted from page logic, helpers, or domain models.
- Copy type: Other Copy
- Entry count: 1

- L111 [Other Copy] title: '请前往首页领潮中心修改今日摸鱼时长',

### features/report/report.wxml

- File role: Direct user-visible copy in page or component templates.
- Copy type: UI Copy
- Entry count: 17

- L8 [UI Copy] <text class="report-nav__title">航行报告</text>
- L21 [UI Copy] title="收入趋势"
- L33 [UI Copy] <text class="tab-switch__text">收入</text>
- L40 [UI Copy] <text class="tab-switch__text">时长</text>
- L70 [UI Copy] <text class="chart-card__unit">{{activeTab === 'income' ? 'RMB' : '小时'}}</text>
- L84 [UI Copy] <pp-section-header title="年度航行成就" barTone="amber" trimBottom="{{true}}" />
- L102 [UI Copy] <pp-section-header title="时长占比统计" barTone="blue" trimBottom="{{true}}" />
- L106 [UI Copy] <text class="range-switch__text">日</text>
- L109 [UI Copy] <text class="range-switch__text">周</text>
- L112 [UI Copy] <text class="range-switch__text">月</text>
- L115 [UI Copy] <text class="range-switch__text">年</text>
- L125 [UI Copy] <text class="ratio-card__ring-label">摸鱼占比</text>
- L132 [UI Copy] <text class="ratio-stat__label">工作时长</text>
- L142 [UI Copy] <text class="ratio-stat__label ratio-stat__label--blue">摸鱼时长</text>
- L155 [UI Copy] <pp-section-header title="最近记录" barTone="slate" trimBottom="{{true}}" />
- L173 [UI Copy] <text class="history-card__hint">仅支持在领潮中心修正今日摸鱼时长</text>
- L180 [UI Copy] <text class="history-card__income-label">收入</text>

## Lab

Progression and task-system copy including level names, daily tasks, weekly achievements, and energy feedback.

### features/lab/model.ts

- File role: Static page content, card titles, tags, or sample copy.
- Copy type: Static Content
- Entry count: 32

- L3 [Static Content] title: '动力舱',
- L6 [Static Content] eyebrow: '动能舱',
- L7 [Static Content] stagePrefix: '第',
- L8 [Static Content] stageSuffix: '阶段',
- L9 [Static Content] todayLabel: '今日动能',
- L10 [Static Content] totalLabel: '总动能',
- L11 [Static Content] targetLabel: '下一等级',
- L12 [Static Content] maxLabel: '已抵达满级航道',
- L16 [Static Content] title: '每日任务',
- L17 [Static Content] subtitle: '每日打开时自动按自然日重置',
- L18 [Static Content] progressLabel: '任务进度',
- L19 [Static Content] rewardSuffix: ' 动能',
- L20 [Static Content] doneText: '已达上限',
- L23 [Static Content] title: '每周成就',
- L28 [Static Content] { level: 1, name: '海湾漫步者', exp: 0, iconName: 'shell', tone: 'slate', theme: 'basic', iconColor: '#94a3b8', cardIconColor: '#94a3b8' },
- L29 [Static Content] { level: 2, name: '浅滩摸鱼手', exp: 100, iconName: 'waves', tone: 'cyan', theme: 'basic', iconColor: '#0891b2', cardIconColor: '#0891b2' },
- L30 [Static Content] { level: 3, name: '茶歇守望员', exp: 260, iconName: 'coffee', tone: 'orange', theme: 'basic', iconColor: '#ea580c', cardIconColor: '#ea580c' },
- L31 [Static Content] { level: 4, name: '风平掌舵人', exp: 520, iconName: 'wind', tone: 'emerald', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L32 [Static Content] { level: 5, name: '资深航迹师', exp: 900, iconName: 'compass', tone: 'blue', theme: 'mid', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L33 [Static Content] { level: 6, name: '深海潜航员', exp: 1400, iconName: 'ghost', tone: 'indigo', theme: 'mid', iconColor: '#e2e8f0', cardIconColor: '#ffffff' },
- L34 [Static Content] { level: 7, name: '风暴避险者', exp: 2050, iconName: 'anchor', tone: 'violet', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L35 [Static Content] { level: 8, name: '核芯巡航长', exp: 2900, iconName: 'zap', tone: 'rose', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L36 [Static Content] { level: 9, name: '深海舰长', exp: 3950, iconName: 'ship', tone: 'blue', theme: 'high', iconColor: '#ffffff', cardIconColor: '#ffffff' },
- L37 [Static Content] { level: 10, name: '满级灯塔', exp: 5200, iconName: 'crown', tone: 'amber', theme: 'ultra', iconColor: '#92400e', cardIconColor: '#92400e' },
- L45 [Static Content] { id: 'water', title: '深海补水计划', desc: '喝一杯水，保持清醒与续航。', reward: 1, count: 0, limit: 8, tone: 'blue', iconName: 'droplets' },
- L46 [Static Content] { id: 'move', title: '甲板体能回收', desc: '起身活动一次，避免久坐卡顿。', reward: 1, count: 0, limit: 10, tone: 'emerald', iconName: 'accessibility' },
- L47 [Static Content] { id: 'eye', title: '远场海平线', desc: '做一次远眺，给视线放个风。', reward: 1, count: 0, limit: 10, tone: 'amber', iconName: 'eye' },
- L48 [Static Content] { id: 'leave', title: '准点回港靠岸', desc: '准点下班一次，守住自己的边界。', reward: 12, count: 0, limit: 1, tone: 'rose', iconName: 'log-out' },
- L49 [Static Content] { id: 'toilet', title: '潜艇压力排放', desc: '离开工位放空一会儿，累计减压分钟。', reward: 4, count: 0, limit: 5, tone: 'indigo', iconName: 'navigation', rotate: true },
- L52 [Static Content] { id: 'discipline', title: '黄金航线守护者', desc: '本周连续 7 天准点回港靠岸。', reward: 50, progress: 0, target: 7 },
- L53 [Static Content] { id: 'idle-master', title: '静默巡航专家', desc: '本周累计完成 120 分钟压力排放。', reward: 50, progress: 0, target: 120, unit: '分钟' },
- L54 [Static Content] { id: 'whale', title: '满点核动力', desc: '本周累计完成 40 次深海补水计划。', reward: 50, progress: 0, target: 40 },

## Profile

Personal center copy including identity summary, menu entries, avatar actions, and related navigation.

### features/profile/model.ts

- File role: Static page content, card titles, tags, or sample copy.
- Copy type: Static Content
- Entry count: 8

- L3 [Static Content] name: '摸鱼小队长',
- L7 [Static Content] name: '深海霸主',
- L23 [Static Content] title: '航行档案设置',
- L30 [Static Content] title: '航程界标设置',
- L37 [Static Content] title: '查看航行日历',
- L46 [Static Content] title: '船员俱乐部',
- L53 [Static Content] title: '航行通告',
- L62 [Static Content] title: '数据同步中心',

### features/profile/profile.ts

- File role: Avatar-related interaction feedback in the profile page.
- Copy type: Interaction Feedback
- Entry count: 2

- L117 [Interaction Feedback] title: '已切换微信头像演示',
- L127 [Interaction Feedback] title: '已切换上传头像演示',

### features/profile/profile.wxml

- File role: Direct user-visible copy in page or component templates.
- Copy type: UI Copy
- Entry count: 11

- L8 [UI Copy] <text class="profile-nav__title">个人基地</text>
- L37 [UI Copy] <text class="profile-identity__pill-text">累计摸鱼打卡：</text>
- L38 [UI Copy] <text class="profile-identity__pill-value">{{vm.user.checkInDays}}天</text>
- L45 [UI Copy] <pp-section-header title="航行控制台" barTone="blue" />
- L68 [UI Copy] <pp-section-header title="甲板议事台" barTone="indigo" />
- L91 [UI Copy] <pp-section-header title="灯塔同步站" barTone="dark" />
- L118 [UI Copy] <text class="avatar-sheet__title">修改头像</text>
- L129 [UI Copy] <text class="avatar-sheet__action-text">微信头像</text>
- L133 [UI Copy] <text class="avatar-sheet__action-text">上传图片</text>
- L138 [UI Copy] <text class="avatar-sheet__preset-title">预设形象</text>
- L150 [UI Copy] <text class="avatar-sheet__confirm-text">确认修改</text>

## Profile Settings

Form copy for personal profile and work parameters, including field labels, options, validation, and save feedback.

### features/profile-settings/helper/validate.ts

- File role: Form validation error copy.
- Copy type: Other Copy
- Entry count: 15

- L12 [Other Copy] return { ok: false, message: '请先填写正确的昵称' }
- L16 [Other Copy] return { ok: false, message: '请填写正确的生日' }
- L20 [Other Copy] return { ok: false, message: '入职日期不能晚于今天' }
- L24 [Other Copy] return { ok: false, message: '入职日期不能早于生日' }
- L33 [Other Copy] return { ok: false, message: '退休年龄必须大于 0' }
- L37 [Other Copy] return { ok: false, message: `退休年龄不能超过 ${profileAgeLimits.retirementAgeMax}` }
- L41 [Other Copy] return { ok: false, message: '预期寿龄必须大于 0' }
- L45 [Other Copy] return { ok: false, message: `预期寿龄不能超过 ${profileAgeLimits.expectedLifespanMax}` }
- L49 [Other Copy] return { ok: false, message: '预期寿龄必须大于退休年龄' }
- L53 [Other Copy] return { ok: false, message: '月薪必须大于 0' }
- L57 [Other Copy] return { ok: false, message: '发薪日必须在 1 到 31 之间' }
- L61 [Other Copy] return { ok: false, message: '下班时间必须晚于上班时间' }
- L66 [Other Copy] return { ok: false, message: '请填写完整的午休时间' }
- L70 [Other Copy] return { ok: false, message: '午休结束时间必须晚于开始时间' }
- L77 [Other Copy] return { ok: false, message: '午休时间必须落在工作区间内' }

### features/profile-settings/model/options.ts

- File role: Option labels used by form controls.
- Copy type: Static Content
- Entry count: 6

- L4 [Static Content] { value: 'male', label: '男性' },
- L5 [Static Content] { value: 'female', label: '女性' },
- L9 [Static Content] { value: 'double', label: '双休' },
- L10 [Static Content] { value: 'single-sat', label: '休六' },
- L11 [Static Content] { value: 'single-sun', label: '休日' },
- L12 [Static Content] { value: 'big-small', label: '大小周' },

### features/profile-settings/profile-settings.ts

- File role: Save-flow feedback such as review results and success prompts.
- Copy type: Interaction Feedback
- Entry count: 3

- L119 [Interaction Feedback] title: '昵称审核中，请稍后确认',
- L127 [Interaction Feedback] title: '昵称未通过审核，请重新输入',
- L146 [Interaction Feedback] title: saveResult.initialized ? '初始化完成' : '保存成功',

### features/profile-settings/profile-settings.wxml

- File role: Direct user-visible copy in page or component templates.
- Copy type: UI Copy
- Entry count: 24

- L7 [UI Copy] <text class="settings-nav__title">航行档案设置</text>
- L14 [UI Copy] <pp-section-header title="船员身份识别" barTone="blue" />
- L19 [UI Copy] <text>用户昵称</text>
- L24 [UI Copy] placeholder="点击输入或使用微信昵称"
- L36 [UI Copy] <text>出生日期</text>
- L46 [UI Copy] <text>性别</text>
- L64 [UI Copy] <pp-section-header title="航程工龄坐标" barTone="blue" />
- L69 [UI Copy] <text>首份工作日期</text>
- L80 [UI Copy] <text>税前月收入</text>
- L91 [UI Copy] <text>发薪日期</text>
- L101 [UI Copy] <text>预计退休年龄</text>
- L106 [UI Copy] placeholder="例如 {{ageLimits.retirementAgeMin}} - {{ageLimits.retirementAgeMax}}"
- L115 [UI Copy] <text>预期寿龄</text>
- L120 [UI Copy] placeholder="至少 {{ageLimits.expectedLifespanMin}} 岁"
- L131 [UI Copy] title="航行排班计划"
- L132 [UI Copy] subtitle="{{dailyWorkDuration.hours}}小时{{dailyWorkDuration.minutes < 10 ? '0' : ''}}{{dailyWorkDuration.minutes}}分"
- L140 [UI Copy] <text>休息模式</text>
- L156 [UI Copy] <text class="switch-row__label">本周是大周吗？</text>
- L166 [UI Copy] <text>上班打卡时间</text>
- L176 [UI Copy] <text>下班打卡时间</text>
- L187 [UI Copy] <text>午休时间段</text>
- L199 [UI Copy] <text>午休开始时间</text>
- L209 [UI Copy] <text>午休结束时间</text>
- L223 [UI Copy] <text class="save-bar__text">保存档案</text>

## Time Axis

Milestone and time-axis copy for event cards, editing flows, category names, and reminder labels.

### features/time-axis/model.ts

- File role: Static page content, card titles, tags, or sample copy.
- Copy type: Static Content
- Entry count: 8

- L3 [Static Content] { id: 'all', name: '全部', iconId: 'layers', tone: 'slate' },
- L4 [Static Content] { id: 'commemorative', name: '纪念日', iconId: 'heart', tone: 'rose' },
- L5 [Static Content] { id: 'travel', name: '旅行本', iconId: 'map', tone: 'amber' },
- L6 [Static Content] { id: 'life', name: '人生本', iconId: 'user', tone: 'blue' },
- L7 [Static Content] { id: 'career', name: '职场本', iconId: 'briefcase', tone: 'indigo' },
- L12 [Static Content] title: '结婚纪念日',
- L19 [Static Content] title: '西藏大冒险',
- L26 [Static Content] title: '拿到高级架构师证',

### features/time-axis/model/storage.ts

- File role: Copy emitted from page logic, helpers, or domain models.
- Copy type: Static Content
- Entry count: 3

- L18 [Static Content] title: '我的生日',
- L25 [Static Content] title: '就业纪念日',
- L32 [Static Content] title: '退休日',

### features/time-axis/time-axis-settings.helper.ts

- File role: Display helper output such as labels, units, and assembled UI text.
- Copy type: Domain And State Copy
- Entry count: 2

- L86 [Domain And State Copy] unitText: '天后',
- L96 [Domain And State Copy] unitText: difference < 0 ? '天前' : '天后',

### features/time-axis/time-axis.ts

- File role: Operational feedback for timeline actions such as system-card restrictions.
- Copy type: Interaction Feedback
- Entry count: 2

- L111 [Interaction Feedback] title: '系统卡请在航行档案设置中修改',
- L205 [Interaction Feedback] title: '系统卡不可删除',

### features/time-axis/time-axis.wxml

- File role: Direct user-visible copy in page or component templates.
- Copy type: UI Copy
- Entry count: 11

- L7 [UI Copy] <text class="time-axis-nav__title">岁月坐标设置</text>
- L70 [UI Copy] <text class="entry-empty__title">档案位暂时空缺</text>
- L81 [UI Copy] <text class="archive-cta__text">存入新档案卡片</text>
- L88 [UI Copy] <text class="edit-sheet__title">{{editingId ? '编辑档案' : '新增档案卡片'}}</text>
- L95 [UI Copy] <text class="edit-field__label">档案名称</text>
- L100 [UI Copy] placeholder="记录此刻的重要意义..."
- L106 [UI Copy] <text class="edit-field__label">发生日期</text>
- L111 [UI Copy] <text class="edit-field__picker-text">{{form.date || '请选择日期'}}</text>
- L119 [UI Copy] <text class="edit-switch__title">周年提醒模式</text>
- L128 [UI Copy] <text class="edit-field__label">存入档案本</text>
- L158 [UI Copy] <text class="edit-actions__primary-text">{{editingId ? '保存修改' : '确认录入'}}</text>

## Calendar

Calendar and holiday-status copy covering workdays, payday, statutory holidays, weekends, and reminders.

### features/calendar/calendar.wxml

- File role: Direct user-visible copy in page or component templates.
- Copy type: UI Copy
- Entry count: 7

- L57 [UI Copy] <text class="legend-item__text">薪日</text>
- L61 [UI Copy] <text class="legend-item__text">法定假日</text>
- L65 [UI Copy] <text class="legend-item__text">周末休息</text>
- L69 [UI Copy] <text class="legend-item__text">补班</text>
- L75 [UI Copy] <pp-section-header title="今日航行状态" barTone="blue" />
- L80 [UI Copy] <text class="detail-card__eyebrow">{{currentMonth.monthLabel}}{{selectedDay}}日</text>
- L90 [UI Copy] <text class="reminder-card__title">下一关键提醒</text>

### features/calendar/model.ts

- File role: Static page content, card titles, tags, or sample copy.
- Copy type: Static Content
- Entry count: 32

- L4 [Static Content] title: '日历',
- L8 [Static Content] title: '2026 九月',
- L9 [Static Content] reminder: '距离国庆长假还有 6 天，舵手请继续坚持。',
- L11 [Static Content] monthLabel: '九月',
- L15 [Static Content] { day: '8' }, { day: '9' }, { day: '10', status: 'payday', badge: '薪' }, { day: '11' }, { day: '12' }, { day: '13', status: 'weekend', badge: '休' }, { day: '14', status: 'weekend', badge: '休' },
- L16 [Static Content] { day: '15' }, { day: '16' }, { day: '17' }, { day: '18' }, { day: '19' }, { day: '20', status: 'makeup', badge: '班' }, { day: '21' },
- L17 [Static Content] { day: '22' }, { day: '23' }, { day: '24' }, { day: '25', status: 'holiday', badge: '秋' }, { day: '26', status: 'holiday', badge: '秋' }, { day: '27', status: 'holiday', badge: '秋' }, { day: '28' },
- L22 [Static Content] title: '正常航行模式',
- L23 [Static Content] desc: '当前海域风平浪静，适合稳定航行与日常推进。',
- L26 [Static Content] title: '法定摸鱼港',
- L27 [Static Content] desc: '当前日期位于官方节假日区间，适合休整与庆祝。',
- L30 [Static Content] title: '宝藏日：薪水到账',
- L31 [Static Content] desc: '检测到账户有大额能量补充，建议今日适当提高摸鱼质量。',
- L34 [Static Content] title: '强力补班中',
- L35 [Static Content] desc: '今天属于官方调休补班日，节奏会比普通工作日更紧凑。',
- L41 [Static Content] title: '2026 十月',
- L42 [Static Content] reminder: '距离下一次发薪日还有 10 天，继续稳住节奏。',
- L44 [Static Content] monthLabel: '十月',
- L47 [Static Content] { day: '1', status: 'holiday', badge: '庆' }, { day: '2', status: 'holiday', badge: '庆' }, { day: '3', status: 'holiday', badge: '庆' }, { day: '4', status: 'holiday', badge: '庆' }, { day: '5', status: 'holiday', badge: '庆' }, { day: '6', status: 'holiday', badge: '庆' }, { day: '7', status: 'holiday', badge: '庆' },
- L48 [Static Content] { day: '8' }, { day: '9' }, { day: '10', status: 'makeup', badge: '班' }, { day: '11', status: 'weekend', badge: '休' }, { day: '12' }, { day: '13' }, { day: '14' },
- L49 [Static Content] { day: '15' }, { day: '16' }, { day: '17', status: 'weekend', badge: '休' }, { day: '18', status: 'weekend', badge: '休' }, { day: '19' }, { day: '20' }, { day: '21' },
- L50 [Static Content] { day: '22' }, { day: '23' }, { day: '24', status: 'weekend', badge: '休' }, { day: '25', status: 'weekend', badge: '休' }, { day: '26' }, { day: '27' }, { day: '28' },
- L51 [Static Content] { day: '29' }, { day: '30' }, { day: '31', status: 'weekend', badge: '休' },
- L55 [Static Content] title: '正常航行模式',
- L56 [Static Content] desc: '当前海域风平浪静，适合稳定航行与日常推进。',
- L59 [Static Content] title: '国庆长假中',
- L60 [Static Content] desc: '当前日期位于 2026 年国庆法定假期区间，适合放松与出游。',
- L63 [Static Content] title: '宝藏日：薪水到账',
- L64 [Static Content] desc: '薪资节点已到，适合回顾本月航行收获。',
- L67 [Static Content] title: '强力补班中',
- L68 [Static Content] desc: '今天属于 2026 年国庆调休补班日，请注意工作节奏切换。',
- L73 [Static Content] weekLabels: ['日', '一', '二', '三', '四', '五', '六'],

### features/calendar/model/state.ts

- File role: Runtime view-model text such as labels, summaries, and metrics.
- Copy type: Static Content
- Entry count: 2

- L27 [Static Content] title: `${year} ${monthIndex + 1}月`,
- L30 [Static Content] monthLabel: `${monthIndex + 1}月`,

## Community

Community-join page copy including brand messaging, benefit descriptions, join hints, errors, and fallback prompts.

### features/community/community.ts

- File role: Interaction feedback for join flow, fallback hints, and toast messages.
- Copy type: Interaction Feedback
- Entry count: 13

- L9 [Interaction Feedback] [-3002]: '获取配置失败，请稍后重试',
- L10 [Interaction Feedback] [-3004]: '用户授权失败，无法继续拉起入群流程',
- L11 [Interaction Feedback] [-3005]: '加群失败，请稍后重试',
- L12 [Interaction Feedback] [-3006]: '你已经在群里了',
- L13 [Interaction Feedback] [-3009]: '群聊已满员，请联系管理员',
- L14 [Interaction Feedback] [-3010]: '群聊已解散',
- L15 [Interaction Feedback] [-3011]: '当前无法加入该群聊',
- L16 [Interaction Feedback] [-3012]: '你已在群里，但该群目前已满员',
- L33 [Interaction Feedback] joinHint: !wx.canIUse('openBusinessView') ? '当前微信版本暂不支持直接拉起入群，请先复制群链接。' : '',
- L50 [Interaction Feedback] title: '已复制群链接，请手动打开',
- L56 [Interaction Feedback] title: '当前无法直接拉起，请稍后重试',
- L71 [Interaction Feedback] title: '已拉起企微入群流程',
- L77 [Interaction Feedback] const message = COMMUNITY_ERROR_MESSAGES[detail.errcode] || '当前无法加入，请稍后重试'

### features/community/community.wxml

- File role: Direct user-visible copy in page or component templates.
- Copy type: UI Copy
- Entry count: 6

- L40 [UI Copy] <text class="join-card__title">深海摸鱼港</text>
- L41 [UI Copy] <text class="join-card__subtitle">官方社群入口</text>
- L50 [UI Copy] contactText="立即加入微信社群"
- L55 [UI Copy] <text class="join-card__button-text">复制群链接</text>
- L59 [UI Copy] <text class="join-card__note">{{joinHint || '点击主按钮后会拉起真实企微入群流程，若失败会提供明确提示与降级路径。'}}</text>
- L62 [UI Copy] <pp-section-header title="社群专属权益" barTone="blue" />

### features/community/model.ts

- File role: Static page content, card titles, tags, or sample copy.
- Copy type: Static Content
- Entry count: 11

- L2 [Static Content] title: '加入社区',
- L3 [Static Content] badge: '薪潮涌动官方社群',
- L4 [Static Content] headline: '汇聚全球舵手',
- L5 [Static Content] highlight: '共创摸鱼盛世',
- L6 [Static Content] description: '加入社区，让每一次航行都不再孤单。与万千舵手一起抵御职场风暴。',
- L10 [Static Content] { label: '活跃舵手', value: '12,840+' },
- L11 [Static Content] { label: '摸鱼心得', value: '85.6k' },
- L12 [Static Content] { label: '覆盖航线', value: '32 条' },
- L15 [Static Content] { title: '摸鱼心得交流', desc: '万千资深舵手在线，分享应对职场风暴的实战技巧。', tone: 'orange', iconLabel: '聊' },
- L16 [Static Content] { title: '新功能抢先看', desc: '优先获得内测资格，提前体验最新的航行工具与动力补给。', tone: 'blue', iconLabel: '新' },
- L17 [Static Content] { title: '需求直通车', desc: '你的每一个想法都直达核心港口，参与定义未来航行方式。', tone: 'emerald', iconLabel: '需' },

## About

Brand and product-story copy including app name, slogan, changelog, design principles, and legal text.

### features/about/about.wxml

- File role: Direct user-visible copy in page or component templates.
- Copy type: UI Copy
- Entry count: 7

- L7 [UI Copy] <text class="about-nav__title">关于软件</text>
- L17 [UI Copy] <text class="brand-hero__badge-text">版本 {{vm.currentVersion}}</text>
- L35 [UI Copy] <text class="tab-switch__text">更新日志</text>
- L38 [UI Copy] <text class="tab-switch__text">设计理念</text>
- L48 [UI Copy] <text class="timeline-item__version">版本 {{item.version}}</text>
- L80 [UI Copy] <text class="about-footer__copy">薪潮涌动工作室 · 深度定制</text>
- L81 [UI Copy] <text class="about-footer__legal">© 2026 版权所有</text>

### features/about/model.ts

- File role: Static page content, card titles, tags, or sample copy.
- Copy type: Static Content
- Entry count: 16

- L2 [Static Content] appName: '薪潮涌动',
- L3 [Static Content] slogan: '波涛之下，自有薪意',
- L5 [Static Content] featureBadges: ['跨平台支持', '数据加密保护'],
- L9 [Static Content] date: '2026年03月18日',
- L10 [Static Content] title: '正式启航：深海探索开启',
- L11 [Static Content] description: '薪潮涌动 v1.0.0 正式发布。我们致力于为每位在职海域中穿行的舵手提供更可读的收入视角与情绪摸鱼港。',
- L13 [Static Content] '【领潮中心】实时掌控薪酬水位与加薪洋流',
- L14 [Static Content] '【个人基地】全维度航行数据建模与等级体系',
- L15 [Static Content] '【动力系统】以卡片方式承载成长反馈与任务节奏',
- L16 [Static Content] '【岁月坐标】记录重要节点并回看人生航线',
- L22 [Static Content] title: '非线性时间观',
- L23 [Static Content] desc: '拒绝传统打卡叙事，将职场时间重新定义为航行周期，关注成长的潮汐而非秒针跳动。',
- L26 [Static Content] title: '算法驱动的关怀',
- L27 [Static Content] desc: '收入换算不仅是数字，还要转化成可被理解的节奏、提醒与回顾。',
- L30 [Static Content] title: '人文摸鱼主义',
- L31 [Static Content] desc: '摸鱼不是目的，在繁忙海域中保持心理干爽与秩序感才是长期目标。',

## Data Center

Data management copy for storage overview, export/reset actions, risk warnings, and confirmation dialogs.

### features/data-center/data-center.ts

- File role: Action feedback for export/reset operations in the data center page.
- Copy type: Interaction Feedback
- Entry count: 1

- L77 [Interaction Feedback] title: '导出失败',

### features/data-center/data-center.wxml

- File role: Direct user-visible copy in page or component templates.
- Copy type: UI Copy
- Entry count: 21

- L7 [UI Copy] <text class="data-center-nav__title">数据管理中心</text>
- L13 [UI Copy] <pp-section-header title="本地存储概览" barTone="blue" />
- L22 [UI Copy] <text class="storage-card__eyebrow">已使用空间</text>
- L28 [UI Copy] <text>当前容量占比</text>
- L35 [UI Copy] <text>总容量上限 {{vm.storage.capacity}} MB</text>
- L38 [UI Copy] <text>安全加密中</text>
- L47 [UI Copy] <text class="sync-card__title">云端同步筹备中</text>
- L48 [UI Copy] <text class="sync-card__desc">当前版本优先完成本地数据管理，后续开放多设备同步能力。</text>
- L50 [UI Copy] <text class="sync-card__tag-text">功能规划中</text>
- L55 [UI Copy] <pp-section-header title="导出与重置" barTone="dark" />
- L64 [UI Copy] <text class="action-item__title">{{exportStatus === 'success' ? '导出已完成' : '导出完整备份'}}</text>
- L65 [UI Copy] <text class="action-item__desc">生成完整 JSON 备份，并复制到用户剪贴板。</text>
- L69 [UI Copy] <text class="action-item__state" wx:if="{{exportStatus === 'exporting'}}">处理中</text>
- L80 [UI Copy] <text class="action-item__title action-item__title--rose">重置所有数据</text>
- L81 [UI Copy] <text class="action-item__desc action-item__desc--rose">擦除所有本地缓存与航行记录。</text>
- L85 [UI Copy] <text>高风险操作</text>
- L92 [UI Copy] <text class="notice-card__text">所有数据均优先存储在设备本地。重置操作不可撤销，请在清理前确保已完成必要备份。</text>
- L100 [UI Copy] <text class="reset-sheet__title">确定要清空航程吗</text>
- L101 [UI Copy] <text class="reset-sheet__subtitle">此操作将永久删除个人配置、任务进度和薪资记录。</text>
- L114 [UI Copy] <text>暂不清理</text>
- L117 [UI Copy] <text>继续重置</text>

