export type HomeCountrySlug = 'laos' | 'sri-lanka';

export interface HomeCountryConfig {
  slug: HomeCountrySlug;
  name: string;
  shelfLeft: number;
  extractedLeft: number;
  extractedTop: number;
  destination: string | null;
  assets: {
    shelfSpine: string;
    shelfExtracted: string;
    closed: string;
    openingFrames: readonly [string, string];
    open: string | null;
  };
  motion: {
    selectedXPercent: number;
    selectedYPercent: number;
    selectedRotation: number;
    selectedScale: number;
  };
}

const gsapAsset = (fileName: string) => `/assets/GSAP/${encodeURIComponent(fileName)}`;

export const HOME_COUNTRIES: readonly HomeCountryConfig[] = [
  {
    slug: 'laos',
    name: 'Laos',
    shelfLeft: 27.1,
    extractedLeft: 24.4,
    extractedTop: 14.1,
    destination: '/laos',
    assets: {
      shelfSpine: gsapAsset('Tranche laos.webp'),
      shelfExtracted: gsapAsset('Sortie etagere Laos.webp'),
      closed: gsapAsset('carnet bureau laos.webp'),
      openingFrames: [
        gsapAsset('debut ouverture Laos.webp'),
        gsapAsset('Ouverture moitier laos.webp'),
      ],
      open: gsapAsset('ouverture finale laos.webp'),
    },
    motion: {
      selectedXPercent: 6,
      selectedYPercent: 10,
      selectedRotation: -7,
      selectedScale: 1.1,
    },
  },
  {
    slug: 'sri-lanka',
    name: 'Sri Lanka',
    shelfLeft: 23.7,
    extractedLeft: 21.0,
    extractedTop: 14.1,
    destination: null,
    assets: {
      shelfSpine: gsapAsset('tranche Sri lanka.webp'),
      shelfExtracted: gsapAsset('sortie etagere sri lanka.webp'),
      closed: gsapAsset('face Srilanka.webp'),
      openingFrames: [
        gsapAsset('debut ouverture sri lanka.webp'),
        gsapAsset('ouverture moitier sri lanka.webp'),
      ],
      open: null,
    },
    motion: {
      selectedXPercent: 6,
      selectedYPercent: 10,
      selectedRotation: -7,
      selectedScale: 1.1,
    },
  },
] as const;

export const NEUTRAL_SHELF = {
  count: 7,
  left: 38.78,
  top: 9.95,
  height: 19.3,
  bookWidth: 42,
} as const;

export const HOME_SCENE_ASSETS = {
  backgroundOn: gsapAsset('desk on.webp'),
  backgroundOff: gsapAsset('desk off.webp'),
  neutralShelf: gsapAsset('tranche neutre.webp'),
  neutralDesk: gsapAsset('Carnet neutre.webp'),
  lampPull: gsapAsset('Languette.webp'),
} as const;
