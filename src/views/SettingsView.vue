<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { changePassword, deleteAccount } from '@/api/accountApi'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const deletionPassword = ref('')
const message = ref('')
const error = ref('')
const busy = ref(false)

async function updatePassword() {
  error.value = ''
  message.value = ''
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'A confirmação da senha não confere.'
    return
  }
  busy.value = true
  try {
    await changePassword(currentPassword.value, newPassword.value)
    message.value = 'Senha alterada com sucesso.'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}
async function removeAccount() {
  if (!window.confirm('Deseja realmente excluir sua conta? Esta ação não pode ser desfeita.'))
    return
  error.value = ''
  busy.value = true
  try {
    await deleteAccount(deletionPassword.value)
    auth.signOut()
    await router.replace('/')
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="container page settings-page">
    <header class="settings-heading">
      <h1>Configurações</h1>
      <p class="muted">Gerencie a segurança e a privacidade da sua conta.</p>
    </header>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="message" role="status" class="notice">{{ message }}</p>
    <div class="settings-grid">
      <section class="card">
        <h2>Segurança da conta</h2>
        <p class="muted">Utilize uma senha forte e não compartilhe sua sessão.</p>
        <form class="form" @submit.prevent="updatePassword">
          <label class="field"
            >Senha atual
            <input
              v-model="currentPassword"
              type="password"
              required
              autocomplete="current-password"
            />
          </label>
          <label class="field"
            >Nova senha
            <input
              v-model="newPassword"
              type="password"
              required
              minlength="8"
              autocomplete="new-password"
            />
          </label>
          <label class="field"
            >Confirme a nova senha
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="8"
              autocomplete="new-password"
            />
          </label>
          <div><button class="button" type="submit" :disabled="busy">Alterar senha</button></div>
        </form>
      </section>
      <div class="settings-side">
        <section class="card">
          <h2>Perfil</h2>
          <p class="muted">Atualize seu nome, username e foto.</p>
          <RouterLink class="button button-secondary" to="/perfil">Editar perfil</RouterLink>
        </section>
        <section class="card">
          <h2>Aparência</h2>
          <p class="muted">
            Escolha entre tema claro, escuro ou automático no seletor do cabeçalho.
          </p>
        </section>
      </div>
    </div>
    <section class="card danger-section">
      <h2>Excluir minha conta</h2>
      <p>
        Esta ação anonimiza sua conta. Você precisa transferir suas equipes e competições antes de
        excluí-la.
      </p>
      <form class="form" @submit.prevent="removeAccount">
        <label class="field"
          >Confirme sua senha
          <input
            v-model="deletionPassword"
            type="password"
            required
            autocomplete="current-password"
          />
        </label>
        <div>
          <button class="danger-button" type="submit" :disabled="busy">
            Excluir conta definitivamente
          </button>
        </div>
      </form>
    </section>
  </section>
</template>

<style scoped>
.settings-page {
  max-width: 1180px;
}
.settings-heading {
  margin-bottom: 24px;
}
.settings-heading h1 {
  font-size: 30px;
  font-weight: 800;
}
.settings-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 18px;
}
.settings-side {
  display: grid;
  align-content: start;
  gap: 18px;
}
.settings-page h2 {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 12px;
}
.settings-page .muted {
  font-size: 13px;
  line-height: 1.6;
  margin-bottom: 18px;
}
.settings-page .card {
  padding: 26px;
}
.danger-section {
  margin-top: 20px;
  border-color: #f0bab9;
}
.danger-section p {
  font-size: 13px;
  line-height: 1.7;
  color: #b54b4b;
}
.danger-section .field {
  max-width: 420px;
}
.danger-button {
  background: #b92c38;
  color: white;
  padding: 12px 18px;
  border-radius: 10px;
  font-weight: 700;
}
.danger-button:hover {
  background: #97212d;
}
@media (max-width: 760px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
  .settings-page .card {
    padding: 18px;
  }
}
</style>
