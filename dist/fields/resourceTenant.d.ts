import { Config } from "payload/config";
import { CollectionConfig, Field, GlobalConfig } from "payload/types";
import { TenancyOptions } from "../options";
/** @returns Tenant field for generic resources. */
export declare const createResourceTenantField: ({ options: { tenantCollection }, collection, global, }: {
    options: TenancyOptions;
    config: Config;
    collection?: CollectionConfig;
    global?: GlobalConfig;
}) => Field;
