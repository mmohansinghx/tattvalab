import { expect, test } from "@playwright/test";

test("home page leads into the experiment catalogue", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /turn engineering theory into experience/i })).toBeVisible();
  await page.getByRole("link", { name: /explore experiments/i }).first().click();
  await expect(page).toHaveURL(/\/labs$/);
  await expect(page.getByRole("heading", { name: /explore the labs/i })).toBeVisible();
});

test("catalogue searches the available modules", async ({ page }) => {
  await page.goto("/labs");
  await page.getByRole("textbox", { name: "Search experiments" }).fill("logic");
  await expect(page.getByRole("heading", { name: "Logic gate explorer" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ohm’s law relationship" })).not.toBeVisible();
});

test("gate module reaches a working logic simulation", async ({ page }) => {
  await page.goto("/experiment/logic-gate-explorer");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "What do you already know?" })).toBeVisible();
  await page.locator(".answer-option").nth(0).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.locator(".answer-option").nth(1).click();
  await page.getByRole("button", { name: /submit answers/i }).click();
  await page.getByRole("button", { name: "Continue to procedure" }).click();
  await expect(page.getByRole("heading", { name: "Work through these steps." })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Output LOW")).toBeVisible();
  await page.getByRole("button", { name: /input b: 0/i }).click();
  await expect(page.getByText("Output HIGH")).toBeVisible();
});

test("completed module appears in private progress", async ({ page }) => {
  await page.goto("/experiment/logic-gate-explorer");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator(".answer-option").nth(0).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.locator(".answer-option").nth(1).click();
  await page.getByRole("button", { name: /submit answers/i }).click();
  await page.getByRole("button", { name: "Continue to procedure" }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator(".answer-option").nth(0).click();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.locator(".answer-option").nth(2).click();
  await page.getByRole("button", { name: /submit answers/i }).click();
  await page.getByRole("button", { name: "Continue to references" }).click();
  await expect(page.getByRole("heading", { name: "Further reading" })).toBeVisible();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue to report" }).click();
  await expect(page.getByRole("heading", { name: "Experiment summary" })).toBeVisible();
  await page.goto("/progress");
  await expect(page.locator(".metric-card").first().locator("strong")).toContainText("1");
});
