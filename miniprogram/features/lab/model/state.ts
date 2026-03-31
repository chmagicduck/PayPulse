import type { LabProgress } from '../../../lib/domain/types'
import { buildLabViewModel } from './view'
import { ensureLabProgressInitialized } from './actions'

export function buildLabRuntimeState(progress?: LabProgress) {
  return buildLabViewModel(progress || ensureLabProgressInitialized())
}
