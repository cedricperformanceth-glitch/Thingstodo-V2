import type { APIRoute } from 'astro';
import type { AtlasEntity } from '../../core/models/types';
import type { TripPrintMeta } from '../../features/trip/store';
import { places } from '../../content/registry/places';
import { things } from '../../content/registry/things-to-do';

export const prerender = true;

type SummaryEntityMeta = {
  src?: string;
  alt?: string;
  printMeta?: TripPrintMeta;
};

const clean = (value?: string) => value?.trim() || undefined;

const imageFor = (entity: AtlasEntity) => {
  const direct = 'image' in entity ? entity.image : undefined;
  const image = direct ?? entity.media.card?.image;
  if (!image?.src) return undefined;
  return { src: image.src, alt: image.alt ?? '' };
};

const printMetaFor = (entity: AtlasEntity): TripPrintMeta | undefined => {
  if ('isLandmark' in entity) {
    const meta: TripPrintMeta = {
      costType: entity.spaCard?.costType,
      gettingThere: clean(entity.spaCard?.gettingThere),
      duration: clean(entity.spaCard?.duration),
      bestTime: clean(entity.spaCard?.bestTime),
    };
    return Object.values(meta).some(Boolean) ? meta : undefined;
  }

  const meta: TripPrintMeta = {
    openingHours: clean(entity.spaCard?.openingHours),
    address: clean(entity.address),
  };
  return Object.values(meta).some(Boolean) ? meta : undefined;
};

const entityIndex: Record<string, SummaryEntityMeta> = {};

for (const entity of [...places, ...things]) {
  const image = imageFor(entity);
  const printMeta = printMetaFor(entity);
  if (!image && !printMeta) continue;

  const meta: SummaryEntityMeta = {
    ...(image ?? {}),
    ...(printMeta ? { printMeta } : {}),
  };
  entityIndex[`${entity.country}:${entity.city}:${entity.id}`] = meta;
  entityIndex[`id:${entity.id}`] = meta;
  entityIndex[`slug:${entity.slug}`] = meta;
}

export const GET: APIRoute = () => new Response(JSON.stringify(entityIndex), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
  },
});
