import { animatedIconPair, type IconImagePair, type IconName } from '../icons'

export const DAILY_MOYU_TASKS = [
  { id: 'water', title: '带薪喝水', desc: '去接杯水，顺便离开工位透个气。', reward: 1, count: 0, limit: 8, tone: 'blue', iconName: 'droplets' },
  { id: 'move', title: '带薪扭腰', desc: '站起来走两步，别把腰坐坏了。', reward: 1, count: 0, limit: 10, tone: 'emerald', iconName: 'accessibility' },
  { id: 'eye', title: '发呆眺望', desc: '看看窗外的风景，给眼睛放个假。', reward: 1, count: 0, limit: 10, tone: 'amber', iconName: 'eye' },
  { id: 'leave', title: '准点下班', desc: '到点就跑，一秒不留，拒绝无意义加班。', reward: 12, count: 0, limit: 1, tone: 'rose', iconName: 'log-out' },
  { id: 'toilet', title: '带薪拉屎', desc: '带薪蹲坑，累计清空压力的分钟数。', reward: 4, count: 0, limit: 5, tone: 'indigo', iconName: 'navigation', rotate: true },
] as const

export type DailyMoyuTaskDefinition = (typeof DAILY_MOYU_TASKS)[number]
export type DailyMoyuTaskNoticeTone = DailyMoyuTaskDefinition['tone'] | 'emerald'

export function getDailyMoyuTaskToneColor(tone: string) {
  switch (tone) {
    case 'cyan':
      return '#0891b2'
    case 'orange':
      return '#ea580c'
    case 'emerald':
      return '#10b981'
    case 'blue':
      return '#3b82f6'
    case 'indigo':
      return '#6366f1'
    case 'violet':
      return '#7c3aed'
    case 'rose':
      return '#e11d48'
    case 'amber':
      return '#f59e0b'
    case 'slate':
    default:
      return '#94a3b8'
  }
}

export function buildDailyMoyuTaskBadgeText(
  reward: number,
  done: boolean,
  options: {
    doneText?: string
    rewardSuffix?: string
  } = {},
) {
  if (done) {
    return options.doneText || '已刷满'
  }

  return `+${reward}${options.rewardSuffix || ' 摸鱼值'}`
}

export function buildDailyMoyuTaskIconPair(task: {
  iconName: string
  tone: string
  rotate?: boolean
}): IconImagePair {
  return animatedIconPair(task.iconName as IconName, {
    color: getDailyMoyuTaskToneColor(task.tone),
    animation: task.rotate ? 'drift' : 'bounce',
    durationMs: 1800,
  })
}

export function buildDailyMoyuTaskNotice(
  task: {
    title: string
    reward: number
    tone: DailyMoyuTaskDefinition['tone']
    count: number
    limit: number
  },
  nextCount: number,
): {
  text: string
  tone: DailyMoyuTaskNoticeTone
} {
  const pointsDelta = Math.abs(nextCount - task.count) * task.reward

  if (nextCount === task.limit && task.count < task.limit) {
    return {
      text: `${task.title} 已刷满，+${pointsDelta} 摸鱼值`,
      tone: 'emerald',
    }
  }

  const sign = nextCount > task.count ? '+' : '-'

  return {
    text: `${task.title} ${sign}${pointsDelta} 摸鱼值`,
    tone: task.tone,
  }
}
