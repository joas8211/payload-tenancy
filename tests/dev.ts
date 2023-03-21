/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./types.d.ts" />
import { initPayload } from "./utils";
import { join, resolve } from "path";
import puppeteer from "puppeteer";

if (process.argv.length < 3 || process.argv.length > 4) {
  console.error(
    "This script requires arguments to be test folder name containing Payload" +
      " config (eg. '1-setup'), and optionally wanted robot state" +
      " (eg. 'registrationPageLoaded')."
  );
  process.exit(1);
}

(async () => {
  const dir = resolve(process.argv[2]);
  const { url } = await initPayload(join(dir, "payload.config.ts"));
  Object.assign(global, { payloadUrl: url });

  const browser = await puppeteer.launch({
    devtools: true,
    defaultViewport: { width: 0, height: 0 },
  });
  const [page] = await browser.pages();
  Object.assign(global, { page });

  const wantedState = process.argv[3];
  if (wantedState) {
    try {
      const { runUntil } = await import(join(dir, "robot.ts"));
      runUntil(wantedState);
    } catch (error) {
      console.error(error);
    }
  } else {
    await page.goto(`${url}/admin`);
  }
})();
