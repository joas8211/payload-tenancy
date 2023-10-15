import { buildConfig } from "payload/config";
import { tenancy } from "../../../src/plugin";
import { baseConfig } from "../../baseConfig";

export default buildConfig({
  ...baseConfig,
  plugins: [tenancy({ isolationStrategy: "user" })],
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
  ],
  admin: {
    ...baseConfig.admin,
    user: "users",
  },
});
