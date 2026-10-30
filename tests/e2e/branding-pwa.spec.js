import { expect, test } from '@playwright/test'

test('manifest aponta para ícones PNG válidos de instalação', async ({ request }) => {
  const response = await request.get('/manifest.webmanifest')
  expect(response.ok()).toBeTruthy()
  const manifest = await response.json()
  expect(manifest.name).toBe('Fut de Sexta')
  const required = ['192x192', '512x512']
  for (const size of required) {
    expect(manifest.icons.some((icon) => icon.sizes === size && icon.type === 'image/png')).toBe(
      true,
    )
  }
  expect(manifest.icons.some((icon) => icon.purpose === 'maskable')).toBe(true)
  for (const icon of manifest.icons) {
    const asset = await request.get(icon.src)
    expect(asset.ok(), `Arquivo não encontrado: ${icon.src}`).toBeTruthy()
    expect(asset.headers()['content-type']).toContain('image/png')
  }
})

test('marca respeita alternância entre tema claro e escuro', async ({ page }) => {
  await page.goto('/')
  const theme = page.getByRole('combobox', { name: 'Tema' })
  const light = page.locator('.brand-emblem--light')
  const dark = page.locator('.brand-emblem--dark')
  await theme.selectOption('dark')
  await expect(dark).toBeVisible()
  await expect(light).toBeHidden()
  await theme.selectOption('light')
  await expect(light).toBeVisible()
  await expect(dark).toBeHidden()
})
