export function sanitizeTimeFieldInput(rawValue: string, max: number) {
  const digits = String(rawValue || '').replace(/\D/g, '').slice(0, 2)
  if (!digits) {
    return ''
  }

  const parsed = Number(digits)
  if (Number.isNaN(parsed)) {
    return ''
  }

  return Math.max(0, Math.min(max, parsed)).toString()
}

export function formatTimeFieldValue(rawValue: string, max: number) {
  const sanitized = sanitizeTimeFieldInput(rawValue, max)
  if (!sanitized) {
    return '00'
  }

  return sanitized.padStart(2, '0')
}
