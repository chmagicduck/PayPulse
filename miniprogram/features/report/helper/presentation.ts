import { animatedIconPair, icon, type IconImagePair, type IconName } from '../../../lib/icons'
import { reportViewModel } from '../model/index'

type AnnualTone = 'indigo' | 'amber' | 'blue' | 'rose'

type HistoryItem = {
  fullDate?: string
  date: string
  duration: string
  income: string
}

type AnnualCard = {
  key: string
  title: string
  value: string
  tone: AnnualTone
  iconName: string
  badgeText: string
  desc: string
}

function strToArrayBuffer(str: string): ArrayBuffer {
  const buffer = new ArrayBuffer(str.length)
  const view = new Uint8Array(buffer)
  for (let index = 0; index < str.length; index += 1) {
    view[index] = str.charCodeAt(index)
  }
  return buffer
}

function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${wx.arrayBufferToBase64(strToArrayBuffer(svg))}`
}

function getAnnualToneColor(tone: AnnualTone): string {
  switch (tone) {
    case 'amber':
      return '#d97706'
    case 'blue':
      return '#2563eb'
    case 'rose':
      return '#e11d48'
    case 'indigo':
    default:
      return '#4f46e5'
  }
}

export function buildRatioRing(moyuPercent: number): string {
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const progress = (moyuPercent / 100) * circumference
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112" fill="none">
    <g transform="translate(56 56) rotate(-90) translate(-56 -56)">
      <circle cx="56" cy="56" r="${radius}" fill="none" stroke="#f8fafc" stroke-width="10" />
      <circle cx="56" cy="56" r="${radius}" fill="none" stroke="#3b82f6" stroke-width="10" stroke-linecap="round" stroke-dasharray="${progress} ${circumference}" />
    </g>
  </svg>`

  return svgToDataUri(svg)
}

export function buildAnnualCards(cards: readonly AnnualCard[] = reportViewModel.annualCards) {
  return cards.map(item =>
    Object.assign({}, item, {
      iconSrc: icon(item.iconName as IconName, '#ffffff', 18),
      ghostIconSrc: icon(item.iconName as IconName, getAnnualToneColor(item.tone as AnnualTone), 54),
    }),
  )
}

export function formatHistoryDate(date: string) {
  const [month, day] = date.split('-')
  return `${Number(month)}月${Number(day)}日`
}

export function buildHistoryItems(items: readonly HistoryItem[] = reportViewModel.historyItems) {
  return items.map(item =>
    Object.assign({}, item, {
      fullDate: item.fullDate || item.date,
      displayDate: formatHistoryDate(item.date),
    }),
  )
}

export function buildReportIcons() {
  return {
    chartPair: animatedIconPair('bar-chart-3', {
      color: '#ffffff',
      animation: 'float',
      durationMs: 2400,
    }),
    filter: icon('filter', '#94a3b8', 16),
    info: icon('info', '#64748b', 14),
    trendingUp: icon('trending-up', '#10b981', 12),
    clock: icon('clock', '#94a3b8', 10),
    chevronLeft: icon('chevron-left', '#cbd5e1', 14),
    x: icon('x', '#94a3b8', 18),
  } as {
    chartPair: IconImagePair
    filter: string
    info: string
    trendingUp: string
    clock: string
    chevronLeft: string
    x: string
  }
}
