import { createLocalHelper } from "../helpers/local";
import {
  fifthLevelTenant,
  firstRootUser,
  firstSecondLevelUser,
  firstThirdLevelUser,
  fourthLevelTenant,
  secondLevelTenant,
  secondSecondLevelUser,
  thirdLevelTenant,
} from "./data";
import {
  createFirstSecondLevelUser,
  createFirstThirdLevelUser,
  createFourthLevelTenant,
  createSecondLevelTenant,
  createSecondRootUser,
  createSecondSecondLevelUser,
  createThirdLevelTenant,
  deleteFifthLevelTenant,
  deleteFirstRootUser,
  deleteFirstSecondLevelUser,
  deleteSecondLevelTenant,
} from "./robot";

describe("management", () => {
  beforeEach(async () => {
    await payloadReset();
  });

  test("root user can add users for root tenant", async () => {
    const local = createLocalHelper();
    await createSecondRootUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstRootUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create sub-tenants", async () => {
    const local = createLocalHelper();
    await createSecondLevelTenant(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: secondLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create users for sub-tenants", async () => {
    const local = createLocalHelper();
    await createFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstSecondLevelUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("root user can create sub-tenants below sub-tenants", async () => {
    const local = createLocalHelper();
    await createThirdLevelTenant(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: thirdLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can create users under it's sub-tenants", async () => {
    const local = createLocalHelper();
    await createFirstThirdLevelUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstThirdLevelUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can create users for it's own tenant", async () => {
    const local = createLocalHelper();
    await createSecondSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: secondSecondLevelUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can create sub-tenants under it's own tenant", async () => {
    const local = createLocalHelper();
    await createFourthLevelTenant(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: fourthLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 1 }));
  });

  test("sub-tenant user can delete it's sub-tenants", async () => {
    const local = createLocalHelper();
    await deleteFifthLevelTenant(local);
    await expect(
      payload.find({
        collection: "tenants",
        where: { slug: { equals: fifthLevelTenant.slug } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("sub-tenant user can delete users under it's own tenant", async () => {
    const local = createLocalHelper();
    await deleteFirstSecondLevelUser(local);
    await expect(
      payload.find({
        collection: "users",
        where: { email: { equals: firstSecondLevelUser.email } },
      })
    ).resolves.toEqual(expect.objectContaining({ totalDocs: 0 }));
  });

  test("root user can delete sub-tenants that still has users and sub-tenants", async () => {
    const local = createLocalHelper();
    await deleteSecondLevelTenant(local);
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
    await deleteFirstRootUser(local);
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
