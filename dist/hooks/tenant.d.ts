import { Config } from "payload/config";
import { CollectionAfterChangeHook, CollectionBeforeDeleteHook } from "payload/types";
import { TenancyOptions } from "../options";
/**
 * Assign initial user the first created tenant.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
export declare const createTenantAfterChangeHook: ({ options: { tenantCollection }, config, }: {
    options: TenancyOptions;
    config: Config;
}) => CollectionAfterChangeHook;
/**
 * Remove sub-tenants and users of tenant before deleting the tenant.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
export declare const createTenantBeforeDeleteHook: ({ options: { tenantCollection }, config, }: {
    options: TenancyOptions;
    config: Config;
}) => CollectionBeforeDeleteHook;
