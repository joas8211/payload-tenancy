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
import { createTenantDomainsField } from "./fields/tenantDomains";
import { createRefreshPermissionsField } from "./fields/refreshPermissions";
import {
  createTenantAfterChangeHook,
  createTenantBeforeDeleteHook,
} from "./hooks/tenant";
import { createInitHook } from "./hooks/init";
import { createRestrictLogin } from "./hooks/auth";
import { createUploadAfterReadHook } from "./hooks/upload";
import {
  createGlobalBeforeReadHook,
  createGlobalBeforeChangeHook,
  createGlobalAfterChangeHook,
} from "./hooks/global";
import { overrideFields } from "./utils/overrideFields";
import { transformGlobalCollectionField } from "./utils/transformGlobalCollectionField";
import { transformGlobalField } from "./utils/transformGlobalField";
import { CollectionConfig } from "payload/types";

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
      // Proxy not shared globals to their respective collections.
      globals: (config.globals ?? []).map((global) =>
        options.sharedGlobals.includes(global.slug)
          ? global
          : {
              ...global,
              fields: overrideFields(
                global.fields.map(transformGlobalField),
                [],
                [
                  createResourceTenantField({
                    options,
                    config,
                    global,
                  }),
                ],
              ),
              hooks: {
                beforeRead: [
                  createGlobalBeforeReadHook({
                    options,
                    config,
                    global,
                  }),
                  ...(global.hooks?.beforeRead ?? []),
                ],
                beforeChange: [
                  ...(global.hooks?.beforeChange ?? []),
                  createGlobalBeforeChangeHook({
                    options,
                    config,
                    global,
                  }),
                ],
                afterChange: [
                  createGlobalAfterChangeHook({
                    options,
                    config,
                    global,
                  }),
                  ...(global.hooks?.afterChange ?? []),
                ],
              },
            },
      ),
      collections: [
        // Create collections for not shared globals.
        ...(config.globals ?? [])
          .filter((global) => !options.sharedGlobals.includes(global.slug))
          .map(
            (global): CollectionConfig => ({
              slug: global.slug + "Globals",
              versions: global.versions,
              fields: overrideFields(
                global.fields.map(transformGlobalCollectionField),
                [],
                [
                  createResourceTenantField({
                    options,
                    config,
                  }),
                ],
              ),
              access: {
                create: () => false,
                read: () => false,
                update: () => false,
                delete: () => false,
              },
            }),
          ),
        ...(config.collections ?? [])
          .map((collection) =>
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
                  fields: overrideFields(
                    collection.fields,
                    [
                      createTenantSlugField({ options, config, collection }),
                      createTenantParentField({ options, config, collection }),
                      createTenantDomainsField({ options, config, collection }),
                      createRefreshPermissionsField({
                        options,
                        config,
                        collection,
                      }),
                    ],
                    [],
                  ),
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
                  admin: {
                    ...collection.admin,
                    disableDuplicate: true,
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
                    fields: overrideFields(
                      collection.fields,
                      [],
                      [createUserTenantField({ options, config, collection })],
                    ),
                    hooks: {
                      ...collection.hooks,
                      beforeLogin: [
                        ...(collection.hooks?.beforeLogin || []),
                        createRestrictLogin({ options, config }),
                      ],
                    },
                  }
                : options.sharedCollections.includes(collection.slug)
                  ? // Do not modify the collection (opt-out)
                    collection
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
                      fields: overrideFields(
                        collection.fields,
                        [],
                        [
                          createResourceTenantField({
                            options,
                            config,
                            collection,
                          }),
                        ],
                      ),
                    },
          )
          .map((collection) => {
            if (!collection.upload) {
              return collection;
            }

            const parameters =
              typeof collection.upload === "object" ? collection.upload : {};
            return {
              ...collection,
              upload: {
                ...parameters,
                staticURL:
                  parameters.staticURL?.startsWith("/") === false
                    ? parameters.staticURL // Absolute URL
                    : basePath + (parameters.staticURL ?? "/media"),
              },
              hooks: {
                ...collection.hooks,
                afterRead: [
                  createUploadAfterReadHook({ options, config, collection }),
                  ...(collection.hooks?.afterRead ?? []),
                ],
              },
            };
          }),
      ],
      routes: {
        admin: basePath + (config.routes?.admin ?? "/admin"),
        api: basePath + (config.routes?.api ?? "/api"),
        graphQL: basePath + (config.routes?.graphQL ?? "/graphql"),
        graphQLPlayground:
          basePath +
          (config.routes?.graphQLPlayground ?? "/graphql-playground"),
      },
      onInit: createInitHook({ options, config }),
    };
  };
