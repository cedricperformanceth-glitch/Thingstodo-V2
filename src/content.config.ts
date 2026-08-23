import { defineCollection, z } from 'astro:content';

// These directories contain the versioned TypeScript data consumed by the
// application, not Markdown content entries. Declaring them explicitly keeps
// Astro from creating deprecated implicit collections for them.
const staticData = () => defineCollection({
  loader: () => [],
  schema: z.record(z.string(), z.unknown()),
});

export const collections = {
  countries: staticData(),
  generated: staticData(),
  registry: staticData(),
};
