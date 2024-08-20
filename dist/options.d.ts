import { Config } from "payload/config";
export interface TenancyOptions {
    /** Tenant collection slug. Default "tenants". */
    tenantCollection: string;
    /**
     * Choose a strategy for tenant isolation. Using "user" strategy by default
     * and when there's no tenants yet.
     *
     * - "user": Detect tenant based on user's tenant field. Does not allow
     *   anonymous access or access to sub-tenants.
     * - "path": Use tenant's slug as base path.
     * - "domain": Detect tenant based on hostname. Remember to remove serverURL
     *   from config to allow multiple domains.
     */
    isolationStrategy: "user" | "path" | "domain";
    /**
     * Slugs of collections you want to share between all tenants. Specifying
     * collection here will opt it out from tenant isolation.
     */
    sharedCollections: string[];
    /**
     * Slugs of globals you want to share between all tenants. Specifying global
     * here will opt it out from tenant isolation.
     */
    sharedGlobals: string[];
}
/** @returns Validated options with default values filled in. */
export declare const validateOptions: ({ options: { tenantCollection, isolationStrategy, sharedCollections, sharedGlobals, }, config, }: {
    options: Partial<TenancyOptions>;
    config: Config;
}) => TenancyOptions;
