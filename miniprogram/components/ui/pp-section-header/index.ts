Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    title: {
      type: String,
      value: '',
    },
    subtitle: {
      type: String,
      value: '',
    },
    subtitlePlacement: {
      type: String,
      value: 'stack',
    },
    barTone: {
      type: String,
      value: 'blue',
    },
    showBar: {
      type: Boolean,
      value: true,
    },
    trimBottom: {
      type: Boolean,
      value: false,
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
    showRightSubtitle: false,
    showStackSubtitle: false,
  },

  observers: {
    'barTone, tagTone, manageTone, manageText, tagText, chevronSrc, subtitle, subtitlePlacement'(
      barTone: string,
      tagTone: string,
      manageTone: string,
      manageText: string,
      tagText: string,
      chevronSrc: string,
      subtitle: string,
      subtitlePlacement: string,
    ) {
      const safeBarTone = barTone || 'blue'
      const tagClassName = tagTone
        ? `pp-section-header__tag pp-section-header__tag--${tagTone}`
        : 'pp-section-header__tag'
      const manageClassName = manageTone
        ? `pp-section-header__manage-text pp-section-header__manage-text--${manageTone}`
        : 'pp-section-header__manage-text'
      const hasManage = !!manageText
      const hasTag = !hasManage && !!tagText
      const showRightSubtitle = subtitlePlacement === 'right' && !!subtitle && !hasManage && !hasTag

      this.setData({
        barClassName: `pp-section-header__bar pp-section-header__bar--${safeBarTone}`,
        tagClassName,
        manageClassName,
        showManage: hasManage,
        showTag: hasTag,
        showChevron: hasManage && !!chevronSrc,
        showRightSubtitle,
        showStackSubtitle: !!subtitle && !showRightSubtitle,
      })
    },
  },
})
