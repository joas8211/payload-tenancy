import { Config } from "payload/config";
import { Field, FieldAccess } from "payload/types";
import { TenancyOptions } from "../options";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";

/**
 * Limits tenant slug field access to users that are on root tenant or tenant
 * above the accessed tenant.
 */
const createAccess =
  (options: TenancyOptions): FieldAccess =>
  async ({ doc, req: { payload, user } }) => {
    // Allow tenant creation with slug.
    if (!doc) return true;

    // Tenant without parent is the root tenant and can modify it's own slug.
    if (!doc.parent) return true;

    // doc.parent can be either tenant document or it's ID.
    const parentTenantId = doc.parent.id || doc.parent;

    // Allow access to users that belong to accessed tenant's ancestor.
    const authorizedTenants = await getAuthorizedTenants({
      options,
      payload,
      tenantId: user.tenant.id,
    });
    return authorizedTenants.includes(parentTenantId);
  };

/** @returns Slug field for tenants. */
export const createTenantSlugField = ({
  options,
}: {
  options: TenancyOptions;
  config: Config;
}): Field => ({
  type: "text",
  name: "slug",
  unique: true,
  required: true,
  access: {
    read: createAccess(options),
    update: createAccess(options),
  },
});
