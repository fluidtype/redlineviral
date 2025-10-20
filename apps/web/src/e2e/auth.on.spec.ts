import { expect, test } from "@playwright/test";

const mode = (process.env.AUTH_MODE ?? "auto").toLowerCase();
test.skip(mode !== "on", "Auth-on smoke spec runs only when AUTH_MODE=on.");

test("sign-in renders Clerk shell when auth is on", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByTestId("clerk-sign-in")).toBeVisible();
  await expect(page.locator("body[data-auth-mode='on']")).toHaveCount(1);
  await expect(page.getByTestId("auth-disabled-placeholder")).toHaveCount(0);
});
