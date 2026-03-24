"use strict";
Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        title: {
            type: String,
            value: '',
        },
        barTone: {
            type: String,
            value: 'blue',
        },
        tagText: {
            type: String,
            value: '',
        },
        tagTone: {
            type: String,
            value: '',
        },
        manageText: {
            type: String,
            value: '',
        },
        chevronSrc: {
            type: String,
            value: '',
        },
    },
    data: {
        barClassName: 'pp-section-header__bar pp-section-header__bar--blue',
        tagClassName: 'pp-section-header__tag',
        showManage: false,
        showTag: false,
        showChevron: false,
    },
    observers: {
        'barTone, tagTone, manageText, tagText, chevronSrc'(barTone, tagTone, manageText, tagText, chevronSrc) {
            const safeBarTone = barTone || 'blue';
            const tagClassName = tagTone
                ? `pp-section-header__tag pp-section-header__tag--${tagTone}`
                : 'pp-section-header__tag';
            this.setData({
                barClassName: `pp-section-header__bar pp-section-header__bar--${safeBarTone}`,
                tagClassName,
                showManage: !!manageText,
                showTag: !manageText && !!tagText,
                showChevron: !!manageText && !!chevronSrc,
            });
        },
    },
});
