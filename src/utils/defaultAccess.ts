import { Payload } from "payload";
import { Access } from "payload/types";
import { TenancyOptions } from "../options";
import { getAuthorizedTenants } from "./getAuthorizedTenants";
import { RequestWithTenant } from "./requestWithTenant";

/**
 * By default, the collection requires user to be logged in and to belong to an
 * authorized tenant.
 *
 * @returns Default access for all collections.
 */
export const createDefaultAccess =
  ({
    options,
    payload,
  }: {
    options: TenancyOptions;
    payload: Payload;
  }): Access =>
  async ({ req }) =>
    // User must be logged in and have assigned tenant.
    Boolean(req.user?.tenant) &&
    (!["path", "domain"].includes(options.isolationStrategy) ||
      // If isolation strategy is "path" or "domain" user must have access to
      // the requested tenant.
      (
        await getAuthorizedTenants({
          options,
          payload,
          tenantId: req.user.tenant.id || req.user.tenant,
        })
      ).includes((req as RequestWithTenant).tenant.id));
