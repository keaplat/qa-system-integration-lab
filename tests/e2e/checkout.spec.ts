import { expect, test } from '@fixtures/test-base';

test.describe('Checkout integration flow', () => {
  test('should render the storefront catalog @smoke', async ({ catalogPage }) => {
    await catalogPage.open();
    await catalogPage.expectLoaded();
  });

  test('should complete checkout and persist the order across API and database', async ({
    adminOrdersClient,
    catalogPage,
    databaseClient,
    page
  }) => {
    await catalogPage.open();
    await catalogPage.expectLoaded();
    await catalogPage.selectProduct('Trace Hoodie');

    const orderResponsePromise = page.waitForResponse((response) => {
      return response.url().includes('/api/orders') && response.request().method() === 'POST';
    });

    await catalogPage.placeOrder('buyer@example.com', 2);

    const orderResponse = await orderResponsePromise;
    expect(orderResponse.status()).toBe(201);
    const orderBody = (await orderResponse.json()) as { orderId: number; productName: string; total: number };

    await catalogPage.expectConfirmationContains(`Order #${orderBody.orderId} confirmed`);

    const adminResponse = await adminOrdersClient.getOrderById(orderBody.orderId);
    expect(adminResponse.status()).toBe(200);
    const adminOrder = (await adminResponse.json()) as {
      email: string;
      product_name: string;
      quantity: number;
      total: number;
    };

    expect(adminOrder.email).toBe('buyer@example.com');
    expect(adminOrder.product_name).toBe('Trace Hoodie');
    expect(adminOrder.quantity).toBe(2);
    expect(adminOrder.total).toBe(120);

    const databaseOrder = await databaseClient.findOrderById(orderBody.orderId);
    expect(databaseOrder).toBeTruthy();
    expect(databaseOrder?.email).toBe('buyer@example.com');
    expect(databaseOrder?.status).toBe('confirmed');
    expect(databaseOrder?.total).toBe(120);
  });

  test('should block invalid email before sending the order request', async ({ catalogPage }) => {
    await catalogPage.open();
    await catalogPage.expectLoaded();
    await catalogPage.selectProduct('QA Notebook');
    await catalogPage.placeOrder('invalid-email', 1);

    await catalogPage.expectValidationMessage('Enter a valid email address.');
  });
});
