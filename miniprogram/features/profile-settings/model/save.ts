import { initializeAppData, isBootstrapReady, saveProfileSettingsAndRefresh } from '../../../store/bootstrap'
import type { ProfileSettings } from '../../../lib/domain/types'

export function saveProfileSettings(settings: ProfileSettings) {
  const alreadyInitialized = isBootstrapReady()
  if (alreadyInitialized) {
    saveProfileSettingsAndRefresh(settings)
    return {
      initialized: false,
    }
  }

  initializeAppData(settings)
  return {
    initialized: true,
  }
}
