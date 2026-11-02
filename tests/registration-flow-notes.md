# Critérios de aceite — cadastro com login automático

1. POST /api/registro/ usando nome, e-mail e senha informados.
2. Se registro falhar, não chamar /api/token/ e exibir mensagem do backend.
3. Se registro retornar 201, chamar POST /api/token/ com o e-mail e a senha ainda em memória.
4. Pinia armazena somente access/refresh token e perfil, nunca a senha.
5. Consultar /api/usuarios/me/ após autenticar; navegar para /inicio.
6. Se login automático falhar após registro, comunicar que a conta foi criada.
7. Recarregar /inicio deve preservar autenticação através de JWT.
8. Logout remove tokens e cache.
