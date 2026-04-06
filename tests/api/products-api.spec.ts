import { expect, test } from '@fixtures/test-base';

test.describe('Products API', () => {
  test('should return the storefront product catalog @smoke', async ({ adminOrdersClient }) => {
    const response = await adminOrdersClient.getProducts();
    const products = (await response.json()) as Array<{ id: string; name: string; price: number }>;

    expect(response.status()).toBe(200);
    expect(products).toHaveLength(3);
    expect(products[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number)
      })
    );
  });
});
