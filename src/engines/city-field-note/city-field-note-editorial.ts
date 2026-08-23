import type { MediaRecord } from '../../core/models/types';
import copyData from '../../content/city-field-note-copy.json';
import mediaData from '../../content/city-field-note-media-copy.json';
import seoData from '../../content/city-field-note-seo-copy.json';
import sourceData from '../../content/city-field-note-source-copy.json';
import type { CityFieldNoteContent } from './city-field-note-engine';

export interface CityFieldNoteSource {
  sourceName: string;
  sourceUrl: string;
  note: string;
}

export interface CityFieldNoteSeoOverride {
  title: string;
  description: string;
  indexable: boolean;
}

const copy = copyData as Record<string, CityFieldNoteContent>;
const media = mediaData as Record<string, MediaRecord[]>;
const seo = seoData as Record<string, CityFieldNoteSeoOverride>;
const sources = sourceData as Record<string, CityFieldNoteSource[]>;

export const getEditorialCityFieldNote = (id: string) => copy[id];
export const getEditorialCityFieldNoteMedia = (id: string) => media[id] ?? [];
export const getEditorialCityFieldNoteSeo = (id: string) => seo[id];
export const getEditorialCityFieldNoteSources = (id: string) => sources[id] ?? [];
