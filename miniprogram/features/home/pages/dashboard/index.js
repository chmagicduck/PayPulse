"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const static_1 = require("../../model/static");
const icons_1 = require("../../../../lib/icons");
const vm = static_1.dashboardStaticViewModel;
Page({
    data: {
        vm,
        statusBarHeight: 0,
        showAmount: true,
        isMoYu: false,
        isEditModalOpen: false,
        editH: '00',
        editM: '00',
        editS: '00',
        // 图标 data URI — 在 onLoad 中生成
        iconWavesWhite: '',
        iconEye: '',
        iconEyeOff: '',
        iconCompassBlue: '',
        iconCoffeeBlue: '',
        iconBriefcaseBlue: '',
        iconLogOut: '',
        iconCoffeeWhite: '',
        iconSettingsSlate: '',
        iconListTodo: '',
        iconWallet: '',
        iconWalletGhost: '',
        iconCompassEmerald: '',
        iconCompassEmeraldGhost: '',
        iconHeartRose: '',
        iconGiftAmber: '',
        iconStarBlue: '',
        iconChevronRight: '',
        iconPlus: '',
        iconHistorySlate: '',
        iconAnchorAmber: '',
        iconShipBlue: '',
        iconSunsetRose: '',
        iconX: '',
    },
    onLoad() {
        const { statusBarHeight } = wx.getSystemInfoSync();
        this.setData({
            statusBarHeight: statusBarHeight || 0,
            iconWavesWhite: (0, icons_1.icon)('waves', '#ffffff', 18),
            iconEye: (0, icons_1.icon)('eye', '#bfdbfe', 14),
            iconEyeOff: (0, icons_1.icon)('eye-off', '#bfdbfe', 14),
            iconCompassBlue: (0, icons_1.icon)('compass', '#2563eb', 12),
            iconCoffeeBlue: (0, icons_1.icon)('coffee', '#bfdbfe', 10),
            iconBriefcaseBlue: (0, icons_1.icon)('briefcase', '#bfdbfe', 10),
            iconLogOut: (0, icons_1.icon)('log-out', '#94a3b8', 18),
            iconCoffeeWhite: (0, icons_1.icon)('coffee', '#ffffff', 18),
            iconSettingsSlate: (0, icons_1.icon)('settings2', '#cbd5e1', 16),
            iconListTodo: (0, icons_1.icon)('list-todo', '#2563eb', 16),
            iconWallet: (0, icons_1.icon)('wallet', '#2563eb', 16),
            iconWalletGhost: (0, icons_1.icon)('wallet', '#2563eb', 80),
            iconCompassEmerald: (0, icons_1.icon)('compass', '#059669', 16),
            iconCompassEmeraldGhost: (0, icons_1.icon)('compass', '#059669', 80),
            iconHeartRose: (0, icons_1.icon)('heart', '#f43f5e', 16),
            iconGiftAmber: (0, icons_1.icon)('gift', '#f59e0b', 16),
            iconStarBlue: (0, icons_1.icon)('star', '#3b82f6', 16),
            iconChevronRight: (0, icons_1.icon)('chevron-right', '#cbd5e1', 12),
            iconPlus: (0, icons_1.icon)('plus', '#cbd5e1', 16),
            iconHistorySlate: (0, icons_1.icon)('history', '#94a3b8', 14),
            iconAnchorAmber: (0, icons_1.icon)('anchor', '#f59e0b', 14),
            iconShipBlue: (0, icons_1.icon)('ship', '#3b82f6', 14),
            iconSunsetRose: (0, icons_1.icon)('sunset', '#f43f5e', 14),
            iconX: (0, icons_1.icon)('x', '#94a3b8', 18),
        });
    },
    toggleAmount() {
        this.setData({ showAmount: !this.data.showAmount });
    },
    toggleMoYu() {
        this.setData({ isMoYu: !this.data.isMoYu });
    },
    openEditModal() {
        this.setData({
            isEditModalOpen: true,
            editH: '01',
            editM: '24',
            editS: '16',
        });
    },
    closeEditModal() {
        this.setData({ isEditModalOpen: false });
    },
    saveEditTime() {
        this.setData({ isEditModalOpen: false });
    },
    onEditHInput(e) {
        const val = Math.min(23, Math.max(0, parseInt(e.detail.value) || 0));
        this.setData({ editH: val.toString().padStart(2, '0') });
    },
    onEditMInput(e) {
        const val = Math.min(59, Math.max(0, parseInt(e.detail.value) || 0));
        this.setData({ editM: val.toString().padStart(2, '0') });
    },
    onEditSInput(e) {
        const val = Math.min(59, Math.max(0, parseInt(e.detail.value) || 0));
        this.setData({ editS: val.toString().padStart(2, '0') });
    },
});
