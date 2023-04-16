import { createLocalHelper } from "../helpers/local";
import {
  fifthLevelTenant,
  firstRootUser,
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
  deleteSecondLevelTenantAsFirstThirdLevelUser,
  deleteSecondLevelTenantAsSecondRootUser,
  deleteSecondRootUserAsFirstSecondLevelUser,
  deleteSecondSecondLevelUserAsFirstThirdLevelUser,
} from "./robot";

describe("management", () => {
  beforeEach(async () => {
    await payloadReset();
  });

  test("root user can add users for root tenant", async () => {
    const local = createLocalHelper();
    await createSecondRootUserAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstRootUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user cannot delete root tenant", async () => {
    const local = createLocalHelper();
    await expect(deleteRootTenantAsFirstRootUser(local)).rejects.toThrow();
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: rootTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create sub-tenants", async () => {
    const local = createLocalHelper();
    await createSecondLevelTenantAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create users for sub-tenants", async () => {
    const local = createLocalHelper();
    await createFirstSecondLevelUserAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstSecondLevelUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create sub-tenants below sub-tenants", async () => {
    const local = createLocalHelper();
    await createThirdLevelTenantAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: thirdLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can create users under it's sub-tenants", async () => {
    const local = createLocalHelper();
    await createFirstThirdLevelUserAsFirstRootUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstThirdLevelUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can create users for it's own tenant", async () => {
    const local = createLocalHelper();
    await createSecondSecondLevelUserAsFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: secondSecondLevelUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user cannot create users for root tenant", async () => {
    const local = createLocalHelper();
    await expect(
      createThirdRootUserAsFirstSecondLevelUser(local)
    ).rejects.toThrow();
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: thirdRootUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot delete root users", async () => {
    const local = createLocalHelper();
    await expect(
      deleteSecondRootUserAsFirstSecondLevelUser(local)
    ).rejects.toThrow();
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: secondRootUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user cannot delete root tenant", async () => {
    const local = createLocalHelper();
    await expect(
      deleteRootTenantAsFirstSecondLevelUser(local)
    ).rejects.toThrow();
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: rootTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can create sub-tenants under it's own tenant", async () => {
    const local = createLocalHelper();
    await createFourthLevelTenantAsFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: fourthLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can delete it's sub-tenants", async () => {
    const local = createLocalHelper();
    await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: fifthLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot create users to sub-tenants above it's own tenant", async () => {
    const local = createLocalHelper();
    await expect(
      createThirdSecondLevelUserAsFirstThirdLevelUser(local)
    ).rejects.toThrow();
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: thirdSecondLevelUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot delete users from sub-tenants above it's own tenant", async () => {
    const local = createLocalHelper();
    await expect(
      deleteSecondSecondLevelUserAsFirstThirdLevelUser(local)
    ).rejects.toThrow();
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: secondSecondLevelUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user cannot create tenants under sub-tenants above it's own tenant", async () => {
    const local = createLocalHelper();
    await expect(
      createSecondThirdLevelTenantAsFirstThirdLevelUser(local)
    ).rejects.toThrow();
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondThirdLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot delete tenants under sub-tenants above it's own tenant", async () => {
    const local = createLocalHelper();
    await expect(
      deleteSecondLevelTenantAsFirstThirdLevelUser(local)
    ).rejects.toThrow();
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user cannot create sub-tenants under root tenant", async () => {
    const local = createLocalHelper();
    await expect(
      createSecondSecondLevelTenantAsFirstSecondLevelUser(local)
    ).rejects.toThrow();
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondSecondLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user cannot delete their own tenant", async () => {
    const local = createLocalHelper();
    await expect(
      deleteSecondLevelTenantAsSecondRootUser(local)
    ).rejects.toThrow();
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can delete users under it's own tenant", async () => {
    const local = createLocalHelper();
    await deleteFirstSecondLevelUserAsSecondSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstSecondLevelUser.email } },
      })
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
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
    await expect(
      payload.find({
        collection: "users",
        where: {
          email: {
            equals: firstThirdLevelUser.email,
          },
        },
      })
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
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });
});
