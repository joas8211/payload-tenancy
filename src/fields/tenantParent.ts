import { Document, Field, FieldAccess, Validate } from "payload/types";
import { getAuthorizedTenants } from "../utils/getAuthorizedTenants";

/**
 * Limits parent field access to users that are on tenant above the accessed
 * tenant.
 */
const canAccess: FieldAccess = async ({ doc, req: { payload, user } }) => {
  // When there's no tenants yet, there's no need to access parent field.
  const someTenantExist =
    payload &&
    (await payload.find({ collection: "tenants", limit: 0 })).totalDocs > 0;
  if (!someTenantExist) return false;

  // Allow tenant creation with parent.
  if (!doc) return true;

  // Tenant without parent is the root tenant and it cannot have a parent.
  if (!doc.parent) return false;

  // doc.parent can be either tenant document or it's ID.
  const parentTenantId = doc.parent.id || doc.parent;

  // Allow access to users that belong to accessed tenant's ancestor.
  const authorizedTenants = await getAuthorizedTenants(payload, user.tenant.id);
  return authorizedTenants.includes(parentTenantId);
};

const validate: Validate = async (value, { payload, id, user }) => {
  if (id && value === id) return "Cannot relate to itself";

  // Skip the following validations on front-end.
  if (!payload) return true;

  // When creating initial tenant (root), it's supposed to not have a parent.
  const someTenantExist =
    (await payload.find({ collection: "tenants", limit: 0 })).totalDocs > 0;
  if (!id && !someTenantExist) return true;

  if (id) {
    const original = await payload.findByID({
      collection: "tenants",
      id,
    });

    // If tenant already exists and is a root tenant, do not allow assigning
    // parent.
    if (original && !original.parent) {
      if (value) {
        return "Cannot assign parent to root tenant";
      }

      return true;
    }
  }

  // At this point, the tenant must not be a root tenant. Check that it has a
  // parent.
  if (!value) {
    return "Required";
  }

  // At this stage if user has no tenant, user has already created the root
  // tenant and is trying to create another tenant, but somehow the tenant is
  // not assigned to the user.
  if (!user.tenant) {
    return "Active user is missing tenant";
  }

  // Check that the selected parent is some tenant that user has access to.
  const authorizedTenants = await getAuthorizedTenants(
    payload,
    (user as Document).tenant.id
  );
  if (!authorizedTenants.includes(value)) return "Unauthorized";

  // All good :)
  return true;
};

/**
 * @returns Parent field for tenants.
 */
export const createTenantParentField = (): Field => ({
  type: "relationship",
  name: "parent",
  relationTo: "tenants",
  required: true,
  filterOptions: ({ id }) => ({ id: { not_equals: id } }),
  validate,
  access: {
    read: canAccess,
    update: canAccess,
  },
});
