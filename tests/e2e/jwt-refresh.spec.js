import { expect, test } from '@playwright/test'

test('Axios renova access token expirado usando refresh persistido', async ({ page }) => {
  await page.goto('/entrar')
  await page.getByLabel('E-mail').fill('e2e@example.com')
  await page.getByLabel('Senha').fill('Test-Pass-2026!')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/painel$/)
  const refresh = await page.evaluate(() => localStorage.getItem('refresh_token'))
  expect(refresh).toBeTruthy()

  await page.evaluate(() => localStorage.setItem('access_token', 'token-invalido'))
  await page.goto('/equipes')
  await expect(page.getByRole('heading', { name: 'Minhas equipes' })).toBeVisible()
  await expect.poll(() => page.evaluate(() => localStorage.getItem('access_token'))).not.toBe('token-invalido')
  await expect(page).toHaveURL(/\/equipes$/)
})
