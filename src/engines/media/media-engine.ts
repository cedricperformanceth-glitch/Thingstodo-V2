import { resolveManualField } from '../../core/media/overrides';
import type { MediaRecord, ManualField } from '../../core/models/types';
export const resolveMedia = (generated?: MediaRecord, override?: ManualField<MediaRecord>) => generated ? resolveManualField(generated, override) : undefined;
