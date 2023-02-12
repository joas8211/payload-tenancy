import { Access } from "payload/config";
import { limitAccess } from "../utils/limitAccess";

/**
 * Limits resource access to users that belong to the same tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for generic resources
 */
export const createResourceReadAccess =
  (original?: Access): Access =>
  async (args) =>
    // User must be logged in and have assigned tenant.
    Boolean(args.req.user?.tenant) &&
    // Limit access to users's tenant.
    limitAccess((await original?.(args)) ?? true, {
      tenant: {
        equals: args.req.user.tenant.id,
      },
    });

/**
 * Limits resource creation to users with tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for generic resources
 */
export const createResourceCreateAccess =
  (original?: Access): Access =>
  (args) =>
    // User must be logged in and have assigned tenant.
    (Boolean(args.req.user?.tenant) && original?.(args)) ?? true;
