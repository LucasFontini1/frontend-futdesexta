<template>
  <div class="container">
    <section class="hero">
      <p class="muted">⚽ Sua resenha, seu time, sua sexta.</p>
      <h1>O futebol com os amigos merece uma organização de primeira.</h1>
      <p>Crie equipes privadas, convide os jogadores, organize o elenco e acompanhe tudo em um só lugar.</p>
      <div class="actions">
        <RouterLink class="button" to="/cadastro">Criar minha conta</RouterLink>
        <RouterLink class="button button-secondary" to="/entrar">Já tenho conta</RouterLink>
      </div>
    </section>
    <section class="grid" aria-label="Funcionalidades">
      <article class="card"><h2>🔒 Equipes privadas</h2><p>Somente convidados entram na sua equipe.</p></article>
      <article class="card"><h2>👕 Elenco organizado</h2><p>Jogadores, camisas e posições em um único lugar.</p></article>
      <article class="card"><h2>🤝 Mais futebol</h2><p>Partidas, amistosos e campeonatos estão no planejamento.</p></article>
    </section>
  </div>
</template>
