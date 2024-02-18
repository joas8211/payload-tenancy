import { Helper, Post, Tenant, User, wait } from "./common";

export const createAdminHelper = (options: { url: string }): Helper => ({
  url: options.url,
  login: async (credentials: User) => {
    await page.goto(`${options.url}/admin/login`);
    await page.waitForSelector("#field-email");
    await page.type("#field-email", credentials.email);
    await page.type("#field-password", credentials.password);
    await wait(500);
    await page.click("[type=submit]");
    await page.waitForNetworkIdle();
  },
  logout: async () => {
    await page.goto(`${options.url}/admin/logout`);
    await page.waitForNetworkIdle();
  },
  createUser: async (user: User) => {
    await page.goto(`${options.url}/admin/collections/users/create`);
    await page.waitForNetworkIdle();
    await page.type("#field-email", user.email);
    await page.type("#field-password", user.password);
    await page.type("#field-confirm-password", user.password);
    await page.click("#field-tenant .react-select");
    await page.waitForNetworkIdle();
    await (
      await (await page.$("#field-tenant .rs__menu")).$("text/" + user.tenant)
    ).click();
    await wait(500);
    await page.click("#action-save");
    await page.waitForNetworkIdle();
  },
  createTenant: async (tenant: Tenant) => {
    await page.goto(`${options.url}/admin/collections/tenants/create`);
    await page.waitForNetworkIdle();
    await page.type("#field-slug", tenant.slug);
    for (let i = 0; i < tenant.domains.length; i++) {
      await page.click("#field-domains .array-field__add-row");
      await page.waitForSelector(`#field-domains__${i}__domain`);
      await page.type(`#field-domains__${i}__domain`, tenant.domains[i]);
    }
    if (tenant.parent) {
      await page.click("#field-parent .react-select");
      await page.waitForNetworkIdle();
      await (
        await (
          await page.$("#field-parent .rs__menu")
        ).$("text/" + tenant.parent)
      ).click();
    }
    await wait(500);
    await page.click("#action-save");
    await page.waitForNetworkIdle();
  },
  createPost: async (post: Post) => {
    await page.goto(`${options.url}/admin/collections/posts/create`);
    await page.waitForNetworkIdle();
    await page.type("#field-title", post.title);
    await wait(500);
    await page.click("#action-save");
    await page.waitForNetworkIdle();
  },
  deleteUser: async (user: User) => {
    await page.goto(`${options.url}/admin/collections/users`);
    await page.waitForNetworkIdle();
    await page.type(".search-filter__input", user.email);
    await page.waitForNetworkIdle();
    await page.click(".row-1 .cell-email a");
    await page.waitForNetworkIdle();
    await page.click(".popup");
    await page.click("#action-delete");
    await page.waitForNetworkIdle();
    await page.click("#confirm-delete");
    await page.waitForNetworkIdle();
  },
  deleteTenant: async (tenant: Tenant) => {
    await page.goto(`${options.url}/admin/collections/tenants`);
    await page.waitForNetworkIdle();
    await page.type(".search-filter__input", tenant.slug);
    await page.waitForNetworkIdle();
    await page.click(".row-1 .cell-slug a");
    await page.waitForNetworkIdle();
    await page.click(".popup");
    await page.click("#action-delete");
    await page.waitForNetworkIdle();
    await page.click("#confirm-delete");
    await page.waitForNetworkIdle();
  },
  deletePost: async (post: Post) => {
    await page.goto(`${options.url}/admin/collections/posts`);
    await page.waitForNetworkIdle();
    await page.type(".search-filter__input", post.title);
    await page.waitForNetworkIdle();
    await page.click(".row-1 .cell-slug a");
    await page.waitForNetworkIdle();
    await page.click(".popup");
    await page.click("#action-delete");
    await page.waitForNetworkIdle();
    await page.click("#confirm-delete");
    await page.waitForNetworkIdle();
  },
});
