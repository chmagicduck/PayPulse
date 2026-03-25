import { animatedIconPair, icon, type IconImagePair } from '../../lib/icons'

export function buildDataCenterIcons() {
  return {
    chevronLeft: icon('chevron-left', '#475569', 22),
    x: icon('x', '#94a3b8', 20),
    databasePair: animatedIconPair('database', {
      color: '#60a5fa',
      animation: 'float',
      durationMs: 2600,
    }),
    hardDrive: icon('hard-drive', '#2563eb', 22),
    cloud: icon('cloud', '#94a3b8', 22),
    download: icon('download', '#2563eb', 18),
    trash2: icon('trash-2', '#f43f5e', 18),
    alertTriangle: icon('alert-triangle', '#f43f5e', 30),
    shieldCheck: icon('shield-check', '#10b981', 14),
    checkCircle2: icon('check-circle-2', '#10b981', 18),
    arrowRightLeft: icon('arrow-right-left', '#cbd5e1', 14),
  } as {
    chevronLeft: string
    x: string
    databasePair: IconImagePair
    hardDrive: string
    cloud: string
    download: string
    trash2: string
    alertTriangle: string
    shieldCheck: string
    checkCircle2: string
    arrowRightLeft: string
  }
}
