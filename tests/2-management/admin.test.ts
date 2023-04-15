import { createAdminHelper } from "../helpers/admin";
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
    await jestPuppeteer.resetPage();
  });

  test("root user can add users for root tenant", async () => {
    const admin = createAdminHelper();
    await createSecondRootUser(admin);
    expect(page.url()).toMatch(/\/users\/[0-9a-f]+$/);
  });

  test("root user can create sub-tenants", async () => {
    const admin = createAdminHelper();
    await createSecondLevelTenant(admin);
    expect(page.url()).toMatch(/\/tenants\/[0-9a-f]+$/);
  });

  test("root user can create users for sub-tenants", async () => {
    const admin = createAdminHelper();
    await createFirstSecondLevelUser(admin);
    expect(page.url()).toMatch(/\/users\/[0-9a-f]+$/);
  });

  test("root user can create sub-tenants below sub-tenants", async () => {
    const admin = createAdminHelper();
    await createThirdLevelTenant(admin);
    expect(page.url()).toMatch(/\/tenants\/[0-9a-f]+$/);
  });

  test("sub-tenant user can create users for it's own tenant", async () => {
    const admin = createAdminHelper();
    await createSecondSecondLevelUser(admin);
    expect(page.url()).toMatch(/\/users\/[0-9a-f]+$/);
  });

  test("sub-tenant user can create users under it's sub-tenants", async () => {
    const admin = createAdminHelper();
    await createFirstThirdLevelUser(admin);
    expect(page.url()).toMatch(/\/users\/[0-9a-f]+$/);
  });

  test("sub-tenant user can create sub-tenants under it's own tenant", async () => {
    const admin = createAdminHelper();
    await createFourthLevelTenant(admin);
    expect(page.url()).toMatch(/\/tenants\/[0-9a-f]+$/);
  });

  test("sub-tenant user can delete it's sub-tenants", async () => {
    const admin = createAdminHelper();
    await deleteFifthLevelTenant(admin);
    // TODO
  });

  test("sub-tenant user can delete users under it's own tenant", async () => {
    const admin = createAdminHelper();
    await deleteFirstSecondLevelUser(admin);
    // TODO
  });

  test("root user can delete sub-tenants that still has users and sub-tenants", async () => {
    const admin = createAdminHelper();
    await deleteSecondLevelTenant(admin);
    // TODO
  });

  test("root user can delete other root users", async () => {
    const admin = createAdminHelper();
    await deleteFirstRootUser(admin);
    // TODO
  });
});
