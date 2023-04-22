import { Tenant, User } from "../helpers/common";

export const rootTenant: Tenant = {
  slug: "root",
  domains: ["root.local"],
};

export const firstRootUser: User = {
  email: "first.user@root.local",
  password: "test",
  tenant: rootTenant.slug,
};

export const secondLevelTenant: Tenant = {
  slug: "second",
  domains: ["second.root.local"],
  parent: rootTenant.slug,
};

export const firstSecondLevelUser: User = {
  email: "first.user@second.root.local",
  password: "test",
  tenant: secondLevelTenant.slug,
};

export const thirdLevelTenant: Tenant = {
  slug: "third",
  domains: ["third.second.root.local"],
  parent: secondLevelTenant.slug,
};

export const firstThirdLevelUser: User = {
  email: "first.user@third.second.root.local",
  password: "test",
  tenant: thirdLevelTenant.slug,
};

export const secondSecondLevelTenant: Tenant = {
  slug: "second-second",
  domains: ["second-second.root.local"],
  parent: rootTenant.slug,
};

export const firstSecondSecondLevelUser: User = {
  email: "first.user@second-second.root.local",
  password: "test",
  tenant: secondSecondLevelTenant.slug,
};

export const secondThirdLevelTenant: Tenant = {
  slug: "second-third",
  domains: ["second-third.second.root.local"],
  parent: secondLevelTenant.slug,
};

export const firstSecondThirdLevelUser: User = {
  email: "first.user@second-third.second.root.local",
  password: "test",
  tenant: secondThirdLevelTenant.slug,
};
