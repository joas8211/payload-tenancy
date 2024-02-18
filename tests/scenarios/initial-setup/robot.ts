import { Helper, wait } from "../../helpers/common";
import { firstRootUser, rootTenant } from "./data";
import { createLocalHelper } from "../../helpers/local";
import payload from "payload";

export const loadRegistrationPage = async (helper: Helper) => {
  await page.goto(`${helper.url}/admin`);
  await page.waitForSelector("#field-email");
};

export const registerRootUser = async (helper: Helper) => {
  await loadRegistrationPage(helper);
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

export const duplicateRootTenant = async (helper: Helper) => {
  const local = createLocalHelper();
  await createRootTenant(local);

  await helper.login(firstRootUser);
  const {
    docs: [tenant],
  } = await payload.find({
    collection: "tenants",
    where: { slug: { equals: rootTenant.slug } },
  });
  await page.goto(`${helper.url}/admin/collections/tenants/${tenant.id}`);
  await page.waitForNetworkIdle();
  await page.click(".popup");
  await page.click("#action-duplicate");
  await page.waitForNetworkIdle();
};
