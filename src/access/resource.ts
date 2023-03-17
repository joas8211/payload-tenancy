import { Access, Config } from "payload/config";
import { TenancyOptions } from "../options";
import { limitAccess } from "../utils/limitAccess";
import { createDefaultAccess } from "../utils/defaultAccess";
import { RequestWithTenant } from "../utils/requestWithTenant";

/**
 * Limits resource access to resources that belong to the same tenant based on
 * user's tenant ("user" strategy) or requested tenant ("path" or "domain"
 * strategy).
 *
 * @returns Collection access control for generic resources
 */
export const createResourceReadAccess =
  ({
    options,
    original,
  }: {
    options: TenancyOptions;
    config: Config;
    /**
     * Original access control to take into account.
     */
    original?: Access;
  }): Access =>
  async (args) => {
    if (!original) {
      original = createDefaultAccess({ options, payload: args.req.payload });
    }

    return ["path", "domain"].includes(options.isolationStrategy)
      ? // Limit requested tenant.
        limitAccess(await original(args), {
          tenant: {
            equals: (args.req as RequestWithTenant).tenant.id,
          },
        })
      : // User must be logged in and have assigned tenant.
        Boolean(args.req.user?.tenant) &&
          // Limit access to users's tenant.
          limitAccess(await original(args), {
            tenant: {
              equals: args.req.user.tenant.id,
            },
          });
  };

/**
 * Limits resource creation to users with tenant.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for generic resources
 */
export const createResourceCreateAccess =
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
