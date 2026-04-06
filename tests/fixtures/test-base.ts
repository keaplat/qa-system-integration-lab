import { test as base } from '@playwright/test';

import { AdminOrdersClient } from '@api/AdminOrdersClient';
import { DatabaseClient } from '@db/DatabaseClient';
import { CatalogPage } from '@pages/CatalogPage';

type Fixtures = {
  adminOrdersClient: AdminOrdersClient;
  catalogPage: CatalogPage;
  databaseClient: DatabaseClient;
};

export const test = base.extend<Fixtures>({
  adminOrdersClient: async ({ request }, use) => {
    await use(new AdminOrdersClient(request));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  databaseClient: async ({}, use) => {
    const client = new DatabaseClient();
    await use(client);
    await client.close();
  }
});

export { expect } from '@playwright/test';
