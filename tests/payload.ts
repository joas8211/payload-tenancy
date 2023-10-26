import express from "express";
import payload from "payload";
import { Server } from "http";

export const initPayload = async (configPath: string) => {
  // Pass some configuration through environment variables.
  process.env.NODE_ENV = "test";
  process.env.PAYLOAD_CONFIG_PATH = configPath;

  // Initialize Payload.
  const app = express();
  const instance = await payload.init({
    secret: "dev",
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
    instance,
    url: "http://" + address,
    reset: async () => {
      await payload.db.destroy(payload);
      await payload.db.connect(payload);
      await payload.config.onInit(payload);
    },
    close: async () => {
      console.log("close");
      await new Promise<void>((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      });
      await payload.db.destroy(payload);
    },
  };
};
