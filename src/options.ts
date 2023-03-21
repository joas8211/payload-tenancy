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
}

/** @returns Validated options with default values filled in. */
export const validateOptions = ({
  options: { tenantCollection = "tenants", isolationStrategy = "user" },
  config,
}: {
  options: Partial<TenancyOptions>;
  config: Config;
}): TenancyOptions => {
  const tenantCollectionExists = config.collections?.some(
    (collection) => collection.slug === tenantCollection
  );
  if (!tenantCollectionExists) {
    throw new Error(
      `Tenant collection with slug '${tenantCollection}' does not exist.` +
        " Create it or pass correct options to use tenancy plugin."
    );
  }

  const authCollectionExists = config.collections?.some(
    (collection) => collection.auth
  );
  if (!authCollectionExists) {
    throw new Error(
      "No authentication collection exists. Create one to use tenancy plugin."
    );
  }

  return {
    tenantCollection,
    isolationStrategy,
  };
};
