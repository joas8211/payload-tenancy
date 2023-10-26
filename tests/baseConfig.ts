import { Config } from "payload/config";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import { webpackBundler } from "@payloadcms/bundler-webpack";

export const baseConfig: Config = {
  db: mongooseAdapter({ url: "mongodb://localhost" }),
  editor: slateEditor({}),
  admin: {
    bundler: webpackBundler(),
    webpack: (config) => ({ ...config, cache: { type: "memory" } }),
  },
};
