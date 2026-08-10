export interface CityHeroPartner {
  label: string;
  href: string;
}

/**
 * Hero partnerships are editorial and always supplied manually per destination.
 * The shared Hero reserves the visual slot; cities without an entry render it empty.
 */
export const cityHeroPartners: Readonly<Record<string, readonly CityHeroPartner[]>> = {};
