Component({
  properties: {
    label: {
      type: String,
      value: '',
    },
    variant: {
      type: String,
      value: 'primary',
    },
    block: {
      type: Boolean,
      value: false,
    },
  },
  methods: {
    onTap() {
      this.triggerEvent('tap')
    },
  },
})
