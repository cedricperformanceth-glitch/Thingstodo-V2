import type { AtlasEntity } from '../core/models/types';
import type {
  AtlasRouteChapter,
  AtlasRouteContent,
  AtlasRouteMedia,
  AtlasRouteNotebook,
  AtlasRouteNotebookPage,
  AtlasRoutePersonalNote,
} from './atlas-route-content';

export type AtlasRouteNoteTone = 'butter' | 'rose' | 'sage' | 'sky' | 'paper';
export type AtlasRouteNoteStyle = 'memory' | 'scribble' | 'list' | 'reminder';
export type AtlasRouteNoteSize = 'small' | 'medium' | 'large';

export type AtlasRouteNotebookPageVariant =
  | 'memory'
  | 'checklist'
  | 'atlas-picks'
  | 'photo'
  | 'scrapbook';

export interface AtlasRouteReference {
  id: string;
  title: string;
  href?: string;
  kicker?: string;
  note?: string;
  entity?: AtlasEntity;
  media?: AtlasRouteMedia;
  status?: 'published' | 'coming-soon';
}

export interface AtlasRouteExperienceNote extends AtlasRoutePersonalNote {
  tone?: AtlasRouteNoteTone;
  style?: AtlasRouteNoteStyle;
  size?: AtlasRouteNoteSize;
  items?: string[];
}

export interface AtlasRouteExperienceNotebookPage extends AtlasRouteNotebookPage {
  variant?: AtlasRouteNotebookPageVariant;
  list?: string[];
  references?: AtlasRouteReference[];
  caption?: string;
  noteTone?: AtlasRouteNoteTone;
}

export interface AtlasRouteExperienceNotebook extends Omit<AtlasRouteNotebook, 'pages'> {
  pages: AtlasRouteExperienceNotebookPage[];
}

export interface AtlasRouteExperienceChapter extends Omit<AtlasRouteChapter, 'personalNotes' | 'notebook'> {
  personalNotes?: AtlasRouteExperienceNote[];
  notebook?: AtlasRouteExperienceNotebook;
  references?: AtlasRouteReference[];
  marginNote?: string;
}

export interface AtlasRouteExperienceContent extends Omit<AtlasRouteContent, 'chapters'> {
  chapters: AtlasRouteExperienceChapter[];
}
