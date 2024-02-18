import { CollectionConfig } from "payload/types";
import { tenancy } from "../../../src/plugin";
import { createBaseConfig } from "../../baseConfig";
import { Config } from "payload/config";

const auth = (slug: string): CollectionConfig => ({
  slug,
  auth: true,
  fields: [],
});

const tenants = (slug: string): CollectionConfig => ({
  slug,
  fields: [],
});

const resources = (slug: string): CollectionConfig => ({
  slug,
  fields: [],
});

describe("plugin configuration", () => {
  test("validates auth collection exists", () => {
    expect(() =>
      tenancy()({ collections: [tenants("tenants")] } as Config),
    ).toThrow();
    expect(() =>
      tenancy()({
        ...createBaseConfig(),
        collections: [auth("AUTH"), tenants("tenants")],
      }),
    ).not.toThrow();
  });

  describe("tenantCollection", () => {
    it("validates collection to exist", () => {
      expect(() =>
        tenancy({ tenantCollection: "TENANTS" })({
          ...createBaseConfig(),
          collections: [auth("users")],
        }),
      ).toThrow();
      expect(() =>
        tenancy({ tenantCollection: "TENANTS" })({
          ...createBaseConfig(),
          collections: [auth("users"), tenants("TENANTS")],
        }),
      ).not.toThrow();
    });

    it("defaults to collection with slug 'tenants'", () => {
      expect(() =>
        tenancy()({
          ...createBaseConfig(),
          collections: [auth("users"), tenants("tenants")],
        }),
      ).not.toThrow();
    });
  });

  describe("sharedCollections", () => {
    it("does not allow you to opt-out tenant collection", () => {
      expect(() =>
        tenancy({ sharedCollections: ["tenants"] })({
          ...createBaseConfig(),
          collections: [auth("users"), tenants("tenants")],
        }),
      ).toThrow();
      expect(() =>
        tenancy({
          tenantCollection: "TENANTS",
          sharedCollections: ["TENANTS"],
        })({
          ...createBaseConfig(),
          collections: [auth("users"), tenants("TENANTS")],
        }),
      ).toThrow();
    });

    it("does not allow you to opt-out auth collection", () => {
      expect(() =>
        tenancy({ sharedCollections: ["users"] })({
          ...createBaseConfig(),
          collections: [auth("users"), tenants("tenants")],
        }),
      ).toThrow();
      expect(() =>
        tenancy({ sharedCollections: ["otherUsers"] })({
          ...createBaseConfig(),
          collections: [auth("otherUsers"), tenants("tenants")],
        }),
      ).toThrow();
    });

    it("allows you to opt-out resource collection", () => {
      expect(
        tenancy({ sharedCollections: ["pages"] })({
          ...createBaseConfig(),
          collections: [auth("users"), tenants("tenants"), resources("pages")],
        }),
      ).toEqual(
        expect.objectContaining({
          collections: expect.arrayContaining([resources("pages")]),
        }),
      );
    });

    it("defaults to nothing", () => {
      expect(
        tenancy()({
          ...createBaseConfig(),
          collections: [auth("users"), tenants("tenants"), resources("pages")],
        }),
      ).toEqual(
        expect.objectContaining({
          collections: expect.arrayContaining([
            expect.objectContaining({
              ...resources("pages"),
              fields: expect.arrayContaining([
                expect.objectContaining({ name: "tenant" }),
              ]),
            }),
          ]),
        }),
      );
    });
  });

  test("tenant domains field can be hidden", async () => {
    const domainsField = (
      await tenancy()({
        ...createBaseConfig(),
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
      expect.objectContaining({ type: "array", name: "domains", hidden: true }),
    );
    expect(domainsField).not.toEqual({
      type: "array",
      name: "domains",
      fields: [],
      hidden: true,
    });
  });
});
