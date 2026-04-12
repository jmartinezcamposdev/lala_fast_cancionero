# 🎤 Karaoke LaLa — Cancionero

A fast, lightweight karaoke song catalog search app.

This is a **fanmade rework** of the [official karaoke catalog system](https://karaokelala.es/), designed and built for a local karaoke place based in **Valencia, Spain**.

## Overview

The original catalog loads the full song list client-side by downloading several large JSON files and filtering results as they arrive, which can take a while on slower connections.

This project aims to replace that approach with a server-side SQLite backend that returns search results instantly with minimal bandwidth.

## Technologies

| Component | Stack |
|---|---|
| **Frontend** | Astro 6 + Preact (SSR) with hand-crafted CSS — no UI frameworks |
| **Backend** | Server-side rendering via `@astrojs/vercel` |
| **Database** | SQLite (`better-sqlite3`) — read-only, embedded, zero external dependency |
| **Import tool** | Python scripts (`lala_import_project/`) that transform legacy JSON exports into a clean SQLite database |

## Project structure

- **`lala_fast_astro/`** — The web application. Handles song search, pagination, and catalog browsing.
- **`lala_import_project/`** — Python import pipeline. Converts legacy JSON catalog files into the SQLite database used by the app.

## Deploy

The project is pre-configured for **Vercel**. The `@astrojs/vercel` adapter is set up and `npm run build` produces Vercel-ready output out of the box. Just push to your repo and connect it to Vercel — no extra configuration needed.

## License

This project is licensed under the **GNU General Public License v2.0** (GPL-2.0).
