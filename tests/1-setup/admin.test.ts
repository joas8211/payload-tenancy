import { rootTenant } from "./data";
import { loadDashboard, loadRegistrationPage, registerRootUser } from "./robot";

describe("setup", () => {
  beforeEach(async () => {
    await payloadReset();
  });

  test("tenant field does not show up in user registration", async () => {
    await loadRegistrationPage();
    await expect(page.$("#field-tenant")).resolves.toBeNull();
  });

  test("registration succeeds", async () => {
    await registerRootUser();
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("only tenant collection visible after registration", async () => {
    await registerRootUser();
    await expect(
      page.$$eval(".dashboard__card-list .card", (cards) =>
        cards.map((card) => card.id)
      )
    ).resolves.toEqual(["card-tenants"]);
  });

  test("can create root tenant", async () => {
    await loadDashboard();
    await createTenant(rootTenant);
    await expect(page.url()).toMatch(/\/tenants\/[0-9a-f]+$/);
  });

  test("other collections appear after creating root tenant", async () => {
    await loadDashboard();
    await createTenant(rootTenant);
    await expect(page.$("#nav-users")).resolves.not.toBeNull();
  });
});
