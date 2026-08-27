import type { APIRoute } from 'astro';
import type { AtlasEntity } from '../../core/models/types';
import { places } from '../../content/registry/places';
import { things } from '../../content/registry/things-to-do';

export const prerender = true;

type SummaryMedia = { src: string; alt: string };

const imageFor = (entity: AtlasEntity): SummaryMedia | undefined => {
  const direct = 'image' in entity ? entity.image : undefined;
  const image = direct ?? entity.media.card?.image;
  if (!image?.src) return undefined;
  return { src: image.src, alt: image.alt ?? '' };
};

const mediaIndex: Record<string, SummaryMedia> = {};

for (const entity of [...places, ...things]) {
  const image = imageFor(entity);
  if (!image) continue;

  mediaIndex[`${entity.country}:${entity.city}:${entity.id}`] = image;
  mediaIndex[`id:${entity.id}`] = image;
  mediaIndex[`slug:${entity.slug}`] = image;
}

export const GET: APIRoute = () => new Response(JSON.stringify(mediaIndex), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=300',
  },
});
