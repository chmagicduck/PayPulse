Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    title: {
      type: String,
      value: '',
    },
    desc: {
      type: String,
      value: '',
    },
    tone: {
      type: String,
      value: 'slate',
    },
    badge: {
      type: String,
      value: '',
    },
    iconSrc: {
      type: String,
      value: '',
    },
    arrowSrc: {
      type: String,
      value: '',
    },
    highlight: {
      type: Boolean,
      value: false,
    },
    pressed: {
      type: Boolean,
      value: false,
    },
  },

  methods: {
    handleTap() {
      this.triggerEvent('cardtap')
    },
  },
})
