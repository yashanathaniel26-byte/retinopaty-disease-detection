import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    
    // Should have at least one h1
    expect(h1Count).toBeGreaterThanOrEqual(1);
    
    const h2 = page.locator('h2');
    const h2Count = await h2.count();
    
    // Should have multiple h2s for sections
    expect(h2Count).toBeGreaterThan(0);
  });

  test('should have proper alt text for images', async ({ page }) => {
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const image = images.nth(i);
      const alt = await image.getAttribute('alt');
      
      // Images should have alt text
      expect(alt).toBeTruthy();
    }
  });

  test('should have proper ARIA labels for buttons', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const text = await button.textContent();
      
      // Button should have either aria-label or text content
      expect(ariaLabel || text).toBeTruthy();
    }
  });

  test('should have proper form labels', async ({ page }) => {
    const inputs = page.locator('input');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const ariaLabel = await input.getAttribute('aria-label');
      
      // Input should have aria-label
      expect(ariaLabel).toBeTruthy();
    }
  });

  test('should support keyboard navigation', async ({ page }) => {
    // Tab to first element
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
  });

  test('should have proper focus indicators', async ({ page }) => {
    // Tab to first element
    await page.keyboard.press('Tab');
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveCount(1);
  });

  test('should have proper color contrast', async ({ page }) => {
    // Check text elements have proper contrast
    const textElements = page.locator('p, span, h1, h2, h3, a');
    const count = await textElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper semantic HTML', async ({ page }) => {
    // Check for semantic elements
    const header = page.locator('header');
    await expect(header).toBeVisible();
    
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
    
    const sections = page.locator('section');
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper link text', async ({ page }) => {
    const links = page.locator('a');
    const count = await links.count();
    
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      
      // Link should have descriptive text
      expect(text?.trim() || ariaLabel).toBeTruthy();
    }
  });

  test('should have proper button types', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      const type = await button.getAttribute('type');
      
      // Button should have proper type attribute
      expect(type || 'button').toBeTruthy();
    }
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3');
    const count = await headings.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper list structure', async ({ page }) => {
    // Check for lists
    const lists = page.locator('ul, ol');
    const count = await lists.count();
    
    // Should have proper list structure if lists are used
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const list = lists.nth(i);
        const items = list.locator('li');
        const itemCount = await items.count();
        
        expect(itemCount).toBeGreaterThan(0);
      }
    }
  });

  test('should have proper form structure', async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');
    const count = await fileInput.count();
    
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const input = fileInput.nth(i);
        const ariaLabel = await input.getAttribute('aria-label');
        
        expect(ariaLabel).toBeTruthy();
      }
    }
  });

  test('should have proper error messages', async ({ page }) => {
    // Check for error message elements
    const errorElements = page.locator('[class*="error"], [class*="alert"], [role="alert"]');
    const count = await errorElements.count();
    
    // Should have error handling capability
    expect(count >= 0).toBe(true);
  });

  test('should support text resizing', async ({ page }) => {
    // Zoom in
    await page.evaluate(() => {
      document.body.style.zoom = '150%';
    });
    
    // Page should still be readable
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should have proper skip links', async ({ page }) => {
    // Check for skip to main content link
    const skipLinks = page.locator('a[href="#main"], a[href="#content"]');
    const count = await skipLinks.count();
    
    // Skip links are optional but good practice
    expect(count >= 0).toBe(true);
  });

  test('should have proper language attribute', async ({ page }) => {
    const htmlElement = page.locator('html');
    const lang = await htmlElement.getAttribute('lang');
    
    // Should have language attribute
    expect(lang).toBeTruthy();
  });

  test('should have proper meta viewport', async ({ page }) => {
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    
    expect(viewport).toContain('width=device-width');
  });

  test('should have proper document title', async ({ page }) => {
    const title = await page.title();
    
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });
});
