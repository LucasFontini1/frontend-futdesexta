# Reconstrução baseada no Frontend-Hackathon (somente leitura)

Referência: https://github.com/Hackaton-2026-IFC/Frontend-Hackathon

## Organização adotada

- `src/api/`: cliente Axios único, interceptors, refresh JWT, serviços por domínio.
- `src/stores/`: Pinia com sessão, perfil e estado de usuário.
- `src/router/`: páginas públicas e protegidas.
- `src/components/layout/`: sidebar, cabeçalho de workspace e layout autenticado.
- `src/views/`: telas separadas por funcionalidade do Fut de Sexta.
- `src/assets/css/`: estilos e paleta verde/escuro da marca.
- `tests/e2e/`: verificações Playwright com Django real na CI.

As referências não são alteradas e as funcionalidades do Momentum
não são copiadas indiscriminadamente: os domínios e permissões permanecem
específicos do futebol.

## Implementado nesta branch

1. Cliente Axios no estilo do Momentum, sem mudar a interface dos serviços.
2. Access e refresh tokens em localStorage e renovação automática em 401.
3. Pinia reconstituindo sessão e perfil após atualizar página.
4. Logout removendo tokens e cache, com retorno ao login.
5. Sidebar desktop, barra inferior mobile, header com tema/notificações.
6. Login e cadastro com layout visual em duas colunas responsivas.
7. Dashboard com partidas/equipes obtidas da API, sem valores fictícios.
8. Testes E2E de login, cadastro, refresh, logout, rotas privadas e regressões.

## Critérios de aceite ainda a validar antes da produção

- E2E de criação de peladas recorrentes, escalação manual e confirmação;
- validação de amistosos entre equipes, disputas de placar e competições;
- fluxo completo de notificações push e permissões no celular;
- testes reais com Cloudinary, Supabase PostgreSQL e entrega de e-mails;
- revisão de acessibilidade, responsividade visual e segurança (XSS).
- decisão sobre armazenamento de tokens: localStorage foi adotado porque
  foi exigido; cookies HttpOnly seriam mais resistentes a roubo via XSS.

A ausência de falhas de build, lint ou testes básicos **não** significa
que todas as funcionalidades estão prontas para produção.
