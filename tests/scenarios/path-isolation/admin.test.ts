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

  test("root user can download root tenant file", async () => {
    const {
      docs: [rootTenantDoc],
    } = await payload.find({
      collection: "tenants",
      where: { slug: { equals: rootTenant.slug } },
    });
    const buffer = Buffer.from("content");
    const file = await payload.create({
      collection: "media",
      data: {
        tenant: rootTenantDoc.id,
      },
      file: {
        data: buffer,
        mimetype: "text/plain",
        name: "file.txt",
        size: buffer.byteLength,
      },
    });

    const admin = createAdminHelper({
      baseUrl: `${payloadUrl}/${encodeURIComponent(rootTenant.slug)}`,
    });
    await admin.login(firstRootUser);
    const response = await page.goto(payloadUrl + file.url);
    const body = await response.text();
    expect(body).toBe("content");
  });
});
