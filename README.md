# Fut de Sexta — Frontend

Aplicação Vue 3 com Composition API, Pinia, Vue Router e Vite. Design mobile-first, tema claro/escuro, instalações PWA e comunicação com Django REST Framework.

> Branch de desenvolvimento, ainda pendente de revisão final e de credenciais dos provedores externos.

## Primeiros passos

1. Instale Node compatível com `package.json` (`22.18.0+`).
2. `npm install`.
3. Copie `.env.example` como `.env`.
4. Configure `VITE_API_BASE_URL=http://127.0.0.1:8000/api`.
5. Execute o backend local, suas migrações e `npm run dev`.
6. Verifique com `npm run build`, `npm run lint:eslint`, `npm run format:check`.

## Funcionalidades implementadas para revisão

- Landing page, cadastro, ativação por e-mail, autenticação e recuperação de senha.
- Perfil e upload de foto; usuários e equipes privadas por convite.
- Membros, elenco, pedidos de vínculo, peladas, recorrências e presenças.
- Editor de escalação com campo visual e registro de resultados.
- Rankings por peladas, amistosos, competições e geral.
- Convites para amistosos, criação de competições, confrontos e classificação.
- Eventos, calendário, notificações e mapa Leaflet.
- Clima Open-Meteo por local e data, com estado indisponível.
- Manifest, service worker com cache restrito a recursos públicos, instalação e opção de web push.

## Estrutura

- `src/api/`: clientes HTTP por domínio.
- `src/stores/`: estado compartilhado Pinia e sessão.
- `src/router/`: roteamento protegido.
- `src/views/`: páginas por fluxo.
- `src/components/`: componentes de navegação, mapas e PWA.
- `src/assets/css/`: estilo do tema e campo de futebol.
- `public/`: manifest, service worker, ícones e tela offline.

## Configurações

- `VITE_API_BASE_URL`: endereço da API Django.
- `VITE_VAPID_PUBLIC_KEY`: chave **pública** gerada para push, opcional. Sem ela, o app funciona sem notificações push.
- **Nunca** coloque chaves privadas Cloudinary, Supabase ou Django em variáveis `VITE_*`.

## Limitações

O app guarda o access token em memória e requer novo login após recarregar. A guarda das rotas é de conveniência; a autorização real é no servidor. O ícone SVG existente é provisório e deve ser substituído pelos arquivos definitivos da marca aprovados pelo projeto. Ícones PWA 192/512 PNG e testes E2E em navegador real ainda são pendências.

A política/termos existentes são textos iniciais, não substituem revisão jurídica. Mapas, SMTP, previsão e push dependem de provedores e podem exigir configuração externa. Não implantar como sistema público antes de revisar testes de segurança, permissões, integração e privacidade.
