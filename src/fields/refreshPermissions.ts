import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
import { mergeObjects } from "../utils/mergeObjects";
import { RefreshPermissionsField } from "../components/RefreshPermissionsField";

export const createRefreshPermissionsField = ({
  collection,
}: {
  options: TenancyOptions;
  config: Config;
  collection: CollectionConfig;
}): Field =>
  mergeObjects<Field>(
    {
      type: "ui",
      name: "refreshPermissions",
      admin: {
        components: {
          Field: RefreshPermissionsField,
        },
      },
    },
    collection.fields.find(
      (field) => "name" in field && field.name == "refreshPermissions",
    ),
  );
