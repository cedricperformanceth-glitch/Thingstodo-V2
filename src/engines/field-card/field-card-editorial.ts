import {
  compact,
  faq,
  hero,
  media,
  mediaAdditions,
  practical,
  primaryStory,
  quickRead,
  secondaryStory,
  seo,
  sources,
  spa,
  spaBestTime,
  spaDescription,
  spaGettingThere,
  thingDisplayName,
} from '../../content/field-card-editorial-data';

export type {
  EditorialSpaCard,
  FieldCardSeoOverride,
} from '../../content/field-card-editorial-data';

export const getEditorialFaq = (id: string) => compact[id]?.faq ?? faq[id];
export const getEditorialHero = (id: string) => compact[id]?.hero ?? hero[id];
export const getEditorialMedia = (id: string) => compact[id]?.media ?? mediaAdditions[id] ?? media[id];
export const getEditorialPractical = (id: string) => compact[id]?.practical ?? practical[id];
export const getEditorialPrimaryStory = (id: string) => compact[id]?.primaryStory ?? primaryStory[id];
export const getEditorialQuickRead = (id: string) => compact[id]?.quickRead ?? quickRead[id];
export const getEditorialSeo = (id: string) => compact[id]?.seo ?? seo[id];
export const getEditorialSources = (id: string) => compact[id]?.sources ?? sources[id];
export const getEditorialSpa = (id: string) => compact[id]?.spa ?? spa[id];
export const getEditorialSpaBestTime = (id: string) => spaBestTime[id];
export const getEditorialSpaDescription = (id: string) => spaDescription[id];
export const getEditorialSpaGettingThere = (id: string) => spaGettingThere[id];
export const getEditorialThingName = (id: string) => thingDisplayName[id];

export const getEditorialSecondaryStory = (id: string) => {
  const compactEntry = compact[id];
  if (compactEntry && Object.prototype.hasOwnProperty.call(compactEntry, 'secondaryStory')) {
    return { hasOverride: true, value: compactEntry.secondaryStory };
  }
  return {
    hasOverride: Object.prototype.hasOwnProperty.call(secondaryStory, id),
    value: secondaryStory[id],
  };
};
