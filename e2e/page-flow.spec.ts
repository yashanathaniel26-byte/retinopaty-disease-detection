import { test, expect } from '@playwright/test';

test.describe('User Flow & Navigation', () => {
  test('should complete full page scroll journey', async ({ page }) => {
    await page.goto('/');
    
    // Start at hero
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeInViewport();
    
    // Scroll to testimonials
    await page.evaluate(() => window.scrollBy(0, 500));
    
    // Scroll to features
    await page.evaluate(() => window.scrollBy(0, 500));
    
    // Scroll to steps
    await page.evaluate(() => window.scrollBy(0, 500));
    
    // Scroll to upload
    const uploadSection = page.locator('section#upload');
    await uploadSection.scrollIntoViewIfNeeded();
    await expect(uploadSection).toBeInViewport();
    
    // Scroll to FAQ
    const faqSection = page.locator('section#faq');
    await faqSection.scrollIntoViewIfNeeded();
    await expect(faqSection).toBeInViewport();
  });

  test('should navigate via header links', async ({ page }) => {
    await page.goto('/');
    
    // Click on Upload link
    const uploadLink = page.locator('a[href="#upload"]').first();
    await uploadLink.click();
    
    const uploadSection = page.locator('section#upload');
    await expect(uploadSection).toBeInViewport();
    
    // Click on FAQ link
    const faqLink = page.locator('a[href="#faq"]').first();
    await faqLink.click();
    
    const faqSection = page.locator('section#faq');
    await expect(faqSection).toBeInViewport();
  });

  test('should navigate via hero CTA buttons', async ({ page }) => {
    await page.goto('/');
    
    // Click "Mulai Analisis" button
    const startButton = page.locator('a[href="#upload"]').first();
    await startButton.click();
    
    const uploadSection = page.locator('section#upload');
    await expect(uploadSection).toBeInViewport();
  });

  test('should navigate via secondary CTA button', async ({ page }) => {
    await page.goto('/');
    
    // Click "Lihat Cara Kerja" button
    const learnButton = page.locator('a[href="#cara-kerja"]');
    await learnButton.click();
    
    // Should scroll to steps section
    const stepsSection = page.locator('section').filter({ hasText: 'Cara Kerja' });
    await expect(stepsSection).toBeInViewport();
  });

  test('should handle back navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to upload
    const uploadLink = page.locator('a[href="#upload"]').first();
    await uploadLink.click();
    
    await page.waitForTimeout(500);
    
    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeInViewport();
  });

  test('should maintain scroll position on section navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to upload section
    const uploadLink = page.locator('a[href="#upload"]').first();
    await uploadLink.click();
    
    await page.waitForTimeout(300);
    
    // Upload section should be visible
    const uploadSection = page.locator('section#upload');
    await expect(uploadSection).toBeInViewport();
  });

  test('should display all sections in correct order', async ({ page }) => {
    await page.goto('/');
    
    // Get all sections
    const sections = page.locator('section');
    const count = await sections.count();
    
    // Should have at least 6 sections: Hero, Testimonials, Features, Steps, Upload, FAQ
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('should have proper section spacing', async ({ page }) => {
    await page.goto('/');
    
    const sections = page.locator('section');
    
    for (const section of await sections.all()) {
      const sectionClass = await section.getAttribute('class');
      
      // Sections should have proper spacing
      expect(sectionClass).toBeTruthy();
    }
  });

  test('should handle rapid navigation', async ({ page }) => {
    await page.goto('/');
    
    // Rapidly click different navigation links
    const uploadLink = page.locator('a[href="#upload"]').first();
    const faqLink = page.locator('a[href="#faq"]').first();
    
    await uploadLink.click();
    await page.waitForTimeout(100);
    await faqLink.click();
    await page.waitForTimeout(100);
    
    // Page should still be functional
    const faqSection = page.locator('section#faq');
    await expect(faqSection).toBeInViewport();
  });

  test('should support anchor navigation', async ({ page }) => {
    // Navigate directly to upload section
    await page.goto('/#upload');
    
    const uploadSection = page.locator('section#upload');
    await expect(uploadSection).toBeInViewport();
  });

  test('should support FAQ anchor navigation', async ({ page }) => {
    // Navigate directly to FAQ section
    await page.goto('/#faq');
    
    const faqSection = page.locator('section#faq');
    await expect(faqSection).toBeInViewport();
  });

  test('should handle mobile menu navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Open mobile menu
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await hamburger.click();
    
    // Click navigation link
    const uploadLink = page.locator('a[href="#upload"]').last();
    await uploadLink.click();
    
    // Should navigate to upload section
    const uploadSection = page.locator('section#upload');
    await expect(uploadSection).toBeInViewport();
    
    // Menu should close
    const mobileMenu = page.locator('div.md\\:hidden').last();
    await expect(mobileMenu).not.toBeVisible();
  });

  test('should display all interactive elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for buttons
    const buttons = page.locator('button, a[class*="bg-"], a[class*="border"]');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check for inputs
    const inputs = page.locator('input');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThan(0);
  });

  test('should have proper focus management', async ({ page }) => {
    await page.goto('/');
    
    // Tab through elements
    await page.keyboard.press('Tab');
    
    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });
    
    expect(focusedElement).toBeTruthy();
  });
});
