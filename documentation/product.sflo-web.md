---
id: uwtv6cmipn1vnbn8ewkiikp
title: Sflo Web
desc: ''
updated: 1762574909879
created: 1762260934208
---


## Unexamined Technical Architecture

index.html - main HTML entry point
  - vite.config.ts - Vite configuration file for build and dev server
  - package.json - SPA dependencies and scripts

- Development workflow:
  - Use `pnpm` to install dependencies in `/sflo-web`
  - Run `vite` dev server for local development with hot module replacement
  - Build production assets with `vite build`
  - Output static assets to `/sflo-web/dist` for deployment or serving by shim plugin

- Recommended dependencies:
  - `vue@3`
  - `vue-router@4` for SPA routing
  - `pinia` for state management
  - `fetch` for API calls to `sflo-api`

- Testing:
  - Use `vitest` for unit and integration tests
  - Use `cypress` or `playwright` for end-to-end testing

- Linting and formatting:
  - Use `eslint` with Vue 3 plugin
  - Use `prettier` for code formatting
