import type { APIRoute } from 'astro';
import type { AtlasEntity } from '../../core/models/types';
import { places } from '../../content/registry/places';
import { things } from '../../content/registry/things-to-do';

export const prerender = true;

const imageFor = (entity: AtlasEntity) => {
  const direct = 'image' in entity ? entity.image : undefined;
  return direct ?? entity.media.card?.image;
};

const mediaIndex = Object.fromEntries(
  [...places, ...things]
    .map((entity) => {
      const image = imageFor(entity);
      if (!image?.src) return null;
      return [
        `${entity.country}:${entity.city}:${entity.id}`,
        { src: image.src, alt: image.alt ?? '' },
      ] as const;
    })
    .filter((entry): entry is readonly [string, { src: string; alt: string }] => Boolean(entry)),
);

export const GET: APIRoute = () => new Response(JSON.stringify(mediaIndex), {
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  },
});
