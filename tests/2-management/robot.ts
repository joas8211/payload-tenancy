import { Helper } from "../helpers/common";
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

export const createSecondRootUserAsFirstRootUser = async (helper: Helper) => {
  await helper.login(firstRootUser);
  await helper.createUser(secondRootUser);
};

export const deleteRootTenantAsFirstRootUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await createSecondRootUserAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.deleteTenant(rootTenant);
};

export const createSecondLevelTenantAsFirstRootUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createSecondRootUserAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.createTenant(secondLevelTenant);
};

export const createFirstSecondLevelUserAsFirstRootUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createSecondLevelTenantAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.createUser(firstSecondLevelUser);
};

export const createThirdLevelTenantAsFirstRootUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await createFirstSecondLevelUserAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.createTenant(thirdLevelTenant);
};

export const createFirstThirdLevelUserAsFirstRootUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createThirdLevelTenantAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.createUser(firstThirdLevelUser);
};

export const createSecondSecondLevelUserAsFirstSecondLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createFirstThirdLevelUserAsFirstRootUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createUser(secondSecondLevelUser);
};

export const createThirdRootUserAsFirstSecondLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createSecondSecondLevelUserAsFirstSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createUser(thirdRootUser);
};

export const deleteSecondRootUserAsFirstSecondLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createSecondSecondLevelUserAsFirstSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.deleteUser(secondRootUser);
};

export const deleteRootTenantAsFirstSecondLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createSecondSecondLevelUserAsFirstSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.deleteTenant(rootTenant);
};

export const createFourthLevelTenantAsFirstSecondLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createSecondSecondLevelUserAsFirstSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createTenant(fourthLevelTenant);
};

export const createFifthLevelTenantAsFirstThirdLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createFourthLevelTenantAsFirstSecondLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.createTenant(fifthLevelTenant);
};

export const deleteFifthLevelTenantAsFirstThirdLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await createFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.deleteTenant(fifthLevelTenant);
};

export const createThirdSecondLevelUserAsFirstThirdLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.createUser(thirdSecondLevelUser);
};

export const deleteSecondSecondLevelUserAsFirstThirdLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.deleteUser(secondSecondLevelUser);
};

export const createSecondThirdLevelTenantAsFirstThirdLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.createTenant(secondThirdLevelTenant);
};

export const deleteSecondLevelTenantAsFirstThirdLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.deleteTenant(secondLevelTenant);
};

export const createSecondSecondLevelTenantAsFirstSecondLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createTenant(secondSecondLevelTenant);
};

export const deleteSecondLevelTenantAsFirstSecondLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.deleteTenant(secondLevelTenant);
};

export const deleteFirstSecondLevelUserAsSecondSecondLevelUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(secondSecondLevelUser);
  await helper.deleteUser(firstSecondLevelUser);
};

export const deleteSecondLevelTenantAsSecondRootUser = async (
  helper: Helper
) => {
  const local = createLocalHelper();
  await deleteFirstSecondLevelUserAsSecondSecondLevelUser(local);
  await helper.login(secondRootUser);
  await helper.deleteTenant(secondLevelTenant);
};

export const deleteFirstRootUserAsSecondRootUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await deleteSecondLevelTenantAsSecondRootUser(local);
  await helper.login(secondRootUser);
  await helper.deleteUser(firstRootUser);
};
