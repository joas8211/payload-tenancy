import { Tenant, User } from "../../helpers/common";

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

export const secondLevelTenantWithSpecialCharacters: Tenant = {
  slug: "second / 100% special",
  domains: ["second-special.root.local"],
  parent: rootTenant.slug,
};
