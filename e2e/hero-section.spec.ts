import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display hero section with all elements', async ({ page }) => {
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });

  test('should display hero tagline', async ({ page }) => {
    const tagline = page.locator('text=AI Screening Retinopati');
    await expect(tagline).toBeVisible();
  });

  test('should display main hero heading', async ({ page }) => {
    const heading = page.locator('text=Retinopathy insight, cepat dan klinis');
    await expect(heading).toBeVisible();
  });

  test('should display hero description', async ({ page }) => {
    const description = page.locator('text=Bantu klinik merangkum risiko');
    await expect(description).toBeVisible();
  });

  test('should display primary CTA button "Mulai Analisis"', async ({ page }) => {
    const ctaButton = page.locator('a:has-text("Mulai Analisis")').first();
    await expect(ctaButton).toBeVisible();
    
    const buttonClass = await ctaButton.getAttribute('class');
    expect(buttonClass).toContain('bg-emerald-600');
  });

  test('should display secondary CTA button "Lihat Cara Kerja"', async ({ page }) => {
    const secondaryButton = page.locator('a:has-text("Lihat Cara Kerja")');
    await expect(secondaryButton).toBeVisible();
    
    const buttonClass = await secondaryButton.getAttribute('class');
    expect(buttonClass).toContain('border');
  });

  test('should navigate to upload section when "Mulai Analisis" is clicked', async ({ page }) => {
    const ctaButton = page.locator('a[href="#upload"]').first();
    await ctaButton.click();
    
    const uploadSection = page.locator('section#upload');
    await expect(uploadSection).toBeInViewport();
  });

  test('should navigate to steps section when "Lihat Cara Kerja" is clicked', async ({ page }) => {
    const secondaryButton = page.locator('a[href="#cara-kerja"]');
    await secondaryButton.click();
    
    const stepsSection = page.locator('section').filter({ hasText: 'Cara Kerja' });
    await expect(stepsSection).toBeInViewport();
  });

  test('should display stats cards', async ({ page }) => {
    const statsCards = page.locator('div.rounded-2xl.border.border-slate-200').first().locator('..').locator('div.rounded-2xl.border.border-slate-200');
    const count = await statsCards.count();
    
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('should display stats with values and labels', async ({ page }) => {
    const statsSection = page.locator('section').first();
    
    // Check for stat values (numbers)
    const statValues = statsSection.locator('p.text-lg.font-semibold, p.text-2xl.font-semibold');
    const valueCount = await statValues.count();
    
    expect(valueCount).toBeGreaterThanOrEqual(3);
  });

  test('should have proper responsive padding on mobile', async ({ page }) => {
    const mainSection = page.locator('main');
    const mainClass = await mainSection.getAttribute('class');
    
    expect(mainClass).toContain('px-4');
    expect(mainClass).toContain('sm:px-6');
  });

  test('should have proper text sizing for mobile and desktop', async ({ page }) => {
    const heading = page.locator('h1').first();
    const headingClass = await heading.getAttribute('class');
    
    expect(headingClass).toContain('text-xl');
    expect(headingClass).toContain('sm:text-3xl');
    expect(headingClass).toContain('md:text-4xl');
  });

  test('should display scroll reveal animations', async ({ page }) => {
    const revealElements = page.locator('.reveal');
    const count = await revealElements.count();
    
    expect(count).toBeGreaterThan(0);
  });
});
