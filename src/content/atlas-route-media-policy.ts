import type { AtlasEntity, MediaRecord } from '../core/models/types';
import { places } from './registry/places';
import { things } from './registry/things-to-do';
import type { AtlasRouteContent, AtlasRouteMedia } from './atlas-route-content';
import type {
  AtlasRouteExperienceChapter,
  AtlasRouteExperienceContent,
  AtlasRouteExperienceNotebookPage,
  AtlasRouteReference,
} from './atlas-route-experience';

const entities: AtlasEntity[] = [...things, ...places];

const entityMedia = (entity?: AtlasEntity): MediaRecord[] => {
  if (!entity) return [];

  const gallery = entity.media.fieldCard?.gallery ?? [];
  const card = entity.media.card?.image ? [entity.media.card.image] : [];
  const seen = new Set<string>();

  return [...gallery, ...card].filter((media) => {
    if (!media?.src || seen.has(media.src)) return false;
    seen.add(media.src);
    return true;
  });
};

const candidatesBySrc = new Map<string, MediaRecord[]>();

for (const entity of entities) {
  const candidates = entityMedia(entity);
  for (const media of candidates) {
    candidatesBySrc.set(media.src, candidates);
  }
}

const luangPrabangHeritage = things.find((thing) => thing.id === 'thing-luang-prabang-heritage-walk');
const luangPrabangHeritageImage = entityMedia(luangPrabangHeritage)[0];

const applyCuratedReplacement = (
  route: AtlasRouteContent,
  media: AtlasRouteMedia,
): AtlasRouteMedia => {
  if (
    route.country === 'laos'
    && route.slug === 'south-to-north'
    && media.id === 'luang-prabang-03'
    && luangPrabangHeritageImage
  ) {
    return {
      ...media,
      src: luangPrabangHeritageImage.src,
      alt: luangPrabangHeritageImage.alt ?? 'Luang Prabang old town',
      label: 'Luang Prabang old town',
    };
  }

  return media;
};

const reserveUniqueMedia = (
  route: AtlasRouteContent,
  media: AtlasRouteMedia,
  used: Set<string>,
): AtlasRouteMedia => {
  const curated = applyCuratedReplacement(route, media);
  if (!curated.src) return curated;

  if (!used.has(curated.src)) {
    used.add(curated.src);
    return curated;
  }

  const replacement = candidatesBySrc
    .get(curated.src)
    ?.find((candidate) => !used.has(candidate.src));

  if (replacement) {
    used.add(replacement.src);
    return {
      ...curated,
      src: replacement.src,
      alt: replacement.alt ?? curated.alt,
    };
  }

  const { src: _duplicateSrc, ...withoutDuplicate } = curated;
  return withoutDuplicate;
};

const processReference = (
  route: AtlasRouteContent,
  reference: AtlasRouteReference,
  used: Set<string>,
): AtlasRouteReference => ({
  ...reference,
  ...(reference.media
    ? { media: reserveUniqueMedia(route, reference.media, used) }
    : {}),
});

const processNotebookPage = (
  route: AtlasRouteContent,
  page: AtlasRouteExperienceNotebookPage,
  used: Set<string>,
): AtlasRouteExperienceNotebookPage => {
  const media = page.media?.map((item) => reserveUniqueMedia(route, item, used));
  const references = page.references?.map((item) => processReference(route, item, used));

  return {
    ...page,
    ...(media ? { media } : {}),
    ...(references ? { references } : {}),
  };
};

const processChapter = (
  route: AtlasRouteContent,
  chapter: AtlasRouteExperienceChapter,
  used: Set<string>,
): AtlasRouteExperienceChapter => {
  // Main chapter photography gets first choice. Smaller Atlas references and
  // notebook pages then receive alternate images from the same canonical card.
  const media = chapter.media?.map((item) => reserveUniqueMedia(route, item, used));
  const references = chapter.references?.map((item) => processReference(route, item, used));
  const notebook = chapter.notebook
    ? {
        ...chapter.notebook,
        pages: chapter.notebook.pages.map((page) => processNotebookPage(route, page, used)),
      }
    : undefined;

  return {
    ...chapter,
    ...(media ? { media } : {}),
    ...(references ? { references } : {}),
    ...(notebook ? { notebook } : {}),
  };
};

/**
 * Atlas Route media rule:
 * hero media is intentionally ignored, so hero images may reappear once in the article.
 * Everywhere after the hero, a photo source can appear only once across the full route.
 * When a duplicate belongs to a canonical Atlas entity, another gallery image from that
 * same entity is used when available. Otherwise the duplicate falls back to the existing
 * visual placeholder instead of repeating the photo.
 */
export const applyAtlasRouteMediaPolicy = <T extends AtlasRouteContent>(route: T): T => {
  const usedArticleMedia = new Set<string>();
  const experienceRoute = route as AtlasRouteExperienceContent;

  return {
    ...route,
    chapters: experienceRoute.chapters.map((chapter) =>
      processChapter(route, chapter, usedArticleMedia),
    ),
  } as T;
};
