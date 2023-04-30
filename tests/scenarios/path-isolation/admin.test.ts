import { createAdminHelper } from "../../helpers/admin";
import {
  firstRootUser,
  firstSecondLevelUser,
  rootTenant,
  secondLevelTenant,
} from "./data";

describe("path isolation", () => {
  beforeEach(async () => {
    await payloadReset();
  });

  test("root user can login to root tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${rootTenant.slug}`,
    });
    await admin.login(firstRootUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("second level user can login to second level tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${secondLevelTenant.slug}`,
    });
    await admin.login(firstSecondLevelUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("root user can login to second level tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${secondLevelTenant.slug}`,
    });
    await admin.login(firstRootUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("second level user cannot login to root tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${rootTenant.slug}`,
    });
    await admin.login(firstSecondLevelUser);
    await expect(page.$(".dashboard")).resolves.toBeNull();
  });
});
