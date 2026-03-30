Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    variant: {
      type: String,
      value: 'full',
    },
    taskId: {
      type: String,
      value: '',
    },
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
    badgeText: {
      type: String,
      value: '',
    },
    iconSrc: {
      type: String,
      value: '',
    },
    countText: {
      type: String,
      value: '',
    },
    progressLabel: {
      type: String,
      value: '完成进度',
    },
    progressPercent: {
      type: Number,
      value: 0,
    },
    done: {
      type: Boolean,
      value: false,
    },
    rotate: {
      type: Boolean,
      value: false,
    },
    pressed: {
      type: Boolean,
      value: false,
    },
    showControls: {
      type: Boolean,
      value: false,
    },
    minusDisabled: {
      type: Boolean,
      value: false,
    },
    plusDisabled: {
      type: Boolean,
      value: false,
    },
    minusPressed: {
      type: Boolean,
      value: false,
    },
    plusPressed: {
      type: Boolean,
      value: false,
    },
  },

  methods: {
    handleTap() {
      this.triggerEvent('cardtap', {
        id: this.data.taskId,
      })
    },

    handleAdjust(e: WechatMiniprogram.TouchEvent) {
      const delta = Number(e.currentTarget.dataset.delta)
      if (!this.data.taskId || Number.isNaN(delta) || delta === 0) {
        return
      }

      this.triggerEvent('adjust', {
        id: this.data.taskId,
        delta,
      })
    },
  },
})
