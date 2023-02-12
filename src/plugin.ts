import { TenancyOptions } from "./options";
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
import { createResourceTenantField } from "./fields/resourceTenant";
import { createTenantParentField } from "./fields/tenantParent";
import { createUserTenantField } from "./fields/userTenant";
import {
  createTenantAfterChangeHook,
  createTenantBeforeDeleteHook,
} from "./hooks/tenant";

export const tenancy =
  ({ tenantCollection = "tenants" }: TenancyOptions = {}): Plugin =>
  (config) => {
    const options: TenancyOptions = { tenantCollection };
    const tenantCollectionExists = config.collections.some(
      (collection) => collection.slug === tenantCollection
    );
    if (!tenantCollectionExists) {
      throw new Error(
        `Tenant collection with slug '${tenantCollection}' does not exist.` +
          " Create it or pass correct options to use tenancy plugin."
      );
    }

    return {
      ...config,
      collections: config.collections.map((collection) =>
        collection.slug === tenantCollection
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
              },
              fields: [
                ...collection.fields,
                createUserTenantField({
                  options,
                  config,
                }),
              ],
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
    };
  };
