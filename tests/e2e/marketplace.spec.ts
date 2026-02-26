import { expect, test } from '@playwright/test'

test.describe('marketplace and negotiation flows', () => {
  test('make offer flow', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.getByPlaceholder('you@example.com').fill('buyer@secondchance.dev')
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.goto('/inbox')
    await page.getByPlaceholder('Offer amount').fill('1300')
    await page.getByRole('button', { name: 'Make offer' }).click()
  })

  test('counter and accept flow', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.getByPlaceholder('you@example.com').fill('seller@secondchance.dev')
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.goto('/seller')
    await expect(page.getByText('Seller Workspace')).toBeVisible()
  })

  test('cancel flow', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.getByPlaceholder('you@example.com').fill('buyer@secondchance.dev')
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.goto('/inbox')
    await page.getByRole('button', { name: 'Cancel offer' }).click()
  })

  test('reveal contact flow', async ({ page }) => {
    await page.goto('/auth/signin')
    await page.getByPlaceholder('you@example.com').fill('buyer@secondchance.dev')
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.goto('/marketplace')
    await page.getByRole('link').first().click()
    await page.getByRole('button', { name: 'Reveal phone' }).click()
    await page.getByRole('button', { name: 'Reveal email' }).click()
  })
})
