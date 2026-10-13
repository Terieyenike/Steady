# Working on Steady

## Product boundaries
- Keep one complete learning journey working: commitment → focus → evidence and reflection → simulated feedback → next milestone → refresh.
- Keep fixed example feedback explicitly simulated. Real buddy feedback uses manual check-in and response files in a separate exchange; never imply automated delivery, verified authorship, or AI review.
- Timer completion alone must not complete a learning milestone. Keep the demo timer shortcut explicitly labeled.
- Progress is local to one browser. Manual buddy files can carry feedback between browsers; do not claim live messaging, authentication, cloud backup, or measured learning outcomes.
- Do not add external APIs, MCP servers, scheduled routines, or authentication without a concrete product need and agreement on scope.

## Implementation rules
- Use the existing React, TypeScript, Vite, Vitest, and Playwright stack. Keep dependencies minimal.
- Persist state successfully before reporting success. Preserve retryable form input on save failure.
- Keep timer calculations timestamp-based, completion idempotent, and resets explicitly confirmed.
- Preserve older saved records when adding fields; never erase existing progress automatically. Validate imported buddy files, require matching submission IDs for messages, and avoid duplicate imports.
- Render user input as text. Only accept HTTP(S) work links; never automatically fetch submitted URLs.
- Preserve keyboard navigation, visible focus, responsive layout at 360px, and offline production behavior.
- Never commit credentials, `.env` files, personal learner details without consent, or browser storage exports. Use synthetic test data.

## Verification
- After application changes, run `npm run build` and `npm run test`.
- For journey, storage, timer, or offline changes, run `npm run test:e2e` after building. Stop any existing preview on port 4173 first; tests own that port.
- Use a controlled clock for timer tests. Test the production build for offline behavior; development mode does not cache the app shell.
- Documentation-only changes need source/command checks, not an automatic full test rerun.
- Report what was actually checked and any remaining gaps. Do not mark learner validation, human rehearsal, or publication complete without evidence.

## Collaboration and submission
- Follow explicit plan-first requests: inspect and propose changes, then wait for approval before editing.
- Do not delegate to subagents unless the user explicitly requests it.
- Keep README commands aligned with package scripts. Preserve “Built with Codex,” honest limitations, and the six-beat demo with fallbacks.
- A real user must come from the owner, with an accurate example and permission to identify them. Never convert an illustrative persona into a claimed real person.
- Do not commit, push, or publish as part of a documentation check. Obtain explicit direction for repository publication.
