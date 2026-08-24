import type { MediaRecord } from '../../core/models/types';
import cambodiaEditorialData from '../../content/country-field-note-editorial-cambodia.json';
import thailandEditorialData from '../../content/country-field-note-editorial-thailand.json';
import vietnamEditorialData from '../../content/country-field-note-editorial-vietnam.json';
import mediaData from '../../content/country-field-note-media-copy.json';
import type { CityFieldNoteContent } from '../city-field-note/city-field-note-engine';

export interface CountryFieldNoteSource {
  sourceName: string;
  sourceUrl: string;
  note: string;
}

export interface CountryFieldNoteSeoOverride {
  title: string;
  description: string;
  indexable: boolean;
}

interface CountryFieldNoteEditorialBundle {
  id: string;
  copy: CityFieldNoteContent;
  seo: CountryFieldNoteSeoOverride;
  sources: CountryFieldNoteSource[];
}

const media = mediaData as Record<string, MediaRecord[]>;
const editorialBundleData = [
  thailandEditorialData,
  cambodiaEditorialData,
  vietnamEditorialData,
] as CountryFieldNoteEditorialBundle[];
const editorialBundles = new Map<string, CountryFieldNoteEditorialBundle>(
  editorialBundleData.map((bundle) => [bundle.id, bundle]),
);

export const getEditorialCountryFieldNote = (id: string) => editorialBundles.get(id)?.copy;
export const getEditorialCountryFieldNoteMedia = (id: string) => media[id] ?? [];
export const getEditorialCountryFieldNoteSeo = (id: string) => editorialBundles.get(id)?.seo;
export const getEditorialCountryFieldNoteSources = (id: string) => editorialBundles.get(id)?.sources ?? [];
