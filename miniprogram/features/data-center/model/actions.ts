import { safeGetStorageInfo } from '../../../lib/wx/storage'
import { buildExportPackage, resetAppData } from '../../../store/bootstrap'

export function measureStorageUsage() {
  const info = safeGetStorageInfo()
  return {
    usedMb: info.currentSize / 1024,
    capacityMb: info.limitSize / 1024,
    keyCount: info.keys.length,
  }
}

export function exportAllData() {
  const content = JSON.stringify(buildExportPackage(), null, 2)
  wx.setClipboardData({
    data: content,
  })
  return content
}

export function clearAllBusinessData() {
  resetAppData()
}
