import { initPayload } from "./payload";
import { join, resolve } from "path";
import puppeteer from "puppeteer";
import { createAdminHelper } from "./helpers/admin";

if (process.argv.length < 3 || process.argv.length > 4) {
  console.error(
    "This script requires arguments to be test folder name containing Payload" +
      " config (eg. '1-setup'), and optionally robot function" +
      " (eg. 'loadDashboard').",
  );
  process.exit(1);
}

(async () => {
  const dir = resolve(process.argv[2]);
  const { url, reset } = await initPayload({ dir });
  await reset();
  console.log("Running on", url);

  const helper = createAdminHelper({ url });
  const func = process.argv[3];
  if (func) {
    const browser = await puppeteer.launch({
      devtools: true,
      defaultViewport: { width: 0, height: 0 },
    });
    const [page] = await browser.pages();
    Object.assign(global, { page });

    try {
      const robot = await import(join(dir, "robot.ts"));
      await robot[func](helper);
    } catch (error) {
      console.error(error);
    }
  }
})();
