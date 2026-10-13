export const KEY = "steady.journey.v1";
export const DURATION = 25 * 60 * 1000;
export type Milestone = { id: number; title: string; condition: string };
export type Session = {
  status: "idle" | "running" | "paused" | "finished";
  remaining: number;
  startedAt: number | null;
};
export type Completion = Milestone & {
  submissionId?: string;
  evidence: string;
  url: string;
  reflection: string;
};
export type SessionRecord = {
  id: string;
  milestoneId: number;
  milestoneTitle: string;
  finishedAt: number;
  demo: boolean;
  achievement: string;
  reflection: string;
};
export type Journey = {
  version: 1;
  goal: string;
  active: Milestone | null;
  session: Session;
  completed: Completion[];
  inbox: CheckIn[];
  messages: BuddyMessage[];
  planned: Milestone[];
  sessions: SessionRecord[];
  feedbackOpen: boolean;
  awaitingNext: boolean;
};
export const fresh = (): Journey => ({
  version: 1,
  goal: "",
  active: null,
  session: { status: "idle", remaining: DURATION, startedAt: null },
  completed: [],
  inbox: [],
  messages: [],
  planned: [],
  sessions: [],
  feedbackOpen: false,
  awaitingNext: false,
});
export function remaining(s: Session, now = Date.now()) {
  return Math.max(
    0,
    s.remaining -
      (s.status === "running" && s.startedAt !== null
        ? Math.max(0, now - s.startedAt)
        : 0),
  );
}
export function timer(
  s: Session,
  action: "start" | "pause" | "finish",
  now = Date.now(),
): Session {
  const left = remaining(s, now);
  if (action === "finish" || left === 0)
    return { status: "finished", remaining: 0, startedAt: null };
  return action === "pause"
    ? { status: "paused", remaining: left, startedAt: null }
    : { status: "running", remaining: left, startedAt: now };
}
export function complete(
  j: Journey,
  evidence: string,
  url: string,
  reflection: string,
): Journey {
  if (j.awaitingNext) return j;
  if (!j.active || j.session.status !== "finished")
    throw new Error("Finish a focus session first.");
  if (!reflection.trim() || (!evidence.trim() && !url.trim()))
    throw new Error("Add evidence and a reflection before saving.");
  if (url.trim()) {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error("Use a complete HTTP(S) work URL.");
    }
    if (!["http:", "https:"].includes(parsed.protocol))
      throw new Error("Use a complete HTTP(S) work URL.");
  }
  return {
    ...j,
    completed: [
      ...j.completed,
      {
        ...j.active,
        submissionId: crypto.randomUUID(),
        evidence: evidence.trim(),
        url: url.trim(),
        reflection: reflection.trim(),
      },
    ],
    sessions: j.sessions.map((s, i) =>
      i === j.sessions.length - 1 && s.milestoneId === j.active!.id
        ? {
            ...s,
            achievement: evidence.trim() || url.trim(),
            reflection: reflection.trim(),
          }
        : s,
    ),
    awaitingNext: true,
  };
}
const isMilestone = (v: any) =>
  v &&
  Number.isInteger(v.id) &&
  typeof v.title === "string" &&
  v.title.trim() &&
  typeof v.condition === "string" &&
  v.condition.trim();
export function load(storage: Pick<Storage, "getItem">): Journey {
  const raw = storage.getItem(KEY);
  if (!raw) return fresh();
  const j = JSON.parse(raw);
  // Older v1 records had no roadmap or history. Preserve their original fields.
  if (j && typeof j === "object") {
    j.inbox ??= [];
    j.messages ??= [];
    j.planned ??= [];
    j.sessions ??= [];
  }
  if (
    j.version !== 1 ||
    typeof j.goal !== "string" ||
    !(j.active === null || isMilestone(j.active)) ||
    !Array.isArray(j.completed) ||
    !j.completed.every(
      (c: any) =>
        isMilestone(c) &&
        ["evidence", "url", "reflection"].every(
          (k) => typeof c[k] === "string",
        ),
    ) ||
    !Array.isArray(j.inbox) ||
    !j.inbox.every(validCheckIn) ||
    !Array.isArray(j.messages) ||
    !j.messages.every(validMessage) ||
    !Array.isArray(j.planned) ||
    !j.planned.every(isMilestone) ||
    !Array.isArray(j.sessions) ||
    !j.sessions.every(
      (s: any) =>
        s &&
        typeof s.id === "string" &&
        Number.isInteger(s.milestoneId) &&
        typeof s.milestoneTitle === "string" &&
        Number.isFinite(s.finishedAt) &&
        typeof s.demo === "boolean" &&
        typeof s.achievement === "string" &&
        typeof s.reflection === "string",
    ) ||
    typeof j.feedbackOpen !== "boolean" ||
    typeof j.awaitingNext !== "boolean" ||
    !j.session ||
    !["idle", "running", "paused", "finished"].includes(j.session.status) ||
    !Number.isFinite(j.session.remaining) ||
    j.session.remaining < 0 ||
    j.session.remaining > DURATION ||
    !(j.session.startedAt === null || Number.isFinite(j.session.startedAt)) ||
    (j.session.status === "running" && j.session.startedAt === null) ||
    (j.awaitingNext && !j.completed.length)
  )
    throw new Error("Saved progress could not be read. Reset to start again.");
  return j;
}
export function save(storage: Pick<Storage, "setItem">, j: Journey) {
  storage.setItem(KEY, JSON.stringify(j));
  return j;
}

export function planMilestone(
  j: Journey,
  title: string,
  condition: string,
): Journey {
  if (!j.goal || !title.trim() || !condition.trim())
    throw new Error("Add a milestone and its completion condition.");
  const id =
    Math.max(
      0,
      j.active?.id ?? 0,
      ...j.completed.map((m) => m.id),
      ...j.planned.map((m) => m.id),
    ) + 1;
  return {
    ...j,
    planned: [
      ...j.planned,
      { id, title: title.trim(), condition: condition.trim() },
    ],
  };
}
export function finishSession(
  j: Journey,
  demo = false,
  now = Date.now(),
): Journey {
  if (
    !j.active ||
    j.session.status === "idle" ||
    j.session.status === "finished"
  )
    return j;
  const finishedAt =
    !demo && j.session.startedAt !== null
      ? Math.min(now, j.session.startedAt + j.session.remaining)
      : now;
  return {
    ...j,
    session: timer(j.session, "finish", now),
    sessions: [
      ...j.sessions,
      {
        id: `${j.active.id}-${finishedAt}-${j.sessions.length}`,
        milestoneId: j.active.id,
        milestoneTitle: j.active.title,
        finishedAt,
        demo,
        achievement: "",
        reflection: "",
      },
    ],
  };
}
export function advance(j: Journey, title: string): Journey {
  if (!j.awaitingNext || !title.trim())
    throw new Error("Add a next milestone.");
  const queued = j.planned[0];
  const id =
    queued?.id ??
    Math.max(0, j.active?.id ?? 0, ...j.completed.map((m) => m.id)) + 1;
  return {
    ...j,
    active: {
      id,
      title: title.trim(),
      condition:
        queued?.condition ?? "Record the change you made and what you learned.",
    },
    planned: j.planned.slice(queued ? 1 : 0),
    session: fresh().session,
    awaitingNext: false,
    feedbackOpen: false,
  };
}

export type CheckIn = {
  kind: "steady-checkin";
  version: 1;
  submissionId: string;
  goal: string;
  title: string;
  evidence: string;
  url: string;
  reflection: string;
};
export type BuddyMessage = {
  kind: "steady-feedback";
  version: 1;
  id: string;
  submissionId: string;
  name: string;
  message: string;
};
const text = (v: unknown) =>
  typeof v === "string" && v.trim().length > 0 && v.length <= 10000;
export const validMessage = (v: any): v is BuddyMessage =>
  v &&
  v.kind === "steady-feedback" &&
  v.version === 1 &&
  text(v.id) &&
  text(v.submissionId) &&
  text(v.name) &&
  text(v.message);
export const validCheckIn = (v: any): v is CheckIn =>
  v &&
  v.kind === "steady-checkin" &&
  v.version === 1 &&
  text(v.submissionId) &&
  text(v.goal) &&
  text(v.title) &&
  typeof v.evidence === "string" &&
  typeof v.url === "string" &&
  (!!v.evidence.trim() || !!v.url.trim()) &&
  text(v.reflection) &&
  (!v.url || /^https?:\/\//i.test(v.url));
export function receive(j: Journey, input: unknown): Journey {
  if (validCheckIn(input))
    return {
      ...j,
      inbox: [
        ...j.inbox.filter((c) => c.submissionId !== input.submissionId),
        input,
      ],
    };
  if (validMessage(input)) {
    if (
      !j.completed.some((c) => c.submissionId === input.submissionId) &&
      !j.inbox.some((c) => c.submissionId === input.submissionId)
    )
      throw new Error(
        "This feedback belongs to a different check-in. Import its check-in first or use the original learner’s browser.",
      );
    return j.messages.some((m) => m.id === input.id)
      ? j
      : { ...j, messages: [...j.messages, input] };
  }
  throw new Error("Choose a valid Steady check-in or feedback file.");
}
