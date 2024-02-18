import payload from "payload";
import { createAdminHelper } from "../../helpers/admin";
import { initPayload } from "../../payload";
import {
  firstRootUser,
  firstSecondLevelUser,
  rootTenant,
  secondLevelTenant,
} from "./data";
import http from "http";

describe("domain isolation", () => {
  let url: string;
  let reset: () => Promise<void>;
  let close: () => Promise<void>;
  const domains = [...rootTenant.domains, ...secondLevelTenant.domains];

  beforeAll(async () => {
    ({ url, close, reset } = await initPayload({ dir: __dirname }));

    // Setup proxy.
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (request.isInterceptResolutionHandled()) return;
      const originalUrl = new URL(request.url());
      const targetUrl = new URL(url);
      if (!domains.includes(originalUrl.host)) {
        return request.continue();
      }
      if (originalUrl.pathname === "/__webpack_hmr") {
        return request.abort();
      }
      return new Promise<void>((resolve) => {
        const proxyRequest = http.request(originalUrl, {
          hostname: targetUrl.hostname,
          port: targetUrl.port,
          method: request.method(),
          headers: { ...request.headers(), Host: originalUrl.hostname },
        });
        proxyRequest.on("response", (response) => {
          const data: Buffer[] = [];
          response.on("data", (buf) => {
            data.push(buf);
          });
          response.on("end", () => {
            if (request.isInterceptResolutionHandled()) return resolve();
            const body = Buffer.concat(data);
            resolve(
              request.respond({
                status: response.statusCode,
                headers: response.headers,
                body,
              }),
            );
          });
        });
        proxyRequest.on("error", (err) => {
          if (request.isInterceptResolutionHandled()) return resolve();
          resolve(
            request.abort("failed").then(() => {
              throw err;
            }),
          );
        });
        if (request.hasPostData()) {
          proxyRequest.write(request.postData());
        }
        proxyRequest.end();
      });
    });
  });

  beforeEach(async () => {
    await reset();
  });

  afterAll(async () => {
    await page.waitForNetworkIdle();
    await page.setRequestInterception(false);
    page.off("request");
    await close();
  });

  test("root user can login to root tenant", async () => {
    const admin = createAdminHelper({
      url: `http://${rootTenant.domains[0]}`,
    });
    await admin.login(firstRootUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("second level user can login to second level tenant", async () => {
    const admin = createAdminHelper({
      url: `http://${secondLevelTenant.domains[0]}`,
    });
    await admin.login(firstSecondLevelUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("root user can login to second level tenant", async () => {
    const admin = createAdminHelper({
      url: `http://${secondLevelTenant.domains[0]}`,
    });
    await admin.login(firstRootUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("second level user cannot login to root tenant", async () => {
    const admin = createAdminHelper({
      url: `http://${rootTenant.domains[0]}`,
    });
    await admin.login(firstSecondLevelUser);
    await expect(page.$(".dashboard")).resolves.toBeNull();
  });

  test("root user can download root tenant file", async () => {
    const {
      docs: [rootTenantDoc],
    } = await payload.find({
      collection: "tenants",
      where: { slug: { equals: rootTenant.slug } },
    });
    const buffer = Buffer.from("content");
    const file = await payload.create({
      collection: "media",
      data: {
        tenant: rootTenantDoc.id,
      },
      file: {
        data: buffer,
        mimetype: "text/plain",
        name: "file.txt",
        size: buffer.byteLength,
      },
    });

    const admin = createAdminHelper({
      url: `http://${rootTenant.domains[0]}`,
    });
    await admin.login(firstRootUser);
    const url = file.url as string;
    const response = await page.goto(
      url.startsWith("/") ? `http://${rootTenant.domains[0]}${url}` : url,
    );
    const body = await response.text();
    expect(body).toBe("content");
  });
});
