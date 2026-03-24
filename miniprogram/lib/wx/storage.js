"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeGetStorage = safeGetStorage;
exports.safeSetStorage = safeSetStorage;
function safeGetStorage(key, fallback) {
    const value = wx.getStorageSync(key);
    return (value || fallback);
}
function safeSetStorage(key, value) {
    wx.setStorageSync(key, value);
}
