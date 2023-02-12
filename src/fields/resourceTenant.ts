import { Config } from "payload/config";
import { Field } from "payload/types";
import { TenancyOptions } from "../options";

/**
 * @returns Tenant field for generic resources.
 */
export const createResourceTenantField = ({
  options: { tenantCollection },
}: {
  options: TenancyOptions;
  config: Config;
}): Field => ({
  type: "relationship",
  name: "tenant",
  relationTo: tenantCollection,
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
