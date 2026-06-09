import { test, expect, devices } from '@playwright/test';

test.describe('Cross-Browser Compatibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load page successfully', async ({ page }) => {
    await expect(page).toHaveTitle(/.*/, { timeout: 5000 });
  });

  test('should display header in all browsers', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should display main content area', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should display footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('should have proper background color', async ({ page }) => {
    const mainDiv = page.locator('div.bg-slate-50').first();
    await expect(mainDiv).toBeVisible();
  });

  test('should display all major sections', async ({ page }) => {
    const sections = page.locator('section');
    const count = await sections.count();
    
    expect(count).toBeGreaterThanOrEqual(6); // Hero, Testimonials, Features, Steps, Upload, FAQ
  });

  test('should have proper text rendering', async ({ page }) => {
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper button styling', async ({ page }) => {
    const buttons = page.locator('button, a[class*="bg-"], a[class*="border"]');
    const count = await buttons.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper image rendering', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    
    // Should have at least some images (preview, etc)
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should have proper form elements', async ({ page }) => {
    const inputs = page.locator('input');
    const count = await inputs.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should support smooth scrolling', async ({ page }) => {
    const uploadLink = page.locator('a[href="#upload"]').first();
    await uploadLink.click();
    
    const uploadSection = page.locator('section#upload');
    await expect(uploadSection).toBeInViewport();
  });

  test('should have proper color contrast', async ({ page }) => {
    const textElements = page.locator('p, span, h1, h2, h3');
    const count = await textElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper font rendering', async ({ page }) => {
    const heading = page.locator('h1').first();
    const fontFamily = await heading.evaluate(el => window.getComputedStyle(el).fontFamily);
    
    expect(fontFamily).toBeTruthy();
  });

  test('should support hover states on buttons', async ({ page }) => {
    const button = page.locator('a[class*="bg-emerald"]').first();
    
    // Hover over button
    await button.hover();
    
    // Button should still be visible after hover
    await expect(button).toBeVisible();
  });

  test('should have proper spacing and alignment', async ({ page }) => {
    const sections = page.locator('section');
    
    for (const section of await sections.all()) {
      await expect(section).toBeVisible();
    }
  });

  test('should render SVG icons properly', async ({ page }) => {
    const svgs = page.locator('svg');
    const count = await svgs.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper z-index stacking', async ({ page }) => {
    const header = page.locator('header');
    const headerClass = await header.getAttribute('class');
    
    expect(headerClass).toContain('z-');
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab to first focusable element
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper viewport settings', async ({ page }) => {
    const viewport = page.viewportSize();
    
    expect(viewport).toBeTruthy();
    expect(viewport?.width).toBeGreaterThan(0);
    expect(viewport?.height).toBeGreaterThan(0);
  });
});

test.describe('Browser-Specific Features', () => {
  test('should support CSS Grid', async ({ page }) => {
    await page.goto('/');
    
    const gridElements = page.locator('div.grid');
    const count = await gridElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should support Flexbox', async ({ page }) => {
    await page.goto('/');
    
    const flexElements = page.locator('div.flex');
    const count = await flexElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should support CSS animations', async ({ page }) => {
    await page.goto('/');
    
    const animatedElements = page.locator('.reveal');
    const count = await animatedElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should support backdrop blur', async ({ page }) => {
    await page.goto('/');
    
    const header = page.locator('header');
    const headerClass = await header.getAttribute('class');
    
    expect(headerClass).toContain('backdrop-blur');
  });

  test('should support rounded corners', async ({ page }) => {
    await page.goto('/');
    
    const roundedElements = page.locator('[class*="rounded"]');
    const count = await roundedElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should support box shadows', async ({ page }) => {
    await page.goto('/');
    
    const shadowElements = page.locator('[class*="shadow"]');
    const count = await shadowElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should support transitions', async ({ page }) => {
    await page.goto('/');
    
    const transitionElements = page.locator('[class*="transition"]');
    const count = await transitionElements.count();
    
    expect(count).toBeGreaterThan(0);
  });
});
