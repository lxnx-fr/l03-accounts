<template>
  <div class="fixed left-0 right-0 spotlight z-10"></div>
  <div v-if="user" class="dashboard-page">
    <a class="back-home-btn gradient-border cursor-pointer animate-fadescale" @click="handleLogout">
      Logout
    </a>
    <div class="statistics-container animate-fadescale">
      <h1>Statistics</h1>
      <div class="statistic-box">
        <div class="title">
          Websites
        </div>
        <div class="value">14</div>
      </div>
      <div class="statistic-box">
        <div class="title">
          Customers
        </div>
        <div class="value">5</div>
      </div>
      <div class="statistic-box">
        <div class="title">
          Invoices
        </div>
        <div class="value">42</div>
      </div>
      <div class="statistic-box">
        <div class="title">
          Revisions
        </div>
        <div class="value">236</div>
      </div>
    </div>
    <div class="statistics-container">
      <h1>Statistics</h1>
      <div class="statistic-box">
        <div class="title">
          Websites
        </div>
        <div class="value">14</div>
      </div>
      <div class="statistic-box">
        <div class="title">
          Customers
        </div>
        <div class="value">5</div>
      </div>
      <div class="statistic-box">
        <div class="title">
          Invoices
        </div>
        <div class="value">42</div>
      </div>
      <div class="statistic-box">
        <div class="title">
          Revisions
        </div>
        <div class="value">236</div>
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

<script>
import {apiURL, getData, loginState, removeData} from "/assets/js/auth";
import axios from "axios";

export default {
  name: "index",
  data() {
    return {
      username: "l03",
      avatar: "",
      user: null,
      avatarUrl: "",
      loadingError: null,
      editing: false,
      websites: {},
      activeContainer: 'websites'
    };
  },
  mounted() {

    if (loginState()) {
      console.log("Nuxt | Try Retrieving data from local user");
      this.loadAvatar();
      this.loadUserData();
      this.loadWebsites();
    } else {
      this.$router.push({ path: "/login"});
    }
  },
  methods: {
    handleLogout() {
      this.user = null;
      removeData("user.token")
      this.$router.push({ path: "/login/"});
    },
    handleEdit() {
      this.editing = !this.editing;
      document.querySelector(".profile-container").classList.toggle("editing");
    },

    loadWebsites() {
      const req = axios.get(apiURL() + "api/users/me?populate=msites&fields=id",
          {
            headers: {
              Authorization: "Bearer " + getData("user.token")
            }
          }
      );
      req.then((response) => {
        this.websites = response.data.msites;
      });
      req.catch((response) => {
        this.loadingError = response;
      });
    },
    loadAvatar() {
      const req = axios.get(apiURL() + "api/users/me?populate=avatar",
          {
            headers: {
              Authorization: "Bearer " + getData("user.token")
            }
          }
      );
      req.then((response) => {
        this.avatarUrl = response.data.avatar.url;
      });
      req.catch((response) => {
        this.loadingError = response;
      });
    },
    loadUserData() {
      const request = axios.get(apiURL() + "api/users/me", {
        headers: { Authorization: "Bearer " + getData("user.token") },
      });
      request.then((response) => {
        console.log("Nuxt | Downloading user data", response);
        this.user = response.data
      });
      request.catch((response) => {
        console.log(
            "Nuxt | Error while downloading user data",
            response
        );
      });
    }
  },
};
</script>

<style lang="sass" scoped>
.dashboard-loading-page
  @apply text-center mx-auto h-screen flex items-center justify-center flex-col gap-6 font-sans
.dashboard-loading-container
  @apply grid place-items-center w-full bg-white bg-opacity-5 text-white text-opacity-80 z-20
  @apply max-w-xs md:max-w-md p-8
  h1
    @apply text-3xl md:text-4xl pt-6
  h2
    @apply text-sm md:text-sm
.spotlight
  background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%)
  filter: blur(20vh)
  height: 40vh
  bottom: -30vh

.gradient-border
  -webkit-backdrop-filter: blur(10px)
  backdrop-filter: blur(10px)
  @apply relative
.gradient-border
  background-color: rgba(20, 20, 20, 0.3)
.gradient-border::before
  background: linear-gradient(90deg,#303030 0%,#303030 25%,#00dc82 50%,#36e4da 75%,#0047e1 100%)
.gradient-border::before
  content: ""
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  padding: 2px
  width: 100%
  background-size: 400% auto
  opacity: 0.5
  transition: background-position 0.3s ease-in-out, opacity 0.2s ease-in-out
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)
  -webkit-mask-composite: xor
  mask-composite: exclude
.gradient-border:hover::before
  background-position: -50% 0
  opacity: 1
.dashboard-page
  @apply text-center mx-auto h-screen font-sans grid grid-cols-2 place-items-center p-8
  img
    @apply aspect-auto max-w-xs md:max-w-sm
.statistics-container
  @apply grid grid-cols-2 place-items-center max-w-md md:max-w-lg w-full bg-white bg-opacity-5 px-8 py-4 text-white text-opacity-80 z-20 gap-4
  h1
    @apply text-2xl md:text-4xl py-4 col-span-2
  h2
    @apply text-sm md:text-sm
  .statistic-box
    @apply gradient-border text-xl py-5 px-2 cursor-pointer max-w-xs w-full

.back-home-btn
  @apply absolute top-2 left-4 md:left-10 md:top-8 text-white text-lg font-sans px-4 py-2 flex
.profile-container
  @apply grid grid-cols-1 place-items-center max-w-sm md:max-w-md w-full bg-white bg-opacity-5 px-8 py-4 text-white text-opacity-80 z-20
  .btn-edit
    @apply bg-black text-white absolute  top-0 w-fit h-fit rounded-full px-3 py-1 m-2 select-none transition-all duration-300 ease-in-out
    &:hover
      box-shadow: 0 2px 20px 0 #5A2BE1
      @apply bg-violet-700 text-white
  &.editing
    img, .details-name
      &:hover
        @apply border-4 border-violet-700 border-dashed

  .details-wrapper
    @apply w-full text-3xl col-span-full flex items-center flex-col mt-5
    a
      @apply text-sm text-left
      &:hover
        @apply relative inline-block transition-all duration-200 ease-in-out
      &:after
        @apply w-full absolute bottom-0 left-0 transition-transform duration-200 ease-in-out content-[''] scale-x-0 h-[2px] bg-black origin-bottom-right
      &:hover:after
        @apply scale-x-100 origin-bottom-left
  .avatar-wrapper
    @apply col-span-full flex justify-center
    img
      @apply rounded-md w-48 rounded-full aspect-square transition-transform duration-300 ease-in-out
  .editing-btn-wrapper
    @apply w-full col-span-full grid grid-cols-2 place-items-center gap-6 mt-5
    button
      @apply bg-black text-white w-full h-fit rounded-full px-3 py-1 m-2 select-none transition-all duration-300 ease-in-out
      &.error:hover
        box-shadow: 0 2px 20px 0 #EF4444
        @apply bg-red-500 text-white
      &.success:hover
        box-shadow: 0 2px 20px 0 #22C55E
        @apply bg-green-500 text-white
.websites-container
  @apply bg-orange-400 duration-300 transition-all ease-in-out rounded-lg
  @apply p-4 grid grid-cols-4 col-span-full justify-start items-center relative w-full gap-4 overflow-hidden
  .container-title
    @apply text-left text-3xl col-span-full text-white
  .website-box
    @apply rounded-lg col-span-2 text-center text-lg p-4 bg-white bg-opacity-25
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.42)
    .website-id
      @apply text-left text-2xl absolute bottom-1.5 left-3
    .website-status
      @apply text-right absolute bottom-1.5 right-3
      &.working
        @apply text-green-500
.website-container
  @apply bg-white duration-300 transition-all ease-in-out rounded-lg
  @apply p-4 grid col-span-6  justify-start items-center relative w-full
  .container-title
    @apply text-left text-3xl
  .btn-container
    @apply absolute  top-0 w-fit h-fit
    .btn-add, .btn-remove
      @apply bg-black text-white  w-fit h-fit rounded-full px-3 py-1 m-2 select-none transition-all duration-300 ease-in-out
      &:hover
        box-shadow: 0 2px 20px 0 #5A2BE1
        @apply bg-violet-700 text-white
  .website-data
    @apply p-2 rounded-md
    h1
      @apply text-center
    .data-row
      @apply text-white grid grid-cols-7 text-center bg-neutral-800 my-2 py-3 rounded-full
    .working
      @apply text-green-500


</style>
