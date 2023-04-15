/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="./types.d.ts" />
import { initPayload } from "./payload";
import { join, resolve } from "path";
import puppeteer from "puppeteer";
import { createAdminHelper } from "./helpers/admin";

if (process.argv.length < 3 || process.argv.length > 4) {
  console.error(
    "This script requires arguments to be test folder name containing Payload" +
      " config (eg. '1-setup'), and optionally robot function" +
      " (eg. 'loadDashboard')."
  );
  process.exit(1);
}

(async () => {
  const dir = resolve(process.argv[2]);
  const { instance, url } = await initPayload(join(dir, "payload.config.ts"));
  Object.assign(global, { payload: instance, payloadUrl: url });

  const browser = await puppeteer.launch({
    devtools: true,
    defaultViewport: { width: 0, height: 0 },
  });
  const [page] = await browser.pages();
  Object.assign(global, { page });

  const helper = createAdminHelper();
  const func = process.argv[3];
  if (func) {
    try {
      const robot = await import(join(dir, "robot.ts"));
      await robot[func](helper);
    } catch (error) {
      console.error(error);
    }
  } else {
    await page.goto(`${url}/admin`);
  }
})();
