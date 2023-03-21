import { runUntil } from "./robot";

describe("setup", () => {
  beforeEach(async () => {
    await payloadReset();
  });

  // TODO: Hide tenant field in user registration.
  test.skip("tenant field does not show up in user registration", async () => {
    await runUntil("registrationPageLoaded");
    await expect(page.$("#field-tenant")).resolves.toBeNull();
  });

  test("registration succeeds", async () => {
    await runUntil("dashboardLoaded");
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("only tenant collection visible after registration", async () => {
    await runUntil("dashboardLoaded");
    await expect(
      page.$$eval(".dashboard__card-list .card", (cards) =>
        cards.map((card) => card.id)
      )
    ).resolves.toEqual(["card-tenants"]);
  });

  test("can create root tenant", async () => {
    await runUntil("rootTenantCreated");
    await expect(page.url()).toMatch(/\/tenants\/[0-9a-f]+$/);
  });

  test("other collections appear after creating root tenant", async () => {
    await runUntil("rootTenantCreated");
    await expect(page.$("#nav-users")).resolves.not.toBeNull();
  });
});
