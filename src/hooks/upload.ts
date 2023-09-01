import { Config } from "payload/config";
import { CollectionAfterReadHook, CollectionConfig } from "payload/types";
import { TenancyOptions } from "../options";
import { RequestWithTenant } from "../utils/requestWithTenant";

/**
 * Fix file URLs when using path tenant isolation strategy.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
export const createUploadAfterReadHook =
  ({
    options: { isolationStrategy, tenantCollection },
    collection,
  }: {
    options: TenancyOptions;
    config: Config;
    collection: CollectionConfig;
  }): CollectionAfterReadHook =>
  async ({ doc, req }): Promise<void> => {
    const parameters =
      typeof collection.upload === "object" ? collection.upload : {};
    let basePath = parameters.staticURL ?? "/media";
    if (isolationStrategy === "path") {
      const { tenant, user, payload } = req as RequestWithTenant;
      const tenantId = tenant?.id || user?.tenant?.id;
      const { slug } = await payload.findByID({
        collection: tenantCollection,
        id: tenantId,
      });
      basePath = `/${slug}${basePath}`;
    }
    return { ...doc, url: `${basePath}/${doc.filename}` };
  };
