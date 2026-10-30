import { expect, test } from '@playwright/test'

test('cadastro cria usuário e mantém login após atualizar a página', async ({ page }) => {
  const identifier = Date.now().toString(36)
  await page.goto('/cadastro')
  await page.getByLabel('Nome completo').fill('Atleta de Teste')
  await page.getByLabel('Username').fill(`atleta_${identifier}`)
  await page.getByLabel('E-mail').fill(`atleta_${identifier}@example.com`)
  await page.getByLabel('Senha', { exact: true }).fill('Senha-Forte-2026!')
  await page.getByLabel('Confirme a senha').fill('Senha-Forte-2026!')
  await page.getByRole('checkbox').check()
  await page.getByRole('button', { name: 'Criar conta' }).click()
  await expect(page).toHaveURL(/\/painel$/)
  await expect.poll(() => page.evaluate(() => localStorage.getItem('access_token'))).not.toBeNull()
  await page.reload()
  await expect(page).toHaveURL(/\/painel$/)
  await expect(page.getByText('Atleta de Teste')).toBeVisible()
})
