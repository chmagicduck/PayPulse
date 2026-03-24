"use strict";
Component({
    properties: {
        title: {
            type: String,
            value: '薪潮涌动',
        },
        subtitle: {
            type: String,
            value: '此刻，金钱正如潮水般涌来',
        },
        badgeText: {
            type: String,
            value: '实时监测中',
        },
    },
    data: {
        statusBarHeight: 0,
    },
    lifetimes: {
        attached() {
            const { statusBarHeight } = wx.getSystemInfoSync();
            this.setData({ statusBarHeight: statusBarHeight || 0 });
        },
    },
});
