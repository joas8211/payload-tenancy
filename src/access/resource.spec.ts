import { Access, Config } from "payload/config";
import { PayloadRequest } from "payload/types";
import { TenancyOptions } from "../options";
import { limitAccess } from "../utils/limitAccess";
import { createResourceReadAccess } from "./resource";

jest.mock("../utils/limitAccess", () => ({
  limitAccess: jest.fn((_original, limit) => limit),
}));

describe("Resouce Collection Access", () => {
  describe("Read Access", () => {
    it("limits access to resources that belong to the same tenant as user when strategy 'user' is active", async () => {
      const resourceReadAccess = createResourceReadAccess({
        options: { isolationStrategy: "user" } as TenancyOptions,
        config: {} as Config,
        original: () => true,
      });

      await expect(
        resourceReadAccess({
          req: { user: { tenant: { id: "TENANT_1" } } },
        } as Parameters<Access>[0])
      ).resolves.toEqual({ tenant: { equals: "TENANT_1" } });

      await expect(
        resourceReadAccess({
          req: { user: { tenant: { id: "TENANT_2" } } },
        } as Parameters<Access>[0])
      ).resolves.toEqual({ tenant: { equals: "TENANT_2" } });
    });

    it.each(["path", "domain"])(
      "limits access to resources that belong to the requested tenant when strategy '%s' is active",
      async (isolationStrategy) => {
        const resourceReadAccess = createResourceReadAccess({
          options: { isolationStrategy } as TenancyOptions,
          config: {} as Config,
          original: () => true,
        });

        await expect(
          resourceReadAccess({
            req: {
              user: { tenant: { id: "TENANT_1" } },
              tenant: { id: "TENANT_1" },
            } as unknown as PayloadRequest,
          } as Parameters<Access>[0])
        ).resolves.toEqual({ tenant: { equals: "TENANT_1" } });

        await expect(
          resourceReadAccess({
            req: {
              user: { tenant: { id: "TENANT_1" } },
              tenant: { id: "TENANT_2" },
            } as unknown as PayloadRequest,
          } as Parameters<Access>[0])
        ).resolves.toEqual({ tenant: { equals: "TENANT_2" } });
      }
    );

    it.each(["user", "path", "domain"])(
      "limits the original access when strategy '%s' is active",
      async (isolationStrategy) => {
        const originalReturn = {};
        const resourceReadAccess = createResourceReadAccess({
          options: { isolationStrategy } as TenancyOptions,
          config: {} as Config,
          original: () => originalReturn,
        });

        await resourceReadAccess({
          req: {
            user: { tenant: { id: "TENANT_1" } },
            tenant: { id: "TENANT_1" },
          } as unknown as PayloadRequest,
        } as Parameters<Access>[0]);
        expect(limitAccess).toHaveBeenLastCalledWith(originalReturn, {
          tenant: { equals: "TENANT_1" },
        });
      }
    );
  });
});
