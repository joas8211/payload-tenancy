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
export const validateOptions = ({
  options: {
    tenantCollection = "tenants",
    isolationStrategy = "user",
    sharedCollections = [],
    sharedGlobals = [],
  },
  config,
}: {
  options: Partial<TenancyOptions>;
  config: Config;
}): TenancyOptions => {
  const tenantCollectionExists = config.collections?.some(
    (collection) => collection.slug === tenantCollection,
  );
  if (!tenantCollectionExists) {
    throw new Error(
      `Tenant collection with slug '${tenantCollection}' does not exist.` +
        " Create it or pass correct options to use tenancy plugin.",
    );
  }

  const authCollectionExists = config.collections?.some(
    (collection) => collection.auth,
  );
  if (!authCollectionExists) {
    throw new Error(
      "No authentication collection exists. Create one to use tenancy plugin.",
    );
  }

  for (const slug of sharedCollections) {
    if (slug === tenantCollection) {
      throw new Error(
        "It's not allowed to share tenant collection between all tenants.",
      );
    }

    if (
      config.collections?.some(
        (collection) => collection.slug === slug && collection.auth,
      )
    ) {
      throw new Error(
        "It's not allowed to share auth collection between all tenants.",
      );
    }
  }

  return {
    tenantCollection,
    isolationStrategy,
    sharedCollections,
    sharedGlobals,
  };
};
