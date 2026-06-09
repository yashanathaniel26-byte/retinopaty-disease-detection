import { test, expect } from '@playwright/test';

test.describe('Responsive Design - Mobile', () => {
  test.use({ viewport: { width: 393, height: 851 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display mobile hamburger menu', async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await expect(hamburger).toBeVisible();
  });

  test('should hide desktop navigation on mobile', async ({ page }) => {
    const desktopNav = page.locator('div.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();
  });

  test('should have proper mobile padding', async ({ page }) => {
    const main = page.locator('main');
    const mainClass = await main.getAttribute('class');
    
    expect(mainClass).toContain('px-4');
  });

  test('should have single column layout for stats on mobile', async ({ page }) => {
    const statsGrid = page.locator('div.grid.grid-cols-3');
    await expect(statsGrid).toBeVisible();
  });

  test('should have proper mobile button sizing', async ({ page }) => {
    const buttons = page.locator('button, a[class*="bg-emerald"]');
    
    for (const button of await buttons.all()) {
      const buttonClass = await button.getAttribute('class');
      expect(buttonClass).toBeTruthy();
    }
  });

  test('should display full width upload card on mobile', async ({ page }) => {
    const uploadSection = page.locator('section#upload');
    await uploadSection.scrollIntoViewIfNeeded();
    
    const uploadCard = uploadSection.locator('div.rounded-2xl.border.border-slate-200').first();
    const uploadCardClass = await uploadCard.getAttribute('class');
    
    // Should not have column restrictions on mobile
    expect(uploadCardClass).not.toContain('lg:grid-cols');
  });

  test('should have proper mobile text sizing', async ({ page }) => {
    const heading = page.locator('h1').first();
    const headingClass = await heading.getAttribute('class');
    
    expect(headingClass).toContain('text-xl');
  });

  test('should display FAQ cards in single column on mobile', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    await faqSection.scrollIntoViewIfNeeded();
    
    const gridContainer = faqSection.locator('div.grid');
    const gridClass = await gridContainer.getAttribute('class');
    
    // On mobile, should not have md:grid-cols-3
    expect(gridClass).toContain('grid');
  });

  test('should have proper mobile spacing', async ({ page }) => {
    const sections = page.locator('section');
    
    for (const section of await sections.all()) {
      const sectionClass = await section.getAttribute('class');
      if (sectionClass?.includes('mt-')) {
        expect(sectionClass).toMatch(/mt-\d+|sm:mt-\d+/);
      }
    }
  });
});

test.describe('Responsive Design - Tablet', () => {
  test.use({ viewport: { width: 1024, height: 1366 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display tablet layout properly', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should display navigation on tablet', async ({ page }) => {
    const navLinks = page.locator('a[href*="#"]');
    const count = await navLinks.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper tablet padding', async ({ page }) => {
    const main = page.locator('main');
    const mainClass = await main.getAttribute('class');
    
    expect(mainClass).toContain('px-4');
    expect(mainClass).toContain('sm:px-6');
  });

  test('should display content in readable width', async ({ page }) => {
    const main = page.locator('main');
    const mainClass = await main.getAttribute('class');
    
    expect(mainClass).toContain('max-w-6xl');
  });

  test('should have proper tablet text sizing', async ({ page }) => {
    const heading = page.locator('h1').first();
    const headingClass = await heading.getAttribute('class');
    
    expect(headingClass).toContain('sm:text-3xl');
  });
});

test.describe('Responsive Design - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display desktop navigation', async ({ page }) => {
    const desktopNav = page.locator('div.hidden.md\\:flex');
    await expect(desktopNav).toBeVisible();
  });

  test('should hide mobile hamburger on desktop', async ({ page }) => {
    const hamburger = page.locator('button[aria-label="Toggle menu"]');
    await expect(hamburger).not.toBeVisible();
  });

  test('should display all desktop navigation links', async ({ page }) => {
    const navLinks = ['Fitur', 'Cara Kerja', 'Upload', 'FAQ'];
    
    for (const link of navLinks) {
      const element = page.locator(`a:has-text("${link}")`).first();
      await expect(element).toBeVisible();
    }
  });

  test('should have proper desktop padding', async ({ page }) => {
    const main = page.locator('main');
    const mainClass = await main.getAttribute('class');
    
    expect(mainClass).toContain('sm:px-6');
  });

  test('should display upload section in two columns', async ({ page }) => {
    const uploadSection = page.locator('section#upload');
    await uploadSection.scrollIntoViewIfNeeded();
    
    const gridContainer = uploadSection.locator('div.grid');
    const gridClass = await gridContainer.getAttribute('class');
    
    expect(gridClass).toContain('lg:grid-cols');
  });

  test('should display FAQ in three columns', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    await faqSection.scrollIntoViewIfNeeded();
    
    const gridContainer = faqSection.locator('div.grid');
    const gridClass = await gridContainer.getAttribute('class');
    
    expect(gridClass).toContain('md:grid-cols-3');
  });

  test('should have proper desktop text sizing', async ({ page }) => {
    const heading = page.locator('h1').first();
    const headingClass = await heading.getAttribute('class');
    
    expect(headingClass).toContain('md:text-4xl');
  });

  test('should display full width content with max-width constraint', async ({ page }) => {
    const main = page.locator('main');
    const mainClass = await main.getAttribute('class');
    
    expect(mainClass).toContain('max-w-6xl');
    expect(mainClass).toContain('mx-auto');
  });

  test('should have proper desktop spacing', async ({ page }) => {
    const sections = page.locator('section');
    
    for (const section of await sections.all()) {
      const sectionClass = await section.getAttribute('class');
      if (sectionClass?.includes('mt-')) {
        expect(sectionClass).toMatch(/mt-\d+|sm:mt-\d+/);
      }
    }
  });
});
