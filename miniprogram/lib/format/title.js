"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFeatureTitle = toFeatureTitle;
function toFeatureTitle(input) {
    return input
        .split('-')
        .map(part => part.slice(0, 1).toUpperCase() + part.slice(1))
        .join(' ');
}
