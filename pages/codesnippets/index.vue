
<script setup lang="ts">
import axios from "axios";

const state = reactive({
  codesnippets: {},
  loadingError: null
});

onMounted(() => {
  if (loginState()) {
    loadCodeSnippets();
  }
})

function loadCodeSnippets() {
  const req = axios.get(apiURL + "api/users/me?fields=id&populate=codesplits", {
    headers: {
      Authorization: "Bearer " + getData("user.token")
    }
  });
  req.then((response) => {
    state.codesnippets = response.data.codesplits;
  });
  req.catch((response) => {
    state.loadingError = response;
  });
}
</script>
<template>
  <div class="grid place-items-center min-h-screen">
    <NuxtLink
        to="/"
        class="back-home-btn gradient-border"
    >
      <i class="fa-solid fa-arrow-left text-white text-lg" />
    </NuxtLink>
    <div class="main-card animate-fadescale">
      <h1 class="card-title">Statistics</h1>
      <h2 class="card-subtitle">Some special idk</h2>
      <div v-for="n in state.codesnippets" :key="n" class="card-box">
        <div class="title">#{{n.id}}</div>
        <div class="value">
          {{n.shorturl}}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.back-home-btn
  @apply absolute top-6 left-6 md:left-10 md:top-10 px-4 py-3 cursor-pointer
</style>