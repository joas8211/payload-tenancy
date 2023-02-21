import { TenancyOptions, validateOptions } from "./options";
import { Plugin } from "payload/config";
import {
  createResourceCreateAccess,
  createResourceReadAccess,
} from "./access/resource";
import {
  createTenantReadAccess,
  createTenantDeleteAccess,
} from "./access/tenant";
import { createUserCreateAccess, createUserReadAccess } from "./access/user";
import { createAdminAccess } from "./access/auth";
import { createResourceTenantField } from "./fields/resourceTenant";
import { createTenantParentField } from "./fields/tenantParent";
import { createUserTenantField } from "./fields/userTenant";
import { createTenantSlugField } from "./fields/tenantSlug";
import {
  createTenantAfterChangeHook,
  createTenantBeforeDeleteHook,
} from "./hooks/tenant";
import { createPathMapping } from "./middleware/pathMapping";
import { createRestrictLogin } from "./hooks/auth";

export const tenancy =
  (partialOptions: Partial<TenancyOptions> = {}): Plugin =>
  (config) => {
    const options = validateOptions({ options: partialOptions, config });
    const basePath =
      options.isolationStrategy === "path" && "location" in globalThis
        ? "/" + location.pathname.slice(1).split("/")[0]
        : "";

    return {
      ...config,
      collections: config.collections.map((collection) =>
        collection.slug === options.tenantCollection
          ? // Modify tenant collection
            {
              ...collection,
              access: {
                ...collection.access,
                read: createTenantReadAccess({
                  options,
                  config,
                  original: collection.access?.read,
                }),
                update: createTenantReadAccess({
                  options,
                  config,
                  original: collection.access?.update,
                }),
                delete: createTenantDeleteAccess({
                  options,
                  config,
                  original: collection.access?.delete,
                }),
              },
              fields: [
                ...collection.fields,
                createTenantSlugField({ options, config }),
                createTenantParentField({
                  options,
                  config,
                }),
              ],
              hooks: {
                ...collection.hooks,
                afterChange: [
                  ...(collection.hooks?.afterChange || []),
                  createTenantAfterChangeHook({
                    options,
                    config,
                  }),
                ],
                beforeDelete: [
                  ...(collection.hooks?.beforeDelete || []),
                  createTenantBeforeDeleteHook({
                    options,
                    config,
                  }),
                ],
              },
            }
          : collection.auth
          ? // Modify user collections
            {
              ...collection,
              access: {
                ...collection.access,
                create: createUserCreateAccess({
                  options,
                  config,
                  original: collection.access?.create,
                }),
                read: createUserReadAccess({
                  options,
                  config,
                  original: collection.access?.read,
                }),
                update: createUserReadAccess({
                  options,
                  config,
                  original: collection.access?.update,
                }),
                delete: createUserReadAccess({
                  options,
                  config,
                  original: collection.access?.delete,
                }),
                admin: createAdminAccess({
                  options,
                  config,
                  original: collection.access?.admin,
                }),
              },
              fields: [
                ...collection.fields,
                createUserTenantField({
                  options,
                  config,
                }),
              ],
              hooks: {
                ...collection.hooks,
                beforeLogin: [
                  ...(collection.hooks?.beforeLogin || []),
                  createRestrictLogin({
                    options,
                    config,
                  }),
                ],
              },
            }
          : // Modify resource collections
            {
              ...collection,
              access: {
                ...collection.access,
                create: createResourceCreateAccess({
                  options,
                  config,
                  original: collection.access?.create,
                }),
                read: createResourceReadAccess({
                  options,
                  config,
                  original: collection.access?.read,
                }),
                update: createResourceReadAccess({
                  options,
                  config,
                  original: collection.access?.update,
                }),
                delete: createResourceReadAccess({
                  options,
                  config,
                  original: collection.access?.delete,
                }),
              },
              fields: [
                ...collection.fields,
                createResourceTenantField({
                  options,
                  config,
                }),
              ],
            }
      ),
      routes: {
        admin: basePath + (config.routes?.admin ?? "/admin"),
        api: basePath + (config.routes?.api ?? "/api"),
        graphQL: basePath + (config.routes?.graphQL ?? "/graphql"),
        graphQLPlayground:
          basePath + (config.routes?.graphQLPlayground ?? "/playground"),
      },
      onInit: async (payload) => {
        await config.onInit?.(payload);

        if (options.isolationStrategy === "path") {
          payload.express.use(createPathMapping({ options, config, payload }));

          // Move the added middleware up in the stack as far as possible (after
          // "expressInit" middleware).
          const router = payload.express._router;
          const index = router.stack.findIndex(
            (layer) => layer.name === "expressInit"
          );
          router.stack = [
            ...router.stack.slice(0, index + 1),
            ...router.stack.slice(-1),
            ...router.stack.slice(index + 1, -1),
          ];
        }
      },
    };
  };
