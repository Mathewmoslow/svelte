# Mathew Moslow — SvelteKit Site

A rebuilt version of Mathew Moslow's author site powered by SvelteKit. The project preserves the original typography-forward design while introducing routed pages, reusable components, a Supabase-ready contact API, and room for future CMS integrations.

## Features

- **Multi-page structure** for Books, Soundtrack, About, Visual Journey, and Contact routes.
- **Componentised sections** with data-driven content sourced from the original HTML/TXT assets.
- **Audio experiences** including cassette-style previews for each book and a vinyl-inspired soundtrack player.
- **Modal previews** for book excerpts and launch reservations with form-to-API wiring.
- **Floating typography layer** and background stage maintained globally via the root layout.
- **Supabase-ready backend** to persist contact and reservation submissions when credentials are provided.

## Getting Started

```bash
npm install
npm run dev -- --open
```

The `--open` flag launches the dev server in your browser.

## Environment Variables

Create a `.env` file based on `.env.example` to enable Supabase persistence for form submissions:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

Without these values the `/api/contact` endpoint will still respond successfully but skip insertion into Supabase.

## Project Structure Highlights

```
src/
├── lib/
│   ├── assets/            # Imported text content for books, bios, etc.
│   ├── components/        # Reusable UI components (books, modals, hero, …)
│   ├── data/              # Plain data modules feeding components
│   └── server/            # Supabase helper
├── routes/                # SvelteKit routes and pages
│   ├── +layout.svelte     # Global background, navigation, floating quotes
│   ├── +page.svelte       # Home / overview
│   ├── books/…            # Additional top-level pages
│   └── api/contact/…      # Contact + reservation endpoint
└── app.html               # Global font + stylesheet links
```

Static assets (images, audio, fonts) live under `static/` to preserve the original relative paths.

## Available Scripts

- `npm run dev` – start the Vite dev server
- `npm run build` – generate a production build (already verified)
- `npm run preview` – preview the production output locally

## Deployment Tips

- Configure the desired SvelteKit adapter in `svelte.config.js` (currently using `adapter-auto`).
- Provide the Supabase keys through your hosting environment.
- Set up form destinations (Supabase tables or alternative providers) before going live.

## Next Steps

- Connect to a CMS or Supabase tables for dynamic book/track management.
- Extend transition logic with GSAP or another animation library if richer motion is required.
- Wire up production purchase URLs for the book CTAs.
