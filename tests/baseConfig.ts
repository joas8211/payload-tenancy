import { Config } from "payload/config";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { slateEditor } from "@payloadcms/richtext-slate";
import { webpackBundler } from "@payloadcms/bundler-webpack";

export const baseConfig: Config = {
  db: process.env.POSTGRES_URI
    ? postgresAdapter({ pool: { connectionString: process.env.POSTGRES_URI } })
    : mongooseAdapter({ url: "mongodb://localhost" }),
  editor: slateEditor({}),
  admin: {
    bundler: webpackBundler(),
    webpack: (config) => ({
      ...config,
      cache: { type: "memory" },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          ["@payloadcms/db-mongodb"]: __dirname + "/mocks/db-mongodb.ts",
          ["@payloadcms/db-postgres"]: __dirname + "/mocks/db-postgres.ts",
        },
      },
    }),
  },
};
