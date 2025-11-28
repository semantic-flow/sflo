

## Unexamined Technical Architecture

- server-rendered + HTMX approach

- Development workflow:
  - Use `pnpm` to install dependencies
  - Run `vite` dev server for local development with hot module replacement
  - Build production assets with `vite build`
  - Output static assets to `/sflo-web/dist` for deployment or serving 
- Recommended dependencies:
  - `fetch` for API calls to `sflo-api`

- Testing:
  - Use `vitest` for unit and integration tests
  - Use `cypress` or `playwright` for end-to-end testing

- Linting and formatting:
  - Use `eslint` with Vue 3 plugin
  - Use `prettier` for code formatting
