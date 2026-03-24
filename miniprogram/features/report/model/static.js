"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportStaticViewModel = void 0;
exports.reportStaticViewModel = {
    header: {
        title: '洋流战报',
        filterText: '筛选',
    },
    tabs: [
        { key: 'income', text: '收益', accent: 'indigo' },
        { key: 'duration', text: '时长', accent: 'amber' },
    ],
    chartBars: [
        { day: '1', incomeHeight: '40%', durationHeight: '32%' },
        { day: '5', incomeHeight: '55%', durationHeight: '42%' },
        { day: '10', incomeHeight: '72%', durationHeight: '65%' },
        { day: '15', incomeHeight: '48%', durationHeight: '38%' },
        { day: '20', incomeHeight: '85%', durationHeight: '74%' },
        { day: '25', incomeHeight: '67%', durationHeight: '58%' },
        { day: '30', incomeHeight: '76%', durationHeight: '69%' },
    ],
    chartSummary: {
        incomeTotal: '¥1,824',
        durationTotal: '42.5h',
        riseText: '+12.5%',
    },
    annualCards: [
        { title: '年度摸鱼收入', value: '¥12,480.50', tone: 'indigo' },
        { title: '摸鱼打卡天数', value: '248 天', tone: 'amber' },
        { title: '月均摸鱼收益', value: '¥1,040.00', tone: 'blue' },
        { title: '击败全国社畜', value: '98.5%', tone: 'rose' },
    ],
    rangeTabs: [
        { key: 'day', text: '日' },
        { key: 'week', text: '周' },
        { key: 'month', text: '月' },
        { key: 'year', text: '年' },
    ],
    ratioStats: {
        day: { work: '75', moyu: '25' },
        week: { work: '68', moyu: '32' },
        month: { work: '60', moyu: '40' },
        year: { work: '82', moyu: '18' },
    },
    historyDetails: [
        { date: '09-18', duration: '02:15:20', income: '42.5' },
        { date: '09-17', duration: '01:45:10', income: '33.2' },
        { date: '09-16', duration: '03:10:00', income: '58.8' },
        { date: '09-15', duration: '00:55:30', income: '15.4' },
        { date: '09-14', duration: '02:30:15', income: '48.0' },
    ],
};
