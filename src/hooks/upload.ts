import { Config } from "payload/config";
import { CollectionAfterReadHook, CollectionConfig } from "payload/types";
import { TenancyOptions } from "../options";
import { FileSize } from "payload/dist/uploads/types";

/**
 * Fix file URLs when using path tenant isolation strategy.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
export const createUploadAfterReadHook =
  ({
    options: { isolationStrategy, tenantCollection },
    config: { serverURL },
    collection,
  }: {
    options: TenancyOptions;
    config: Config;
    collection: CollectionConfig;
  }): CollectionAfterReadHook =>
  async ({ doc, req }): Promise<void> => {
    if (req.context?.skipTenancyUploadAfterReadHook) {
      return doc;
    }

    const parameters =
      typeof collection.upload === "object" ? collection.upload : {};
    if (parameters.staticURL?.startsWith("/") === false) {
      // Absolute URL, don't touch it.
      return doc;
    }

    let basePath = parameters.staticURL ?? "/media";
    if (isolationStrategy === "path") {
      const { payload } = req;
      req.context.skipTenancyUploadAfterReadHook = true;
      const { tenant } = await payload.findByID({
        collection: collection.slug,
        id: doc.id,
        depth: 0,
        showHiddenFields: true,
        req,
      });
      delete req.context.skipTenancyUploadAfterReadHook;
      const { slug } = await payload.findByID({
        collection: tenantCollection,
        id: tenant,
        depth: 0,
      });
      basePath = `/${slug}${basePath}`;
    }

    return {
      ...doc,
      url: `${serverURL ?? ""}${basePath}/${doc.filename}`,
      sizes: {
        ...Object.fromEntries(
          Object.entries<FileSize>(doc.sizes).map(([name, size]) => [
            name,
            {
              ...size,
              url: `${serverURL ?? ""}${basePath}/${size.filename}`,
            },
          ])
        ),
      },
    };
  };
