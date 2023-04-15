import { Helper } from "../helpers/common";
import { createLocalHelper } from "../helpers/local";
import {
  fifthLevelTenant,
  firstRootUser,
  firstSecondLevelUser,
  firstThirdLevelUser,
  fourthLevelTenant,
  secondLevelTenant,
  secondRootUser,
  secondSecondLevelUser,
  thirdLevelTenant,
} from "./data";

export const createSecondRootUser = async (helper: Helper) => {
  await helper.login(firstRootUser);
  await helper.createUser(secondRootUser);
};

export const createSecondLevelTenant = async (helper: Helper) => {
  const local = createLocalHelper();
  await createSecondRootUser(local);
  await helper.login(firstRootUser);
  await helper.createTenant(secondLevelTenant);
};

export const createFirstSecondLevelUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await createSecondLevelTenant(local);
  await helper.login(firstRootUser);
  await helper.createUser(firstSecondLevelUser);
};

export const createThirdLevelTenant = async (helper: Helper) => {
  const local = createLocalHelper();
  await createFirstSecondLevelUser(local);
  await helper.login(firstRootUser);
  await helper.createTenant(thirdLevelTenant);
};

export const createFirstThirdLevelUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await createThirdLevelTenant(local);
  await helper.login(firstRootUser);
  await helper.createUser(firstThirdLevelUser);
};

export const createSecondSecondLevelUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await createFirstThirdLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createUser(secondSecondLevelUser);
};

export const createFourthLevelTenant = async (helper: Helper) => {
  const local = createLocalHelper();
  await createSecondSecondLevelUser(local);
  await helper.login(firstSecondLevelUser);
  await helper.createTenant(fourthLevelTenant);
};

export const createFifthLevelTenant = async (helper: Helper) => {
  const local = createLocalHelper();
  await createFourthLevelTenant(local);
  await helper.login(firstThirdLevelUser);
  await helper.createTenant(fifthLevelTenant);
};

export const deleteFifthLevelTenant = async (helper: Helper) => {
  const local = createLocalHelper();
  await createFifthLevelTenant(local);
  await helper.login(firstThirdLevelUser);
  await helper.deleteTenant(fifthLevelTenant);
};

export const deleteFirstSecondLevelUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await deleteFifthLevelTenant(local);
  await helper.login(secondSecondLevelUser);
  await helper.deleteUser(firstSecondLevelUser);
};

export const deleteSecondLevelTenant = async (helper: Helper) => {
  const local = createLocalHelper();
  await deleteFirstSecondLevelUser(local);
  await helper.login(secondRootUser);
  await helper.deleteTenant(secondLevelTenant);
};

export const deleteFirstRootUser = async (helper: Helper) => {
  const local = createLocalHelper();
  await deleteSecondLevelTenant(local);
  await helper.login(secondRootUser);
  await helper.deleteUser(firstRootUser);
};
