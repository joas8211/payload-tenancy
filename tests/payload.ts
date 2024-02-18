import express from "express";
import payload from "payload";
import { Server } from "http";
import { PostgresAdapter } from "@payloadcms/db-postgres/dist/types";
import { sql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { dirname, join } from "path";
import { stat } from "fs/promises";
import { MongooseAdapter } from "@payloadcms/db-mongodb";

const findClosestFile = async (
  dir: string,
  filename: string,
  rootDir: string,
) => {
  while (
    await stat(join(dir, filename))
      .then((stats) => !stats.isFile())
      .catch(() => true)
  ) {
    dir = dirname(dir);
    if (!dir || dir === "/" || dir === rootDir) {
      throw new Error(`Could not find ${filename} close to directory ${dir}`);
    }
  }
  return join(dir, filename);
};

export const initPayload = async ({
  dir,
  local = false,
}: {
  dir: string;
  local?: boolean;
}) => {
  const configPath = await findClosestFile(
    dir,
    "payload.config.ts",
    dirname(require.main.filename),
  );

  // Pass some configuration through environment variables.
  process.env.NODE_ENV = "test";
  process.env.PAYLOAD_CONFIG_PATH = configPath;
  process.env.PAYLOAD_DROP_DATABASE = process.env.POSTGRES_URI
    ? "true"
    : "false";

  // Initialize Payload.
  const app = express();
  const instance = await payload.init({
    secret: randomUUID(),
    express: app,
    disableOnInit: true,
    local,
  });

  // Start server.
  const host = process.env.PAYLOAD_HOST ?? "127.0.0.1";
  const port = parseInt(process.env.PAYLOAD_PORT ?? "0");
  const server = await new Promise<Server>((resolve) => {
    const server = app.listen(port, host, () => resolve(server));
  });

  // Find out the server address.
  let address = server.address();
  if (!address) throw new Error("Could not determine the server address");
  if (typeof address === "object") {
    address = address.address + ":" + address.port;
  }

  return {
    instance,
    url: "http://" + address,
    reset: async () => {
      if (instance.db.name === "mongoose") {
        const db = instance.db as unknown as MongooseAdapter;
        await db.connection.dropDatabase();
        await Promise.all(
          Object.values(db.collections).map((collection) =>
            collection.createIndexes(),
          ),
        );
      } else if (instance.db.name === "postgres") {
        const db = instance.db as unknown as PostgresAdapter;
        const { schema } = db.drizzle._;
        await db.drizzle.transaction((transaction) =>
          Promise.all(
            Object.values(schema)
              .map((table: { dbName: string }) =>
                sql.raw(`DELETE FROM ${table.dbName}`),
              )
              .map((query) => transaction.execute(query)),
          ),
        );
      }
      await instance.config.onInit(instance);
    },
    close: async () => {
      await new Promise<void>((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      });
      await instance.db.destroy(instance);
    },
  };
};
