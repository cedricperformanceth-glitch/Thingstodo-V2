export interface CityHeroPartner {
  label: string;
  href: string;
}

/**
 * Hero partnerships are editorial and always supplied manually per destination.
 * The shared Hero reserves the visual slot; cities without an entry render it empty.
 */
export const cityHeroPartners: Readonly<Record<string, readonly CityHeroPartner[]>> = {
  'laos/tad-lo': [
    { label: 'Visit Tad Lo', href: 'https://visit-tadlo.com/' },
    { label: 'Samaki Laos', href: 'https://samaki-laos.com/' },
    { label: 'Fandee Island', href: 'https://fandee-island.com/' },
  ],
};
