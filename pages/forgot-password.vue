<template>
  <div class="fixed left-0 right-0 spotlight z-10"></div>
  <div class="auth-page">
    <div class="auth-container animate-fadescale">
      <h1 class="auth-title">Forgot Password</h1>
      <ClientOnly>
        <form class="auth-form">
          <TextField
              name="mail"
              type="email"
              prepend="fa-solid fa-envelope"
              label="E-Mail"
              label-color="rgba(255,255,255,0.5)"
              icon-color="rgba(255,255,255,0.9)"
              :error="
              v$.mail.$errors.length > 0 ? v$.mail.$errors[0].$message : null
            "
              @field:input="
              mail = $event;
              v$.mail.$touch();
            "
          />
        </form>
      </ClientOnly>
      <button class="auth-btn-submit" @click="handleRequest">
        Send Request
      </button>
      <div class="auth-link-wrapper mt-2">
        <NuxtLink to="/login" class="auth-link success"
        >Already have an account? Login</NuxtLink>
      </div>
      <div
          v-show="notification !== false"
          class="notification-wrapper"
      >
        <div v-if="notification === 'loading'" class="notification loading animate-fadescale">
          <span class="pt-1"
          ><i class="fa-duotone fa-spinner-third fa-spin"
          /></span>
          <span class="">Loading...</span>
        </div>
        <div
            v-else-if="notification === 'success'"
            class="notification success"
        >
          <span class=""><i class="fa-light fa-cloud-check" /></span>
          <span class=""
          >If an user with this E-Mail exists,<br />You will receive an
            E-Mail!</span
          >
        </div>
        <div v-else-if="notification === 'error'" class="notification error">
          <span class=""
          ><i class="fa-light fa-circle-exclamation fa-beat-fade"
          /></span>
          <span class="">{{ notificationMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: CLIENT AREA / MULTI PAGE REDIRECTION / client.l03.dev / duplicate project / new sidebar etc. / faster main page
import useVuelidate from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import {apiURL, loginState} from "assets/js/auth";
import axios from "axios";


export default {
  name: "ForgotPasswordView",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      mail: "",
      notification: false,
      notificationMessage: "",
    };
  },
  mounted() {
    if (loginState()) { this.$router.push({ path: "/"}); }
  },
  validations() {
    return {
      mail: {
        email: helpers.withMessage("Please enter a valid E-Mail.", email),
        required: helpers.withMessage("E-Mail is required.", required),
      },
    }
  },
  methods: {
    async handleRequest() {
      this.v$.$touch();
      console.log("DEV-LOG | 1. Trying to Request a Reset-Password link...");
      if (!this.v$.$invalid) {
        console.log("DEV-LOG | 2. Form Validation successfully");
        const res = axios.post(
            apiURL() + "api/auth/forgot-password",
            {
              email: this.mail,
            }
        );

        this.notification = "loading";
        // eslint-disable-next-line no-unused-vars
        res.then((response) => {
          this.notification = "success";
          console.log("DEV-LOG | 3. Reset Password Request successfully;");
          setTimeout(() => {
            this.notification = false;
          }, 3500);
        });
        res.catch((response) => {
          console.log("DEV-LOG | 3. Reset Password Request failed;", response);
          this.notification = "error";
          this.notificationMessage = response.response.data.error.message;
          setTimeout(() => {
            this.notification = false;
          }, 3500);
        });
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.auth-page
  @apply text-center mx-auto h-screen flex items-center justify-center
.auth-container
  @apply min-w-min px-14 bg-white bg-opacity-5 py-4 z-20
  .auth-title
    @apply text-4xl text-opacity-80 text-white
.auth-form
  @apply my-4
.auth-btn-submit
  @apply gradient-border py-2.5 text-xl text-white text-opacity-80 max-w-xs w-full cursor-pointer
.auth-link-wrapper .auth-link
  @apply m-2 text-xs text-white text-opacity-75 transition-all ease-in-out duration-300
  &.success:hover
    @apply text-green-500
  &.error:hover
    @apply text-red-500
.notification
  &.loading
    @apply bg-yellow-500
    box-shadow: 0 2px 15px 0 #EAB308
  &.success
    @apply bg-green-500
    box-shadow: 0 2px 15px 0 #22C55E
  &.error
    @apply bg-red-500
    box-shadow: 0 2px 15px 0 #EF4444
  @apply rounded-full bg-white gap-3 flex-row flex px-4 py-2 place-items-center
.spotlight
  background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%)

  height: 40vh
  bottom: -30vh
  @apply blur-[20vh]
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
  transition: background-position 0.4s ease-in-out, opacity 0.5s ease-in-out
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)
  -webkit-mask-composite: xor
  mask-composite: exclude
.gradient-border:hover::before
  background-position: -50% 0
  opacity: 1
</style>
