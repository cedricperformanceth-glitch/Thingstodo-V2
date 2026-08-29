import type { MediaRecord } from '../../core/models/types';
import donDetEditorialData from '../../content/city-field-note-editorial-don-det.json';
import luangPrabangEditorialData from '../../content/city-field-note-editorial-luang-prabang.json';
import pakseEditorialData from '../../content/city-field-note-editorial-pakse.json';
import tadLoEditorialData from '../../content/city-field-note-editorial-tad-lo.json';
import thakhekEditorialData from '../../content/city-field-note-editorial-thakhek.json';
import vangViengEditorialData from '../../content/city-field-note-editorial-vang-vieng.json';
import vientianeEditorialData from '../../content/city-field-note-editorial-vientiane.json';
import mediaData from '../../content/city-field-note-media-copy.json';
import { applyCanonicalCityFieldMediaPolicy } from '../../content/field-card-media-router';
import {
  getEditorialCountryFieldNote,
  getEditorialCountryFieldNoteMedia,
  getEditorialCountryFieldNoteSeo,
  getEditorialCountryFieldNoteSources,
} from '../country-field-note/country-field-note-editorial';
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

const rawMedia = mediaData as Record<string, MediaRecord[]>;
const cityMedia = (id: string): MediaRecord[] => applyCanonicalCityFieldMediaPolicy(rawMedia[id], id) ?? [];
const media: Record<string, MediaRecord[]> = {
  ...rawMedia,
  'city-don-det': cityMedia('city-don-det'),
  'city-tad-lo': cityMedia('city-tad-lo'),
  'city-laos-pakse': cityMedia('city-laos-pakse'),
  'city-laos-luang-prabang': cityMedia('city-laos-luang-prabang'),
  'city-laos-thakhek': cityMedia('city-laos-thakhek'),
  'city-laos-vang-vieng': cityMedia('city-laos-vang-vieng'),
  'city-laos-vientiane': cityMedia('city-laos-vientiane'),
};
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

export const getEditorialCityFieldNote = (id: string) => editorialBundles.get(id)?.copy ?? getEditorialCountryFieldNote(id);
export const getEditorialCityFieldNoteMedia = (id: string) => media[id] ?? getEditorialCountryFieldNoteMedia(id);
export const getEditorialCityFieldNoteSeo = (id: string) => editorialBundles.get(id)?.seo ?? getEditorialCountryFieldNoteSeo(id);
export const getEditorialCityFieldNoteSources = (id: string) => editorialBundles.get(id)?.sources ?? getEditorialCountryFieldNoteSources(id);
