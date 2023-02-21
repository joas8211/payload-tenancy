import { Payload } from "payload";
import { TenancyOptions } from "../options";

/**
 * @returns All tenant IDs that the tenant has access to. Output will be the
 *          inputted tenant ID and all sub-tenant IDs.
 */
export const getAuthorizedTenants = async ({
  options,
  payload,
  tenantId,
}: {
  options: TenancyOptions;
  payload: Payload;
  /**
   * The tenant who's authorization to list
   */
  tenantId: string;
}): Promise<string[]> => {
  if (!tenantId) return [];
  return [
    tenantId,
    ...(
      await Promise.all(
        (
          await payload.find({
            collection: options.tenantCollection,
            where: { parent: { equals: tenantId } },
          })
        ).docs.map((tenant) =>
          getAuthorizedTenants({
            options,
            payload,
            tenantId: tenant.id,
          })
        )
      )
    ).flat(),
  ];
};
