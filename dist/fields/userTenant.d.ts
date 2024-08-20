import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
/** @returns Tenant field for users. */
export declare const createUserTenantField: ({ options, collection, }: {
    options: TenancyOptions;
    config: Config;
    collection: CollectionConfig;
}) => Field;
