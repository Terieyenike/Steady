import { readFile } from "node:fs/promises";
import { test, expect, type Page } from "@playwright/test";
async function commit(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Save my commitment" }).click();
}
async function finish(page: Page) {
  await page.getByRole("button", { name: "Start focus session" }).click();
  await page.getByRole("button", { name: "Finish session for demo" }).click();
}
test("judge journey survives refresh and offline reload", async ({
  page,
  context,
}) => {
  await commit(page);
  await finish(page);
  await expect(page.locator(".progress-count")).toContainText("0");
  await page
    .getByLabel("What did you make?")
    .fill("Created three labeled form inputs.");
  await page
    .getByLabel("What did you learn or get stuck on?")
    .fill("Labels connect using for and id.");
  await page.getByRole("button", { name: "Save milestone & check in" }).click();
  await page
    .getByRole("button", { name: "Open simulated buddy response" })
    .click();
  await page.getByRole("button", { name: "Commit to my next step" }).click();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Add accessible error messages" }),
  ).toBeVisible();
  await page
    .getByText("✓ Create labeled name, email, and message fields", {
      exact: true,
    })
    .click();
  await expect(
    page
      .locator(".completed-record")
      .getByText("Created three labeled form inputs.", { exact: false }),
  ).toBeVisible();
  await expect(
    page
      .locator(".completed-record")
      .getByText("Labels connect using for and id.", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".completed-record")).toHaveCount(1);
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => resolve(),
          { once: true },
        ),
      );
  });
  await context.setOffline(true);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Add accessible error messages" }),
  ).toBeVisible();
  await expect(page.locator(".completed-record")).toHaveCount(1);
});
test("validates empty inputs and evidence", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Learning goal").fill("");
  await page.getByRole("button", { name: "Save my commitment" }).click();
  await expect(page.getByRole("alert")).toContainText("Fill in");
  await page.getByLabel("Learning goal").fill("Learn forms");
  await page.getByRole("button", { name: "Save my commitment" }).click();
  await finish(page);
  await page.getByRole("button", { name: "Save milestone & check in" }).click();
  await expect(page.getByRole("alert")).toContainText("Add evidence");
});
test("timer pauses, resumes and restores after reload", async ({ page }) => {
  await page.clock.install({ time: new Date("2026-10-13T12:00:00Z") });
  await page.clock.pauseAt(new Date("2026-10-13T12:01:00Z"));
  await commit(page);
  await page.getByRole("button", { name: "Start focus session" }).click();
  await page.clock.fastForward(60000);
  await expect(page.getByLabel("Time remaining")).toHaveText("24:00");
  await page.getByRole("button", { name: "Pause session" }).click();
  await page.clock.fastForward(60000);
  await expect(page.getByLabel("Time remaining")).toHaveText("24:00");
  await page.getByRole("button", { name: "Resume session" }).click();
  await page.clock.fastForward(60000);
  await page.reload();
  await expect(page.getByLabel("Time remaining")).toHaveText("23:00");
});
test("failed saves do not advance; corrupt data offers confirmed reset", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new Error("quota");
    };
  });
  await page.getByRole("button", { name: "Save my commitment" }).click();
  await expect(page.getByRole("alert")).toContainText("could not be saved");
  await expect(page.getByLabel("Learning goal")).toBeVisible();
  await page.reload();
  await page.evaluate(() =>
    localStorage.setItem("steady.journey.v1", "broken"),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("could not be read");
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await page.getByRole("button", { name: "Yes, reset progress" }).click();
  await expect(page.getByLabel("Learning goal")).toBeVisible();
});
test("360px keyboard journey has visible focus and no overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Steady home" })).toBeFocused();
  expect(
    await page
      .getByRole("link", { name: "Steady home" })
      .evaluate((el) => getComputedStyle(el).outlineStyle),
  ).toBe("solid");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Learning goal")).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Start focus session" }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Start focus session" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("What did you make?")).toBeVisible();
  await page.keyboard.press("Tab");
  await page.keyboard.type("Created labeled fields.");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.type("Labels need matching ids.");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Open simulated buddy response" }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Add accessible error messages" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/steady-mobile.png",
    fullPage: true,
  });
});

test("roadmap and completed session history survive reopening", async ({
  page,
  context,
}) => {
  await commit(page);
  await page.getByText("Plan another milestone", { exact: true }).click();
  await page
    .getByLabel("Planned milestone", { exact: true })
    .fill("Style the form");
  await page
    .getByLabel("Completion condition", { exact: true })
    .fill("Form works on a small screen");
  await page.getByRole("button", { name: "Add to roadmap" }).click();
  await finish(page);
  const reopened = await context.newPage();
  await page.close();
  await reopened.goto("/");
  await expect(
    reopened.getByRole("region", { name: "Completed focus sessions" }),
  ).toContainText("1 completed session");
  await expect(
    reopened.getByRole("region", { name: "Milestone roadmap" }),
  ).toContainText("Style the form");
  await reopened.getByLabel("What did you make?").fill("Built form fields");
  await reopened
    .getByLabel("What did you learn or get stuck on?")
    .fill("Use connected labels");
  await reopened
    .getByRole("button", { name: "Save milestone & check in" })
    .click();
  await reopened
    .getByRole("button", { name: "Open simulated buddy response" })
    .click();
  await expect(
    reopened.getByLabel("Your next milestone", { exact: true }),
  ).toHaveValue("Style the form");
  await reopened
    .getByRole("button", { name: "Commit to my next step" })
    .click();
  await reopened.reload();
  await expect(
    reopened.getByRole("heading", { name: "Style the form", exact: true }),
  ).toBeVisible();
  await reopened
    .getByRole("region", { name: "Completed focus sessions" })
    .locator("summary")
    .click();
  await expect(
    reopened.getByRole("region", { name: "Completed focus sessions" }),
  ).toContainText("Built form fields");
  await expect(
    reopened.getByRole("region", { name: "Milestone roadmap" }),
  ).toContainText("Completed");
});

test("two browsers exchange real written feedback and a learner reply", async ({
  page,
  browser,
}) => {
  await commit(page);
  await finish(page);
  await page.getByLabel("What did you make?").fill("Built a form");
  await page
    .getByLabel("What did you learn or get stuck on?")
    .fill("Connect each label");
  await page.getByRole("button", { name: "Save milestone & check in" }).click();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Download check-in", exact: true })
    .click();
  const checkinFile = await (await download).path();
  const buddyContext = await browser.newContext();
  const buddy = await buddyContext.newPage();
  await buddy.goto("/");
  await buddy
    .getByRole("button", { name: "Review a buddy’s work", exact: false })
    .click();
  await buddy
    .getByLabel("Choose buddy check-in (.json)")
    .setInputFiles(checkinFile!);
  await expect(
    buddy.getByRole("region", { name: "Real buddy exchange" }),
  ).toContainText("Built a form");
  await buddy.getByLabel("Your display name").fill("Sam");
  await buddy
    .getByLabel("Your feedback or reply")
    .fill("Try keyboard navigation next.");
  const response = buddy.waitForEvent("download");
  await buddy.getByRole("button", { name: "Save & download feedback" }).click();
  const responsePath = await (await response).path();
  await page
    .getByRole("button", { name: "Read feedback or a reply", exact: false })
    .click();
  await page
    .getByLabel("Choose feedback or reply (.json)")
    .setInputFiles(checkinFile!);
  await expect(page.getByRole("alert")).toContainText(
    "This is a check-in file",
  );
  await page
    .getByLabel("Choose feedback or reply (.json)")
    .setInputFiles(responsePath!);
  await expect(
    page
      .getByRole("region", { name: "Real buddy exchange" })
      .getByRole("status"),
  ).toContainText("Response opened and saved");
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Real buddy exchange" }),
  ).toContainText("Try keyboard navigation next.");
  const raw = await readFile(responsePath!, "utf8");
  await page
    .getByRole("button", { name: "Read feedback or a reply", exact: false })
    .click();
  await page.getByLabel("Choose feedback or reply (.json)").setInputFiles({
    name: "duplicate.json",
    mimeType: "application/json",
    buffer: Buffer.from(raw),
  });
  await expect(page.locator(".buddy-messages article")).toHaveCount(1);
  await page.getByLabel("Your display name").fill("Ada");
  await page
    .getByLabel("Your feedback or reply")
    .fill("Thanks, that is my next step.");
  const reply = page.waitForEvent("download");
  await page.getByRole("button", { name: "Save & download feedback" }).click();
  await buddy
    .getByRole("button", { name: "Read feedback or a reply", exact: false })
    .click();
  await buddy
    .getByLabel("Choose feedback or reply (.json)")
    .setInputFiles((await (await reply).path())!);
  await expect(
    buddy
      .getByRole("region", { name: "Real buddy exchange" })
      .getByRole("status"),
  ).toContainText("Response opened and saved");
  await buddy.reload();
  await expect(
    buddy.getByRole("region", { name: "Real buddy exchange" }),
  ).toContainText("Thanks, that is my next step.");
  await buddy
    .getByRole("button", { name: "Read feedback or a reply", exact: false })
    .click();
  await buddy.getByLabel("Choose feedback or reply (.json)").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from("broken"),
  });
  await expect(buddy.getByRole("alert")).toContainText("not a Steady file");
  await buddy.getByLabel("Your display name").fill("Unsaved private name");
  await buddy
    .getByLabel("Your feedback or reply")
    .fill("Unsaved private draft");
  await buddy.getByRole("button", { name: "Reset demo" }).click();
  await buddy.getByRole("button", { name: "Yes, reset progress" }).click();
  await buddy
    .getByRole("button", { name: "Review a buddy’s work", exact: false })
    .click();
  await buddy
    .getByLabel("Choose buddy check-in (.json)")
    .setInputFiles(checkinFile!);
  await expect(buddy.getByLabel("Your display name")).toHaveValue("");
  await expect(buddy.getByLabel("Your feedback or reply")).toHaveValue("");
  await expect(buddy.locator(".buddy-messages article")).toHaveCount(0);
  await buddyContext.close();
});

test("personal pace, accessible timer and credible reference names", async ({
  page,
}) => {
  await commit(page);
  await page
    .getByRole("combobox", { name: "Focus duration" })
    .selectOption("45");
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Focus duration" }),
  ).toHaveValue("45");
  await expect(page.getByRole("timer", { name: "Time remaining" })).toHaveText(
    "45:00",
  );
  await expect(page.getByRole("timer")).toHaveAttribute("aria-live", "off");
  await expect(
    page.getByRole("link", { name: "Your first form" }),
  ).toHaveAttribute("href", /^https:\/\/developer.mozilla.org/);
  await expect(
    page.getByRole("link", { name: "Labeling controls" }),
  ).toHaveAttribute("href", /^https:\/\/www.w3.org/);
  await page.getByRole("button", { name: "Start focus session" }).click();
  await expect(
    page.getByRole("combobox", { name: "Focus duration" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Pause session" }),
  ).toHaveAccessibleName("Pause session");
  await page.getByText("Using a shared device?", { exact: true }).click();
  await expect(page.locator(".shared-device")).toContainText("not encrypted");
  await page
    .getByRole("button", { name: "Clear saved progress", exact: true })
    .click();
  await expect(
    page.getByRole("group", { name: "Confirm reset" }),
  ).toContainText("Downloaded files will remain");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Pause session" }),
  ).toBeVisible();
});

test("restart lets a learner change the timer without losing milestones", async ({
  page,
}) => {
  await commit(page);
  await page.getByRole("button", { name: "Start focus session" }).click();
  await page
    .getByRole("button", { name: "Choose a different duration" })
    .click();
  await page.getByRole("button", { name: "Keep current session" }).click();
  await expect(
    page.getByRole("button", { name: "Pause session" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Choose a different duration" })
    .click();
  await page
    .getByRole("button", { name: "Restart focus session", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Focus duration" })
    .selectOption("10");
  await page.reload();
  await expect(page.getByRole("timer")).toHaveText("10:00");
  await expect(
    page.getByRole("heading", {
      name: "Create labeled name, email, and message fields",
      exact: true,
    }),
  ).toBeVisible();
});
