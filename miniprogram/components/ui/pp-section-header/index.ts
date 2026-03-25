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
    manageTone: {
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
    manageClassName: 'pp-section-header__manage-text',
    showManage: false,
    showTag: false,
    showChevron: false,
  },

  observers: {
    'barTone, tagTone, manageTone, manageText, tagText, chevronSrc'(
      barTone: string,
      tagTone: string,
      manageTone: string,
      manageText: string,
      tagText: string,
      chevronSrc: string,
    ) {
      const safeBarTone = barTone || 'blue'
      const tagClassName = tagTone
        ? `pp-section-header__tag pp-section-header__tag--${tagTone}`
        : 'pp-section-header__tag'
      const manageClassName = manageTone
        ? `pp-section-header__manage-text pp-section-header__manage-text--${manageTone}`
        : 'pp-section-header__manage-text'

      this.setData({
        barClassName: `pp-section-header__bar pp-section-header__bar--${safeBarTone}`,
        tagClassName,
        manageClassName,
        showManage: !!manageText,
        showTag: !manageText && !!tagText,
        showChevron: !!manageText && !!chevronSrc,
      })
    },
  },
})
