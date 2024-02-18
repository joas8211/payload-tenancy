import payload, { Payload } from "payload";
import { Helper, Post, Tenant, User } from "./common";

export const createLocalHelper = (
  options: { payload?: Payload; overrideAccess?: boolean } = {},
): Helper => {
  const instance = options.payload || payload;
  let loggedInUser: unknown;
  return {
    url: "",
    login: async (user: User) => {
      ({
        docs: [loggedInUser],
      } = await instance.find({
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
      } = await instance.find({
        collection: "tenants",
        where: { slug: { equals: user.tenant } },
      });
      await instance.create({
        collection: "users",
        data: { email: user.email, password: user.password, tenant },
        user: loggedInUser,
        overrideAccess: Boolean(options.overrideAccess),
      });
    },
    createTenant: async (tenant: Tenant) => {
      let parent: string | number | undefined;
      if (tenant.parent) {
        ({
          docs: [{ id: parent }],
        } = await instance.find({
          collection: "tenants",
          where: { slug: { equals: tenant.parent } },
        }));
      }
      await instance.create({
        collection: "tenants",
        data: {
          slug: tenant.slug,
          domains: tenant.domains.map((domain) => ({ domain })),
          parent,
        },
        user: loggedInUser,
        overrideAccess: Boolean(options.overrideAccess),
      });
    },
    createPost: async (post: Post) => {
      await instance.create({
        collection: "posts",
        data: {
          title: post.title,
        },
        user: loggedInUser,
        overrideAccess: Boolean(options.overrideAccess),
      });
    },
    deleteUser: async (user: User) => {
      await instance.delete({
        collection: "users",
        where: { email: { equals: user.email } },
        user: loggedInUser,
        overrideAccess: Boolean(options.overrideAccess),
      });
    },
    deleteTenant: async (tenant: Tenant) => {
      await instance.delete({
        collection: "tenants",
        where: { slug: { equals: tenant.slug } },
        user: loggedInUser,
        overrideAccess: Boolean(options.overrideAccess),
      });
    },
    deletePost: async (post: Post) => {
      await instance.delete({
        collection: "posts",
        where: { title: { equals: post.title } },
        user: loggedInUser,
        overrideAccess: Boolean(options.overrideAccess),
      });
    },
  };
};
