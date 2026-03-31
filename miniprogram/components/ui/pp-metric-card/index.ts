Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    cardKey: {
      type: String,
      value: '',
    },
    variant: {
      type: String,
      value: 'compact',
    },
    tone: {
      type: String,
      value: 'blue',
    },
    iconSrc: {
      type: String,
      value: '',
    },
    ghostSrc: {
      type: String,
      value: '',
    },
    badgeText: {
      type: String,
      value: '',
    },
    valuePrefix: {
      type: String,
      value: '',
    },
    valueText: {
      type: String,
      value: '',
    },
    descPrefix: {
      type: String,
      value: '',
    },
    descStrong: {
      type: String,
      value: '',
    },
    descSuffix: {
      type: String,
      value: '',
    },
    descStrongTone: {
      type: String,
      value: 'primary',
    },
    pressed: {
      type: Boolean,
      value: false,
    },
  },

  methods: {
    handleTap() {
      this.triggerEvent('cardtap', {
        key: this.data.cardKey,
      })
    },
  },
})
