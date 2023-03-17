import { buildConfig } from "payload/config";

export default buildConfig({
  collections: [
    {
      slug: "users",
      auth: true,
      fields: [],
    },
  ],
  admin: {
    user: "users",
  },
});
