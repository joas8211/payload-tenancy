import { Post, Tenant, User } from "../../helpers/common";

export const rootTenant: Tenant = {
  slug: "root",
  domains: ["root.local"],
};

export const firstRootUser: User = {
  email: "first.user@root.local",
  password: "test",
  tenant: rootTenant.slug,
};

export const secondRootUser: User = {
  email: "second.user@root.local",
  password: "test",
  tenant: rootTenant.slug,
};

export const thirdRootUser: User = {
  email: "third.user@root.local",
  password: "test",
  tenant: rootTenant.slug,
};

export const firstRootPost: Post = {
  title: "First Root Post",
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

export const secondSecondLevelUser: User = {
  email: "second.user@second.root.local",
  password: "test",
  tenant: secondLevelTenant.slug,
};

export const thirdSecondLevelUser: User = {
  email: "third.user@second.root.local",
  password: "test",
  tenant: secondLevelTenant.slug,
};

export const firstSecondLevelPost: Post = {
  title: "First Second Level Post",
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

export const fourthLevelTenant: Tenant = {
  slug: "fourth",
  domains: ["fourth.third.second.root.local"],
  parent: thirdLevelTenant.slug,
};

export const fifthLevelTenant: Tenant = {
  slug: "fifth",
  domains: ["fifth.fourth.third.second.root.local"],
  parent: fourthLevelTenant.slug,
};

export const secondSecondLevelTenant: Tenant = {
  slug: "second-second",
  domains: ["second-second.root.local"],
  parent: rootTenant.slug,
};

export const secondThirdLevelTenant: Tenant = {
  slug: "second-third",
  domains: ["second-third.second.root.local"],
  parent: secondLevelTenant.slug,
};
