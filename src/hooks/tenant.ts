import { Config } from "payload/config";
import {
  CollectionAfterChangeHook,
  CollectionBeforeDeleteHook,
} from "payload/types";
import { TenancyOptions } from "../options";

/**
 * Assign initial user the first created tenant.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
export const createTenantAfterChangeHook =
  ({
    options: { tenantCollection },
    config,
  }: {
    options: TenancyOptions;
    config: Config;
  }): CollectionAfterChangeHook =>
  async ({ doc, operation, req }): Promise<void> => {
    if (operation !== "create") return;

    const { payload } = req;
    const tenantCount = (
      await payload.find({ req, collection: tenantCollection, limit: 2 })
    ).totalDocs;
    if (tenantCount !== 1) return;

    const authCollections = config.collections?.filter(
      (collection) => collection.auth,
    );
    for (const { slug: collection } of authCollections) {
      const { docs: users } = await payload.find({ req, collection });
      for (const { id } of users) {
        await payload.update({
          req,
          collection,
          id,
          data: { tenant: doc.id },
        });
      }
    }
  };

/**
 * Remove sub-tenants and users of tenant before deleting the tenant.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
export const createTenantBeforeDeleteHook =
  ({
    options: { tenantCollection },
    config,
  }: {
    options: TenancyOptions;
    config: Config;
  }): CollectionBeforeDeleteHook =>
  async ({ id, req: { payload } }): Promise<void> => {
    // Delete child tenants
    const children = (
      await payload.find({
        collection: tenantCollection,
        where: { parent: { equals: id } },
      })
    ).docs;
    for (const child of children) {
      await payload.delete({
        collection: tenantCollection,
        id: child.id,
      });
    }

    // Delete users of this tenant
    const authCollections = config.collections.filter(
      (collection) => collection.auth,
    );
    for (const { slug: collection } of authCollections) {
      const users = (
        await payload.find({
          collection,
          where: { tenant: { equals: id } },
        })
      ).docs;
      for (const user of users) {
        await payload.delete({
          collection,
          id: user.id,
        });
      }
    }
  };
