# Steady — build-week specification

**Planning only · 13 October 2026 · Budget: one week, mostly with Codex**

## Problem and users
Independent learners may lose momentum when study time has no practical outcome or follow-up commitment. This is a hypothesis, not validated market evidence.

Primary user: **Ada, an illustrative aspiring developer in Lagos**, learning HTML/CSS independently. Assumed example: she watches a forms lesson, misses a session, and returns without a finished form or clear restart point. The prototype serves one learner on one browser. A buddy is a future second user; this build uses labeled example feedback, not an actual peer workflow.

Outcome to test: can a learner turn a study commitment into recorded work and a clear next step? Recruit one real learner to validate the scenario and usability; do not infer habit change from a single test.

## Demo journey
Choose “build an accessible contact form” → commit to a small milestone → start a 25-minute focus session → record work evidence and a check-in → explicitly open simulated buddy feedback → accept or edit a next milestone → refresh and resume. A visible demo-only shortcut completes the timer in seconds; normal use keeps the full duration. Feedback is supportive example text, not verification of submitted work.

## Acceptance criteria
1. **Goal and milestone:** starting from empty state, the learner can save a goal and a milestone with a concrete completion condition. Empty submissions show an accessible error and do not save.
2. **Focus session:** start, pause, resume, and finish a 25-minute timer; elapsed time derives from timestamps so backgrounding does not introduce cumulative drift. Reload restores the session. Timer completion alone never marks a learning milestone complete. Demo acceleration is visibly labeled.
3. **Evidence and check-in:** a completed milestone requires non-empty text evidence or an HTTP(S) work URL, plus a short reflection. Saving records one completion and updates progress without duplicates. The app does not claim to verify linked work.
4. **Accountability loop:** the learner explicitly opens feedback labeled “Simulated buddy response,” can accept or edit a proposed next milestone, and sees exactly one active next action. No interface claims feedback was delivered by a real person.
5. **Persistence and access:** refresh restores goal, milestone, evidence, check-in, next action, and timer state on the same browser. After an initial online load, the core journey works offline and survives reload. Verify at 360px width and with keyboard-only navigation. Reset requires confirmation; a storage failure shows an error rather than reporting a successful save.

## Architecture sketch
- **Application:** a small TypeScript web app with one journey and a responsive dashboard. Use React/Vite unless inspection of reusable IntelliTrex assets justifies an equally small existing setup. No backend is required.
- **State and offline:** versioned browser-local storage for the small record set; a service worker caches the app shell and bundled fixtures. Timestamp-based timer state handles reload/backgrounding. Browser/device changes do not share progress.
- **Data and feedback:** bundled HTML/CSS milestone fixtures and deterministic, explicitly simulated buddy feedback. A learner may edit the next step. No LLM or live course API lies on the demo path.
- **MCP reuse:** inspect IntelliTrex on day 1 for a suitable existing data MCP server; **none is identified or required yet**. Reuse only if access, schema, and maintenance cost fit this slice; otherwise use bundled fixtures. Do not build a new MCP server during this week.
- **Skills and scheduled tasks:** inspect IntelliTrex for a reusable demo-check or review skill; **none is assumed installed**. A builder-side scheduled daily build-review task is optional if already available. Learner reminders are an in-app next-session commitment, not a background notification promise.

## Data sources and limits
| Source | Use and provenance | Limits, keys, and Nigeria availability |
| --- | --- | --- |
| Learner-entered goals, evidence, and reflections | Browser-local records; avoid sensitive details | No provider key or API rate limit. Limited by browser storage and eviction; no backup or cross-device sync. Core use has no regional service dependency after the initial load. |
| Bundled example milestone and buddy response | Author-written fixtures labeled illustrative/simulated | No key, network call, quota, or regional restriction imposed by a third-party API. Not a real course feed, peer response, or assessment. |
| Optional learner-provided work URL | Store/display a link; do not fetch, crawl, or embed it | The destination's access, quotas, sign-in, and Nigerian reachability are unknown. Text evidence must remain a complete alternative. |
| Optional IntelliTrex MCP integration | Development reuse only, pending inspection | Server, upstream sources, quotas, keys, licensing, and Nigerian availability are unknown. Verify before adoption; no dependency may block the bundled demo. Keep credentials server-side and out of the repository. |
| Static hosting for the app | Initial app download and updates | Provider is undecided; limits and Nigerian reachability must be checked when selected. Test the deployed URL from the intended network and pre-load the offline fallback. |

No external AI API is required in this specification. Whether the hackathon requires live AI, specific MCP usage, or other infrastructure is **unconfirmed**; check the official rubric on day 1 and explicitly revise scope if necessary. Showcase dates above are supplied by the user, not independently verified.

## Build-week tasks
- [ ] **1 · Day 1 — validate and freeze scope.** Speak with one learner; check the official rubric and inspect available IntelliTrex assets. **Check:** record evidence versus assumptions, integration decisions, and the agreed demo sequence.
- [ ] **2 · Day 1 — define records and fixtures.** Specify goal, milestone, session, evidence, reflection, feedback, and next-action state; write the single forms example. **Check:** fixture provenance and simulated content are labeled; reset yields a reproducible starting point.
- [ ] **3 · Day 2 — build the commitment flow.** Create goal/milestone forms and the dashboard. **Check:** acceptance criterion 1 passes with empty and valid inputs.
- [ ] **4 · Day 3 — build the focus session.** Add timestamp-based timer controls and a labeled demo shortcut. **Check:** criterion 2 passes, including pause, backgrounding, and reload.
- [ ] **5 · Day 4 — close the accountability loop.** Add evidence, reflection, example feedback, and editable next milestone. **Check:** criteria 3–4 pass; repeated save does not duplicate completion.
- [ ] **6 · Day 5 — persist and support offline use.** Add versioned storage, failure handling, app-shell caching, and confirmed reset. **Check:** offline reload preserves the journey; storage failure does not show false success.
- [ ] **7 · Day 6 — verify with a learner.** Check keyboard use, 360px layout, offline behavior, and the full journey; fix blockers. **Check:** document all five acceptance results and one learner's observed usability feedback, with consent and no unnecessary personal data.
- [ ] **8 · Day 7 — package and rehearse.** Prepare README, a three-minute demo script, hosting if available, and an offline fallback. **Check:** rehearse from reset through refresh; review repository for secrets and confirm every simulated feature is labeled.

## Out of scope
Authentication, cloud persistence, actual buddy messaging or matching, live presence, calls, course imports, public profiles, leaderboards, payments, AI tutoring, automated evidence grading, push/email reminders, analytics infrastructure, and additional learning pathways. Local persistence is not a production multi-user service.

## Risks and responses
- **Accountability value is unproven:** use the prototype to test comprehension and next-step usefulness; real peer accountability and longitudinal habit outcomes require later testing.
- **Simulation may confuse judges:** label example feedback at every entry point and explain it aloud. Never imply live peer participation.
- **Scope or rubric mismatch:** verify requirements on day 1; cut optional reuse before compromising the working journey. A live-AI requirement needs an explicit scope revision.
- **Data loss or connectivity failure:** disclose same-browser storage, handle failed saves, cache the app shell, and rehearse offline. Clearing browser data loses progress; export/backup is outside this slice.
- **Timer and demo fragility:** use persisted timestamps and test background/reload behavior; keep the demo shortcut explicit and a reproducible fixture ready.
- **Privacy and link safety:** collect minimal text, avoid private work URLs, accept only HTTP(S) links, and render user input as text. No scraping or automatic link fetching.
