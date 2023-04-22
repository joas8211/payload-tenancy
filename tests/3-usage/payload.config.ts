import { buildConfig } from "payload/config";
import { tenancy } from "../../src/plugin";
import {
  firstRootUser,
  firstSecondLevelUser,
  firstSecondSecondLevelUser,
  firstSecondThirdLevelUser,
  firstThirdLevelUser,
  rootTenant,
  secondLevelTenant,
  secondSecondLevelTenant,
  secondThirdLevelTenant,
  thirdLevelTenant,
} from "./data";
import { createLocalHelper } from "../helpers/local";

export default buildConfig({
  plugins: [tenancy({ isolationStrategy: "user" })],
  collections: [
    {
      slug: "users",
      auth: true,
      fields: [],
      admin: {
        useAsTitle: "email",
      },
    },
    {
      slug: "tenants",
      fields: [],
      admin: {
        useAsTitle: "slug",
      },
    },
    {
      slug: "pages",
      fields: [
        {
          name: "title",
          type: "text",
        },
      ],
    },
  ],
  admin: {
    user: "users",
  },
  onInit: async (payload) => {
    const local = createLocalHelper({ payload, overrideAccess: true });

    for (const tenant of [
      rootTenant,
      secondLevelTenant,
      thirdLevelTenant,
      secondSecondLevelTenant,
      secondThirdLevelTenant,
    ]) {
      await local.createTenant(tenant);
    }

    for (const user of [
      firstRootUser,
      firstSecondLevelUser,
      firstThirdLevelUser,
      firstSecondSecondLevelUser,
      firstSecondThirdLevelUser,
    ]) {
      await local.createUser(user);
    }
  },
});
