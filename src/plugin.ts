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
import { tenantAfterChangeHook, tenantBeforeDeleteHook } from "./hooks/tenant";

export const tenancy = (): Plugin => (config) => ({
  ...config,
  collections: config.collections.map((collection) =>
    collection.slug === "tenants"
      ? // Modify tenant collection
        {
          ...collection,
          access: {
            ...collection.access,
            read: createTenantReadAccess(collection.access?.read),
            update: createTenantReadAccess(collection.access?.update),
            delete: createTenantDeleteAccess(collection.access?.delete),
          },
          fields: [...collection.fields, createTenantParentField()],
          hooks: {
            ...collection.hooks,
            afterChange: [
              ...(collection.hooks?.afterChange || []),
              tenantAfterChangeHook,
            ],
            beforeDelete: [
              ...(collection.hooks?.beforeDelete || []),
              tenantBeforeDeleteHook,
            ],
          },
        }
      : collection.auth
      ? // Modify user collections
        {
          ...collection,
          access: {
            ...collection.access,
            create: createUserCreateAccess(collection.access?.create),
            read: createUserReadAccess(collection.access?.read),
            update: createUserReadAccess(collection.access?.update),
            delete: createUserReadAccess(collection.access?.delete),
          },
          fields: [...collection.fields, createUserTenantField()],
        }
      : // Modify resource collections
        {
          ...collection,
          access: {
            ...collection.access,
            create: createResourceCreateAccess(collection.access?.create),
            read: createResourceReadAccess(collection.access?.read),
            update: createResourceReadAccess(collection.access?.update),
            delete: createResourceReadAccess(collection.access?.delete),
          },
          fields: [...collection.fields, createResourceTenantField()],
        }
  ),
});
