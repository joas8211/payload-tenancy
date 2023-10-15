import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
import { mergeObjects } from "../utils/mergeObjects";

const noSpace = /^[^ ]+$/;

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
      validate: (value) => {
        if (!value) return "Slug is required";
        if (!noSpace.test(value)) return "Slug cannot contain space characters";
        return true;
      },
    },
    collection.fields.find((field) => "name" in field && field.name === "slug"),
  );
