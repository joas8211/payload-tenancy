import { rootUser } from "../credentials";
import { wait } from "../utils";

export type State =
  | "registrationPageLoaded"
  | "dashboardLoaded"
  | "rootTenantCreated";

export const runUntil = async (wantedState: State) => {
  await page.goto(`${payloadUrl}/admin`);
  await page.waitForSelector("#field-email");
  if (wantedState === "registrationPageLoaded") return;

  await page.waitForSelector("#field-email");
  await page.type("#field-email", rootUser.email);
  await page.type("#field-password", rootUser.password);
  await page.type("#field-confirm-password", rootUser.password);
  await wait(500);
  await page.click("[type=submit]");
  await page.waitForNetworkIdle();
  if (wantedState === "dashboardLoaded") return;

  await page.goto(`${payloadUrl}/admin/collections/tenants/create`);
  await page.waitForNetworkIdle();
  await page.type("#field-slug", "root");
  await page.click("#field-domains .array-field__add-button-wrap button");
  await page.waitForSelector("#field-domains__0__domain");
  await page.type("#field-domains__0__domain", "root.local");
  await page.click("#action-save");
  await page.waitForNetworkIdle();
  if (wantedState === "rootTenantCreated") return;
};
