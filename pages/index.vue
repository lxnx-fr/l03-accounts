

<script setup lang="ts">
import axios from "axios";

const router = useRouter();
const state = reactive({
  username: "",
  avatar: "",
  user: null,
  avatarUrl: "",
  loadingError: null,
  editing: false,
  websites: {},
  codesnippets: {},
  activeContainer: ''
})
onMounted(() => {
  if (loginState()) {
    loadUserData();
    loadCodeSnippets();
  } else router.push('/login');
})
function loadCodeSnippets() {
  const req = axios.get(apiURL + "api/users/me?fields=id&populate[codesplits][fields]=id", {
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
function loadAvatar() {
  const req = axios.get(apiURL + "api/users/me?populate=avatar", {
    headers: {
      Authorization: "Bearer " + getData("user.token")
    }
  });
  req.then((response) => {
    state.avatarUrl = response.data.avatar.url;
  });
  req.catch((response) => {
    state.loadingError = response;
  });
}
function loadUserData() {
  const request = axios.get(apiURL + "api/users/me", {
    headers: {
      Authorization: "Bearer " + getData("user.token")
    },
  });
  request.then((response) => {
    console.log("Nuxt | Downloading user data", response);
    state.user = response.data
  });
  request.catch((response) => {
    console.log(
        "Nuxt | Error while downloading user data",
        response
    );
  });
}
function handleLogout() {
  state.user = null;
  removeData("user.token")
  router.push('/login');
}
</script>

<template>
  <div v-if="state.user" class="dashboard-page">
    <a class="back-home-btn gradient-border" @click="handleLogout">
      Logout
    </a>
    <div class="statistics-container animate-fadescale">
      <h1>Statistics</h1>
      <NuxtLink to="/codesnippets" class="statistic-box">
        <div class="title">
          Code Snippets
        </div>
        <div class="value">{{ state.codesnippets.length }}</div>
      </NuxtLink>
      <div class="statistic-box">
        <div class="title">
          URL Shorts
        </div>
        <div class="value">23</div>
      </div>
    </div>
    <!--<div v-if="activeContainer === 'w'" class="websites-container">
      <h1 class="container-title">Your Websites</h1>
      <div v-for="n in websites" :key="n" class="website-box relative ">
        <div class="website-id">#{{ Math.round(n.id * 542 * Math.random() * (Math.random() / Math.PI)) }}</div>
        <div class="website-status working">
          <i class="fa-solid fa-circle" :class="n.status" />
        </div>
        <div class="col-span-2">{{ n.domain }}</div>
        <div class="col-span-2">{{ n.owner }}</div>
        <div class="col-span-1">Edit</div>
      </div>
    </div>
    <div v-if="activeContainer === 'w'" class="website-container">
      <h1 class="container-title">Your Websites</h1>
      <div class="btn-container right-0">
        <button class="btn-add">
          <i class="fa-solid fa-layer-plus pr-1" />
          Add
        </button>
        <button class="btn-remove">
          <i class="fa-solid fa-layer-minus pr-1" />
          Remove

        </button>
      </div>

      <div class="website-data">
        <div class="grid-cols-7 grid text-center">
          <h1 class="col-span-1">ID</h1>
          <h1 class="col-span-1">Status</h1>
          <h1 class="col-span-2">Domain</h1>
          <h1 class="col-span-2">Owner</h1>
          <h1 class="col-span-1">Actions</h1>
        </div>
        <div v-for="n in websites" :key="n" class="data-row">
          <div class="col-span-1">#{{ n.id }}</div>
          <div class="col-span-1">
            <i class="fa-solid fa-circle" :class="n.status" />
          </div>
          <div class="col-span-2">{{ n.domain }}</div>
          <div class="col-span-2">{{ n.owner }}</div>
          <div class="col-span-1">Edit</div>
        </div>
      </div>
    </div>-->
  </div>
  <div v-else class="dashboard-loading-page">
    <div class="dashboard-loading-container animate-fadescale">
      <svg aria-hidden="true" class="w-20 text-white animate-spin fill-black" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
        />
        <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
        />
      </svg>
      <h1>Loading Dashboard</h1>
      <h2>Getting data from Rest-API</h2>
    </div>
  </div>
</template>
<style lang="sass">
.dashboard-loading-page
  @apply text-center mx-auto h-screen flex items-center justify-center flex-col gap-6 font-sans
.dashboard-loading-container
  @apply grid place-items-center w-full bg-white bg-opacity-5 text-white text-opacity-80 z-20
  @apply max-w-xs md:max-w-md p-8
  h1
    @apply text-3xl md:text-4xl pt-6
  h2
    @apply text-sm md:text-sm
.dashboard-page
  @apply text-center mx-auto h-screen font-sans grid grid-cols-2 place-items-center p-8
  img
    @apply aspect-auto max-w-xs md:max-w-sm
.statistics-container
  @apply  grid grid-cols-2 place-items-center max-w-md md:max-w-lg w-full bg-white bg-opacity-5 px-8 py-4 text-white text-opacity-80 z-20 gap-4
  h1
    @apply text-2xl md:text-4xl py-4 col-span-2
  h2
    @apply text-sm md:text-sm
  .statistic-box
    @apply text-xl py-5 px-2 cursor-pointer max-w-xs w-full gradient-border
.back-home-btn
  @apply cursor-pointer animate-fadescale absolute top-2 left-4 md:left-10 md:top-8 text-white text-lg font-sans px-4 py-2 flex


</style>
