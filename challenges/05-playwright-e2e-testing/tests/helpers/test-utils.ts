import { Page } from '@playwright/test';

/**
 * Test utilities and helper functions
 */

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function takeScreenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

export function generateTestEmail(): string {
  const timestamp = Date.now();
  return `test-user-${timestamp}@example.com`;
}

export function generateTestUser() {
  const timestamp = Date.now();
  return {
    firstName: 'Test',
    lastName: 'User',
    email: `test-${timestamp}@example.com`,
    password: 'TestPass123!',
    phone: '555-123-4567',
    address: '123 Test Street',
    city: 'Test City',
    state: 'CA',
    zipCode: '12345'
  };
}

export const TEST_CREDIT_CARD = {
  number: '4532015112830366', // Valid test card number (Luhn algorithm)
  cvv: '123',
  expiry: '12/25',
  name: 'Test User'
};
