export interface Config {
  collections: {
    tenants: Tenant;
  };
  globals: object;
}

export interface Tenant {
  id: string;
  parent?: string | Tenant;
  createdAt: string;
  updatedAt: string;
}
