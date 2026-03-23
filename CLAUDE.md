# Claude Instructions

## Tech Stack
- **Frontend:** Vite + React 18 (in `client/`)
- **Backend:** Supabase (PostgreSQL + RLS + Storage)
- **API:** Vercel Serverless Functions (in `api/`)
- **Deployment:** Vercel (deploy from repo root, NOT `client/`)
- **Styling:** CSS (portal styles in `client/src/portal/portal.css`)

## Project Structure
```
client/src/
  App.js              # Routes
  pages/              # Public-facing pages
  portal/
    pages/            # Expert portal pages
    admin/            # Admin pages
    components/       # Shared portal components
    portal.css        # Portal styles
  hooks/              # Custom hooks (useAuth.js, etc.)
  components/         # Shared public components
  contexts/           # React contexts
  utils/              # Utility functions
  lib/                # Library configs
api/                  # Vercel serverless functions
  _lib/               # Shared API utilities (supabaseAdmin.js)
supabase-schema.sql   # Database schema reference
```

## Coding Conventions
- Use functional React components with hooks. No class components.
- Keep components focused — one primary responsibility per file.
- Prefer editing existing files over creating new ones.
- Keep diffs small and focused. Do not refactor surrounding code unless asked.
- Do not add fallbacks, extra error handling, or abstractions that were not requested.
- Do not add comments, docstrings, or type annotations to code you did not change.

## Before Pushing
- Always run `npm run lint` from `client/` and resolve all ESLint errors before pushing or creating a PR.
- Warnings may be left if they are intentional, but errors must be fixed.

## Deployment
- Only deploy when explicitly asked. Do not deploy automatically after code changes.
- Always deploy from the **repo root**: `npx vercel --prod --yes`
- The correct Vercel project is `veracity-expert-witness`. Do NOT deploy to the `client` project.
- Production URL: `https://veracityexpertwitness.com`

## Browser Verification
- After UI changes, verify in Chrome MCP: `get_page_text` for content, `read_page` for layout.
- Production: `https://www.veracityexpertwitness.com` | Local: `npm start` from `client/`
- Mobile: use `resize_window` (375x812 iPhone, 768x1024 iPad), then resize back to desktop.

## Do NOT
- Do not remove or modify `eslint-plugin-react-hooks` v7 "off" rules — they suppress intentional patterns.
- Do not delete the root-level `@supabase/supabase-js` — it is used by `api/_lib/supabaseAdmin.js`.
- Do not commit `.env` files or secrets.
