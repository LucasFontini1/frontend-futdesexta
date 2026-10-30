import { expect, test } from '@playwright/test'

test('todos os módulos principais abrem autenticados sem erro JavaScript', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/entrar')
  await page.getByLabel('E-mail').fill('e2e@example.com')
  await page.getByLabel('Senha').fill('Test-Pass-2026!')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/painel$/)
  const routes = [
    '/painel',
    '/equipes',
    '/partidas',
    '/agenda',
    '/recorrencias',
    '/estatisticas',
    '/amistosos',
    '/competicoes',
    '/eventos',
    '/notificacoes',
    '/convites',
    '/perfil',
  ]
  for (const route of routes) {
    await page.goto(route)
    await expect(page).toHaveURL(new RegExp(route.replace('/', '\\/') + '$'))
    await expect(page.locator('main').first()).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toHaveCount(0)
  }
  expect(errors, errors.join('\n')).toEqual([])
})
