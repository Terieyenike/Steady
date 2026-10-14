import { describe, it, expect } from "vitest";
import {
  fresh,
  timer,
  remaining,
  complete,
  save,
  load,
  DURATION,
  planMilestone,
  finishSession,
  advance,
  type Journey,
  receive,
  setFocusDuration,
} from "./state";
const ready = () => ({
  ...fresh(),
  goal: "Goal",
  active: { id: 1, title: "Form", condition: "Labeled" },
  session: timer(fresh().session, "finish"),
});
describe("journey state", () => {
  it("uses timestamps and preserves paused time", () => {
    const running = timer(fresh().session, "start", 1000);
    expect(remaining(running, 61000)).toBe(DURATION - 60000);
    const paused = timer(running, "pause", 61000);
    expect(remaining(paused, 90000)).toBe(DURATION - 60000);
    expect(remaining(timer(paused, "start", 100000), 130000)).toBe(
      DURATION - 90000,
    );
  });
  it("finishing time does not complete work", () =>
    expect(ready().completed).toHaveLength(0));
  it("requires a session, evidence and reflection", () => {
    expect(() =>
      complete({ ...ready(), session: fresh().session }, "work", "", "learned"),
    ).toThrow();
    expect(() => complete(ready(), "", "", "learned")).toThrow();
    expect(() => complete(ready(), "work", "", "")).toThrow();
    expect(() =>
      complete(ready(), "", "javascript:alert(1)", "learned"),
    ).toThrow();
  });
  it("records completion once and supports a work URL", () => {
    const j = complete(ready(), "", "https://example.com", "learned");
    expect(complete(j, "", "", "")).toEqual(j);
    expect(j.completed).toHaveLength(1);
  });
  it("round trips storage and propagates failure", () => {
    let raw = "";
    const storage = {
      setItem: (_k: string, v: string) => {
        raw = v;
      },
      getItem: () => raw,
    };
    save(storage, ready());
    expect(load(storage)).toEqual(ready());
    expect(() =>
      save(
        {
          setItem: () => {
            throw Error("quota");
          },
        },
        ready(),
      ),
    ).toThrow("quota");
    expect(() => load({ getItem: () => "{bad" })).toThrow();
    expect(() => load({ getItem: () => '{"version":1}' })).toThrow();
  });
});

describe("roadmap and history", () => {
  it("queues milestones, records a session once and retains its achievement", () => {
    let j: Journey = {
      ...fresh(),
      goal: "Forms",
      active: { id: 1, title: "Build fields", condition: "Labels connected" },
    };
    j = planMilestone(j, "Style form", "Works on mobile");
    j = { ...j, session: timer(j.session, "start", 1000) };
    j = finishSession(j, true, 2000);
    expect(finishSession(j, true, 3000).sessions).toHaveLength(1);
    j = complete(j, "Built inputs", "", "Connected labels");
    j = advance(j, "Style form");
    expect(j.active?.condition).toBe("Works on mobile");
    expect(j.planned).toHaveLength(0);
    expect(j.sessions[0].achievement).toBe("Built inputs");
    expect(j.completed).toHaveLength(1);
  });
  it("loads old records without losing existing progress", () => {
    const { planned, sessions, ...legacy } = ready();
    const loaded = load({ getItem: () => JSON.stringify(legacy) });
    expect(loaded.active).toEqual(legacy.active);
    expect(loaded.planned).toEqual([]);
    expect(loaded.sessions).toEqual([]);
  });
});

describe("buddy exchange", () => {
  const checkin = {
    kind: "steady-checkin",
    version: 1,
    submissionId: "submission-1",
    goal: "Learn forms",
    title: "Build fields",
    evidence: "Connected labels",
    url: "",
    reflection: "Practiced HTML",
  };
  const message = {
    kind: "steady-feedback",
    version: 1,
    id: "message-1",
    submissionId: "submission-1",
    name: "Sam",
    message: "Try testing with a keyboard.",
  };
  it("receives check-ins and feedback once without touching the learner goal", () => {
    let j = receive(fresh(), checkin);
    j = receive(j, checkin);
    expect(j.inbox).toHaveLength(1);
    expect(j.goal).toBe("");
    j = receive(j, message);
    expect(receive(j, message).messages).toHaveLength(1);
  });
  it("rejects malformed files and feedback for another submission", () => {
    expect(() => receive(fresh(), message)).toThrow("different check-in");
    expect(() =>
      receive(fresh(), { ...checkin, url: "javascript:alert(1)" }),
    ).toThrow();
    expect(() => receive(fresh(), { ...message, message: "" })).toThrow();
  });
});

describe("personal focus pace", () => {
  it("saves a chosen duration and uses it for the next milestone", () => {
    let j: Journey = setFocusDuration(
      { ...ready(), session: fresh().session },
      45,
    );
    expect(j.session.remaining).toBe(45 * 60000);
    j = { ...j, session: timer(j.session, "start", 1000) };
    expect(() => setFocusDuration(j, 10)).toThrow();
    j = finishSession(j, true, 2000);
    j = complete(j, "work", "", "learned");
    j = advance(j, "Next step");
    expect(j.session.remaining).toBe(45 * 60000);
    expect(load({ getItem: () => JSON.stringify(j) }).focusMinutes).toBe(45);
    expect(() => setFocusDuration(j, 0)).toThrow();
  });
});
