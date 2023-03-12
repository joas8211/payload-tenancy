import { Config } from "payload/config";
import { RequestWithTenant } from "../utils/requestWithTenant";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";
import { TenancyOptions } from "../options";

/**
 * Limits access to admin UI based on if the path matches user's tenant when
 * isolation strategy is set to "path".
 *
 * @returns Collection access control for admin UI
 */
export const createAdminAccess =
  ({
    options,
    original,
  }: {
    options: TenancyOptions;
    config: Config;
    /**
     * Original access control to take into account.
     */
    original?: (args: unknown) => boolean | Promise<boolean>;
  }) =>
  async (args): Promise<boolean> => {
    if (["path", "domain"].includes(options.isolationStrategy)) {
      const req = args.req as RequestWithTenant;
      const authorizedTenants = await getAuthorizedTenants({
        options,
        payload: req.payload,
        tenantId: req.user.tenant.id || req.user.tenant,
      });
      if (!authorizedTenants.includes(req.tenant.id)) {
        return false;
      }
    }

    if (original) {
      return original(args);
    }

    return true;
  };
