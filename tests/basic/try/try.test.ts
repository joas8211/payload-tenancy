import { baseUrl, initPayload } from "../../utils";

let closeServer: () => Promise<void>;

beforeEach(async () => {
  closeServer = await initPayload(__dirname + "/..");
  await page.goto(`${baseUrl}/admin`);
});

afterEach(async () => {
  await closeServer();
});

it.skip("try", async () => {
  await page.screenshot({ path: "test.png" });
});
