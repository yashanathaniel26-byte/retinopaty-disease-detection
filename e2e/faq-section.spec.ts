import { test, expect } from '@playwright/test';

test.describe('FAQ Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Scroll to FAQ section
    const faqSection = page.locator('section#faq');
    await faqSection.scrollIntoViewIfNeeded();
  });

  test('should display FAQ section with heading', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    await expect(faqSection).toBeVisible();
    
    const heading = faqSection.locator('text=Pertanyaan yang sering muncul');
    await expect(heading).toBeVisible();
  });

  test('should display FAQ label', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const label = faqSection.locator('text=FAQ');
    await expect(label).toBeVisible();
  });

  test('should display contact information text', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const contactText = faqSection.locator('text=Butuh info tambahan');
    await expect(contactText).toBeVisible();
  });

  test('should display multiple FAQ cards', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const faqCards = faqSection.locator('div.rounded-2xl.border.border-slate-200');
    const count = await faqCards.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should display FAQ questions in cards', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const questions = faqSection.locator('h3.text-sm.font-semibold');
    const count = await questions.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should display FAQ answers in cards', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const answers = faqSection.locator('p.mt-2.text-sm.text-slate-600, p.mt-3.text-sm.text-slate-600');
    const count = await answers.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should have proper responsive grid layout', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const gridContainer = faqSection.locator('div.grid');
    const gridClass = await gridContainer.getAttribute('class');
    
    expect(gridClass).toContain('md:grid-cols-3');
  });

  test('should have proper card styling', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const cards = faqSection.locator('div.rounded-2xl.border.border-slate-200');
    const firstCard = cards.first();
    
    const cardClass = await firstCard.getAttribute('class');
    expect(cardClass).toContain('bg-white');
    expect(cardClass).toContain('shadow-sm');
  });

  test('should have proper responsive padding', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const cards = faqSection.locator('div.rounded-2xl.border.border-slate-200');
    const firstCard = cards.first();
    
    const cardClass = await firstCard.getAttribute('class');
    expect(cardClass).toContain('p-5');
    expect(cardClass).toContain('sm:p-6');
  });

  test('should have scroll reveal animations', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const revealElements = faqSection.locator('.reveal');
    const count = await revealElements.count();
    
    expect(count).toBeGreaterThan(0);
  });

  test('should display all FAQ content without truncation', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const cards = faqSection.locator('div.rounded-2xl.border.border-slate-200');
    const firstCard = cards.first();
    
    // Check that content is visible
    const question = firstCard.locator('h3');
    await expect(question).toBeVisible();
    
    const answer = firstCard.locator('p.mt-2, p.mt-3');
    await expect(answer).toBeVisible();
  });

  test('should have proper text sizing for mobile and desktop', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const heading = faqSection.locator('h2');
    const headingClass = await heading.getAttribute('class');
    
    expect(headingClass).toContain('text-2xl');
    expect(headingClass).toContain('sm:text-3xl');
  });

  test('should have proper spacing between sections', async ({ page }) => {
    const faqSection = page.locator('section#faq');
    
    const sectionClass = await faqSection.getAttribute('class');
    expect(sectionClass).toContain('mt-16');
    expect(sectionClass).toContain('sm:mt-20');
  });
});
