import { buildExportPackage, resetAppData } from '../../../store/bootstrap'
import { measureManagedStorage } from '../../../store/storage-registry'

export function measureStorageUsage() {
  return measureManagedStorage()
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
