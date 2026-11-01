import { Page, Locator, expect } from '@playwright/test';
import { money } from '../config';

export class CheckoutPage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly finishButton: Locator;
  readonly error: Locator;
  readonly completeHeader: Locator;
  readonly backHome: Locator;

  constructor(private readonly page: Page) {
    this.firstName = page.getByTestId('firstName');
    this.lastName = page.getByTestId('lastName');
    this.postalCode = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.cancelButton = page.getByTestId('cancel');
    this.finishButton = page.getByTestId('finish');
    this.error = page.getByTestId('error');
    this.completeHeader = page.getByTestId('complete-header');
    this.backHome = page.getByTestId('back-to-products');
  }

  async fillInfo(first: string, last: string, zip: string) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
  }

  async continue() {
    await this.continueButton.click();
  }

  async expectOnOverview() {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
  }

  async overviewAmounts() {
    const [item, tax, total] = await Promise.all([
      this.page.getByTestId('subtotal-label').textContent(),
      this.page.getByTestId('tax-label').textContent(),
      this.page.getByTestId('total-label').textContent(),
    ]);
    return { item: money(item!), tax: money(tax!), total: money(total!) };
  }

  async overviewItemPrices(): Promise<number[]> {
    const texts = await this.page.getByTestId('inventory-item-price').allTextContents();
    return texts.map(money);
  }

  async finish() {
    await this.finishButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
