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
});
