/**
 * icons.ts
 *
 * 小程序统一 SVG data URI 工具层。
 * 默认提供静态图标 `icon()`，
 * 需要交互动效时提供 `animatedIconPair()` / `animatedScenePair()`，
 * 由页面层在点击或触摸后切换 `src`。
 */

export const ICON_PATHS: Record<string, string> = {
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'bar-chart-3': '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/>',
  'calendar-days': '<path d="M8 2v4"/><path d="M16 2v4"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  'map-pin': '<path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'message-square': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>',
  'hard-drive': '<line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/>',
  cloud: '<path d="M17.5 19H9a7 7 0 1 1 1.3-13.88A8 8 0 1 1 17.5 19Z"/>',
  trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v2a5 5 0 0 1-10 0V4Z"/><path d="M17 5h3a2 2 0 0 1 0 4h-3"/><path d="M7 5H4a2 2 0 0 0 0 4h3"/>',
  medal: '<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M12 12h.01"/><path d="m7 4 2 4"/><path d="m17 4-2 4"/><path d="M7 2h3l2 4"/><path d="M17 2h-3l-2 4"/>',
  target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
  'flask-conical': '<path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3 19.74 19a2 2 0 0 1-1.72 3H5.98a2 2 0 0 1-1.72-3L10 9.3"/><path d="M6 16h12"/>',
  coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>',
  droplets: '<path d="M7 16a3 3 0 0 0 6 0c0-2-3-6-3-6s-3 4-3 6Z"/><path d="M15 16a3 3 0 0 0 6 0c0-2-3-6-3-6s-3 4-3 6Z"/><path d="M8 2v2"/><path d="M16 2v2"/>',
  eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  'eye-off': '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  baby: '<path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.5.3 2 0"/><path d="M19 14a7 7 0 1 1-14 0c0-1.57.46-2.58 1.05-3.76l1.42-2.84A2 2 0 0 1 9.26 6H11V5a1 1 0 0 1 2 0v1h1.74a2 2 0 0 1 1.79 1.11l1.42 2.84C18.54 11.42 19 12.43 19 14Z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  compass: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  navigation: '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  flag: '<path d="M4 22V4"/><path d="m4 4 6-2 4 2 6-2v12l-6 2-4-2-6 2"/>',
  'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  settings2: '<path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  'list-todo': '<rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
  'pie-chart': '<path d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9v9z"/><path d="M21 3v9h-9"/>',
  wallet: '<path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>',
  coins: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.66 3.13 3 7 3s7-1.34 7-3V5"/><path d="M5 11c0 1.66 3.13 3 7 3s7-1.34 7-3"/><path d="M7 16v3c0 1.1 2.24 2 5 2s5-.9 5-2v-3"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  gift: '<polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  layers: '<path d="m12.83 2.18 8 3.6a2 2 0 0 1 0 3.64l-8 3.6a2 2 0 0 1-1.66 0l-8-3.6a2 2 0 0 1 0-3.64l8-3.6a2 2 0 0 1 1.66 0Z"/><path d="m2 12 9.17 4.13a2 2 0 0 0 1.66 0L22 12"/><path d="m2 16.6 9.17 4.13a2 2 0 0 0 1.66 0L22 16.6"/>',
  map: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  'plus-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
  minus: '<line x1="5" y1="12" x2="19" y2="12"/>',
  download: '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  'arrow-right-left': '<path d="M16 3h5v5"/><path d="m21 3-6 6"/><path d="M8 21H3v-5"/><path d="m3 21 6-6"/>',
  'arrow-up-right': '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'trash-2': '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  'alert-triangle': '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
  anchor: '<circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/>',
  ship: '<path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/><path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M12 10v4"/><path d="M12 2v3"/>',
  sunset: '<path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
  'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  wind: '<path d="M12.8 19.6A2 2 0 1 0 14 16H2"/><path d="M17.6 16.6A2 2 0 1 0 19 13H2"/><path d="M9.6 12.6A2 2 0 1 1 11 9H2"/>',
  shell: '<path d="M12 21a9 9 0 0 1-9-9c0-4 2.7-7.3 6.4-8.5"/><path d="M12 21V3"/><path d="M12 12c-5 0-9-4-9-9"/><path d="M12 12c5 0 9-4 9-9"/><path d="M12 21a9 9 0 0 0 9-9c0-4-2.7-7.3-6.4-8.5"/>',
  ghost: '<path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M9 16a3 3 0 0 0 6 0"/><path d="M8 20l2-2 2 2 2-2 2 2 2-2v-7a8 8 0 1 0-16 0v7l2 2Z"/>',
  skull: '<path d="M12 5.5a6.5 6.5 0 0 0-2 12.68V21h4v-2.82A6.5 6.5 0 0 0 12 5.5Z"/><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16h4"/><path d="M10 21v-2"/><path d="M14 21v-2"/>',
  crown: '<path d="m2 8 4 4 6-8 6 8 4-4"/><path d="M3 12h18"/><path d="M5 12v8h14v-8"/>',
  zap: '<path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.5-2 4.5-2 4.5s3-.5 4.5-2 2-4.5 2-4.5-3 .5-4.5 2Z"/><path d="M12 15 9 12c0-4.97 4.03-9 9-9 0 4.97-4.03 9-9 9Z"/><path d="M15 9 12 6"/><path d="M9 18l-3 3"/><path d="M14 13l3 3"/>',
  camera: '<path d="M14.5 4h-5l-1.5 2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/>',
  music: '<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
  accessibility: '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.54"/><path d="M4 20 7 14"/><path d="m14 12 2 3 4 1"/>',
  'share-2': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.59 13.51 6.83 3.98"/><path d="m15.41 6.51-6.82 3.98"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-3.4-3.3Z"/>',
  cpu: '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3"/><path d="M15 1v3"/><path d="M9 20v3"/><path d="M15 20v3"/><path d="M20 9h3"/><path d="M20 14h3"/><path d="M1 9h3"/><path d="M1 14h3"/>',
  'trending-up': '<path d="M22 7 13.5 15.5l-5-5L2 17"/><path d="M16 7h6v6"/>',
  moon: '<path d="M12 3a7.5 7.5 0 1 0 9 9A9 9 0 1 1 12 3Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  'check-circle-2': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
  'loader-2': '<path d="M21 12a9 9 0 1 1-6.22-8.56"/><path d="M22 4 12 14"/><path d="M16 4h6v6"/>',
}

export type IconName = keyof typeof ICON_PATHS

export type SvgAnimationPreset =
  | 'none'
  | 'pulse'
  | 'float'
  | 'drift'
  | 'drift-reverse'
  | 'wave'
  | 'bounce'
  | 'twinkle'

export type IconImagePair = {
  staticSrc: string
  animatedSrc: string
}

export type AnimatedIconOptions = {
  color?: string
  size?: number
  strokeWidth?: number
  animation?: SvgAnimationPreset
  durationMs?: number
  delayMs?: number
}

export type SvgSceneLayer = {
  name: IconName
  color?: string
  strokeWidth?: number
  opacity?: number
  x?: number
  y?: number
  width?: number
  height?: number
  rotate?: number
  animation?: SvgAnimationPreset
  durationMs?: number
  delayMs?: number
}

export type SvgSceneOptions = {
  viewBox?: string
  width?: number
  height?: number
  layers: SvgSceneLayer[]
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildAnimationMarkup(
  preset: SvgAnimationPreset,
  durationMs: number,
  delayMs: number,
): string {
  const begin = delayMs > 0 ? `${delayMs}ms` : '0ms'

  switch (preset) {
    case 'pulse':
      return `<animate attributeName="opacity" values="1;0.68;1" dur="${durationMs}ms" begin="${begin}" repeatCount="indefinite" />`
    case 'float':
      return `<animateTransform attributeName="transform" type="translate" values="0 0;0 -1.6;0 0" dur="${durationMs}ms" begin="${begin}" repeatCount="indefinite" />`
    case 'drift':
      return `<animateTransform attributeName="transform" type="translate" values="0 0;-1.8 -1.4;0 0" dur="${durationMs}ms" begin="${begin}" repeatCount="indefinite" />`
    case 'drift-reverse':
      return `<animateTransform attributeName="transform" type="translate" values="0 0;1.8 -1.2;0 0" dur="${durationMs}ms" begin="${begin}" repeatCount="indefinite" />`
    case 'wave':
      return `<animateTransform attributeName="transform" type="translate" values="0 0;1.2 0;0 0" dur="${durationMs}ms" begin="${begin}" repeatCount="indefinite" />`
    case 'bounce':
      return `<animateTransform attributeName="transform" type="translate" values="0 0;0 -2.4;0 0;0 -1.1;0 0" dur="${durationMs}ms" begin="${begin}" repeatCount="indefinite" />`
    case 'twinkle':
      return `<animate attributeName="opacity" values="1;0.52;1" dur="${durationMs}ms" begin="${begin}" repeatCount="indefinite" />`
    case 'none':
    default:
      return ''
  }
}

function buildAnimatedPresentation(preset: SvgAnimationPreset): {
  translateX: number
  translateY: number
  scale: number
  opacity: number
  rotate: number
} {
  switch (preset) {
    case 'pulse':
      return { translateX: 0, translateY: 0, scale: 1.08, opacity: 0.72, rotate: 0 }
    case 'float':
      return { translateX: 0, translateY: -1.6, scale: 1.02, opacity: 1, rotate: 0 }
    case 'drift':
      return { translateX: -1.8, translateY: -1.4, scale: 1.04, opacity: 0.92, rotate: 6 }
    case 'drift-reverse':
      return { translateX: 1.8, translateY: -1.2, scale: 1.04, opacity: 0.92, rotate: -6 }
    case 'wave':
      return { translateX: 1.2, translateY: 0, scale: 1, opacity: 1, rotate: 0 }
    case 'bounce':
      return { translateX: 0, translateY: -2.4, scale: 1.02, opacity: 1, rotate: 0 }
    case 'twinkle':
      return { translateX: 0, translateY: 0, scale: 1.12, opacity: 0.58, rotate: 8 }
    case 'none':
    default:
      return { translateX: 0, translateY: 0, scale: 1, opacity: 1, rotate: 0 }
  }
}

function buildIconSvgMarkup(
  name: IconName,
  color: string,
  size: number,
  strokeWidth: number,
  animation: SvgAnimationPreset = 'none',
  durationMs: number = 2400,
  delayMs: number = 0,
): string {
  const paths = ICON_PATHS[name]
  if (!paths) return ''
  const animationMarkup = buildAnimationMarkup(animation, durationMs, delayMs)
  const presentation = buildAnimatedPresentation(animation)
  const center = 12
  const transform = `translate(${presentation.translateX} ${presentation.translateY}) translate(${center} ${center}) rotate(${presentation.rotate}) scale(${presentation.scale}) translate(${-center} ${-center})`

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${escapeAttr(color)}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><g opacity="${presentation.opacity}" transform="${transform}">${animationMarkup}${paths}</g></svg>`
}

function buildSceneSvgMarkup(options: SvgSceneOptions, animated: boolean): string {
  const width = options.width ?? 100
  const height = options.height ?? 100
  const viewBox = options.viewBox || `0 0 ${width} ${height}`

  const layers = options.layers.map(layer => {
    const paths = ICON_PATHS[layer.name]
    if (!paths) return ''

    const x = layer.x ?? 0
    const y = layer.y ?? 0
    const iconWidth = layer.width ?? 24
    const iconHeight = layer.height ?? 24
    const opacity = layer.opacity ?? 1
    const rotate = layer.rotate ?? 0
    const strokeWidth = layer.strokeWidth ?? 2
    const color = escapeAttr(layer.color || '#000000')
    const presentation = buildAnimatedPresentation(animated ? layer.animation || 'none' : 'none')
    const animationMarkup = animated
      ? buildAnimationMarkup(layer.animation || 'none', layer.durationMs || 2600, layer.delayMs || 0)
      : ''
    const centerX = iconWidth / 2
    const centerY = iconHeight / 2
    const layerTransform = `translate(${presentation.translateX} ${presentation.translateY}) translate(${centerX} ${centerY}) rotate(${rotate + presentation.rotate}) scale(${presentation.scale}) translate(${-centerX} ${-centerY})`

    return `<g opacity="${opacity * presentation.opacity}" transform="translate(${x} ${y})"><g>${animationMarkup}<g transform="${layerTransform}"><svg width="${iconWidth}" height="${iconHeight}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${paths}</svg></g></g></g>`
  }).join('')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}" fill="none">${layers}</svg>`
}

function strToArrayBuffer(str: string): ArrayBuffer {
  const buf = new ArrayBuffer(str.length)
  const view = new Uint8Array(buf)
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i)
  }
  return buf
}

function toDataUri(svg: string): string {
  const base64 = wx.arrayBufferToBase64(strToArrayBuffer(svg))
  return `data:image/svg+xml;base64,${base64}`
}

export function icon(name: string, color: string = '#000000', size: number = 24): string {
  const svg = buildIconSvgMarkup(name as IconName, color, size, 2)
  if (!svg) return ''
  return toDataUri(svg)
}

export function animatedIconPair(
  name: IconName,
  options: AnimatedIconOptions = {},
): IconImagePair {
  const color = options.color || '#000000'
  const size = options.size || 24
  const strokeWidth = options.strokeWidth || 2
  const animation = options.animation || 'pulse'
  const durationMs = options.durationMs || 2400
  const delayMs = options.delayMs || 0

  return {
    staticSrc: toDataUri(buildIconSvgMarkup(name, color, size, strokeWidth)),
    animatedSrc: toDataUri(buildIconSvgMarkup(name, color, size, strokeWidth, animation, durationMs, delayMs)),
  }
}

export function animatedScenePair(options: SvgSceneOptions): IconImagePair {
  return {
    staticSrc: toDataUri(buildSceneSvgMarkup(options, false)),
    animatedSrc: toDataUri(buildSceneSvgMarkup(options, true)),
  }
}
