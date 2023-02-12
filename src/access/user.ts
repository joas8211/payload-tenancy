import { Access, Config } from "payload/config";
import { TenancyOptions } from "../options";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";
import { limitAccess } from "../utils/limitAccess";

/**
 * Limits user access to users that belong to the same or above tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for users
 */
export const createUserReadAccess =
  ({
    options,
    original,
  }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
  }): Access =>
  async (args) =>
    // User must be logged in and have assigned tenant.
    Boolean(args.req.user?.tenant) &&
    // Limit access to users's tenant or its sub-tenants.
    limitAccess((await original?.(args)) ?? true, {
      tenant: {
        in: await getAuthorizedTenants({
          options,
          payload: args.req.payload,
          tenantId: args.req.user.tenant.id,
        }),
      },
    });

/**
 * Limits user creation to users with tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for users
 */
export const createUserCreateAccess =
  ({
    original,
  }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
  }): Access =>
  (args) =>
    // User must be logged in and have assigned tenant.
    (Boolean(args.req.user?.tenant) && original?.(args)) ?? true;
