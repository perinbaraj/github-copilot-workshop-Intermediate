import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test('should display search input on products page', async ({ page }) => {
    await page.goto('/products');
    
    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', /search/i);
  });

  test('should filter products when searching', async ({ page }) => {
    await page.goto('/products');
    
    // Type in search box
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('headphones');
    
    // Wait for results to update
    await page.waitForTimeout(500);
    
    // Check that filtered products are displayed
    const productCards = page.locator('[data-testid^="product-card-"]');
    await expect(productCards).not.toHaveCount(0);
  });

  test('should show no results message for invalid search', async ({ page }) => {
    await page.goto('/products');
    
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('nonexistentproduct12345');
    
    await page.waitForTimeout(500);
    
    // Should show "no results" message
    const noResults = page.getByText(/no products found/i);
    await expect(noResults).toBeVisible();
  });
});
