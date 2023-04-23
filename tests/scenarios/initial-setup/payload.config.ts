import { buildConfig } from "payload/config";
import { tenancy } from "../../../src/plugin";

export default buildConfig({
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
    user: "users",
  },
});
