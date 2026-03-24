"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readHomeScaffoldFlag = readHomeScaffoldFlag;
exports.writeHomeScaffoldFlag = writeHomeScaffoldFlag;
const HOME_STORAGE_KEY = 'home.scaffold';
function readHomeScaffoldFlag() {
    return wx.getStorageSync(HOME_STORAGE_KEY) || null;
}
function writeHomeScaffoldFlag(value) {
    wx.setStorageSync(HOME_STORAGE_KEY, value);
}
