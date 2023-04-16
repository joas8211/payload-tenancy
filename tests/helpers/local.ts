import { Helper, Tenant, User } from "./common";

export const createLocalHelper = (): Helper => {
  let loggedInUser: unknown;
  return {
    login: async (user: User) => {
      ({
        docs: [loggedInUser],
      } = await payload.find({
        collection: "users",
        where: { email: { equals: user.email } },
      }));
    },
    logout: async () => {
      loggedInUser = undefined;
    },
    createUser: async (user: User) => {
      const {
        docs: [{ id: tenant }],
      } = await payload.find({
        collection: "tenants",
        where: { slug: { equals: user.tenant } },
      });
      await payload.create({
        collection: "users",
        data: { email: user.email, password: user.password, tenant },
        user: loggedInUser,
        overrideAccess: false,
      });
    },
    createTenant: async (tenant: Tenant) => {
      let parent: string | undefined;
      if (tenant.parent) {
        ({
          docs: [{ id: parent }],
        } = await payload.find({
          collection: "tenants",
          where: { slug: { equals: tenant.parent } },
        }));
      }
      await payload.create({
        collection: "tenants",
        data: {
          slug: tenant.slug,
          domains: tenant.domains.map((domain) => ({ domain })),
          parent,
        },
        user: loggedInUser,
        overrideAccess: false,
      });
    },
    deleteUser: async (user: User) => {
      await payload.delete({
        collection: "users",
        where: { email: { equals: user.email } },
        user: loggedInUser,
        overrideAccess: false,
      });
    },
    deleteTenant: async (tenant: Tenant) => {
      await payload.delete({
        collection: "tenants",
        where: { slug: { equals: tenant.slug } },
        user: loggedInUser,
        overrideAccess: false,
      });
    },
  };
};
