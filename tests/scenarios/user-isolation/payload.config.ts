import { buildConfig } from "payload/config";
import { tenancy } from "../../../src/plugin";
import { firstRootUser, rootTenant } from "./data";
import { createBaseConfig } from "../../baseConfig";

const baseConfig = createBaseConfig();

export default buildConfig({
  ...baseConfig,
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
    await payload.create({
      collection: "users",
      data: {
        email: firstRootUser.email,
        password: firstRootUser.password,
        tenant: rootTenantDoc.id,
      },
    });
  },
});
