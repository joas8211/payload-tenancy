import { Access } from "payload/config";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";
import { limitAccess } from "../utils/limitAccess";

/**
 * Limits user access to users that belong to the same or above tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for users
 */
export const createUserReadAccess =
  (original?: Access): Access =>
  async (args) =>
    // User must be logged in and have assigned tenant.
    Boolean(args.req.user?.tenant) &&
    // Limit access to users's tenant or its sub-tenants.
    limitAccess((await original?.(args)) ?? true, {
      tenant: {
        in: await getAuthorizedTenants(
          args.req.payload,
          args.req.user.tenant.id
        ),
      },
    });

/**
 * Limits user creation to users with tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for users
 */
export const createUserCreateAccess =
  (original?: Access): Access =>
  (args) =>
    // User must be logged in and have assigned tenant.
    (Boolean(args.req.user?.tenant) && original?.(args)) ?? true;
