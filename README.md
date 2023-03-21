# Multi-tenancy plugin for Payload CMS

**Initial version for this plugin is still work in progress!**

This plugin allows multiple tenants to access different resources in the same
instance of Payload CMS.

## Features / Todo

- [x] **Tenant isolation**: Each tenant has it's own documents and only that
      tenant can access them.
- [x] **Hierarchial tenant management**: Tenants have parents. Parent tenants
      can manage and access their children in a hierarchical manner.
- [x] **Path mapping**: Each tenant can be mapped to its own path to separate
      login pages and to allow access sub-tenants.
- [x] **Domain mapping**: Each tenant can be mapped to its own domain to create
      clear separation between tenants.
- [ ] **Tested properly**: The project is tested thoroughly with unit tests, e2e
      tests and manual testing.

## Installation

1. Ensure you have at least one authentication-enabled collection.
2. Create tenant collection. Use slug "tenants" or configure other slug in the
   following step.

```javascript
export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      type: "text",
      name: "name",
      label: "Name",
      required: true,
    },
  ],
};
```

3. Import and add the plugin to your Payload config.

```javascript
export default buildConfig({
  plugins: [tenancy()],
  collections: [Users, Tenants],
  // ...rest of the config...
});
```

## Setup

Some notes about setup:

- Setup can currently be only made in when using "user" isolation strategy,
  which is the default strategy.
- When creating initial user, there's tenant field, but it can be left empty.
