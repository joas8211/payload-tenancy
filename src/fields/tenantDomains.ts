import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
import { mergeObjects } from "../utils/mergeObjects";

export const createTenantDomainsField = ({
  collection,
}: {
  options: TenancyOptions;
  config: Config;
  collection: CollectionConfig;
}): Field =>
  mergeObjects<Field>(
    {
      type: "array",
      name: "domains",
      fields: [
        {
          type: "text",
          name: "domain",
          required: true,
        },
      ],
      admin: {
        components: {
          RowLabel: ({ data }) => data.domain || "New Domain",
        },
      },
    },
    collection.fields.find(
      (field) => "name" in field && field.name == "domains",
    ),
  );
