# Steady — Moonshot judge demo

## 60-second pitch · six beats

Read only the **Say** lines. Aim for about 150 words in 60 seconds; allow a longer slot for the complete walkthrough below. Fallbacks replace live actions rather than adding to the speech.

**Prepare:** save the example contact-form goal and first milestone. Add “Add accessible error messages” to the roadmap with the condition “Errors explain what to fix.” Keep short evidence and reflection text ready to paste. Pre-load the production app online. Use a separate browser profile for the buddy walkthrough; two tabs in the same profile share storage. Rehearsal remains unconfirmed until you time it aloud.

### 1 · 0–10 seconds — Person and problem

**Say:** “Imagine Ada, an aspiring developer in Lagos learning alone. She is an illustrative learner. Steady helps her organize practice around small milestones and clear next steps.”

**Show:** goal, current milestone, and planned milestone in the roadmap.

**Fallback:** “This is an illustrative scenario; we still need to validate the problem with real learners.”

### 2 · 10–20 seconds — The painful moment

**Say:** “She misses a session. Returning is hard when she cannot see what she finished or where to restart. Here, her goal becomes a visible milestone roadmap.”

**Show:** planned and in-progress status; start focus.

**Fallback:** “The roadmap separates what is planned, what is active, and what has been completed.”

### 3 · 20–30 seconds — Focus into evidence

**Say:** “She starts a focus session. I use the labeled demo shortcut, then save what she made and learned. A finished timer alone never completes her milestone.”

**Show:** finish using the demo shortcut, paste evidence/reflection, save the check-in.

**Fallback:** “The session and practical achievement are separate records; demo sessions are explicitly labeled.”

### 4 · 30–40 seconds — The wow moment

**Say:** “Example feedback is simulated. Real buddies exchange check-in and response files separately. Her completed work, session history, and next action survive refresh on this same browser.”

**Show:** open example feedback, commit to the planned milestone, refresh; point to session history and the three buddy choices. Demonstrate actual file exchange in the extended walkthrough.

**Fallback:** “Real feedback uses manual files, not live chat. Saved progress stays in the original browser.”

### 5 · 40–50 seconds — Built with Codex

**Say:** “I chose the scope. Codex generated the interface, saved-progress logic, and tests. We checked the journey, offline reload, keyboard use, and feedback exchange between separate browsers.”

**Show:** stay on the progress summary; avoid spending the pitch switching to source code.

**Fallback:** “Codex helped build and verify the prototype. It does not generate the buddy feedback.”

### 6 · 50–60 seconds — What is next

**Say:** “Next, I’ll test whether learners find this useful when returning to study. Easier sharing and editing come later. Today, there are no accounts or cloud backups.”

**Show:** end on the next milestone and browser-local privacy note.

**Fallback:** “Learner validation is next; improved learning outcomes are not a result we have measured.”

## Complete walkthrough · allow 3–4 minutes

Use this when judges can watch the whole product. Explain each action as you perform it; do not squeeze every interaction into the one-minute pitch.

| Beat | On-screen action | What to say | One-line fallback |
| --- | --- | --- | --- |
| Goal and roadmap | From a confirmed reset, save the contact-form goal, first milestone, and completion condition. Open **Plan another milestone**, add “Add accessible error messages,” and set its completion condition. | “I define a goal, then break it into practical steps. Each step says what done means. The roadmap shows planned, active, and completed work.” | “The roadmap is a saved list of small steps, not an imported course plan.” |
| Focus session | Start focus, pause, resume, then choose **Finish session for demo**. | “Normal sessions last 25 minutes. This shortcut is only for the demonstration. Finishing time records a session; it does not claim the work is done.” | “The timer restores from timestamps after reload; this shortened session is labeled as a demo.” |
| Achievement and check-in | Enter “Created three labeled form inputs” and “Labels connect using for and id.” Save the milestone. Expand the completed record and focus-session history. | “I record evidence and a reflection. A work link is an alternative to text evidence. Steady records my claim; it does not assess or verify the work.” | “Saved evidence and reflection remain attached to the milestone and session history.” |
| Simulated feedback and next step | Open **simulated buddy response**, accept or edit the next planned milestone, and commit. | “This guidance is fixed example text. It is clearly simulated. The planned milestone becomes my next active step, while completed work stays visible.” | “The example response is not from a real buddy or AI.” |
| Real buddy exchange | Learner: **Share my work** → **Download check-in**. Separate buddy profile: **Review a buddy’s work** → open the downloaded `steady-checkin.json`; read it, enter a display name and feedback, then **Save & download feedback**. Learner: **Read feedback or a reply** → open `steady-feedback.json`. Write/download a reply and open it in the buddy profile. | “These are real words entered by a person in another browser. Steady creates the files; we share them ourselves. Replies work the same way. Display names are supplied by the sender and are not verified.” | “If file exchange fails, explain the three choices; do not present simulated feedback as a real conversation.” |
| Persistence and offline | Refresh. Expand the completed milestone, session history, and saved conversation. After the production service worker has activated, disconnect and reload; reconnect afterward. | “Saved goals, milestone status, sessions, and feedback survive reopening on this browser. Once loaded and cached, the app also works offline. There is no cloud sync.” | “Stay online if the cache is not ready; describe offline support as conditional on an initial successful load.” |
| Access and control | Briefly show the narrow layout or keyboard focus. Point to **Reset demo**, show confirmation, then cancel. | “The journey supports keyboard use and small screens. Reset asks first. Clearing browser data still removes progress, and unsaved drafts are not retained.” | “Keyboard and 360px checks are covered by browser tests; do not claim a complete accessibility audit.” |
| Codex and next steps | Finish on the next action. If asked, show README’s **Built with Codex** section. | “I approved the scope; Codex built the app and test suite. Next I need learner feedback, simpler editing and sharing, and the final submission checks.” | “Explain the build contribution verbally if source or documentation cannot be opened.” |

## Rehearsal and failure checklist

- [ ] Time the six **Say** lines aloud, including pauses. Shorten or slow the click sequence to fit the actual slot.
- [ ] Rehearse the full walkthrough using two separate browser profiles, a check-in file, a feedback file, and a reply. The app accepts Steady-generated JSON files up to 64 KB, not screenshots, PDFs, or arbitrary documents.
- [ ] Confirm the next planned milestone keeps its completion condition when promoted.
- [ ] Wait for the file-import success message before refreshing or switching away.
- [ ] Pre-load the production app, verify offline reload, and restore connectivity before finishing.
- [ ] Use only synthetic demo work. No real learner details or private links without permission.
- [ ] If saved data cannot be read, reset only with confirmation. If a save fails, retry the retained form; do not announce success.
- [ ] Prepare optional screenshots or a recording before the event if wanted; none is assumed to exist. If the live app fails, use the one-line fallbacks and describe the flow honestly.

**Submission still needs human evidence:** identify one real learner with permission, confirm a public repository contains the app and tests, and record an actual rehearsal duration. Ada remains illustrative until the owner supplies a real user's details.
