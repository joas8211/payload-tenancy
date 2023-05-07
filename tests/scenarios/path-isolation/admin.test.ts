import { createAdminHelper } from "../../helpers/admin";
import {
  firstRootUser,
  firstSecondLevelUser,
  rootTenant,
  secondLevelTenant,
  secondLevelTenantWithSpecialCharacters,
} from "./data";

describe("path isolation", () => {
  beforeEach(async () => {
    await payloadReset();
  });

  test("root user can login to root tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${encodeURIComponent(rootTenant.slug)}`,
    });
    await admin.login(firstRootUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("second level user can login to second level tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${encodeURIComponent(secondLevelTenant.slug)}`,
    });
    await admin.login(firstSecondLevelUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("root user can login to second level tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${encodeURIComponent(secondLevelTenant.slug)}`,
    });
    await admin.login(firstRootUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("second level user cannot login to root tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${encodeURIComponent(rootTenant.slug)}`,
    });
    await admin.login(firstSecondLevelUser);
    await expect(page.$(".dashboard")).resolves.toBeNull();
  });

  // This test won't pass.
  // Tracked here: https://github.com/joas8211/payload-tenancy/issues/12
  test.skip("root user can login to tenant that has slug with special characters", async () => {
    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${encodeURIComponent(
        secondLevelTenantWithSpecialCharacters.slug
      )}`,
    });
    await admin.login(firstRootUser);
    await expect(page.$(".dashboard")).resolves.toBeNull();
  });
});
