import { expect, test } from '@playwright/test'

test('sessão sobrevive ao reload e usa navegação lateral', async ({ page }) => {
  await page.goto('/entrar')
  await page.getByLabel('E-mail').fill('e2e@example.com')
  await page.getByLabel('Senha').fill('Test-Pass-2026!')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/painel$/)
  await expect(page.locator('aside.fut-sidebar')).toBeVisible()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('access_token'))).not.toBeNull()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('refresh_token'))).not.toBeNull()
  await page.reload()
  await expect(page).toHaveURL(/\/painel$/)
  await expect(page.getByRole('link', { name: /Equipes/ }).first()).toBeVisible()
})

test('logout limpa todos os tokens locais', async ({ page }) => {
  await page.goto('/entrar')
  await page.getByLabel('E-mail').fill('e2e@example.com')
  await page.getByLabel('Senha').fill('Test-Pass-2026!')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.getByRole('button', { name: 'Sair da conta' }).click()
  await expect(page).toHaveURL(/\/entrar$/)
  const stored = await page.evaluate(() => ({
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
  }))
  expect(stored).toEqual({ access: null, refresh: null })
})
