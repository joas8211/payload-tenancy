import { Access } from "payload/config";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";
import { limitAccess } from "../utils/limitAccess";

/**
 * Limits tenant access to users that belong to the same or above tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for tenants
 */
export const createTenantReadAccess =
  (original?: Access): Access =>
  async (args) =>
    // User must be logged in.
    Boolean(args.req.user) &&
    // Initial user doesn't have an assigned tenant during installation process,
    // so it's allowed to access tenants to create one.
    (!args.req.user.tenant ||
      // Limit access to users's tenant or its sub-tenants.
      limitAccess((await original?.(args)) ?? true, {
        id: {
          in: await getAuthorizedTenants(
            args.req.payload,
            args.req.user.tenant.id
          ),
        },
      }));

/**
 * Limits deletion of root tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for tenants
 */
export const createTenantDeleteAccess =
  (original?: Access): Access =>
  async (args) =>
    // User must be logged in and have assigned tenant.
    Boolean(args.req.user?.tenant) &&
    // Limit access to non-root tenants.
    limitAccess((await original?.(args)) ?? true, {
      parent: {
        exists: true,
      },
    });
