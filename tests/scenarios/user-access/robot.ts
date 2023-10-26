import { Helper } from "../../helpers/common";
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

/** Good */
export const createSecondRootUserAsFirstRootUser = async (helper: Helper) => {
  await helper.login(firstRootUser);
  await helper.createUser(secondRootUser);
};

/** Bad */
export const deleteRootTenantAsFirstRootUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await createSecondRootUserAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.deleteTenant(rootTenant);
};

/** Good */
export const createSecondLevelTenantAsFirstRootUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createSecondRootUserAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.createTenant(secondLevelTenant);
};

/** Good */
export const createFirstSecondLevelUserAsFirstRootUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createSecondLevelTenantAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.createUser(firstSecondLevelUser);
};

/** Good */
export const createThirdLevelTenantAsFirstRootUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await createFirstSecondLevelUserAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.createTenant(thirdLevelTenant);
};

/** Good */
export const createFirstThirdLevelUserAsFirstRootUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createThirdLevelTenantAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.createUser(firstThirdLevelUser);
};

/** Good */
export const createFirstRootPostAsFirstRootUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await createFirstThirdLevelUserAsFirstRootUser(local);
  await helper.login(firstRootUser);
  await helper.createPost(firstRootPost);
};

/** Good */
export const createSecondSecondLevelUserAsFirstSecondLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createFirstRootPostAsFirstRootUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createUser(secondSecondLevelUser);
};

/** Good */
export const createFirstSecondLevelPostAsFirstSecondLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createSecondSecondLevelUserAsFirstSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createPost(firstSecondLevelPost);
};

/** Bad */
export const createThirdRootUserAsFirstSecondLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createFirstSecondLevelPostAsFirstSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createUser(thirdRootUser);
};

/** Bad */
export const deleteSecondRootUserAsFirstSecondLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createFirstSecondLevelPostAsFirstSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.deleteUser(secondRootUser);
};

/** Bad */
export const deleteRootTenantAsFirstSecondLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createFirstSecondLevelPostAsFirstSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.deleteTenant(rootTenant);
};

/** Good */
export const createFourthLevelTenantAsFirstSecondLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createFirstSecondLevelPostAsFirstSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createTenant(fourthLevelTenant);
};

/** Good */
export const createFifthLevelTenantAsFirstThirdLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createFourthLevelTenantAsFirstSecondLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.createTenant(fifthLevelTenant);
};

/** Good */
export const deleteFifthLevelTenantAsFirstThirdLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await createFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.deleteTenant(fifthLevelTenant);
};

/** Bad */
export const createThirdSecondLevelUserAsFirstThirdLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.createUser(thirdSecondLevelUser);
};

/** Bad */
export const deleteSecondSecondLevelUserAsFirstThirdLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.deleteUser(secondSecondLevelUser);
};

/** Bad */
export const createSecondThirdLevelTenantAsFirstThirdLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.createTenant(secondThirdLevelTenant);
};

/** Bad */
export const deleteSecondLevelTenantAsFirstThirdLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstThirdLevelUser);
  await helper.deleteTenant(secondLevelTenant);
};

/** Bad */
export const createSecondSecondLevelTenantAsFirstSecondLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createTenant(secondSecondLevelTenant);
};

/** Bad */
export const deleteSecondLevelTenantAsFirstSecondLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.deleteTenant(secondLevelTenant);
};

/** Bad */
export const deleteFirstSecondLevelUserAsSecondSecondLevelUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(secondSecondLevelUser);
  await helper.deleteUser(firstSecondLevelUser);
};

/** Good */
export const deleteSecondLevelTenantAsSecondRootUser = async (
  helper: Helper,
) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenantAsFirstThirdLevelUser(local);
  await helper.login(secondRootUser);
  await helper.deleteTenant(secondLevelTenant);
};

/** Good */
export const deleteFirstRootUserAsSecondRootUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await deleteSecondLevelTenantAsSecondRootUser(local);
  await helper.login(secondRootUser);
  await helper.deleteUser(firstRootUser);
};
