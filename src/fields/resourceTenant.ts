import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
import { RequestWithTenant } from "../utils/requestWithTenant";
import { mergeObjects } from "../utils/mergeObjects";

/** @returns Tenant field for generic resources. */
export const createResourceTenantField = ({
  options: { tenantCollection },
  collection,
}: {
  options: TenancyOptions;
  config: Config;
  collection?: CollectionConfig;
}): Field =>
  mergeObjects<Field>(
    {
      type: "relationship",
      name: "tenant",
      relationTo: tenantCollection,
      hidden: true,
      hooks: {
        beforeChange: [
          ({ req }) => {
            // Assign tenant to the document when it's created (or updated).
            const { tenant, user } = req as RequestWithTenant;
            return tenant?.id || user?.tenant?.id;
          },
        ],
      },
    },
    collection?.fields.find(
      (field) => "name" in field && field.name === "tenant"
    )
  );
