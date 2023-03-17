export interface Credentials {
  email: string;
  password: string;
}

export const rootUser: Credentials = {
  email: "root@payload.local",
  password: "test",
};
