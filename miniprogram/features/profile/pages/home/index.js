"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const icons_1 = require("../../../../lib/icons");
const static_1 = require("../../model/static");
const vm = static_1.profileHomeStaticViewModel;
const DEFAULT_RANK_INDEX = 4;
const AUTO_PLAY_INTERVAL = 2000;
const defaultRank = {
    ...vm.ranks[DEFAULT_RANK_INDEX],
    badgeIconSrc: '',
    axisIconSrc: '',
};
let rankTimer = null;
Page({
    data: {
        vm,
        statusBarHeight: 0,
        rankIndex: DEFAULT_RANK_INDEX,
        isAutoPlay: true,
        showAvatarModal: false,
        currentAvatar: vm.avatarPresets[0].src,
        draftAvatar: vm.avatarPresets[0].src,
        ranks: [],
        currentRank: defaultRank,
        primaryItems: [],
        secondaryItems: [],
        storageCard: {
            ...vm.sections.storage,
            iconSrc: '',
        },
        icons: {
            sparkles: '',
            trophy: '',
            chevronRight: '',
            x: '',
            checkCircle2: '',
        },
    },
    onLoad() {
        const { statusBarHeight } = wx.getSystemInfoSync();
        const ranks = vm.ranks.map(rank => ({
            ...rank,
            badgeIconSrc: (0, icons_1.icon)(rank.iconName, rank.iconColor, 16),
            axisIconSrc: (0, icons_1.icon)(rank.iconName, rank.iconColor, 10),
        }));
        const primaryItems = vm.sections.primary.items.map(item => ({
            ...item,
            iconSrc: (0, icons_1.icon)(item.iconName, item.iconColor, 18),
        }));
        const secondaryItems = vm.sections.secondary.items.map((item, index, items) => ({
            ...item,
            iconSrc: (0, icons_1.icon)(item.iconName, item.iconColor, 18),
            isLast: index === items.length - 1,
        }));
        this.setData({
            statusBarHeight: statusBarHeight || 0,
            ranks,
            currentRank: ranks[DEFAULT_RANK_INDEX],
            primaryItems,
            secondaryItems,
            storageCard: {
                ...vm.sections.storage,
                iconSrc: (0, icons_1.icon)(vm.sections.storage.iconName, vm.sections.storage.iconColor, 20),
            },
            icons: {
                sparkles: (0, icons_1.icon)('sparkles', '#2563eb', 20),
                trophy: (0, icons_1.icon)('trophy', '#f59e0b', 14),
                chevronRight: (0, icons_1.icon)('chevron-right', '#cbd5e1', 16),
                x: (0, icons_1.icon)('x', '#94a3b8', 20),
                checkCircle2: (0, icons_1.icon)('check-circle-2', '#2563eb', 24),
            },
        });
        this.startRankAutoPlay();
    },
    onShow() {
        if (this.data.isAutoPlay) {
            this.startRankAutoPlay();
        }
    },
    onHide() {
        this.stopRankAutoPlay();
    },
    onUnload() {
        this.stopRankAutoPlay();
    },
    startRankAutoPlay() {
        if (!this.data.isAutoPlay || rankTimer || this.data.ranks.length === 0)
            return;
        rankTimer = setInterval(() => {
            const nextIndex = (this.data.rankIndex + 1) % this.data.ranks.length;
            this.updateCurrentRank(nextIndex);
        }, AUTO_PLAY_INTERVAL);
    },
    stopRankAutoPlay() {
        if (rankTimer) {
            clearInterval(rankTimer);
            rankTimer = null;
        }
    },
    updateCurrentRank(index) {
        this.setData({
            rankIndex: index,
            currentRank: this.data.ranks[index],
        });
    },
    toggleAutoPlay() {
        const nextValue = !this.data.isAutoPlay;
        this.setData({ isAutoPlay: nextValue });
        if (nextValue) {
            this.startRankAutoPlay();
            return;
        }
        this.stopRankAutoPlay();
    },
    openAvatarModal() {
        this.setData({
            showAvatarModal: true,
            draftAvatar: this.data.currentAvatar,
        });
    },
    closeAvatarModal() {
        this.setData({
            showAvatarModal: false,
            draftAvatar: this.data.currentAvatar,
        });
    },
    selectAvatar(e) {
        const { src } = e.currentTarget.dataset;
        if (!src)
            return;
        this.setData({ draftAvatar: src });
    },
    confirmAvatar() {
        this.setData({
            currentAvatar: this.data.draftAvatar,
            showAvatarModal: false,
        });
    },
});
