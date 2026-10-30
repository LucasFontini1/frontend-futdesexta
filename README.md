# Fut de Sexta — Frontend

Plataforma Vue 3 com Composition API, Vite, Pinia e Vue Router para o futebol amador.

## Funcionalidades implementadas nesta branch
- Landing page, cadastro, login, perfil e foto.
- Tema claro, escuro e automático.
- Equipes privadas, membros, jogadores e convites.
- Agendamento de peladas e confirmação Vou/Não vou.
- Integração real com API Django REST (sem mocks de dados).

Recorrência, escalação, resultados, estatísticas, amistosos, competições,
calendário, PWA, push e integração da arte final **ainda não estão concluídos**.
Consulte as issues e não considere a aplicação completa.

## Rodar
1. Instale Node conforme `package.json`.
2. `npm install`
3. Copie `.env.example` como `.env` e ajuste `VITE_API_BASE_URL`.
4. Execute o backend Django primeiro.
5. `npm run dev`; `npm run build` para validar produção.

## Organização
- `src/api/`: chamadas HTTP ao Django.
- `src/stores/`: estado Pinia e autenticação.
- `src/router/`: navegação, páginas protegidas.
- `src/views/`: telas por jornada.
- `src/components/layout/`: cabeçalho e temas.
- `src/assets/css/`: estilos globais.
- `public/`: recursos públicos, futuros ícones PWA.

## Segurança
Tokens de acesso JWT permanecem apenas em memória e são descartados quando
a página recarrega. Não adicione chaves de Supabase ou Cloudinary em `VITE_*`.
A autorização é feita no backend; as guardas do Vue são apenas de navegação.

## Testes
`npm run build` e `npm run lint:eslint` são executados no GitHub Actions.
Ainda são necessários testes de integração e de ponta a ponta.
