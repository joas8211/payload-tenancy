import { buildConfig } from "payload/config";
import { tenancy } from "../../../src/plugin";
import {
  rootTenant,
  firstRootUser,
  secondLevelTenant,
  firstSecondLevelUser,
} from "./data";
import { createBaseConfig } from "../../baseConfig";

const baseConfig = createBaseConfig();

export default buildConfig({
  ...baseConfig,
  plugins: [tenancy({ isolationStrategy: "path" })],
  collections: [
    {
      slug: "users",
      auth: true,
      fields: [],
    },
    {
      slug: "tenants",
      fields: [],
    },
    {
      slug: "media",
      upload: { staticDir: "../../../uploads" },
      fields: [],
    },
  ],
  admin: {
    ...baseConfig.admin,
    user: "users",
  },
  onInit: async (payload) => {
    const rootTenantDoc = await payload.create({
      collection: "tenants",
      data: {
        slug: rootTenant.slug,
        domains: rootTenant.domains.map((domain) => ({ domain })),
      },
    });
    const secondLevelTenantDoc = await payload.create({
      collection: "tenants",
      data: {
        slug: secondLevelTenant.slug,
        domains: secondLevelTenant.domains.map((domain) => ({ domain })),
        parent: rootTenantDoc.id,
      },
    });
    // await payload.create({
    //   collection: "tenants",
    //   data: {
    //     slug: secondLevelTenantWithSpecialCharacters.slug,
    //     domains: secondLevelTenantWithSpecialCharacters.domains.map(
    //       (domain) => ({ domain })
    //     ),
    //     parent: rootTenantDoc.id,
    //   },
    // });
    await payload.create({
      collection: "users",
      data: {
        email: firstRootUser.email,
        password: firstRootUser.password,
        tenant: rootTenantDoc.id,
      },
    });
    await payload.create({
      collection: "users",
      data: {
        email: firstSecondLevelUser.email,
        password: firstSecondLevelUser.password,
        tenant: secondLevelTenantDoc.id,
      },
    });
  },
});
