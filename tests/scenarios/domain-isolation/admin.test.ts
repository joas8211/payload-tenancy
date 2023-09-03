import { createAdminHelper } from "../../helpers/admin";
import {
  firstRootUser,
  firstSecondLevelUser,
  rootTenant,
  secondLevelTenant,
} from "./data";
import http from "http";

describe("domain isolation", () => {
  const domains = [...rootTenant.domains, ...secondLevelTenant.domains];

  beforeAll(async () => {
    // Setup proxy.
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const originalUrl = new URL(request.url());
      const targetUrl = new URL(payloadUrl);
      if (!domains.includes(originalUrl.host)) {
        return request.continue();
      }
      if (originalUrl.pathname === "/__webpack_hmr") {
        return request.abort();
      }
      return new Promise<void>((resolve, reject) => {
        const proxyRequest = http.request(
          originalUrl,
          {
            hostname: targetUrl.hostname,
            port: targetUrl.port,
            method: request.method(),
            headers: { ...request.headers(), Host: originalUrl.hostname },
          },
          (response) => {
            const data: Buffer[] = [];
            response.on("data", (buf) => {
              data.push(buf);
            });
            response.on("end", () => {
              const body = Buffer.concat(data);
              request
                .respond({
                  status: response.statusCode,
                  headers: response.headers,
                  body,
                })
                .then(() => resolve())
                .catch((err) => reject(err));
            });
          }
        );
        proxyRequest.on("error", (err) => {
          request.abort();
          reject(err);
        });
        proxyRequest.end(request.postData());
      });
    });
  });

  beforeEach(async () => {
    await payloadReset();
  });

  test("root user can login to root tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `http://${rootTenant.domains[0]}`,
    });
    await admin.login(firstRootUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("second level user can login to second level tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `http://${secondLevelTenant.domains[0]}`,
    });
    await admin.login(firstSecondLevelUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("root user can login to second level tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `http://${secondLevelTenant.domains[0]}`,
    });
    await admin.login(firstRootUser);
    await expect(page.$(".dashboard")).resolves.not.toBeNull();
  });

  test("second level user cannot login to root tenant", async () => {
    const admin = createAdminHelper({
      baseUrl: `http://${rootTenant.domains[0]}`,
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
      baseUrl: `http://${rootTenant.domains[0]}`,
    });
    await admin.login(firstRootUser);
    const response = await page.goto(
      file.url.startsWith("/")
        ? `http://${rootTenant.domains[0]}${file.url}`
        : file.url
    );
    const body = await response.text();
    expect(body).toBe("content");
  });
});
