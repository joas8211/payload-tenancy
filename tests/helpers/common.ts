export interface User {
  email: string;
  password: string;
  tenant: string;
}

export interface Tenant {
  slug: string;
  domains: string[];
  parent?: string;
}

export interface Post {
  title: string;
}

export interface Helper {
  url: string;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  createUser: (user: User) => Promise<void>;
  createTenant: (tenant: Tenant) => Promise<void>;
  createPost: (page: Post) => Promise<void>;
  deleteUser: (user: User) => Promise<void>;
  deleteTenant: (tenant: Tenant) => Promise<void>;
  deletePost: (page: Post) => Promise<void>;
}

export const wait = (time?: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), time));
