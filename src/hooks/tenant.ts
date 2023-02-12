import {
  CollectionAfterChangeHook,
  CollectionBeforeDeleteHook,
} from "payload/types";

/**
 * Assign initial user the first created tenant.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
export const tenantAfterChangeHook: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req: { payload, user },
}): Promise<void> => {
  if (operation !== "create") return;

  const tenantCount = (await payload.find({ collection: "tenants", limit: 0 }))
    .totalDocs;
  if (tenantCount !== 1) return;

  await payload.update({
    collection: user.collection,
    id: user.id,
    data: { tenant: doc.id },
  });
};

/**
 * Remove sub-tenants and users of tenant before deleting the tenant.
 *
 * @param args Hook args
 * @returns {Promise<void>}
 */
export const tenantBeforeDeleteHook: CollectionBeforeDeleteHook = async ({
  id,
  req: { payload },
}): Promise<void> => {
  // Delete child tenants
  const children = (
    await payload.find({
      collection: "tenants",
      where: { parent: { equals: id } },
    })
  ).docs;
  for (const child of children) {
    await payload.delete({
      collection: "tenants",
      id: child.id,
    });
  }

  // Delete users of this tenant
  const users = (
    await payload.find({
      collection: "users",
      where: { tenant: { equals: id } },
    })
  ).docs;
  for (const user of users) {
    await payload.delete({
      collection: "users",
      id: user.id,
    });
  }
};
