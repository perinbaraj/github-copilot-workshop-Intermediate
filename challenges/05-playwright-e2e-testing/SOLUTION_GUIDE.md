# 📘 Playwright E2E Testing - Solution Guide

This guide provides solutions, best practices, and implementation examples for the Playwright E2E Testing Challenge.

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Task 1: Page Object Models](#task-1-page-object-models)
3. [Task 2: User Journey Tests](#task-2-user-journey-tests)
4. [Task 3: Error Handling Tests](#task-3-error-handling-tests)
5. [Task 4: Accessibility Tests](#task-4-accessibility-tests)
6. [Task 5: Responsive Tests](#task-5-responsive-tests)
7. [Best Practices](#best-practices)
8. [Common Pitfalls](#common-pitfalls)

## 🚀 Setup Instructions

### Initial Setup
```bash
cd challenges/playwright-e2e-testing
npm install
npx playwright install
```

### Running Tests
```bash
# Run all tests
npm test

# Run in UI mode
npm run test:ui

# Run specific test
npx playwright test tests/user-journeys/purchase-flow.spec.ts

# Debug mode
npm run test:debug
```

## 📝 Task 1: Page Object Models

### Solution: ProductCatalogPage

```typescript
// tests/pages/ProductCatalogPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductCatalogPage extends BasePage {
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;
  readonly sortDropdown: Locator;
  readonly productCards: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-input');
    this.categoryFilter = page.getByTestId('category-filter');
    this.sortDropdown = page.getByTestId('sort-dropdown');
    this.productCards = page.locator('[data-testid^="product-card-"]');
    this.noResultsMessage = page.getByText(/no products found/i);
  }

  async goto() {
    await this.page.goto('/products');
    await this.waitForPageLoad();
  }

  async searchProducts(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Wait for debounce
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
    await this.waitForPageLoad();
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectOption(option);
    await this.waitForPageLoad();
  }

  async getProductCard(productId: string): Promise<Locator> {
    return this.page.getByTestId(`product-card-${productId}`);
  }

  async clickProduct(productId: string) {
    await this.page.getByTestId(`view-product-${productId}`).click();
  }

  async addToCart(productId: string) {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  async isNoResultsVisible(): Promise<boolean> {
    return await this.noResultsMessage.isVisible();
  }
}
```

### Solution: ShoppingCartPage

```typescript
// tests/pages/ShoppingCartPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShoppingCartPage extends BasePage {
  readonly cartItems: Locator;
  readonly subtotal: Locator;
  readonly discountInput: Locator;
  readonly applyDiscountButton: Locator;
  readonly discountAmount: Locator;
  readonly total: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-testid^="cart-item-"]');
    this.subtotal = page.getByTestId('cart-subtotal');
    this.discountInput = page.getByTestId('discount-input');
    this.applyDiscountButton = page.getByTestId('apply-discount');
    this.discountAmount = page.getByTestId('discount-amount');
    this.total = page.getByTestId('cart-total');
    this.checkoutButton = page.getByTestId('checkout-button');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
    this.emptyCartMessage = page.getByText(/your cart is empty/i);
  }

  async goto() {
    await this.page.goto('/cart');
    await this.waitForPageLoad();
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async updateQuantity(productId: string, quantity: number) {
    const quantityInput = this.page.getByTestId(`quantity-${productId}`);
    await quantityInput.fill(quantity.toString());
  }

  async removeItem(productId: string) {
    await this.page.getByTestId(`remove-${productId}`).click();
  }

  async applyDiscountCode(code: string) {
    await this.discountInput.fill(code);
    await this.applyDiscountButton.click();
  }

  async getSubtotal(): Promise<string> {
    return await this.subtotal.textContent() || '0';
  }

  async getTotal(): Promise<string> {
    return await this.total.textContent() || '0';
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async isCartEmpty(): Promise<boolean> {
    return await this.emptyCartMessage.isVisible();
  }
}
```

### Solution: CheckoutPage

```typescript
// tests/pages/CheckoutPage.ts
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  // Personal Information
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;

  // Shipping Address
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;

  // Payment
  readonly cardNumberInput: Locator;
  readonly expiryInput: Locator;
  readonly cvvInput: Locator;

  // Actions
  readonly submitButton: Locator;
  readonly backButton: Locator;

  // Validation
  readonly errorMessages: Locator;

  constructor(page: Page) {
    super(page);
    
    // Personal Information
    this.firstNameInput = page.getByTestId('first-name');
    this.lastNameInput = page.getByTestId('last-name');
    this.emailInput = page.getByTestId('email');
    this.phoneInput = page.getByTestId('phone');

    // Shipping Address
    this.addressInput = page.getByTestId('address');
    this.cityInput = page.getByTestId('city');
    this.stateInput = page.getByTestId('state');
    this.zipCodeInput = page.getByTestId('zip-code');

    // Payment
    this.cardNumberInput = page.getByTestId('card-number');
    this.expiryInput = page.getByTestId('card-expiry');
    this.cvvInput = page.getByTestId('card-cvv');

    // Actions
    this.submitButton = page.getByTestId('submit-order');
    this.backButton = page.getByTestId('back-to-cart');

    // Validation
    this.errorMessages = page.locator('[data-testid^="error-"]');
  }

  async goto() {
    await this.page.goto('/checkout');
    await this.waitForPageLoad();
  }

  async fillPersonalInfo(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
  }

  async fillShippingAddress(data: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }) {
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.selectOption(data.state);
    await this.zipCodeInput.fill(data.zipCode);
  }

  async fillPaymentDetails(data: {
    cardNumber: string;
    expiry: string;
    cvv: string;
  }) {
    await this.cardNumberInput.fill(data.cardNumber);
    await this.expiryInput.fill(data.expiry);
    await this.cvvInput.fill(data.cvv);
  }

  async submitOrder() {
    await this.submitButton.click();
  }

  async goBackToCart() {
    await this.backButton.click();
  }

  async getErrorMessages(): Promise<string[]> {
    const errors = await this.errorMessages.all();
    return Promise.all(errors.map(error => error.textContent() || ''));
  }

  async hasError(field: string): Promise<boolean> {
    return await this.page.getByTestId(`error-${field}`).isVisible();
  }
}
```

## 🧪 Task 2: User Journey Tests

### Solution: Complete Purchase Flow

```typescript
// tests/user-journeys/complete-purchase.spec.ts
import { test, expect } from '@playwright/test';
import { ProductCatalogPage } from '../pages/ProductCatalogPage';
import { ShoppingCartPage } from '../pages/ShoppingCartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { generateTestUser, TEST_CREDIT_CARD } from '../helpers/test-utils';

test.describe('Complete Purchase Journey', () => {
  test('guest user can complete purchase from browsing to confirmation', async ({ page }) => {
    // 1. Browse products
    const catalogPage = new ProductCatalogPage(page);
    await catalogPage.goto();
    await expect(page).toHaveURL('/products');

    // 2. Search for products
    await catalogPage.searchProducts('headphones');
    const productCount = await catalogPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // 3. Add first product to cart
    await catalogPage.addToCart('1');
    await expect(page.getByTestId('cart-badge')).toHaveText('1');

    // 4. Continue shopping and add another product
    await catalogPage.searchProducts('watch');
    await catalogPage.addToCart('2');
    await expect(page.getByTestId('cart-badge')).toHaveText('2');

    // 5. Go to cart
    const cartPage = new ShoppingCartPage(page);
    await cartPage.goto();
    expect(await cartPage.getCartItemCount()).toBe(2);

    // 6. Update quantity
    await cartPage.updateQuantity('1', 2);
    await page.waitForTimeout(500);

    // 7. Apply discount code
    await cartPage.applyDiscountCode('SAVE10');
    await expect(cartPage.discountAmount).toBeVisible();

    // 8. Proceed to checkout
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL('/checkout');

    // 9. Fill checkout form
    const checkoutPage = new CheckoutPage(page);
    const testUser = generateTestUser();

    await checkoutPage.fillPersonalInfo({
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      email: testUser.email,
      phone: testUser.phone
    });

    await checkoutPage.fillShippingAddress({
      address: testUser.address,
      city: testUser.city,
      state: testUser.state,
      zipCode: testUser.zipCode
    });

    await checkoutPage.fillPaymentDetails({
      cardNumber: TEST_CREDIT_CARD.number,
      expiry: TEST_CREDIT_CARD.expiry,
      cvv: TEST_CREDIT_CARD.cvv
    });

    // 10. Submit order
    await checkoutPage.submitOrder();

    // 11. Verify confirmation page
    await expect(page).toHaveURL(/\/confirmation/);
    await expect(page.getByTestId('order-success')).toBeVisible();
    await expect(page.getByTestId('order-number')).toBeVisible();
  });

  test('authenticated user can complete purchase with saved information', async ({ page }) => {
    // TODO: Implement authenticated user purchase flow
    // 1. Login first
    // 2. Navigate to products
    // 3. Add items to cart
    // 4. Checkout with saved address
    // 5. Verify order confirmation
  });
});
```

## 🔍 Task 3: Error Handling Tests

### Solution: Form Validation Tests

```typescript
// tests/edge-cases/checkout-validation.spec.ts
import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Form Validation', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    await checkoutPage.goto();
  });

  test('should show error for empty required fields', async ({ page }) => {
    await checkoutPage.submitOrder();

    // Verify all required field errors are shown
    await expect(checkoutPage.hasError('first-name')).resolves.toBeTruthy();
    await expect(checkoutPage.hasError('last-name')).resolves.toBeTruthy();
    await expect(checkoutPage.hasError('email')).resolves.toBeTruthy();
    await expect(checkoutPage.hasError('address')).resolves.toBeTruthy();
    
    // Form should not be submitted
    await expect(page).toHaveURL('/checkout');
  });

  test('should show error for invalid email format', async ({ page }) => {
    await checkoutPage.emailInput.fill('invalid-email');
    await checkoutPage.submitOrder();

    const errorMessage = page.getByTestId('error-email');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Invalid email');
  });

  test('should show error for invalid phone number', async ({ page }) => {
    await checkoutPage.phoneInput.fill('123');
    await checkoutPage.submitOrder();

    await expect(page.getByTestId('error-phone')).toBeVisible();
  });

  test('should show error for invalid credit card', async ({ page }) => {
    await checkoutPage.cardNumberInput.fill('1234567890');
    await checkoutPage.submitOrder();

    await expect(page.getByTestId('error-card-number')).toBeVisible();
  });

  test('should show error for invalid zip code', async ({ page }) => {
    await checkoutPage.zipCodeInput.fill('ABC');
    await checkoutPage.submitOrder();

    await expect(page.getByTestId('error-zip-code')).toBeVisible();
  });

  test('errors should clear when fields are corrected', async ({ page }) => {
    // Submit empty form
    await checkoutPage.submitOrder();
    await expect(checkoutPage.hasError('email')).resolves.toBeTruthy();

    // Fill correct email
    await checkoutPage.emailInput.fill('test@example.com');
    await page.waitForTimeout(300);

    // Error should be cleared
    await expect(page.getByTestId('error-email')).not.toBeVisible();
  });
});
```

## ♿ Task 4: Accessibility Tests

### Solution: Accessibility Testing

```typescript
// tests/accessibility/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should not have accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('product catalog should be accessible', async ({ page }) => {
    await page.goto('/products');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('checkout form should be keyboard navigable', async ({ page }) => {
    await page.goto('/checkout');
    
    // Tab through form fields
    await page.keyboard.press('Tab'); // First name
    await expect(page.getByTestId('first-name')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Last name
    await expect(page.getByTestId('last-name')).toBeFocused();
    
    await page.keyboard.press('Tab'); // Email
    await expect(page.getByTestId('email')).toBeFocused();
    
    // Verify tab order is logical
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
      expect(alt?.length).toBeGreaterThan(0);
    }
  });

  test('form inputs should have associated labels', async ({ page }) => {
    await page.goto('/checkout');
    
    const inputs = await page.locator('input[type="text"], input[type="email"]').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });
});
```

## 📱 Task 5: Responsive Tests

### Solution: Responsive Design Tests

```typescript
// tests/responsive/mobile.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 12'] });

test.describe('Mobile Responsive Tests', () => {
  test('mobile navigation menu should work', async ({ page }) => {
    await page.goto('/');
    
    // Hamburger menu should be visible on mobile
    const menuButton = page.getByTestId('mobile-menu-button');
    await expect(menuButton).toBeVisible();
    
    // Regular nav links should be hidden
    await expect(page.getByTestId('desktop-nav')).not.toBeVisible();
    
    // Open menu
    await menuButton.click();
    const mobileMenu = page.getByTestId('mobile-menu');
    await expect(mobileMenu).toBeVisible();
    
    // Click a menu item
    await page.getByTestId('mobile-nav-products').click();
    await expect(page).toHaveURL('/products');
    
    // Menu should close
    await expect(mobileMenu).not.toBeVisible();
  });

  test('product grid should adapt to mobile viewport', async ({ page }) => {
    await page.goto('/products');
    
    const productGrid = page.getByTestId('product-grid');
    const box = await productGrid.boundingBox();
    
    // Grid should be full width on mobile
    expect(box?.width).toBeLessThanOrEqual(375);
    
    // Products should stack vertically (1 column)
    const firstProduct = page.getByTestId('product-card-1');
    const secondProduct = page.getByTestId('product-card-2');
    
    const firstBox = await firstProduct.boundingBox();
    const secondBox = await secondProduct.boundingBox();
    
    // Second product should be below first (not side by side)
    expect(secondBox?.y).toBeGreaterThan(firstBox?.y! + firstBox?.height!);
  });

  test('cart should be usable on mobile', async ({ page }) => {
    // TODO: Test mobile cart interactions
  });
});
```

## 🎯 Best Practices

### 1. Use Page Object Model
✅ **DO**: Encapsulate page logic in page objects
```typescript
const catalogPage = new ProductCatalogPage(page);
await catalogPage.searchProducts('laptop');
```

❌ **DON'T**: Write selectors directly in tests
```typescript
await page.getByTestId('search-input').fill('laptop');
```

### 2. Write Independent Tests
✅ **DO**: Each test should be independent
```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/products');
});
```

❌ **DON'T**: Rely on test execution order
```typescript
// Bad: Test 2 depends on Test 1
```

### 3. Use Proper Waits
✅ **DO**: Wait for conditions
```typescript
await expect(page.getByTestId('cart-badge')).toHaveText('1');
```

❌ **DON'T**: Use arbitrary timeouts
```typescript
await page.waitForTimeout(3000);
```

### 4. Use Data-TestId Selectors
✅ **DO**: Use semantic test IDs
```typescript
await page.getByTestId('checkout-button').click();
```

❌ **DON'T**: Use CSS classes or brittle selectors
```typescript
await page.locator('.btn.btn-primary.checkout').click();
```

## ⚠️ Common Pitfalls

### 1. Not Waiting for Elements
**Problem**: Test fails intermittently
```typescript
// Bad
await page.click('#submit');
```

**Solution**: Use proper assertions
```typescript
// Good
const submitButton = page.locator('#submit');
await expect(submitButton).toBeVisible();
await submitButton.click();
```

### 2. Hardcoding Test Data
**Problem**: Tests fail when data changes
```typescript
// Bad
await expect(page.getByText('$299.99')).toBeVisible();
```

**Solution**: Use dynamic assertions
```typescript
// Good
const price = await page.getByTestId('product-price').textContent();
expect(parseFloat(price!)).toBeGreaterThan(0);
```

### 3. Not Cleaning Up Test Data
**Problem**: Tests interfere with each other
**Solution**: Use fixtures and cleanup
```typescript
test.afterEach(async ({ page }) => {
  // Clear cart
  await page.evaluate(() => localStorage.clear());
});
```

## 🏆 Success Criteria Checklist

- [ ] 25+ comprehensive test scenarios
- [ ] Page Object Model implemented for all pages
- [ ] All user journeys covered
- [ ] Error scenarios tested
- [ ] Accessibility tests included
- [ ] Responsive design tested
- [ ] Tests are independent and reliable
- [ ] Good test coverage report
- [ ] Documentation complete

---

**Need help?** Refer to [COPILOT_PROMPTS.md](./COPILOT_PROMPTS.md) for effective prompting strategies!
