import { Helper, wait } from "../../helpers/common";
import { firstRootUser, rootTenant } from "./data";
import { createLocalHelper } from "../../helpers/local";
import { createAdminHelper } from "../../helpers/admin";

export const loadRegistrationPage = async () => {
  await page.goto(`${payloadUrl}/admin`);
  await page.waitForSelector("#field-email");
};

export const registerRootUser = async () => {
  await loadRegistrationPage();
  await page.type("#field-email", firstRootUser.email);
  await page.type("#field-password", firstRootUser.password);
  await page.type("#field-confirm-password", firstRootUser.password);
  await wait(500);
  await page.click("[type=submit]");
  await page.waitForNetworkIdle();
};

export const createRootTenant = async (helper: Helper) => {
  await payload.create({
    collection: "users",
    data: { email: firstRootUser.email, password: firstRootUser.password },
  });
  await helper.login(firstRootUser);
  await helper.createTenant(rootTenant);
};

export const duplicateRootTenant = async () => {
  const local = createLocalHelper();
  await createRootTenant(local);

  const admin = createAdminHelper();
  await admin.login(firstRootUser);
  const {
    docs: [tenant],
  } = await payload.find({
    collection: "tenants",
    where: { slug: { equals: rootTenant.slug } },
  });
  await page.goto(`${payloadUrl}/admin/collections/tenants/${tenant.id}`);
  await page.waitForNetworkIdle();
  await page.click("#action-duplicate");
  await page.waitForNetworkIdle();
};
