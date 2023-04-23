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
