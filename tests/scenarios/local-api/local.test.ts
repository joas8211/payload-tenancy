import payload from "payload";
import { initPayload } from "../../payload";

describe("local api with override access", () => {
  let reset: () => Promise<void>;
  let close: () => Promise<void>;

  beforeAll(async () => {
    ({ close, reset } = await initPayload({ dir: __dirname, local: true }));
  });

  beforeEach(async () => {
    await reset();
  });

  afterAll(async () => {
    await close();
  });

  test("can create, find, update, and delete first user without tenant", async () => {
    await expect(
      payload.create({
        collection: "users",
        data: {
          email: "some.user@root.local",
          password: "test",
        },
      }),
    ).resolves.not.toBeFalsy();
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: "some.user@root.local" } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
    await expect(
      payload.update({
        collection: "users",
        where: { email: { equals: "some.user@root.local" } },
        data: { email: "same.user@root.local" },
      }),
    ).resolves.toEqual(expect.objectContaining({ errors: [] }));
    await expect(
      payload.delete({
        collection: "users",
        where: { email: { equals: "same.user@root.local" } },
      }),
    ).resolves.toEqual(expect.objectContaining({ errors: [] }));
  });

  test("can create, find, update, and delete root tenant", async () => {
    await expect(
      payload.create({
        collection: "tenants",
        data: {
          slug: "root",
          domains: [{ domain: "root.local" }],
        },
      }),
    ).resolves.not.toBeFalsy();
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: "root" } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
    await expect(
      payload.update({
        collection: "tenants",
        where: { slug: { equals: "root" } },
        data: { domains: [{ domain: "root2.local" }] },
      }),
    ).resolves.toEqual(expect.objectContaining({ errors: [] }));
    await expect(
      payload.delete({
        collection: "tenants",
        where: { slug: { equals: "root" } },
      }),
    ).resolves.toEqual(expect.objectContaining({ errors: [] }));
  });

  test("can create, find, update, and delete sub-tenant", async () => {
    const rootTenant = await payload.create({
      collection: "tenants",
      data: {
        slug: "root",
        domains: [{ domain: "root.local" }],
      },
    });
    await expect(
      payload.create({
        collection: "tenants",
        data: {
          slug: "second",
          domains: [{ domain: "second.root.local" }],
          parent: rootTenant.id,
        },
      }),
    ).resolves.not.toBeFalsy();
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: "second" } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
    await expect(
      payload.update({
        collection: "tenants",
        where: { slug: { equals: "second" } },
        data: { domains: [{ domain: "second2.root.local" }] },
      }),
    ).resolves.toEqual(expect.objectContaining({ errors: [] }));
    await expect(
      payload.delete({
        collection: "tenants",
        where: { slug: { equals: "second" } },
      }),
    ).resolves.toEqual(expect.objectContaining({ errors: [] }));
  });

  test("can create, find, update, and delete a post", async () => {
    await expect(
      payload.create({
        collection: "posts",
        data: {
          title: "Welcome",
        },
      }),
    ).resolves.not.toBeFalsy();
    await expect(
      payload.find({
        collection: "posts",
        where: { title: { equals: "Welcome" } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
    await expect(
      payload.update({
        collection: "posts",
        where: { title: { equals: "Welcome" } },
        data: { title: "Welcome again" },
      }),
    ).resolves.toEqual(expect.objectContaining({ errors: [] }));
    await expect(
      payload.delete({
        collection: "posts",
        where: { title: { equals: "Welcome again" } },
      }),
    ).resolves.toEqual(expect.objectContaining({ errors: [] }));
  });
});
