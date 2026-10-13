# Steady

Steady is a learning accountability prototype for independent learners, initially aspiring software developers.
It turns a small commitment into a focus session, recorded work, and a clear next milestone.
Ada, the example learner, is illustrative; buddy feedback is explicitly simulated.

## Screenshot

> **Screenshot placeholder:** add a desktop capture showing one completed milestone and “Add accessible error messages” as the next action before submission.

## Features that work today

- Save a learning goal, practical milestone, and completion condition.
- Start, pause, and resume a 25-minute timer; restore it after refresh. **Finish session for demo** is a visible shortcut, not proof of study time.
- Record text evidence or an HTTP(S) work URL, plus a reflection. Finishing the timer alone does not complete the milestone.
- Open labeled example buddy feedback, then accept or edit the next milestone.
- Review completed work and retain saved progress on the same browser. Failed writes show an error; reset requires confirmation.
- Use the production app offline after its first online load and service-worker activation. The browser suite covers the complete keyboard journey at 360px width.

## Quick start

Use Node.js 22 or later and npm. Run these commands from the project root. Initial dependency and browser downloads require internet access.

**Install dependencies**

```sh
npm run setup
```

**Environment variables:** none. No `.env` file, API keys, or service accounts are required.

**Develop**

```sh
npm run dev
```

Open the Local URL Vite prints. Development mode does not provide offline caching.

**Test**

```sh
npm run test
npm run build
npm run browser:install
npm run test:e2e
```

The state tests cover timer arithmetic, completion validation, duplicate-save protection, and storage behavior. Browser tests cover the full journey, refresh/offline recovery, timer restoration, failed saves, corrupt-data reset, and mobile keyboard use. Build first: browser tests serve `dist/` automatically on port 4173. Stop any existing preview on that port before running them. Chromium installation is needed once per machine/browser version.

**Demo the production build**

```sh
npm run preview
```

Open the printed Local URL, normally [http://127.0.0.1:4173](http://127.0.0.1:4173). Offline caching requires localhost or HTTPS. Keep this page open while the service worker activates before testing an offline reload.

### Judge walkthrough · about two minutes

1. Choose **Reset demo** and confirm if progress already exists. Save the supplied contact-form commitment.
2. Start focus, optionally show pause/resume, then select **Finish session for demo**.
3. Enter evidence: “Created three labeled form inputs.” Enter reflection: “Labels connect using for and id.” Save the milestone and check in.
4. Open **simulated buddy response** and commit to “Add accessible error messages,” or edit it first.
5. Show one completed milestone and the next action. Expand the completed record, refresh, and confirm both remain. After the app shell is cached, disconnect and reload to demonstrate offline recovery.

See [DEMO_SCRIPT.md](DEMO_SCRIPT.md) for the rehearsal and fallback sequence.

## How it works

- **Interface:** React and TypeScript render a single-page guided journey; Vite builds static assets. There is no backend.
- **Journey state:** `src/state.ts` defines goals, milestones, sessions, evidence, and transitions. Changes are written before the interface reports success.
- **Persistence and timer:** versioned localStorage uses `steady.journey.v1`; timestamps restore remaining focus time after backgrounding or reload. Unsaved form drafts are not persisted.
- **Offline:** `vite-plugin-pwa` generates a Workbox service worker that precaches the production app shell. Local storage holds saved progress separately.
- **Example data:** `src/demo.ts` supplies the illustrative contact-form journey and fixed feedback. Work URLs are displayed as links, never automatically fetched or assessed.
- **MCP servers, skills, and scheduled tasks:** none are integrated into the application. The external Sites skill guided local development, and review-agent guided this documentation check; neither is a runtime dependency. IntelliTrex reuse and scheduled routines remain deferred.

## Built with Codex

**Codex generated** the React/TypeScript implementation, styling, journey state and storage logic, offline build configuration, unit/browser tests, and demo documentation. It also rewrote this README against the source and package scripts.

**The project owner decided and approved** the first vertical slice: one learner journey, browser-local persistence, a labeled demo timer shortcut, simulated buddy feedback, and no backend or external API. Approval of that plan is not a claim of an independent manual code review.

**One bug validation caught:** the timer browser test initially let its mocked clock keep advancing during assertions, producing inconsistent expected times. Freezing the clock with `pauseAt` made the pause/resume/reload check deterministic; the corrected test is in `tests/journey.spec.ts`.

## Limitations and next steps

- This is a prototype, not a multi-user service. No authentication, cloud backup, cross-device sync, live rooms, real peer messaging, matching, reminders, or AI feedback is implemented.
- Clearing or evicting browser storage loses progress. Unsaved evidence, reflection, and next-step edits are lost on reload. Avoid sensitive information and private work links.
- Fixed feedback does not review submitted work, verify competence, or demonstrate improved learning outcomes. Test the accountability hypothesis with real learners next.
- Verify the official Moonshot rubric, including any live-AI requirement; evaluate IntelliTrex reuse only where it serves the working journey.
- Add the submission screenshot, conduct a real learner usability session, and validate a hosted HTTPS build on the intended Nigerian network before showcasing.
- The git history currently contains the planning documents only; application files and this README need to be included in the submission repository.
