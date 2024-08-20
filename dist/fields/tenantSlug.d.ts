import { Config } from "payload/config";
import { CollectionConfig, Field } from "payload/types";
import { TenancyOptions } from "../options";
/** @returns Slug field for tenants. */
export declare const createTenantSlugField: ({ collection, }: {
    options: TenancyOptions;
    config: Config;
    collection: CollectionConfig;
}) => Field;
