import { Payload } from "payload";

/**
 * @param payload Payload instance
 * @param tenantId The tenant who's authorization to list
 * @returns All tenant IDs that the tenant has access to. Output will be the
 *          inputted tenant ID and all sub-tenant IDs.
 */
export const getAuthorizedTenants = async (
  payload: Payload,
  tenantId: string
): Promise<string[]> => {
  return [
    tenantId,
    ...(
      await Promise.all(
        (
          await payload.find({
            collection: "tenants",
            where: { parent: { equals: tenantId } },
          })
        ).docs.map((tenant) => getAuthorizedTenants(payload, tenant.id))
      )
    ).flat(),
  ];
};
