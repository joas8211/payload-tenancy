import { Config } from "payload/config";
import { CollectionAfterReadHook, CollectionConfig } from "payload/types";
import { TenancyOptions } from "../options";
/**
 * Fix file URLs when using path tenant isolation strategy.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
export declare const createUploadAfterReadHook: ({ options: { isolationStrategy, tenantCollection }, config: { serverURL }, collection, }: {
    options: TenancyOptions;
    config: Config;
    collection: CollectionConfig;
}) => CollectionAfterReadHook;
