import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/TechShop/);
    
    // Verify main heading is visible
    const heroTitle = page.getByTestId('hero-title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toHaveText('Welcome to TechShop');
  });

  test('should display site logo', async ({ page }) => {
    await page.goto('/');
    
    const logo = page.getByTestId('site-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('TechShop');
  });

  test('should display featured products section', async ({ page }) => {
    await page.goto('/');
    
    const featuredTitle = page.getByTestId('featured-title');
    await expect(featuredTitle).toBeVisible();
    await expect(featuredTitle).toHaveText('Featured Products');
    
    // Check that at least one product card is visible
    const firstProduct = page.getByTestId('product-card-1');
    await expect(firstProduct).toBeVisible();
  });

  test('should display all feature benefits', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByTestId('feature-shipping')).toBeVisible();
    await expect(page.getByTestId('feature-returns')).toBeVisible();
    await expect(page.getByTestId('feature-support')).toBeVisible();
  });

  test('should have working CTA button', async ({ page }) => {
    await page.goto('/');
    
    const ctaButton = page.getByTestId('hero-cta');
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveText('Shop Now');
  });
});
