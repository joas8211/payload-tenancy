import { CollectionConfig } from "payload/types";
import { tenancy } from "../../../src/plugin";

const auth = (slug: string): CollectionConfig => ({
  slug,
  auth: true,
  fields: [],
});

const tenants = (slug: string): CollectionConfig => ({
  slug,
  fields: [],
});

describe("plugin configuration", () => {
  test("validates auth collection exists", () => {
    expect(() => tenancy()({ collections: [tenants("tenants")] })).toThrow();
    expect(() =>
      tenancy()({ collections: [auth("AUTH"), tenants("tenants")] })
    ).not.toThrow();
  });

  describe("tenantCollection", () => {
    it("validates collection to exist", () => {
      expect(() =>
        tenancy({ tenantCollection: "TENANTS" })({
          collections: [auth("users")],
        })
      ).toThrow();
      expect(() =>
        tenancy({ tenantCollection: "TENANTS" })({
          collections: [auth("users"), tenants("TENANTS")],
        })
      ).not.toThrow();
    });

    it("defaults to collection with slug 'tenants'", () => {
      expect(() =>
        tenancy()({
          collections: [auth("users"), tenants("tenants")],
        })
      ).not.toThrow();
    });
  });

  test("tenant domains field can be hidden", async () => {
    const domainsField = (
      await tenancy()({
        collections: [
          {
            slug: "users",
            auth: true,
            fields: [],
          },
          {
            slug: "tenants",
            fields: [
              {
                type: "array",
                name: "domains",
                fields: [],
                hidden: true,
              },
            ],
          },
        ],
      })
    ).collections
      .find((collection) => collection.slug === "tenants")
      .fields.find((field) => "name" in field && field.name === "domains");
    expect(domainsField).toEqual(
      expect.objectContaining({ type: "array", name: "domains", hidden: true })
    );
    expect(domainsField).not.toEqual({
      type: "array",
      name: "domains",
      fields: [],
      hidden: true,
    });
  });
});
