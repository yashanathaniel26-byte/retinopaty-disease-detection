import { test, expect } from '@playwright/test';

test.describe('Header & Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display header with logo', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    const logo = page.locator('text=RETINA CARE');
    await expect(logo).toBeVisible();
  });

  test('should display desktop navigation links', async ({ page }) => {
    const navLinks = ['Fitur', 'Cara Kerja', 'Upload', 'FAQ'];
    
    for (const link of navLinks) {
      const element = page.locator(`a:has-text("${link}")`).first();
      await expect(element).toBeVisible();
    }
  });

  test('should hide desktop nav and show hamburger on mobile', async ({ page }) => {
    // Desktop view
    const desktopNav = page.locator('div.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();
    
    // Mobile hamburger should be visible
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await expect(hamburger).toBeVisible();
  });

  test('should toggle mobile menu when hamburger is clicked', async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    const mobileMenu = page.locator('div.md\\:hidden').last();
    
    // Menu should not be visible initially
    await expect(mobileMenu).not.toBeVisible();
    
    // Click hamburger
    await hamburger.click();
    await expect(mobileMenu).toBeVisible();
    
    // Click again to close
    await hamburger.click();
    await expect(mobileMenu).not.toBeVisible();
  });

  test('should close mobile menu when navigation link is clicked', async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    
    // Open menu
    await hamburger.click();
    
    // Click a navigation link
    const fiturLink = page.locator('a[href="#fitur"]').last();
    await fiturLink.click();
    
    // Menu should close
    const mobileMenu = page.locator('div.md\\:hidden').last();
    await expect(mobileMenu).not.toBeVisible();
  });

  test('should navigate to sections via header links', async ({ page }) => {
    const uploadLink = page.locator('a[href="#upload"]').first();
    await uploadLink.click();
    
    // Wait for navigation and check if upload section is in view
    const uploadSection = page.locator('section#upload');
    await expect(uploadSection).toBeInViewport();
  });

  test('should have sticky header positioning', async ({ page }) => {
    const header = page.locator('header');
    const headerClass = await header.getAttribute('class');
    
    expect(headerClass).toContain('fixed');
    expect(headerClass).toContain('top-0');
  });

  test('should have proper z-index for header', async ({ page }) => {
    const header = page.locator('header');
    const headerClass = await header.getAttribute('class');
    
    expect(headerClass).toContain('z-30');
  });
});
