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

## Google Sheets export

The Trip Summary can create a Google Sheet in the visitor's own Google Drive. The browser flow uses Google Identity Services and requests only the `https://www.googleapis.com/auth/drive.file` scope, so Atlas can work with files the visitor creates through Atlas rather than requesting access to all of their spreadsheets.

Production setup:
1. Enable the Google Sheets API in a Google Cloud project.
2. Configure the OAuth consent screen for Things To Do Atlas.
3. Create an OAuth 2.0 **Web application** client and add the production site as an authorised JavaScript origin.
4. Expose the public client ID at build time as `PUBLIC_GOOGLE_CLIENT_ID`.

Example local environment value:

```text
PUBLIC_GOOGLE_CLIENT_ID=1234567890-example.apps.googleusercontent.com
```

The OAuth client ID is public browser configuration, not a client secret. Do not add a Google client secret to the frontend.

Deployment is intentionally manual through Cloudflare Pages Direct Upload. Do not add deployment GitHub Actions or connect a Git-based automatic deployment.