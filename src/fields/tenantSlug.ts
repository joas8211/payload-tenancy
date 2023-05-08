import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
import { mergeObjects } from "../utils/mergeObjects";

/** @returns Slug field for tenants. */
export const createTenantSlugField = ({
  collection,
}: {
  options: TenancyOptions;
  config: Config;
  collection: CollectionConfig;
}): Field =>
  mergeObjects<Field>(
    {
      type: "text",
      name: "slug",
      unique: true,
      required: true,
    },
    collection.fields.find((field) => "name" in field && field.name === "slug")
  );
