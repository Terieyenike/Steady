# Steady — five-minute submission voiceover

**Hard limit: 5:00.** Read only the blockquotes. Use the six timed segments below and leave room for clicks. Timing is a recording plan, not a completed rehearsal. This script describes the current app only.

## Prepare before recording

- Open the production build online once and load any available app update. Save existing work before reloading.
- Use synthetic demo data and separate **Learner** and **Buddy** browser profiles. Two tabs in one profile share storage.
- Have short evidence/reflection text ready to paste. Keep the download folder accessible. Actual file exchange must be shown, not replaced with simulated feedback.
- Prepare the source tree, project documents, and real test output for the final segment. If results change, say only the actual results.
- Pre-load the offline app cache. External learning-reference pages are not cached.
- Record and time one rehearsal. Aim to finish the narration by 4:50; use the final ten seconds for the closing screen.

## 1 · 0:00–0:45 — Person, problem, and commitment

**Screen:** show the commitment form. Save the default goal, milestone, and completion condition. Open **Plan another milestone** and add “Add accessible error messages,” with “Errors explain what to fix.”

> This is Steady, a learning accountability prototype I built with Codex.
>
> Imagine Ada, an aspiring developer in Lagos learning independently. She misses a session and returns unsure where to restart. Ada is illustrative; this is a problem we still need to test with real learners.
>
> Here, I set a goal: build an accessible contact form. I define one practical milestone and what done means. Then I add the next milestone to the roadmap.
>
> Planned, active, and completed steps make the learning journey visible.

**Fallback:** “The saved roadmap connects a goal to practical milestones and their completion conditions.”

## 2 · 0:45–1:30 — Focus and recorded achievement

**Screen:** choose **15 minutes**, start, pause, resume, and use **Finish session for demo**. Paste evidence “Created three labeled form inputs” and reflection “Labels connect using for and id.” Save. Expand session history.

> The focus duration defaults to twenty-five minutes. I can choose ten, fifteen, twenty-five, or forty-five minutes before starting. That preference is saved.
>
> I can pause and resume. To change an unfinished session’s duration, I confirm a timer restart without deleting my milestones.
>
> For this video, I use the labeled demo shortcut. It does not prove study time.
>
> I record what I made and learned. A work link is another evidence option. The app records my submission; it does not grade or verify it. Session history preserves the achievement and marks demo sessions.

**Fallback:** “A finished timer and a completed milestone are separate; evidence and reflection complete the check-in.”

## 3 · 1:30–2:05 — Next action and credible references

**Screen:** open simulated feedback, commit to the planned next step. Show roadmap and source-reference cards.

> This response is explicitly simulated. It is fixed example text, not a real buddy message or AI assessment.
>
> The next planned milestone becomes active, keeping its completion condition. Completed work remains visible.
>
> The example also links to MDN’s form tutorial and W3C’s guidance on labels. Those references support the contact-form example, not every learner-created goal. Their short notes remain in the app offline; opening the source pages needs internet.

**Fallback:** “Show the completed milestone and next action; never describe the example response as real feedback.”

## 4 · 2:05–3:15 — Real buddy feedback

**Screen:** Learner selects **Share my work** and downloads the check-in. Buddy profile selects **Review a buddy’s work**, opens it, enters “Sam” and “Try keyboard navigation next,” and downloads feedback. Learner selects **Read feedback or a reply**, opens the response, and writes “Thanks. That is my next step.” Download and open the reply in Buddy profile. Wait for each import-success message.

> Real feedback uses a separate manual exchange.
>
> I choose Share my work. Steady creates a check-in file containing the milestone, evidence, and reflection. I send it myself.
>
> In this separate browser profile, the buddy chooses Review a buddy’s work and opens that file. They write feedback and download the response.
>
> Back in the learner’s browser, Read feedback or a reply opens that response. I can reply using the same process.
>
> Only Steady-generated files are accepted. The interface explains which file each option needs. Names are not verified. Nothing is delivered automatically; this is file exchange, not live chat.

**Fallback:** “Explain the three choices and label the missing live action; do not substitute simulated feedback for a real exchange.”

## 5 · 3:15–4:00 — Persistence, access, and privacy

**Screen:** refresh the learner page; show history and conversation. Demonstrate offline reload after caching, then reconnect. Show **Using a shared device?**, open clearing confirmation, and cancel.

> Refresh restores saved goals, milestone status, sessions, and conversations on the same browser. After an initial successful load, the production app also works offline.
>
> The interface has labeled controls, visible keyboard focus, and a tested mobile layout. That is not a complete accessibility audit.
>
> Storage is local and unencrypted. Anyone using this browser profile could read it. Clearing progress asks for confirmation and also clears unsaved drafts. Downloaded files remain outside the app.
>
> There is no account, cloud backup, or automatic synchronization. Unsaved drafts are otherwise lost on reload.

**Fallback:** “If the offline cache is not ready, stay online and state the initial-load requirement.”

## 6 · 4:00–5:00 — How Codex helped and the closing

**Screen:** show brief, spec, rules, source tree, README’s **Built with Codex** section, and actual build/test results. Return to the next active milestone by 4:50.

> I supplied the idea and approved the first implementation plan. Codex created the product brief, build specification, application, styling, saved-state logic, offline configuration, and tests.
>
> My feedback led to the roadmap, session history, manual buddy exchange, clearer file choices, source references, flexible focus time, and privacy controls.
>
> The app uses React and TypeScript, built with Vite. It runs in the browser without a backend, API key, MCP server, or scheduled task.
>
> Verification covers timer behavior, saved progress, offline reload, keyboard use, and two-browser feedback exchange. During validation, a drifting test clock was fixed by freezing time.
>
> Steady demonstrates a working learning loop. It does not yet demonstrate improved learning outcomes. The interface is English-only. What you have seen is the implemented prototype, with its limits stated openly.

**Fallback:** “If test output is unavailable, describe the checks without inventing a passing result.”

## Final recording checks

- [ ] Video duration is at most 5:00, including intro, pauses, transitions, and closing.
- [ ] Timer choices are visible in the recorded build; use the app-update prompt if one appears.
- [ ] Real buddy exchange uses two separate browser profiles and actual generated files.
- [ ] Simulated feedback, demo acceleration, browser-local storage, and manual sharing are identified aloud.
- [ ] Every shown feature works in the recorded build; failed steps use the stated fallback.
- [ ] No personal records, private work URLs, secrets, or unverified claims appear.
