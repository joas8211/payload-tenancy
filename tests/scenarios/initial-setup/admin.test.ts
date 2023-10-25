import { createAdminHelper } from "../../helpers/admin";
import {
  createRootTenant,
  duplicateRootTenant,
  loadRegistrationPage,
  registerRootUser,
} from "./robot";

describe("initial setup", () => {
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

  test("only user and tenant collection visible after registration", async () => {
    await registerRootUser();
    await expect(
      page.$$eval(".dashboard__card-list .card", (cards) =>
        cards.map((card) => card.id),
      ),
    ).resolves.toEqual(expect.arrayContaining(["card-users", "card-tenants"]));
  });

  test("can create root tenant", async () => {
    const admin = createAdminHelper();
    await createRootTenant(admin);
    await expect(page.url()).toMatch(/\/tenants\/[0-9a-f]+$/);
  });

  test("other collections appear after creating root tenant", async () => {
    const admin = createAdminHelper();
    await createRootTenant(admin);
    await page.click("#nav-toggler");
    await expect(page.$("#nav-posts")).resolves.not.toBeNull();
  });

  test("cannot duplicate root tenant", async () => {
    await expect(duplicateRootTenant()).rejects.toThrowError(
      "Node is either not clickable or not an Element",
    );
  });
});
