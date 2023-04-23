import { createAdminHelper } from "../../helpers/admin";
import { wait } from "../../helpers/common";
import { firstRootUser } from "./data";

const admin = createAdminHelper();

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

export const loadDashboard = async () => {
  await payload.create({
    collection: "users",
    data: { email: firstRootUser.email, password: firstRootUser.password },
  });
  await admin.login(firstRootUser);
};
