import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
import { mergeObjects } from "../utils/mergeObjects";

const hostnamePattern = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;

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
          validate: (value) =>
            hostnamePattern.test(value) || "Domain is not valid.",
        },
      ],
      admin: {
        components: {
          RowLabel: ({ data }) => data.domain || "New Domain",
        },
      },
    },
    collection.fields.find(
      (field) => "name" in field && field.name == "domains"
    )
  );
