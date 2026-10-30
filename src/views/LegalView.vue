<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const privacy = computed(() => route.path === '/privacidade')
</script>

<template>
  <section class="container page">
    <h1>{{ privacy ? 'Política de privacidade' : 'Termos de uso' }}</h1>
    <template v-if="privacy">
      <p>
        O Fut de Sexta utiliza nome, nome de usuário, e-mail, foto opcional e registros de
        participação para oferecer equipes, partidas e convites.
      </p>
      <p>
        As equipes são privadas: somente membros autorizados podem consultar seus dados internos.
        Algumas informações básicas dos escudos e nomes de equipes podem aparecer na pesquisa para
        amistosos e competições.
      </p>
      <p>
        As imagens enviadas podem ser armazenadas no Cloudinary. Informações cadastrais e partidas
        são armazenadas em PostgreSQL. Operações e dados pessoais estão sujeitos à LGPD.
      </p>
      <p>
        O titular poderá solicitar acesso, correção e exclusão dos dados aplicáveis. Algumas
        informações estatísticas e registros necessários à integridade das partidas poderão exigir
        anonimização e retenção justificada.
      </p>
      <p>
        Este texto deverá ser revisado antes da publicação pública, com identificação do controlador
        e contato de privacidade.
      </p>
    </template>
    <template v-else>
      <p>
        Ao usar a plataforma, você concorda em fornecer informações corretas, respeitar integrantes
        das equipes e não usar o serviço para prejudicar outros usuários.
      </p>
      <p>
        Organizadores e administradores respondem pelo cadastro de participantes, convites,
        resultados e informações que publicarem. O sistema poderá aplicar restrições para preservar
        a segurança e integridade das partidas.
      </p>
      <p>
        O serviço é oferecido em desenvolvimento, podendo haver alterações de funcionalidades e
        interrupções. Estes termos devem passar por revisão antes da disponibilização pública.
      </p>
    </template>
  </section>
</template>
