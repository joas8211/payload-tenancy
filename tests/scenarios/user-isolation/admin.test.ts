import payload from "payload";
import { createAdminHelper } from "../../helpers/admin";
import { firstRootUser, rootTenant } from "./data";
import { initPayload } from "../../payload";

describe("user isolation", () => {
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

    const admin = createAdminHelper({ url });
    await admin.login(firstRootUser);
    const fileUrl = file.url as string;
    const response = await page.goto(
      fileUrl.startsWith("/") ? url + fileUrl : fileUrl,
    );
    const body = await response.text();
    expect(body).toBe("content");
  });
});
