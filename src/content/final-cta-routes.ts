export interface FinalCtaRoute {
  country: string;
  slug: string;
  label: string;
  href: string;
}

const routesByCountry: Record<string, FinalCtaRoute[]> = {
  laos: [
    {
      country: 'laos',
      slug: 'north-to-south',
      label: 'North → South',
      href: '/laos/atlas-routes/north-to-south',
    },
    {
      country: 'laos',
      slug: 'south-to-north',
      label: 'South → North',
      href: '/laos/atlas-routes/south-to-north',
    },
  ],
};

export const getFinalCtaRoutes = (country: string): FinalCtaRoute[] =>
  routesByCountry[country.toLowerCase()] ?? [];

export const getAllFinalCtaRoutes = (): FinalCtaRoute[] =>
  Object.values(routesByCountry).flat();
