import { rootTenant } from "./data";

describe("path isolation", () => {
  test("local API can create and find multiple files with correct URLs", async () => {
    const createFile = async ({
      filename,
      content,
      tenantId,
    }: {
      filename: string;
      content: string;
      tenantId: string;
    }) => {
      const buffer = Buffer.from(content);
      const file = await payload.create({
        collection: "media",
        data: {
          tenant: tenantId,
        },
        file: {
          data: buffer,
          mimetype: "text/plain",
          name: filename,
          size: buffer.byteLength,
        },
      });
      return file;
    };

    const {
      docs: [rootTenantDoc],
    } = await payload.find({
      collection: "tenants",
      where: { slug: { equals: rootTenant.slug } },
    });

    await expect(
      createFile({
        filename: "file1.txt",
        content: "content1",
        tenantId: rootTenantDoc.id,
      }),
    ).resolves.not.toBeFalsy();

    await expect(
      createFile({
        filename: "file2.txt",
        content: "content2",
        tenantId: rootTenantDoc.id,
      }),
    ).resolves.not.toBeFalsy();

    await expect(
      payload.find({
        collection: "media",
        where: { tenant: rootTenantDoc.id },
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        docs: expect.arrayContaining([
          expect.objectContaining({
            filename: expect.stringContaining("file1"),
            url: expect.stringMatching(/^\/root\/media\/file1/),
          }),
          expect.objectContaining({
            filename: expect.stringContaining("file2"),
            url: expect.stringMatching(/^\/root\/media\/file2/),
          }),
        ]),
      }),
    );
  });
});
