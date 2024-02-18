import payload from "payload";
import { User } from "../../helpers/common";
import { createLocalHelper } from "../../helpers/local";
import {
  fifthLevelTenant,
  firstRootPost,
  firstRootUser,
  firstSecondLevelPost,
  firstSecondLevelUser,
  firstThirdLevelUser,
  fourthLevelTenant,
  rootTenant,
  secondLevelTenant,
  secondRootUser,
  secondSecondLevelTenant,
  secondSecondLevelUser,
  secondThirdLevelTenant,
  thirdLevelTenant,
  thirdRootUser,
  thirdSecondLevelUser,
} from "./data";
import {
  createFirstRootPostAsFirstRootUser,
  createFirstSecondLevelPostAsFirstSecondLevelUser,
  createFirstSecondLevelUserAsFirstRootUser,
  createFirstThirdLevelUserAsFirstRootUser,
  createFourthLevelTenantAsFirstSecondLevelUser,
  createSecondLevelTenantAsFirstRootUser,
  createSecondRootUserAsFirstRootUser,
  createSecondSecondLevelTenantAsFirstSecondLevelUser,
  createSecondSecondLevelUserAsFirstSecondLevelUser,
  createSecondThirdLevelTenantAsFirstThirdLevelUser,
  createThirdLevelTenantAsFirstRootUser,
  createThirdRootUserAsFirstSecondLevelUser,
  createThirdSecondLevelUserAsFirstThirdLevelUser,
  deleteFifthLevelTenantAsFirstThirdLevelUser,
  deleteFirstRootUserAsSecondRootUser,
  deleteFirstSecondLevelUserAsSecondSecondLevelUser,
  deleteRootTenantAsFirstRootUser,
  deleteRootTenantAsFirstSecondLevelUser,
  deleteSecondLevelTenantAsFirstSecondLevelUser,
  deleteSecondLevelTenantAsFirstThirdLevelUser,
  deleteSecondLevelTenantAsSecondRootUser,
  deleteSecondRootUserAsFirstSecondLevelUser,
  deleteSecondSecondLevelUserAsFirstThirdLevelUser,
} from "./robot";
import { initPayload } from "../../payload";

const getUserDocument = async (user: User) => {
  return (
    await payload.find({
      collection: "users",
      where: { email: { equals: user.email } },
    })
  ).docs[0];
};

describe("user access", () => {
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

  test("root user can add users for root tenant", async () => {
    const local = createLocalHelper();
    await createSecondRootUserAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstRootUser.email } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user cannot delete root tenant", async () => {
    const local = createLocalHelper();
    await deleteRootTenantAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: rootTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create sub-tenants", async () => {
    const local = createLocalHelper();
    await createSecondLevelTenantAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondLevelTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create users for sub-tenants", async () => {
    const local = createLocalHelper();
    await createFirstSecondLevelUserAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstSecondLevelUser.email } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create sub-tenants below sub-tenants", async () => {
    const local = createLocalHelper();
    await createThirdLevelTenantAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: thirdLevelTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create users under sub-tenant's sub-tenants", async () => {
    const local = createLocalHelper();
    await createFirstThirdLevelUserAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstThirdLevelUser.email } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create posts", async () => {
    const local = createLocalHelper();
    await createFirstRootPostAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "posts",
        where: { title: { equals: firstRootPost.title } },
        user: await getUserDocument(firstRootUser),
        overrideAccess: false,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        totalDocs: 1,
      }),
    );
  });

  test("sub-tenant user cannot see root tenant posts", async () => {
    const local = createLocalHelper();
    await createFirstRootPostAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "posts",
        where: { title: { equals: firstRootPost.title } },
        user: await getUserDocument(firstSecondLevelUser),
        overrideAccess: false,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        totalDocs: 0,
      }),
    );
  });

  test("sub-tenant user can create users for it's own tenant", async () => {
    const local = createLocalHelper();
    await createSecondSecondLevelUserAsFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: secondSecondLevelUser.email } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can create posts", async () => {
    const local = createLocalHelper();
    await createFirstSecondLevelPostAsFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "posts",
        where: { title: { equals: firstSecondLevelPost.title } },
        user: await getUserDocument(firstSecondLevelUser),
        overrideAccess: false,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        totalDocs: 1,
      }),
    );
  });

  test("root user cannot see sub-tenant's posts", async () => {
    const local = createLocalHelper();
    await createFirstSecondLevelPostAsFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "posts",
        where: { title: { equals: firstSecondLevelPost.title } },
        user: await getUserDocument(firstRootUser),
        overrideAccess: false,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        totalDocs: 0,
      }),
    );
  });

  test("sub-tenant user cannot create users for root tenant", async () => {
    const local = createLocalHelper();
    await createThirdRootUserAsFirstSecondLevelUser(local).catch(() => {
      // We don't want error to be thrown.
    });
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: thirdRootUser.email } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot delete root users", async () => {
    const local = createLocalHelper();
    await deleteSecondRootUserAsFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: secondRootUser.email } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user cannot delete root tenant", async () => {
    const local = createLocalHelper();
    await deleteRootTenantAsFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: rootTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can create sub-tenants under it's own tenant", async () => {
    const local = createLocalHelper();
    await createFourthLevelTenantAsFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: fourthLevelTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can delete it's sub-tenants", async () => {
    const local = createLocalHelper();
    await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: fifthLevelTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot create users to sub-tenant above it's own tenant", async () => {
    const local = createLocalHelper();
    await createThirdSecondLevelUserAsFirstThirdLevelUser(local).catch(() => {
      // We don't want error to be thrown.
    });
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: thirdSecondLevelUser.email } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot delete users from sub-tenant above it's own tenant", async () => {
    const local = createLocalHelper();
    await deleteSecondSecondLevelUserAsFirstThirdLevelUser(local).catch(() => {
      // We don't want error to be thrown.
    });
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: secondSecondLevelUser.email } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user cannot create tenants under sub-tenant above it's own tenant", async () => {
    const local = createLocalHelper();
    await createSecondThirdLevelTenantAsFirstThirdLevelUser(local).catch(() => {
      // We don't want error to be thrown.
    });
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondThirdLevelTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot delete tenants under sub-tenant above it's own tenant", async () => {
    const local = createLocalHelper();
    await deleteSecondLevelTenantAsFirstThirdLevelUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondLevelTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user cannot create sub-tenants under root tenant", async () => {
    const local = createLocalHelper();
    await createSecondSecondLevelTenantAsFirstSecondLevelUser(local).catch(
      () => {
        // We don't want error to be thrown.
      },
    );
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondSecondLevelTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot delete their own tenant", async () => {
    const local = createLocalHelper();
    await deleteSecondLevelTenantAsFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondLevelTenant.slug } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can delete users under it's own tenant", async () => {
    const local = createLocalHelper();
    await deleteFirstSecondLevelUserAsSecondSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstSecondLevelUser.email } },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("root user can delete sub-tenants that still has users and sub-tenants", async () => {
    const local = createLocalHelper();
    await deleteSecondLevelTenantAsSecondRootUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: {
          slug: {
            in: [
              secondLevelTenant.slug,
              thirdLevelTenant.slug,
              fourthLevelTenant.slug,
            ],
          },
        },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
    await expect(
      payload.find({
        collection: "users",
        where: {
          email: {
            equals: firstThirdLevelUser.email,
          },
        },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("root user can delete other root users", async () => {
    const local = createLocalHelper();
    await deleteFirstRootUserAsSecondRootUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: {
          email: {
            equals: firstRootUser.email,
          },
        },
      }),
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });
});
