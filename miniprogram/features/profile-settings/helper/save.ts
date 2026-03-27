import type { ProfileSettings } from '../../../lib/domain/types'
import { initializeAppData, isBootstrapReady, saveProfileSettingsAndRefresh } from '../../../store/bootstrap'

export function saveProfileSettings(settings: ProfileSettings) {
  if (isBootstrapReady()) {
    saveProfileSettingsAndRefresh(settings)
    return { initialized: false }
  }

  initializeAppData(settings)
  return { initialized: true }
}
