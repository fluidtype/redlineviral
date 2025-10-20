import { expect, test } from "@playwright/test";

const mode = (process.env.AUTH_MODE ?? "auto").toLowerCase();
test.skip(mode !== "off", "Auth-off smoke spec runs only when AUTH_MODE=off.");

test("sign-in shows disabled placeholder when auth is off", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(page.getByTestId("auth-disabled-placeholder")).toBeVisible();
  await expect(page.locator("body[data-auth-mode='off']")).toHaveCount(1);
  await expect(page.getByTestId("clerk-sign-in")).toHaveCount(0);
});
