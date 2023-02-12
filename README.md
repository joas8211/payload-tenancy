# Multi-tenancy plugin for Payload CMS

**Initial version for this plugin is still work in progress!**

This plugin allows multiple tenants to access different resources in the same
instance of Payload CMS.

## Features / Todo

- [x] **Tenant isolation**: Each tenant has it's own documents and only that
      tenant can access them.
- [x] **Hierarchial tenant management**: Tenants have a parent. Parent tenants
      can manage and access their children in a hierarchical manner.
- [ ] **Domain or path mapping**: Each tenant is mapped to its own domain or
      path to create clear separation between tenants.

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

After enabling tenancy plugin you must create the root tenant. After that you
might need to reload the page to refresh accesses.
