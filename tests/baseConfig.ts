import { Config } from "payload/config";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { slateEditor } from "@payloadcms/richtext-slate";
import { viteBundler } from "@payloadcms/bundler-vite";
import { webpackBundler } from "@payloadcms/bundler-webpack";

export const createBaseConfig = (): Config => ({
  db: process.env.POSTGRES_URI
    ? postgresAdapter({ pool: { connectionString: process.env.POSTGRES_URI } })
    : mongooseAdapter({ url: "mongodb://127.0.0.1" }),
  editor: slateEditor({}),
  admin: {
    bundler: process.env.BUNDLER === "vite" ? viteBundler() : webpackBundler(),
    vite: (config) => ({
      ...config,
      server: {
        ...config.server,
        hmr: { port: 3001 },
      },
    }),
    webpack: (config) => ({
      ...config,
      entry: "payload/dist/admin",
      cache: false,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@payloadcms/db-mongodb": __dirname + "/mocks/db-mongodb.ts",
          "@payloadcms/db-postgres": __dirname + "/mocks/db-postgres.ts",
          "@payloadcms/bundler-webpack":
            __dirname + "/mocks/bundler-webpack.ts",
          "@payloadcms/bundler-vite": __dirname + "/mocks/bundler-vite.ts",
        },
      },
    }),
  },
});
