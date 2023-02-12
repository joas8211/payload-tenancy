import { Field } from "payload/types";

/**
 * @returns Tenant field for generic resources.
 */
export const createResourceTenantField = (): Field => ({
  type: "relationship",
  name: "tenant",
  relationTo: "tenants",
  hidden: true,
  hooks: {
    beforeChange: [
      ({ req: { user } }) => {
        // Assign tenant to the document when it's created (or updated).
        return user?.tenant?.id;
      },
    ],
  },
});
