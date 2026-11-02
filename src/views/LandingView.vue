<script setup>
import { RouterLink } from 'vue-router'
const features = [
  { icon: 'mdi-shield-check-outline', title: 'EQUIPES PRIVADAS', detail: 'Só entra quem recebe convite. O elenco e o calendário ficam entre vocês.' },
  { icon: 'mdi-calendar-check-outline', title: 'PELADA TODA SEXTA', detail: 'Crie a pelada uma vez e cada membro só marca Vou ou Não vou.' },
  { icon: 'mdi-tshirt-crew-outline', title: 'ESCALAÇÃO MANUAL', detail: 'Monte os times no campo, do seu jeito. Sem sorteio.' },
  { icon: 'mdi-chart-bar', title: 'ESTATÍSTICAS POR MODALIDADE', detail: 'Peladas, amistosos e competições separados, com total geral.' },
  { icon: 'mdi-account-group-outline', title: 'AMISTOSOS ENTRE EQUIPES', detail: 'Convide outra equipe; os administradores aceitam e o jogo entra no calendário.' },
  { icon: 'mdi-trophy-outline', title: 'COMPETIÇÕES', detail: 'Mata-mata ou pontos corridos, só com equipes cadastradas.' },
]
const steps = [
  { title: 'CRIE SUA EQUIPE', detail: 'Nome, cor e escudo. Você é o dono e escolhe os administradores.' },
  { title: 'CONVIDE A GALERA', detail: 'Busque pelo nome ou username. Só convidados entram.' },
  { title: 'BOLA ROLANDO', detail: 'Peladas recorrentes, presença, escalação e placar com estatísticas.' },
]
</script>

<template>
  <div class="landing">
    <div class="landing-dark">
      <header class="public-header public-container">
        <RouterLink class="public-brand" to="/" aria-label="Fut de Sexta — início">
          <span class="brand-emblem"><i class="mdi mdi-soccer" aria-hidden="true"></i></span>
          <span>FUT <b>DE SEXTA</b></span>
        </RouterLink>
        <RouterLink to="/entrar" class="nav-login">Entrar</RouterLink>
      </header>

      <section class="hero public-container">
        <div class="hero-copy">
          <p class="kicker">FUTEBOL AMADOR, ORGANIZADO</p>
          <h1>SUA PELADA<br />MERECE <span>SÚMULA.</span></h1>
          <p class="hero-description">Chame a galera, confirme quem vai, monte os times e registre cada gol. Tudo num só lugar, no celular.</p>
          <div class="hero-actions">
            <RouterLink class="public-button primary" to="/cadastro">Criar conta grátis</RouterLink>
            <RouterLink class="public-button outline" to="/entrar">Já tenho conta</RouterLink>
          </div>
        </div>
        <div class="hero-preview">
          <div class="hero-crest" aria-label="Fut de Sexta">
            <i class="mdi mdi-soccer" aria-hidden="true"></i>
            <strong>FUT</strong><span>DE SEXTA</span>
            <div class="crest-stars" aria-hidden="true">★ ★ ★</div>
          </div>
          <div class="score-card">
            <div class="match-caption"><span>Sexta, 19:00 · Arena do Bairro</span><span class="status">Agendada</span></div>
            <div class="score-line"><strong>VERDE</strong><b>4 × 3</b><strong>PRETO</strong></div>
            <div class="attendance"><span><b>14</b> confirmados</span><span><b>3</b> não vão</span></div>
            <small>Exemplo ilustrativo</small>
          </div>
        </div>
      </section>
    </div>

    <section class="public-section how">
      <div class="public-container">
        <h2>COMO FUNCIONA</h2>
        <div class="steps-grid">
          <article v-for="(step, index) in steps" :key="step.title" class="public-card step-card">
            <div class="step-number">{{ index + 1 }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.detail }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="public-section features">
      <div class="public-container">
        <h2>TUDO QUE O SEU GRUPO PRECISA</h2>
        <div class="features-grid">
          <article v-for="feature in features" :key="feature.title" class="public-card feature-card">
            <i class="mdi" :class="feature.icon" aria-hidden="true"></i>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.detail }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="landing-cta">
      <div class="public-container">
        <h2>BORA MARCAR A DE SEXTA?</h2>
        <RouterLink to="/cadastro" class="public-button primary">Começar agora</RouterLink>
      </div>
    </section>
    <footer class="public-footer">
      <div class="public-container footer-inner">
        <span>© {{ new Date().getFullYear() }} Fut de Sexta</span>
        <span>Feito para quem ama futebol.</span>
      </div>
    </footer>
  </div>
</template>
