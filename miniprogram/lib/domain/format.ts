function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function formatDurationHMS(totalSeconds: number) {
  const safe = Math.max(0, Math.round(totalSeconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function formatDurationHours(totalSeconds: number) {
  return `${(Math.max(0, totalSeconds) / 3600).toFixed(1)}h`
}

export function formatCurrency(cents: number, fractionDigits: number = 2) {
  return `¥${(Math.max(0, cents) / 100).toFixed(fractionDigits)}`
}
