import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
/** @returns Parent field for tenants. */
export declare const createTenantParentField: ({ options, collection, }: {
    options: TenancyOptions;
    config: Config;
    collection: CollectionConfig;
}) => Field;
