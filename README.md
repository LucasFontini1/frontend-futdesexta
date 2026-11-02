# Fut de Sexta — fase de login

Esta branch parte da main original e contém **somente login**.

## Estrutura
- src/api/config.js: Axios, JWT e refresh
- src/api/authApi.js: chamadas de login e perfil
- src/stores/authStore.js: Pinia e localStorage
- src/views/LoginView.vue: formulário
- src/views/HomeView.vue: comprovação da sessão
- src/router/index.js: proteção de rota
- src/assets/css/global.css: identidade visual

Referências estudadas **somente para leitura**:
Hackaton-2026-IFC/Frontend-Hackathon e Hackaton-2026-IFC/Backend-Hackathon.

## Como iniciar
Copie `.env.example` para `.env`, depois `npm install`, `npm run dev`.

No backend, crie um usuário com `pdm run python manage.py createsuperuser`, use o e-mail e a senha cadastrados. O endpoint é `POST /api/token/`. Após login, o sistema confirma o perfil com `GET /api/usuarios/me/`, salva access e refresh no localStorage e abre `/inicio`.

Os demais módulos foram deliberadamente deixados de fora desta fase. Não é uma implementação completa do projeto.
