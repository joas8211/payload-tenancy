import { createAdminHelper } from "../../helpers/admin";
import {
  createRootTenant,
  duplicateRootTenant,
  loadRegistrationPage,
  registerRootUser,
} from "./robot";
import { initPayload } from "../../payload";

describe("initial setup", () => {
  let url: string;
  let reset: () => Promise<void>;
  let close: () => Promise<void>;

  beforeAll(async () => {
    ({ url, close, reset } = await initPayload({ dir: __dirname }));
  });

  beforeEach(async () => {
    await reset();
  });

  afterAll(async () => {
    await close();
  });

  test("tenant field does not show up in user registration", async () => {
    const admin = createAdminHelper({ url });
    await loadRegistrationPage(admin);
    await expect(page.$("#field-tenant")).resolves.toBeNull();
  });

  test("registration succeeds", async () => {
    const admin = createAdminHelper({ url });
    await registerRootUser(admin);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("only user and tenant collection visible after registration", async () => {
    const admin = createAdminHelper({ url });
    await registerRootUser(admin);
    await expect(
      page.$$eval(".dashboard__card-list .card", (cards) =>
        cards.map((card) => card.id),
      ),
    ).resolves.toEqual(expect.arrayContaining(["card-users", "card-tenants"]));
  });

  test("can create root tenant", async () => {
    const admin = createAdminHelper({ url });
    await createRootTenant(admin);
    await expect(page.url()).toMatch(/\/tenants\/[0-9a-f]+$/);
  });

  test("other collections appear after creating root tenant", async () => {
    const admin = createAdminHelper({ url });
    await createRootTenant(admin);
    await page.click("#nav-toggler");
    await expect(page.$("#nav-posts")).resolves.not.toBeNull();
  });

  test("cannot duplicate root tenant", async () => {
    const admin = createAdminHelper({ url });
    await expect(duplicateRootTenant(admin)).rejects.toThrow(
      "No element found for selector: #action-duplicate",
    );
  });
});
