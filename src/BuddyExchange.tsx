import { useState } from "react";
import {
  receive,
  validCheckIn,
  validMessage,
  type Journey,
  type CheckIn,
  type BuddyMessage,
} from "./state";
function download(value: CheckIn | BuddyMessage) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download =
    value.kind === "steady-checkin"
      ? "steady-checkin.json"
      : "steady-feedback.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function BuddyExchange({
  journey: j,
  commit,
}: {
  journey: Journey;
  commit: (j: Journey) => boolean;
}) {
  const [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [name, setName] = useState(""),
    [message, setMessage] = useState(""),
    [selected, setSelected] = useState(""),
    [mode, setMode] = useState<"share" | "review" | "feedback">("share");
  const targets = [
    ...j.completed
      .filter((c) => c.submissionId)
      .map((c) => ({ id: c.submissionId!, title: c.title })),
    ...j.inbox.map((c) => ({ id: c.submissionId, title: c.title })),
  ];
  const target = targets.some((t) => t.id === selected)
    ? selected
    : targets[0]?.id || "";
  return (
    <section className="buddy-exchange" aria-label="Real buddy exchange">
      <p className="eyebrow">A REAL PERSON, AT YOUR OWN PACE</p>
      <h2>Bring a buddy into the loop.</h2>
      <p className="muted">
        Choose what you want to do. Steady creates a small file you can send
        through email or a messaging app. Your buddy opens that file in Steady
        and sends a response back. No account needed; nothing is sent
        automatically.
      </p>
      <div
        className="exchange-options"
        role="group"
        aria-label="What would you like to do?"
      >
        {(
          [
            ["share", "Share my work", "Create a file for my buddy to review."],
            [
              "review",
              "Review a buddy’s work",
              "Open a check-in they sent me.",
            ],
            [
              "feedback",
              "Read feedback or a reply",
              "Open a response someone sent me.",
            ],
          ] as const
        ).map(([value, title, description]) => (
          <button
            type="button"
            key={value}
            aria-pressed={mode === value}
            onClick={() => {
              setMode(value);
              setError("");
              setNotice("");
            }}
          >
            <strong>{title}</strong>
            <span>{description}</span>
          </button>
        ))}
      </div>
      <div className="exchange-guide">
        <h3>
          {mode === "share"
            ? "1. Download your check-in, then send it to your buddy"
            : mode === "review"
              ? "2. Open your buddy’s check-in, then write feedback"
              : "3. Open the response to your check-in or message"}
        </h3>
        <p>
          {mode === "share"
            ? "Finish a milestone, then choose Download check-in below. Steady creates steady-checkin.json with your goal, work, and reflection. Send that file yourself using email or a messaging app. Your buddy chooses ‘Review a buddy’s work’ in Steady."
            : mode === "review"
              ? "Ask your buddy to choose ‘Share my work’ and send you the steady-checkin.json file Steady downloads. Choose that file below, read their work, then write and download your feedback. Send the downloaded steady-feedback.json file back to them."
              : "Choose steady-feedback.json sent by your buddy after they wrote feedback or a reply in Steady. Open it in the browser where you shared the original check-in, or where you previously imported that check-in. Your saved conversation appears below."}
        </p>
        {mode !== "share" && (
          <p className="hint">
            Only Steady-generated .json files are accepted, up to 64 KB. A
            screenshot, PDF, Word document, work URL, or unrelated JSON file
            will not work. You do not need to create or edit the file yourself;
            renamed Steady files also work.
          </p>
        )}
      </div>
      {mode === "share" &&
        j.completed.map((c) => (
          <div className="exchange-record" key={c.id}>
            <strong>{c.title}</strong>
            <button
              className="secondary"
              onClick={() => {
                const submissionId = c.submissionId || crypto.randomUUID();
                const updated = {
                  ...j,
                  completed: j.completed.map((m) =>
                    m.id === c.id ? { ...m, submissionId } : m,
                  ),
                };
                if (!commit(updated)) return;
                download({
                  kind: "steady-checkin",
                  version: 1,
                  submissionId,
                  goal: j.goal,
                  title: c.title,
                  evidence: c.evidence,
                  url: c.url,
                  reflection: c.reflection,
                });
                setNotice(
                  "steady-checkin.json downloaded. Send it to your buddy through email or a messaging app. Ask them to choose ‘Review a buddy’s work’ in Steady.",
                );
              }}
            >
              Download check-in
            </button>
          </div>
        ))}
      {mode === "share" && !j.completed.length && (
        <p className="hint">
          Complete a milestone to create your check-in file. Already have a file
          from your buddy? Choose “Review a buddy’s work” above.
        </p>
      )}
      {mode !== "share" && (
        <label>
          {mode === "review"
            ? "Choose buddy check-in (.json)"
            : "Choose feedback or reply (.json)"}
          <input
            aria-label={
              mode === "review"
                ? "Choose buddy check-in (.json)"
                : "Choose feedback or reply (.json)"
            }
            type="file"
            accept=".json,application/json"
            aria-describedby="accepted-file-help"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              setNotice("");
              try {
                if (file.size > 64000)
                  throw Error("Choose a Steady file smaller than 64 KB.");
                const input: unknown = JSON.parse(await file.text());
                if (mode === "review" && validMessage(input))
                  throw Error(
                    "This is a feedback file. Choose ‘Read feedback or a reply’ above to open it.",
                  );
                if (mode === "feedback" && validCheckIn(input))
                  throw Error(
                    "This is a check-in file. Choose ‘Review a buddy’s work’ above to open it.",
                  );
                const result = receive(j, input);
                if (commit(result)) {
                  setError("");
                  if (validCheckIn(input)) setSelected(input.submissionId);
                  setNotice(
                    mode === "review"
                      ? "Buddy’s work opened and saved. Read it below, then write your feedback."
                      : "Response opened and saved. Read your conversation below, or write a reply.",
                  );
                }
              } catch (err) {
                setError(
                  err instanceof SyntaxError
                    ? "This is not a Steady file. Ask your buddy for the .json file downloaded from Steady, not a screenshot or document."
                    : (err as Error).message,
                );
              }
            }}
          />
          <span id="accepted-file-help" className="hint">
            Expected:{" "}
            {mode === "review"
              ? "steady-checkin.json, created with Download check-in"
              : "steady-feedback.json, created with Save & download feedback"}
            .
          </span>
        </label>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="hint">
          {notice}
        </p>
      )}
      {j.inbox.map((c) => (
        <article className="incoming-checkin" key={c.submissionId}>
          <span className="badge">IMPORTED BUDDY CHECK-IN</span>
          <h3>{c.title}</h3>
          <p>
            <strong>Goal:</strong> {c.goal}
          </p>
          <p>
            <strong>Work:</strong> {c.evidence || "See the work link below."}
          </p>
          {c.url && (
            <p>
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                Open buddy’s work ↗
              </a>
            </p>
          )}
          <p>
            <strong>Reflection:</strong> {c.reflection}
          </p>
        </article>
      ))}
      {targets.length > 0 && (
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !message.trim()) {
              setError("Add your display name and feedback.");
              return;
            }
            const response: BuddyMessage = {
              kind: "steady-feedback",
              version: 1,
              id: crypto.randomUUID(),
              submissionId: target,
              name: name.trim(),
              message: message.trim(),
            };
            if (commit({ ...j, messages: [...j.messages, response] })) {
              download(response);
              setMessage("");
              setError("");
              setNotice(
                "steady-feedback.json saved and downloaded. Send it back to your buddy. Ask them to choose ‘Read feedback or a reply’ in Steady.",
              );
            }
          }}
        >
          <h3>Write feedback or a reply</h3>
          <label>
            Milestone to discuss
            <select
              value={target}
              onChange={(e) => setSelected(e.target.value)}
            >
              {targets.map((t) => (
                <option value={t.id} key={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            Your display name
            <input
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Your feedback or reply
            <textarea
              required
              maxLength={10000}
              rows={3}
              placeholder="What works well? What could they try next?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </label>
          <button className="primary">Save & download feedback</button>
        </form>
      )}
      {j.messages.length > 0 && (
        <div className="buddy-messages">
          <h3>Saved conversation</h3>
          {j.messages.map((m) => (
            <article key={m.id}>
              <strong>{m.name}</strong>
              <span className="hint">
                {" "}
                · Name supplied by the sender, not verified
              </span>
              <p className="hint">
                {targets.find((t) => t.id === m.submissionId)?.title ||
                  "Milestone check-in"}
              </p>
              <p>{m.message}</p>
              <button className="text-button" onClick={() => download(m)}>
                Download this message again
              </button>
            </article>
          ))}
        </div>
      )}
      <p className="privacy">
        File exchange is separate from the simulated example above. Names and
        authorship are not verified. Files include the work and reflections you
        choose to share; avoid private information. No accounts, live chat, or
        cloud sync.
      </p>
    </section>
  );
}
