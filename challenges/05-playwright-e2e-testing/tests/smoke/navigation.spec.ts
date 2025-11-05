import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should display all navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check that all main navigation links are visible
    await expect(page.getByTestId('nav-products')).toBeVisible();
    await expect(page.getByTestId('nav-cart')).toBeVisible();
    await expect(page.getByTestId('nav-account')).toBeVisible();
  });

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByTestId('nav-products').click();
    await expect(page).toHaveURL('/products');
  });

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByTestId('nav-cart').click();
    await expect(page).toHaveURL('/cart');
  });

  test('should navigate to account page', async ({ page }) => {
    await page.goto('/');
    
    await page.getByTestId('nav-account').click();
    await expect(page).toHaveURL('/account');
  });

  test('should return to homepage when clicking logo', async ({ page }) => {
    await page.goto('/products');
    
    await page.getByTestId('site-logo').click();
    await expect(page).toHaveURL('/');
  });
});
