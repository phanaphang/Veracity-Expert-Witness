# Claude Instructions

## Before Pushing
- Always run `npm run lint` from `client/` and resolve all ESLint errors before pushing or creating a PR.
- Warnings may be left if they are intentional, but errors must be fixed.

## Browser Verification
- After UI changes, use the Chrome MCP browser to navigate to the affected page and visually verify the result.
- Use `get_page_text` to confirm content renders correctly, or `read_page` for layout/visual checks.
- Be specific about what to verify — check that the changed elements are visible, styled correctly, and functional.
- For production verification, check `https://www.veracityexpertwitness.com` after deployment.
- For local verification, use the dev server URL after starting it with `npm start` from `client/`.
- For mobile verification, use `resize_window` to simulate mobile viewports (e.g., 375x812 for iPhone, 768x1024 for iPad) and verify responsive layout before resizing back to desktop.
