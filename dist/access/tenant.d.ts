import { Access, Config } from "payload/config";
import { TenancyOptions } from "../options";
/**
 * Limits tenant access to users that belong to the same or above tenant.
 *
 * @returns Collection access control for tenants
 */
export declare const createTenantReadAccess: ({ options, original, }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
}) => Access;
/**
 * Limits deletion of current tenant or above tenants.
 *
 * @param original Original access control to take into account.
 * @returns Collection access control for tenants
 */
export declare const createTenantDeleteAccess: ({ options, original, }: {
    options: TenancyOptions;
    config: Config;
    original?: Access;
}) => Access;
