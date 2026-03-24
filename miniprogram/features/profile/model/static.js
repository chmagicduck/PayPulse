"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSettingsStaticViewModel = exports.profileHomeStaticViewModel = void 0;
exports.profileHomeStaticViewModel = {
    user: {
        name: '摸鱼小队长',
        id: 'ID: 20240915',
        badge: 'VIP',
    },
    rankPreview: {
        title: '等级预览',
        totalLabel: '累计快乐值',
        totalValue: '100',
        autoPreviewText: 'Auto Preview',
    },
    ranks: [
        { level: 1, name: '海滩漫步者', iconName: 'shell', tone: 'slate', iconColor: '#94a3b8' },
        { level: 2, name: '浅滩摸鱼手', iconName: 'waves', tone: 'cyan', iconColor: '#06b6d4' },
        { level: 3, name: '茶歇守卫官', iconName: 'coffee', tone: 'orange', iconColor: '#f97316' },
        { level: 4, name: '划水见习生', iconName: 'wind', tone: 'emerald', iconColor: '#10b981' },
        { level: 5, name: '资深舵手', iconName: 'compass', tone: 'blue', iconColor: '#3b82f6' },
        { level: 6, name: '隐身巡航员', iconName: 'ghost', tone: 'indigo', iconColor: '#6366f1' },
        { level: 7, name: '风暴避难者', iconName: 'anchor', tone: 'violet', iconColor: '#8b5cf6' },
        { level: 8, name: '极速快艇王', iconName: 'zap', tone: 'yellow', iconColor: '#ca8a04' },
        { level: 9, name: '深海霸主', iconName: 'ship', tone: 'rose', iconColor: '#e11d48' },
        { level: 10, name: '深海大懒兽', iconName: 'crown', tone: 'amber', iconColor: '#d97706' },
    ],
    avatarPresets: [
        { id: 'preset-1', label: 'Felix', src: '/assets/images/profile/avatar-felix.svg' },
        { id: 'preset-2', label: 'Aneka', src: '/assets/images/profile/avatar-aneka.svg' },
        { id: 'preset-3', label: 'Jasper', src: '/assets/images/profile/avatar-jasper.svg' },
        { id: 'preset-4', label: 'Milo', src: '/assets/images/profile/avatar-milo.svg' },
        { id: 'preset-5', label: 'Luna', src: '/assets/images/profile/avatar-luna.svg' },
        { id: 'preset-6', label: 'Zoe', src: '/assets/images/profile/avatar-zoe.svg' },
    ],
    sections: {
        primary: {
            title: '航行控制台',
            barTone: 'blue',
            items: [
                { title: '基本信息设置', desc: '修改航行 ID、薪资基数及工时', tone: 'blue', iconName: 'user', iconColor: '#3b82f6' },
                { title: '岁月坐标设置', desc: '管理重要的时间节点与纪念日', tone: 'emerald', iconName: 'map-pin', iconColor: '#10b981' },
                { title: '查看日历', desc: '纵览航行周期与重要考勤节点', tone: 'indigo', iconName: 'calendar', iconColor: '#4f46e5' },
                { title: '任务中心设置', desc: '配置你的每日航行目标与奖励', tone: 'rose', iconName: 'target', iconColor: '#f43f5e', badge: '3' },
            ],
        },
        secondary: {
            title: '关于与社群',
            barTone: 'slate',
            items: [
                { title: '加入社群', desc: '与万千舵手交流摸鱼心得', iconName: 'users', iconColor: '#94a3b8' },
                { title: '关于软件', desc: '版本 v2.4.0 (Build 2024)', iconName: 'info', iconColor: '#94a3b8' },
            ],
        },
        storage: {
            sectionTitle: '安全与存储',
            barTone: 'dark',
            title: '数据管理中心',
            desc: '本地备份、同步与隐私清理',
            iconName: 'database',
            iconColor: '#60a5fa',
        },
    },
    modal: {
        title: '更换基地身份',
        subtitle: 'Select Preset Avatar',
        confirmText: '确认修改',
    },
};
exports.profileSettingsStaticViewModel = {
    title: '航行档案设置',
    bannerTitle: '校准你的航向',
    bannerDescription: '输入坐标参数，静态阶段先完成高保真表单还原，后续再接正式校验与存储。',
    workModes: [
        { key: 'double', text: '双休' },
        { key: 'single-sat', text: '休六' },
        { key: 'single-sun', text: '休日' },
        { key: 'big-small', text: '大小周' },
    ],
    form: {
        nickname: '摸鱼小队长',
        birthday: '1995-06-15',
        gender: 'male',
        careerStartDate: '2018-07-01',
        retirementAge: '60',
        expectedLifespan: '85',
        monthlySalary: '15000',
        payDay: '10',
        workMode: 'double',
        isCurrentBigWeek: true,
        startTime: '09:00',
        endTime: '18:00',
        lunchBreakEnabled: false,
        lunchStartTime: '12:00',
        lunchEndTime: '13:30',
    },
};
