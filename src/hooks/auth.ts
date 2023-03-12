import { Config } from "payload/config";
import { CollectionBeforeLoginHook } from "payload/types";
import { RequestWithTenant } from "../utils/requestWithTenant";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";
import { TenancyOptions } from "../options";

/**
 * Restrict login to only authorized tenants if isolation strategy is set to
 * "path".
 *
 * @returns
 */
export const createRestrictLogin =
  ({
    options,
  }: {
    options: TenancyOptions;
    config: Config;
  }): CollectionBeforeLoginHook =>
  async (args) => {
    if (["path", "domain"].includes(options.isolationStrategy)) {
      const { user } = args;
      const req = args.req as RequestWithTenant;
      const authorizedTenants = await getAuthorizedTenants({
        options,
        payload: req.payload,
        tenantId: user.tenant,
      });
      if (!authorizedTenants.includes(req.tenant.id)) {
        throw new Error("Unauthorized tenant");
      }
    }
  };
