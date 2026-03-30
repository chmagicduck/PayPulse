import type { LabProgress } from '../../../lib/domain/types'
import { buildLabPageState } from '../lab.helper'
import { ensureLabProgressInitialized } from './actions'

export function buildLabRuntimeState(progress?: LabProgress) {
  return buildLabPageState(progress || ensureLabProgressInitialized())
}
