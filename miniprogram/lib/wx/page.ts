type TimerHandle = ReturnType<typeof setTimeout>

export type TimerBag = Record<string, TimerHandle | null>

type StateValue = string | number | boolean

type ModalStateKeys = {
  show: string
  visible: string
}

export function buildSetDataPatch(path: string, value: unknown) {
  const patch: Record<string, unknown> = {}
  patch[path] = value
  return patch
}

export function createTimerBag(): TimerBag {
  return {}
}

export function clearTimerBag(timers: TimerBag) {
  Object.keys(timers).forEach(key => {
    const timer = timers[key]
    if (timer) {
      clearTimeout(timer)
    }
    timers[key] = null
  })
}

export function pulseState(
  page: WechatMiniprogram.Page.Instance<any, any>,
  timers: TimerBag,
  timerKey: string,
  path: string,
  activeValue: StateValue,
  restValue: StateValue,
  duration: number = 220,
) {
  const pending = timers[timerKey]
  if (pending) {
    clearTimeout(pending)
    timers[timerKey] = null
  }

  page.setData(buildSetDataPatch(path, activeValue), () => {
    timers[timerKey] = setTimeout(() => {
      page.setData(buildSetDataPatch(path, restValue))
      timers[timerKey] = null
    }, duration)
  })
}

export function replayState(
  page: WechatMiniprogram.Page.Instance<any, any>,
  timers: TimerBag,
  timerKey: string,
  path: string,
  activeValue: StateValue,
  restValue: StateValue,
  duration: number,
) {
  const pending = timers[timerKey]
  if (pending) {
    clearTimeout(pending)
    timers[timerKey] = null
  }

  page.setData(buildSetDataPatch(path, restValue), () => {
    page.setData(buildSetDataPatch(path, activeValue), () => {
      timers[timerKey] = setTimeout(() => {
        page.setData(buildSetDataPatch(path, restValue))
        timers[timerKey] = null
      }, duration)
    })
  })
}

export function openModal(
  page: WechatMiniprogram.Page.Instance<any, any>,
  timers: TimerBag,
  timerKey: string,
  stateKeys: ModalStateKeys,
  payload: Record<string, unknown> = {},
  enterDelay: number = 30,
) {
  const pending = timers[timerKey]
  if (pending) {
    clearTimeout(pending)
    timers[timerKey] = null
  }

  page.setData(
    Object.assign({}, payload, {
      [stateKeys.show]: true,
      [stateKeys.visible]: false,
    }),
    () => {
      timers[timerKey] = setTimeout(() => {
        page.setData({ [stateKeys.visible]: true })
        timers[timerKey] = null
      }, enterDelay)
    },
  )
}

export function closeModal(
  page: WechatMiniprogram.Page.Instance<any, any>,
  timers: TimerBag,
  timerKey: string,
  stateKeys: ModalStateKeys,
  payload: Record<string, unknown> = {},
  exitDuration: number = 280,
) {
  const pending = timers[timerKey]
  if (pending) {
    clearTimeout(pending)
    timers[timerKey] = null
  }

  page.setData({ [stateKeys.visible]: false })
  timers[timerKey] = setTimeout(() => {
    page.setData(
      Object.assign({}, payload, {
        [stateKeys.show]: false,
        [stateKeys.visible]: false,
      }),
    )
    timers[timerKey] = null
  }, exitDuration)
}

export function handlePageBack(fallbackUrl: string) {
  if (getCurrentPages().length > 1) {
    wx.navigateBack({ delta: 1 })
    return
  }

  wx.reLaunch({ url: fallbackUrl })
}
