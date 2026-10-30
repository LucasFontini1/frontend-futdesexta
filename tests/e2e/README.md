# E2E

Fluxo real de navegação e cadastro de equipes contra a API Django local.

Na CI, o workflow cria um usuário temporário em um SQLite novo, inicia o Django e executa Playwright Chromium. Localmente, crie um usuário ativo com e-mail `e2e@example.com` e senha `Test-Pass-2026!` apenas no banco **de desenvolvimento**, nunca em produção, e execute `npm run test:e2e`.

Esses testes são uma cobertura mínima: convites, torneios, concorrência, uploads e push ainda exigem testes E2E adicionais.
