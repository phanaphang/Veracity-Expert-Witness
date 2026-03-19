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
- Always deploy from the **repo root**: `cd /c/Users/phana/OneDrive/Desktop/Veracity_Expert_Witness && npx vercel --prod --yes`
- The correct Vercel project is `veracity-expert-witness`. Do NOT deploy to the `client` project.
- Production URL: `https://veracityexpertwitness.com`

## Browser Verification
- After UI changes, use the Chrome MCP browser to navigate to the affected page and visually verify the result.
- Use `get_page_text` to confirm content renders correctly, or `read_page` for layout/visual checks.
- Be specific about what to verify — check that the changed elements are visible, styled correctly, and functional.
- For production verification, check `https://www.veracityexpertwitness.com` after deployment.
- For local verification, use the dev server URL after starting it with `npm start` from `client/`.
- For mobile verification, use `resize_window` to simulate mobile viewports (e.g., 375x812 for iPhone, 768x1024 for iPad) and verify responsive layout before resizing back to desktop.

## Do NOT
- Do not remove or modify `eslint-plugin-react-hooks` v7 "off" rules — they suppress intentional patterns.
- Do not delete the root-level `@supabase/supabase-js` — it is used by `api/_lib/supabaseAdmin.js`.
- Do not commit `.env` files or secrets.
- Do not create new files unless absolutely necessary.
- Do not over-engineer — solve what was asked, nothing more.
