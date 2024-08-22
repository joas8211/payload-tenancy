import { Config } from "payload/config";
import { CollectionConfig, Field, GlobalConfig } from "payload/types";
import { TenancyOptions } from "../options";
import { RequestWithTenant } from "../utils/requestWithTenant";
import { mergeObjects } from "../utils/mergeObjects";

/** @returns Tenant field for generic resources. */
export const createResourceTenantField = ({
  options: { tenantCollection },
  collection,
  global,
}: {
  options: TenancyOptions;
  config: Config;
  collection?: CollectionConfig;
  global?: GlobalConfig;
}): Field =>
  mergeObjects<Field>(
    {
      type: "relationship",
      name: "tenant",
      relationTo: tenantCollection,
      // FIXME: PayloadCMS error for the hidden field - QueryError: The following path cannot be queried: version.tenant
      // hideen: true,
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
    (collection ?? global)?.fields.find(
      (field) => "name" in field && field.name === "tenant",
    ),
  );
