<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Build verification in this workspace

- The production build fetches the Geist fonts from Google Fonts. Run build commands with network access enabled on the first attempt; do not first repeat a network-restricted build that is expected to fail with `ENOTFOUND`.
- Turbopack cannot bind its internal helper port in the current sandbox and fails with `Operation not permitted`. For local production verification in this workspace, run `npx next build --webpack` once instead of retrying the same Turbopack build. Keep the project's normal `npm run build` script unchanged for Vercel unless the user explicitly requests otherwise.

## Testing policy

- Add tests for frontend and UI work only when the user explicitly requests them.
- Always add or update focused tests for backend behavior, including API routes, Server Actions, data access, authentication, authorization, and webhooks.
- Run only the smallest relevant test set for the feature or behavior changed. Do not run the full test suite after every code change.
- Expand verification only when a focused test fails, a concrete cross-cutting risk requires it, or the user explicitly requests broader testing.
