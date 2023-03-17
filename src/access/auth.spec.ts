import { Config } from "payload/config";
import { TenancyOptions } from "../options";
import { createAdminAccess } from "./auth";

jest.mock("../utils/getAuthorizedTenants", () => ({
  getAuthorizedTenants: jest.fn(() => Promise.resolve(["TENANT_1"])),
}));

describe("Auth Collection Access", () => {
  describe("Admin UI Access", () => {
    it("does not limit access when 'user' strategy is active", async () => {
      const adminAccess = createAdminAccess({
        options: { isolationStrategy: "user" } as TenancyOptions,
        config: {} as Config,
      });

      await expect(
        adminAccess({
          req: {
            user: { tenant: { id: "TENANT_1" } },
          },
        })
      ).resolves.toBe(true);

      await expect(
        adminAccess({
          req: {
            user: { tenant: { id: "TENANT_2" } },
          },
        })
      ).resolves.toBe(true);
    });

    it.each(["path", "domain"])(
      "limits access to only authorized tenants when '%s' strategy is active",
      async (isolationStrategy) => {
        const adminAccess = createAdminAccess({
          options: { isolationStrategy } as TenancyOptions,
          config: {} as Config,
        });

        await expect(
          adminAccess({
            req: {
              user: { tenant: { id: "TENANT_1" } },
              tenant: { id: "TENANT_1" },
            },
          })
        ).resolves.toBe(true);

        await expect(
          adminAccess({
            req: {
              user: { tenant: { id: "TENANT_1" } },
              tenant: { id: "TENANT_2" },
            },
          })
        ).resolves.toBe(false);
      }
    );

    it.each(["user", "path", "domain"])(
      "returns the original access when tenant is authorized on '%s' strategy",
      async (isolationStrategy) => {
        const originalReturn = {};
        const adminAccess = createAdminAccess({
          options: { isolationStrategy } as TenancyOptions,
          config: {} as Config,
          original: () => originalReturn as boolean | Promise<boolean>,
        });

        await expect(
          adminAccess({
            req: {
              user: { tenant: { id: "TENANT_1" } },
              tenant: { id: "TENANT_1" },
            },
          })
        ).resolves.toBe(originalReturn);
      }
    );
  });
});
