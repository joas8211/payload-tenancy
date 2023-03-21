import express from "express";
import { dirname, join } from "path";
import payload from "payload";
import { Server } from "http";
import { stat } from "fs/promises";

export const initPayload = async (configPath: string) => {
  // Pass some configuration through environment variables.
  process.env.NODE_ENV = "test";
  process.env.PAYLOAD_CONFIG_PATH = configPath;

  // Initialize Payload.
  const app = express();
  await payload.init({
    secret: "dev",
    mongoURL: "mongodb://localhost",
    express: app,
  });

  // Start server.
  const server = await new Promise<Server>((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
  });

  // Find out the server address.
  let address = server.address();
  if (!address) throw new Error("Could not determine the server address");
  if (typeof address === "object") {
    address = address.address + ":" + address.port;
  }

  return {
    url: "http://" + address,
    reset: async () => {
      for (const collection of Object.keys(payload.collections)) {
        const { docs } = await payload.find({ collection });
        await Promise.all(
          docs.map(({ id }) => payload.delete({ collection, id }))
        );
      }
    },
    close: () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
        server.closeAllConnections();
      }),
  };
};

export const wait = (time?: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), time));

export const findClosestFile = async (
  dir: string,
  filename: string,
  rootDir: string
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
