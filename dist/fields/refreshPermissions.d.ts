import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
export declare const createRefreshPermissionsField: ({ collection, }: {
    options: TenancyOptions;
    config: Config;
    collection: CollectionConfig;
}) => Field;
