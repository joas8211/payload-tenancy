import { createAdminHelper } from "../../helpers/admin";
import { firstRootUser, rootTenant } from "./data";

describe("user isolation", () => {
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

    const admin = createAdminHelper();
    await admin.login(firstRootUser);
    const url = file.url as string;
    const response = await page.goto(
      url.startsWith("/") ? payloadUrl + url : url,
    );
    const body = await response.text();
    expect(body).toBe("content");
  });
});
