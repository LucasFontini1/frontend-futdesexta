<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="auth-screen">
    <div class="auth-shell">
      <section class="auth-form-side" aria-label="Acesso Fut de Sexta">
        <RouterLink to="/" class="auth-brand">
          <img src="/icons/fut-light-192.png" width="52" height="52" alt="" />
          <strong>Fut <span>de Sexta</span></strong>
        </RouterLink>
        <slot />
        <p class="auth-smallprint">Seu futebol organizado, do convite ao apito final.</p>
      </section>
      <aside class="auth-visual">
        <div class="auth-visual-content">
          <div class="auth-glow" aria-hidden="true"></div>
          <img src="/branding/logo-dark.png" alt="Fut de Sexta" class="auth-hero-logo" />
          <p class="auth-eyebrow">A resenha também merece organização.</p>
          <h2>{{ route.name === 'register' ? 'O próximo jogo começa aqui.' : 'Bem-vindo de volta ao seu time.' }}</h2>
          <p>Monte equipes privadas, confirme presença e acompanhe campeonatos, peladas e estatísticas no mesmo lugar.</p>
          <div class="auth-chips">
            <span>⚽ Peladas</span>
            <span>🏆 Competições</span>
            <span>♟ Equipes</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.auth-screen{min-height:100dvh;display:grid;place-items:center;padding:clamp(14px,3vw,44px);background:radial-gradient(circle at top left,#e2f4e8,#f4f9f6 55%,#e3f2e7)}
.auth-shell{width:min(1140px,100%);min-height:680px;display:grid;grid-template-columns:1fr 1fr;overflow:hidden;border-radius:22px;background:#fff;box-shadow:0 26px 80px #12351c22}
.auth-form-side{display:flex;flex-direction:column;padding:22px clamp(22px,4vw,62px);min-width:0}
.auth-brand{display:inline-flex;align-items:center;gap:10px;width:max-content;font-size:20px;font-weight:800;letter-spacing:-.6px;color:#172d1d}
.auth-brand span{color:#1a9b4b}.auth-brand img{object-fit:contain}
.auth-form-side :deep(.container){width:100%;max-width:480px;margin:auto}
.auth-form-side :deep(.page){padding:20px 0}
.auth-form-side :deep(.card.form-card){padding:0;border:0;box-shadow:none;max-width:100%;margin:0}
.auth-form-side :deep(h1){font-size:clamp(26px,3vw,33px);font-weight:800;letter-spacing:-.8px}
.auth-form-side :deep(.form){gap:16px}
.auth-form-side :deep(.field input){min-height:48px;border-radius:11px;background:#fafcfb;border:1px solid #c5d9c9}
.auth-form-side :deep(.button){min-height:48px;border-radius:999px;background:#1bb55a}
.auth-smallprint{font-size:12px;color:#75927b;margin:20px auto 0;text-align:center}
.auth-visual{background:radial-gradient(circle at 60% 40%,#154e2b,#071a0d 65%);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;color:#fff;padding:44px}
.auth-visual:before,.auth-visual:after{content:'';position:absolute;border-radius:50%;border:1px solid #5aea8740;width:430px;height:430px;top:-170px;right:-160px}
.auth-visual:after{width:620px;height:620px;top:auto;bottom:-340px;left:-310px}
.auth-visual-content{position:relative;z-index:1;max-width:420px;text-align:center}
.auth-hero-logo{height:240px;max-width:100%;object-fit:contain;margin:auto auto 20px}
.auth-eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:800;color:#6af69b}
.auth-visual h2{font-size:clamp(25px,3vw,38px);line-height:1.2;letter-spacing:-1.2px;font-weight:800;margin:12px 0}
.auth-visual p:not(.auth-eyebrow){font-size:14px;line-height:1.75;color:#c2ddca}
.auth-chips{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin-top:23px}
.auth-chips span{border:1px solid #6fee9b55;border-radius:50px;padding:7px 11px;font-size:12px;background:#18452b}
:root[data-theme="dark"] .auth-screen{background:#08150d}
:root[data-theme="dark"] .auth-form-side{background:#101e15;color:#e9f8ed}
:root[data-theme="dark"] .auth-brand{color:#e9f8ed}
:root[data-theme="dark"] .auth-form-side :deep(.field input){background:#15291b;border-color:#31533b}
@media(max-width:780px){.auth-shell{grid-template-columns:1fr;min-height:calc(100dvh - 28px);max-width:570px}.auth-visual{display:none}.auth-form-side{min-height:620px}.auth-form-side :deep(.container){margin:auto}}
@media(max-width:370px){.auth-screen{padding:8px}.auth-form-side{padding:17px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto}}
</style>
