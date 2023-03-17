import express from "express";
import { join } from "path";
import payload from "payload";
import { rootUser } from "./credentials";

export const baseUrl = "http://localhost:3000";

export const initPayload = async (
  dir: string
): Promise<() => Promise<void>> => {
  // Pass some configuration through environment variables.
  process.env.PAYLOAD_CONFIG_PATH = join(dir, "payload.config.ts");

  // Initialize Payload.
  const app = express();
  await payload.init({
    secret: "dev",
    mongoURL: "mongodb://localhost",
    express: app,
  });
  const server = app.listen(3000);

  // Register root user.
  await page.goto(`${baseUrl}/admin`);
  await page.waitForSelector("#field-email");
  await page.type("#field-email", rootUser.email);
  await page.type("#field-password", rootUser.password);
  await page.type("#field-confirm-password", rootUser.password);
  await page.click("[type=submit]");
  await page.waitForNetworkIdle();

  // Return server closer.
  return () =>
    new Promise((resolve) => {
      server.close(() => resolve());
      server.closeAllConnections();
    });
};
