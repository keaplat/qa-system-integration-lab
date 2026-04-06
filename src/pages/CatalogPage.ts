import { expect, type Page } from '@playwright/test';

export class CatalogPage {
  constructor(private readonly page: Page) {}

  readonly heading = this.page.getByRole('heading', { level: 1, name: 'QA Storefront Demo' });
  readonly emailInput = this.page.getByLabel('Email');
  readonly quantityInput = this.page.getByLabel('Quantity');
  readonly submitButton = this.page.getByRole('button', { name: 'Place order' });
  readonly validationMessage = this.page.locator('[data-testid="validation-message"]');
  readonly confirmation = this.page.locator('[data-testid="confirmation"]');

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  productCard(name: string) {
    return this.page.locator('[data-testid="product-card"]').filter({ hasText: name });
  }

  async selectProduct(name: string): Promise<void> {
    await this.productCard(name).getByRole('button', { name: 'Select' }).click();
  }

  async placeOrder(email: string, quantity: number): Promise<void> {
    await this.emailInput.fill(email);
    await this.quantityInput.fill(String(quantity));
    await this.submitButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.heading).toBeVisible();
    await expect(this.page.locator('[data-testid="product-card"]')).toHaveCount(3);
  }

  async expectConfirmationContains(text: string): Promise<void> {
    await expect(this.confirmation).toContainText(text);
  }

  async expectValidationMessage(text: string): Promise<void> {
    await expect(this.validationMessage).toContainText(text);
  }
}
