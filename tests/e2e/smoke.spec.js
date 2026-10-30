import { expect, test } from '@playwright/test'

test('página inicial e navegação pública', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('futebol')
  await page.getByRole('link', { name: 'Criar minha conta' }).click()
  await expect(page).toHaveURL(/\/cadastro$/)
  await expect(page.getByRole('heading', { name: 'Crie sua conta' })).toBeVisible()
})

test('rota de equipe bloqueia visitante não autenticado', async ({ page }) => {
  await page.goto('/equipes')
  await expect(page).toHaveURL(/\/entrar\?next=/)
  await expect(page.getByRole('heading', { name: 'Entre em campo' })).toBeVisible()
})

test('usuário ativo faz login e cria equipe persistida no Django', async ({ page }) => {
  await page.goto('/entrar')
  await page.getByLabel('E-mail').fill('e2e@example.com')
  await page.getByLabel('Senha').fill('Test-Pass-2026!')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await expect(page).toHaveURL(/\/painel$/)
  await page.goto('/equipes')
  const name = 'E2E Sexta FC'
  await page.getByLabel('Nome da equipe').fill(name)
  await page.getByRole('button', { name: 'Criar equipe' }).click()
  await expect(page.getByRole('link', { name: new RegExp(name) })).toBeVisible()
})
