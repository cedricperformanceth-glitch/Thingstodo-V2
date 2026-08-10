import type { ManualField } from '../models/types';

export function resolveManualField<T>(generated: T, override?: ManualField<T>): T {
  return override?.source === 'manual' && override.locked ? override.value : generated;
}
