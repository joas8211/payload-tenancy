import { Access, Config } from "payload/config";
import { TenancyOptions } from "../options";
import { createDefaultAccess } from "../utils/defaultAccess";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";
import { limitAccess } from "../utils/limitAccess";
import { RequestWithTenant } from "../utils/requestWithTenant";

/**
 * Limits user access to users that belong to the same or above tenant.
 *
 * @returns Collection access control for users
 */
export const createUserReadAccess =
  ({
    options,
    /**
     * Original access control to take into account.
     */
    original,
  }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
  }): Access =>
  async (args) => {
    if (!original) {
      original = createDefaultAccess({ options, payload: args.req.payload });
    }

    return ["path", "domain"].includes(options.isolationStrategy)
      ? // Limit requested tenant or its sub-tenants.
        limitAccess(await original(args), {
          tenant: {
            in: await getAuthorizedTenants({
              options,
              payload: args.req.payload,
              tenantId: (args.req as RequestWithTenant).tenant.id,
            }),
          },
        })
      : // User must be logged in and have assigned tenant.
        Boolean(args.req.user?.tenant) &&
          // Limit access to users's tenant or its sub-tenants.
          limitAccess(await original(args), {
            tenant: {
              in: await getAuthorizedTenants({
                options,
                payload: args.req.payload,
                tenantId: args.req.user.tenant.id,
              }),
            },
          });
  };

/**
 * Limits user creation to users with tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for users
 */
export const createUserCreateAccess =
  ({
    options,
    original,
  }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
  }): Access =>
  (args) => {
    if (!original) {
      original = createDefaultAccess({ options, payload: args.req.payload });
    }

    return ["path", "domain"].includes(options.isolationStrategy)
      ? original(args)
      : // User must be logged in and have assigned tenant.
        Boolean(args.req.user?.tenant) && original(args);
  };
