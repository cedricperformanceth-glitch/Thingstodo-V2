import type { MediaRecord } from '../../core/models/types';
import donDetEditorialData from '../../content/city-field-note-editorial-don-det.json';
import luangPrabangEditorialData from '../../content/city-field-note-editorial-luang-prabang.json';
import pakseEditorialData from '../../content/city-field-note-editorial-pakse.json';
import tadLoEditorialData from '../../content/city-field-note-editorial-tad-lo.json';
import thakhekEditorialData from '../../content/city-field-note-editorial-thakhek.json';
import vangViengEditorialData from '../../content/city-field-note-editorial-vang-vieng.json';
import vientianeEditorialData from '../../content/city-field-note-editorial-vientiane.json';
import mediaData from '../../content/city-field-note-media-copy.json';
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

interface CityFieldNoteEditorialBundle {
  id: string;
  copy: CityFieldNoteContent;
  seo: CityFieldNoteSeoOverride;
  sources: CityFieldNoteSource[];
}

const media = mediaData as Record<string, MediaRecord[]>;
const editorialBundleData = [
  donDetEditorialData,
  thakhekEditorialData,
  tadLoEditorialData,
  pakseEditorialData,
  luangPrabangEditorialData,
  vangViengEditorialData,
  vientianeEditorialData,
] as CityFieldNoteEditorialBundle[];
const editorialBundles = new Map<string, CityFieldNoteEditorialBundle>(
  editorialBundleData.map((bundle) => [bundle.id, bundle]),
);

export const getEditorialCityFieldNote = (id: string) => editorialBundles.get(id)?.copy;
export const getEditorialCityFieldNoteMedia = (id: string) => media[id] ?? [];
export const getEditorialCityFieldNoteSeo = (id: string) => editorialBundles.get(id)?.seo;
export const getEditorialCityFieldNoteSources = (id: string) => editorialBundles.get(id)?.sources ?? [];
