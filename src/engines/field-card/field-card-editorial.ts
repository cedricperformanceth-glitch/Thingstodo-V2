import { fieldCardEditorial } from '../../content/field-card-editorial-data';
import { applyVangViengActivityMediaCorrections } from '../../content/field-card-media-vang-vieng-overrides';

export type { EditorialSpaCard, FieldCardSeoOverride } from '../../content/field-card-editorial-data';

const entry = (id: string) => fieldCardEditorial[id];
export const getEditorialFaq = (id: string) => entry(id)?.faq;
export const getEditorialHero = (id: string) => entry(id)?.hero;
export const getEditorialMedia = (id: string) => applyVangViengActivityMediaCorrections(entry(id)?.media, id);
export const getEditorialPractical = (id: string) => entry(id)?.practical;
export const getEditorialPrimaryStory = (id: string) => entry(id)?.primaryStory;
export const getEditorialQuickRead = (id: string) => entry(id)?.quickRead;
export const getEditorialSeo = (id: string) => entry(id)?.seo;
export const getEditorialSources = (id: string) => entry(id)?.sources;
export const getEditorialSpa = (id: string) => entry(id)?.spa;
export const getEditorialSpaBestTime = (id: string) => entry(id)?.spaBestTime;
export const getEditorialSpaDescription = (id: string) => entry(id)?.spaDescription;
export const getEditorialSpaGettingThere = (id: string) => entry(id)?.spaGettingThere;
export const getEditorialThingName = (id: string) => entry(id)?.displayName;
export const getEditorialPracticalItemLabels = (id: string) => entry(id)?.practicalItemLabels;

export const getEditorialSecondaryStory = (id: string) => {
  const current = entry(id);
  return {
    hasOverride: Boolean(current && Object.prototype.hasOwnProperty.call(current, 'secondaryStory')),
    value: current?.secondaryStory,
  };
};
