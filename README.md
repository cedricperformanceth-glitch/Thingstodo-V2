# Things To Do Atlas V2

Static-first editorial travel platform built with Astro and TypeScript.

Before modifying structure, read:
- [`docs/PRODUCT.md`](docs/PRODUCT.md)
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- [`docs/CONTENT-MODEL.md`](docs/CONTENT-MODEL.md)
- [`docs/DESIGN-SYSTEM.md`](docs/DESIGN-SYSTEM.md)

## Development-only content pipeline

The public Astro site has no discovery or research calls. Versioned source inputs are transformed locally by `npm run create-city` and `npm run generate-city`; manual locks always win over generation. See [`pipeline/README.md`](pipeline/README.md).

This repository uses npm and `package-lock.json` as the canonical package-manager workflow. Run `npm install`, then `npm run check` and `npm run build`.

Deployment is intentionally manual through Cloudflare Pages Direct Upload. Do not add deployment GitHub Actions or connect a Git-based automatic deployment.
