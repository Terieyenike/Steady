import { useEffect, useRef, useState } from "react";
import BuddyExchange from "./BuddyExchange";
import { demo, learningReferences, referenceCheckedOn } from "./demo";
import {
  complete,
  FOCUS_MINUTES,
  setFocusDuration,
  planMilestone,
  finishSession,
  advance,
  fresh,
  load,
  remaining,
  save,
  timer,
  type Journey,
} from "./state";
export default function App() {
  const [initial] = useState(() => {
    try {
      return { journey: load(localStorage), error: "" };
    } catch {
      return {
        journey: fresh(),
        error: "Saved progress could not be read. Reset to start again.",
      };
    }
  });
  const [j, setJ] = useState(initial.journey),
    [error, setError] = useState(initial.error),
    [blocked, setBlocked] = useState(!!initial.error),
    [now, setNow] = useState(Date.now()),
    [reset, setReset] = useState(false),
    [resetCount, setResetCount] = useState(0),
    [restart, setRestart] = useState(false),
    [updateAvailable, setUpdateAvailable] = useState(false);
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const hadController = !!navigator.serviceWorker.controller;
    const changed = () => {
      if (hadController) setUpdateAvailable(true);
    };
    navigator.serviceWorker.addEventListener("controllerchange", changed);
    const check = () => {
      navigator.serviceWorker
        .getRegistration()
        .then((r) => r?.update())
        .catch(() => {});
    };
    window.addEventListener("focus", check);
    check();
    const interval = setInterval(check, 60000);
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", changed);
      window.removeEventListener("focus", check);
      clearInterval(interval);
    };
  }, []);
  const [goal, setGoal] = useState(demo.goal),
    [title, setTitle] = useState(demo.milestone),
    [condition, setCondition] = useState(demo.condition),
    [evidence, setEvidence] = useState(""),
    [url, setUrl] = useState(""),
    [reflection, setReflection] = useState(""),
    [next, setNext] = useState(demo.next),
    [plannedTitle, setPlannedTitle] = useState(""),
    [plannedCondition, setPlannedCondition] = useState("");
  useEffect(() => {
    if (j.awaitingNext) setNext(j.planned[0]?.title ?? demo.next);
  }, [j.awaitingNext, j.planned[0]?.id]);
  function commit(value: Journey) {
    try {
      save(localStorage, value);
      setJ(value);
      setError("");
      return true;
    } catch {
      setError(
        "Progress could not be saved. Check browser storage, then retry your action.",
      );
      return false;
    }
  }
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (
      !blocked &&
      j.session.status === "running" &&
      remaining(j.session, now) === 0
    )
      commit(finishSession(j, false, now));
  }, [now, j, blocked]);
  const left = remaining(j.session, now),
    step = !j.goal ? 1 : !j.awaitingNext ? 2 : 3;
  const stage = `${step}:${j.session.status === "finished"}:${j.feedbackOpen}:${j.active?.id}`;
  const previousStage = useRef(stage);
  const workspace = useRef<HTMLElement>(null);
  useEffect(() => {
    if (previousStage.current !== stage) {
      workspace.current?.querySelector<HTMLHeadingElement>("h2")?.focus();
      previousStage.current = stage;
    }
  }, [stage]);
  return (
    <div className="shell">
      <header>
        <a className="brand" href="/" aria-label="Steady home">
          <span className="brand-icon">s</span>steady
          <span className="brand-dot">.</span>
        </a>
        <span className="local-tag">
          <span /> Saved on this browser
        </span>
      </header>
      {updateAvailable && (
        <div className="update-banner" role="status">
          An app update is ready. Save your work before reloading. Unsaved
          drafts will be lost.{" "}
          <button
            className="secondary"
            onClick={() => window.location.reload()}
          >
            Load updated app
          </button>
        </div>
      )}
      <main>
        <div className="intro">
          <p className="eyebrow">A LITTLE PROGRESS, TOGETHER</p>
          <h1>
            Show up. Make something.
            <br />
            <em>Keep going.</em>
          </h1>
          <p className="lede">
            One small commitment, a focused session, and a clear next step.
            <br className="desktop" /> Your learning journey starts with today.
          </p>
        </div>
        <div className="layout">
          <section
            ref={workspace}
            className="workspace"
            aria-label="Your learning session"
          >
            <nav className="steps" aria-label="Journey progress">
              {["Commit", "Focus & reflect", "Next step"].map((s, i) => (
                <span
                  key={s}
                  aria-current={step === i + 1 ? "step" : undefined}
                  className={step === i + 1 ? "current" : ""}
                >
                  <b>{i + 1 < step ? "✓" : i + 1}</b>
                  {s}
                </span>
              ))}
            </nav>
            {error && (
              <div role="alert" className="error">
                {error}
              </div>
            )}
            {!blocked && (
              <>
                {!j.goal ? (
                  <form
                    noValidate
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!goal.trim() || !title.trim() || !condition.trim()) {
                        setError(
                          "Fill in your goal, milestone, and completion condition.",
                        );
                        return;
                      }
                      commit({
                        ...fresh(),
                        goal: goal.trim(),
                        active: {
                          id: 1,
                          title: title.trim(),
                          condition: condition.trim(),
                        },
                      });
                    }}
                  >
                    <p className="eyebrow">01 / MAKE A COMMITMENT</p>
                    <h2 tabIndex={-1}>What will you move forward?</h2>
                    <p className="muted">
                      Start small. Choose something you can put into practice.
                    </p>
                    <label>
                      Learning goal
                      <input
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      Today’s milestone
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </label>
                    <label>
                      I’ll know it’s done when…
                      <textarea
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        required
                        rows={2}
                      />
                    </label>
                    <button className="primary">
                      Save my commitment <span>↗</span>
                    </button>
                    <p className="hint">
                      An illustrative HTML & CSS example. Make it your own.
                    </p>
                  </form>
                ) : !j.awaitingNext ? (
                  <>
                    <p className="eyebrow">02 / GIVE IT YOUR ATTENTION</p>
                    <h2 tabIndex={-1}>{j.active?.title}</h2>
                    <p className="muted">Done means: {j.active?.condition}</p>
                    <div className="timer-panel">
                      <span className="eyebrow">YOUR FOCUS SESSION</span>
                      <div
                        className="clock"
                        role="timer"
                        aria-live="off"
                        aria-label="Time remaining"
                      >
                        {String(Math.floor(left / 60000)).padStart(2, "0")}
                        <span>:</span>
                        {String(Math.floor((left % 60000) / 1000)).padStart(
                          2,
                          "0",
                        )}
                      </div>
                      <p className="muted" role="status">
                        {j.session.status === "finished"
                          ? "Session finished. Now capture what you made."
                          : j.session.status === "running"
                            ? "One thing at a time. You’ve got this."
                            : j.session.status === "paused"
                              ? "Take a breath. Resume when you’re ready."
                              : `${j.focusMinutes} minutes for one small step.`}
                      </p>
                      {j.session.status !== "finished" && (
                        <div className="timer-actions">
                          <button
                            className="primary"
                            onClick={() =>
                              commit({
                                ...j,
                                session: timer(
                                  j.session,
                                  j.session.status === "running"
                                    ? "pause"
                                    : "start",
                                ),
                              })
                            }
                          >
                            {j.session.status === "running"
                              ? "Pause session"
                              : j.session.status === "paused"
                                ? "Resume session"
                                : "Start focus session"}
                          </button>
                          {j.session.status !== "idle" && (
                            <button
                              className="text-button"
                              onClick={() => commit(finishSession(j, true))}
                            >
                              Finish session for demo
                            </button>
                          )}
                        </div>
                      )}
                      {
                        <label className="duration-setting">
                          Focus duration
                          <select
                            aria-label="Focus duration"
                            disabled={j.session.status !== "idle"}
                            value={j.focusMinutes}
                            onChange={(e) => {
                              try {
                                commit(
                                  setFocusDuration(j, Number(e.target.value)),
                                );
                              } catch (err) {
                                setError((err as Error).message);
                              }
                            }}
                          >
                            {FOCUS_MINUTES.map((m) => (
                              <option value={m} key={m}>
                                {m} minutes
                              </option>
                            ))}
                          </select>
                          <span className="hint">
                            {j.session.status === "idle"
                              ? "Choose a length that fits your available time before starting."
                              : "This session’s duration is locked. Restart an unfinished session below to choose a different length."}
                          </span>
                        </label>
                      }
                      {["running", "paused"].includes(j.session.status) && (
                        <div>
                          <button
                            className="text-button"
                            onClick={() => setRestart(true)}
                          >
                            Choose a different duration
                          </button>
                          {restart && (
                            <div
                              role="group"
                              aria-label="Confirm session restart"
                            >
                              <p className="muted">
                                Restart this timer? Elapsed time in this
                                unfinished session will not be counted. Your
                                milestones and completed sessions stay saved.
                              </p>
                              <button
                                className="secondary"
                                onClick={() => {
                                  if (
                                    commit({
                                      ...j,
                                      session: {
                                        ...fresh().session,
                                        remaining: j.focusMinutes * 60000,
                                      },
                                    })
                                  )
                                    setRestart(false);
                                }}
                              >
                                Restart focus session
                              </button>{" "}
                              <button
                                className="text-button"
                                onClick={() => setRestart(false)}
                              >
                                Keep current session
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {j.session.status === "finished" && (
                      <form
                        noValidate
                        onSubmit={(e) => {
                          e.preventDefault();
                          try {
                            commit(complete(j, evidence, url, reflection));
                          } catch (err) {
                            setError((err as Error).message);
                          }
                        }}
                      >
                        <h3>Time spent → progress made</h3>
                        <p className="muted">
                          Capture your work. A finished timer isn’t a finished
                          milestone.
                        </p>
                        <label>
                          What did you make?
                          <textarea
                            value={evidence}
                            onChange={(e) => setEvidence(e.target.value)}
                            placeholder="Describe the practical work you completed…"
                            rows={3}
                          />
                        </label>
                        <label>
                          Work URL{" "}
                          <span className="optional">
                            optional if you describe your work
                          </span>
                          <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://…"
                            inputMode="url"
                          />
                        </label>
                        <label>
                          What did you learn or get stuck on?
                          <textarea
                            value={reflection}
                            onChange={(e) => setReflection(e.target.value)}
                            required
                            rows={2}
                          />
                        </label>
                        <button className="primary">
                          Save milestone & check in <span>↗</span>
                        </button>
                      </form>
                    )}
                  </>
                ) : (
                  <>
                    <p className="eyebrow">03 / KEEP THE MOMENTUM</p>
                    <div className="success-mark">✓</div>
                    <h2 tabIndex={-1}>A small step. Real progress.</h2>
                    <p className="muted">
                      You recorded work for “{j.active?.title}”. Choose where to
                      go next.
                    </p>
                    <div className="feedback">
                      <span className="badge">SIMULATED BUDDY RESPONSE</span>
                      <h3>A little encouragement for the next step</h3>
                      <p className="muted">
                        Example feedback, not a message from a real person.
                      </p>
                      {!j.feedbackOpen ? (
                        <button
                          className="secondary"
                          onClick={() => commit({ ...j, feedbackOpen: true })}
                        >
                          Open simulated buddy response
                        </button>
                      ) : (
                        <>
                          <p>{demo.feedback}</p>
                          <form
                            noValidate
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!next.trim()) {
                                setError("Add a next milestone.");
                                return;
                              }
                              if (commit(advance(j, next))) {
                                setEvidence("");
                                setUrl("");
                                setReflection("");
                              }
                            }}
                          >
                            <label>
                              Your next milestone
                              <input
                                value={next}
                                onChange={(e) => setNext(e.target.value)}
                                required
                              />
                            </label>
                            <button className="primary">
                              Commit to my next step <span>↗</span>
                            </button>
                          </form>
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </section>
          <aside>
            <div className="progress-card">
              <p className="eyebrow">YOUR LEARNING TRAIL</p>
              <h2 tabIndex={-1}>Every step counts.</h2>
              <div className="progress-count">
                {j.completed.length}
                <span>
                  milestone{j.completed.length === 1 ? "" : "s"} completed
                </span>
              </div>
              <div className="trail">
                <span className="trail-dot" />
                <div>
                  <p className="eyebrow">
                    {j.goal ? "YOUR GOAL" : "START WITH A GOAL"}
                  </p>
                  <p>{j.goal || "A little intention goes a long way."}</p>
                </div>
              </div>
              {j.active && (
                <div className="next-card">
                  <p className="eyebrow">
                    {j.awaitingNext ? "UP NEXT" : "YOUR NEXT ACTION"}
                  </p>
                  <p>
                    {j.awaitingNext
                      ? "Open example feedback and choose your next milestone."
                      : j.active.title}
                  </p>
                </div>
              )}
              {j.goal && (
                <section className="roadmap" aria-label="Milestone roadmap">
                  <h3>Your milestone roadmap</h3>
                  <p className="muted">
                    Break your goal into small steps. Finish the current one
                    before moving to the next.
                  </p>
                  <ol className="roadmap-list">
                    {j.completed.map((m) => (
                      <li key={`done-${m.id}`}>
                        <span className="status-label">Completed</span>
                        <span>{m.title}</span>
                      </li>
                    ))}
                    {j.active && !j.awaitingNext && (
                      <li>
                        <span className="status-label">In progress</span>
                        <span>{j.active.title}</span>
                      </li>
                    )}
                    {j.planned.map((m) => (
                      <li key={m.id}>
                        <span className="status-label">Planned</span>
                        <span>{m.title}</span>
                        <small>{m.condition}</small>
                      </li>
                    ))}
                  </ol>
                  <details>
                    <summary>Plan another milestone</summary>
                    <form
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault();
                        try {
                          if (
                            commit(
                              planMilestone(j, plannedTitle, plannedCondition),
                            )
                          ) {
                            setPlannedTitle("");
                            setPlannedCondition("");
                          }
                        } catch (err) {
                          setError((err as Error).message);
                        }
                      }}
                    >
                      <label>
                        Planned milestone
                        <input
                          value={plannedTitle}
                          onChange={(e) => setPlannedTitle(e.target.value)}
                          required
                        />
                      </label>
                      <label>
                        Completion condition
                        <textarea
                          value={plannedCondition}
                          onChange={(e) => setPlannedCondition(e.target.value)}
                          required
                          rows={2}
                        />
                      </label>
                      <button className="secondary">Add to roadmap</button>
                    </form>
                  </details>
                </section>
              )}
              {j.sessions.length > 0 && (
                <section
                  aria-label="Completed focus sessions"
                  className="session-history"
                >
                  <h3>Focus session history</h3>
                  <p className="muted">
                    {j.sessions.length} completed session
                    {j.sessions.length === 1 ? "" : "s"}. Demo shortcuts are
                    labeled.
                  </p>
                  {j.sessions.map((s) => (
                    <details key={s.id}>
                      <summary>
                        {s.milestoneTitle} ·{" "}
                        {s.demo ? "Demo session" : "Focus session"}
                      </summary>
                      <p>{new Date(s.finishedAt).toLocaleString()}</p>
                      <p>
                        {s.achievement ||
                          "Session finished. Record your achievement in the check-in form."}
                      </p>
                      {s.reflection && <p>{s.reflection}</p>}
                    </details>
                  ))}
                </section>
              )}
              {j.completed.map((c) => (
                <details className="completed-record" key={c.id}>
                  <summary>✓ {c.title}</summary>
                  <p>
                    <strong>Evidence:</strong>{" "}
                    {c.evidence || "Work linked below."}
                  </p>
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer">
                      Open work ↗
                    </a>
                  )}
                  <p>
                    <strong>Reflection:</strong> {c.reflection}
                  </p>
                </details>
              ))}
            </div>
            <div className="note">
              <span>↗</span>
              <p>
                Progress is what you practice,
                <br />
                not just what you watch.
              </p>
            </div>
            <p className="privacy">
              Stored on this browser. No account or cloud sync. Buddy files are
              shared manually. Clearing browser data removes your progress.
            </p>
            <details className="shared-device">
              <summary>Using a shared device?</summary>
              <p>
                Your saved work and buddy messages can be read by anyone using
                this browser profile. Storage is not encrypted or protected by a
                password.
              </p>
              <p>
                Before leaving, clear saved progress below. This removes your
                goal, milestones, sessions, imported check-ins, and conversation
                from this browser. Downloaded or shared files remain; remove
                those yourself if needed.
              </p>
              <button className="secondary" onClick={() => setReset(true)}>
                Clear saved progress
              </button>
            </details>
            <button
              className="text-button reset"
              onClick={() => setReset(true)}
            >
              Reset demo
            </button>
            {reset && (
              <div
                className="reset-confirm"
                role="group"
                aria-label="Confirm reset"
              >
                <p>
                  Delete your goal, milestones, sessions, imported check-ins,
                  and messages from this browser? Downloaded files will remain.
                </p>
                <button
                  className="secondary"
                  onClick={() => {
                    if (commit(fresh())) {
                      setBlocked(false);
                      setReset(false);
                      setResetCount((count) => count + 1);
                      setRestart(false);
                      setGoal(demo.goal);
                      setTitle(demo.milestone);
                      setCondition(demo.condition);
                      setPlannedTitle("");
                      setPlannedCondition("");
                      setNext(demo.next);
                      setEvidence("");
                      setUrl("");
                      setReflection("");
                    }
                  }}
                >
                  Yes, reset progress
                </button>
                <button className="text-button" onClick={() => setReset(false)}>
                  Cancel
                </button>
              </div>
            )}
          </aside>
        </div>
        <section
          className="learning-references"
          aria-label="Sources for the example milestone"
        >
          <p className="eyebrow">TRACEABLE LEARNING</p>
          <h2>References for the contact-form example</h2>
          <p className="muted">
            These sources support the example’s form-building and label
            guidance. They do not assess your work or validate custom goals.
            Links need internet; the brief notes below are available offline
            once Steady is cached.
          </p>
          <ul>
            {learningReferences.map((r) => (
              <li key={r.url}>
                <span className="badge">{r.publisher}</span>
                <h3>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    {r.title} ↗
                  </a>
                </h3>
                <p>{r.note}</p>
              </li>
            ))}
          </ul>
          <p className="hint">
            Links and example guidance checked against these sources on{" "}
            {referenceCheckedOn}. Summaries are written for this prototype, not
            copied course materials.
          </p>
        </section>
        {!blocked && (
          <BuddyExchange key={resetCount} journey={j} commit={commit} />
        )}
      </main>
      <footer>
        <span>
          steady.{" "}
          <span className="muted">Built for the days you keep going.</span>
        </span>
        <span>Learning accountability · Prototype</span>
      </footer>
    </div>
  );
}
