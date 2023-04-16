import { Access, Config } from "payload/config";
import { TenancyOptions } from "../options";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";
import { limitAccess } from "../utils/limitAccess";
import { createDefaultAccess } from "../utils/defaultAccess";
import { RequestWithTenant } from "../utils/requestWithTenant";

/**
 * Limits tenant access to users that belong to the same or above tenant.
 *
 * @returns Collection access control for tenants
 */
export const createTenantReadAccess =
  ({
    options,
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
          id: {
            in: await getAuthorizedTenants({
              options,
              payload: args.req.payload,
              tenantId: (args.req as RequestWithTenant).tenant.id,
            }),
          },
        })
      : // User must be logged in.
        Boolean(args.req.user) &&
          // Initial user doesn't have an assigned tenant during installation
          // process, so it's allowed to access tenants to create one.
          (!args.req.user.tenant ||
            // Limit access to users's tenant or its sub-tenants.
            limitAccess(await original(args), {
              id: {
                in: await getAuthorizedTenants({
                  options,
                  payload: args.req.payload,
                  tenantId: args.req.user.tenant.id,
                }),
              },
            }));
  };

/**
 * Limits deletion of root tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for tenants
 */
export const createTenantDeleteAccess =
  ({
    options,
    config,
    original,
  }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
  }): Access =>
  async (args) => {
    const readAccess = createTenantReadAccess({ options, config, original });

    return (
      // User must be logged in and have assigned tenant.
      Boolean(args.req.user?.tenant) &&
      // Limit access to non-root tenants.
      limitAccess(await readAccess(args), {
        parent: {
          exists: true,
        },
      })
    );
  };
