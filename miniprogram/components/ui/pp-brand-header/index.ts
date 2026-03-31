Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    paddingTop: {
      type: Number,
      value: 0,
    },
    title: {
      type: String,
      value: '',
    },
    logoSrc: {
      type: String,
      value: '',
    },
    logoBg: {
      type: String,
      value: '#2563eb',
    },
    logoShadow: {
      type: String,
      value: '0 8rpx 24rpx rgba(37, 99, 235, 0.3)',
    },
    actionIconSrc: {
      type: String,
      value: '',
    },
    actionPressed: {
      type: Boolean,
      value: false,
    },
  },

  methods: {
    handleLogoTap() {
      this.triggerEvent('logotap')
    },

    handleActionTap() {
      this.triggerEvent('actiontap')
    },
  },
})
