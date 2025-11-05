import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object - Contains common functionality for all pages
 * TODO: Students can use this as a starting point
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Common navigation elements
  get logo(): Locator {
    return this.page.getByTestId('site-logo');
  }

  get productsLink(): Locator {
    return this.page.getByTestId('nav-products');
  }

  get cartLink(): Locator {
    return this.page.getByTestId('nav-cart');
  }

  get accountLink(): Locator {
    return this.page.getByTestId('nav-account');
  }

  // Common actions
  async navigateToProducts() {
    await this.productsLink.click();
  }

  async navigateToCart() {
    await this.cartLink.click();
  }

  async navigateToAccount() {
    await this.accountLink.click();
  }

  async navigateHome() {
    await this.logo.click();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }
}
