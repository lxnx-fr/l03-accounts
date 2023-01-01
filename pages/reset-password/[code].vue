<template>
  <div class="fixed left-0 right-0 spotlight z-10"></div>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="title">Reset Password</h1>
      <h3 class="subtitle">Set a new password</h3>
      <ClientOnly>
        <template #fallback>
          <p>Loading...</p>
        </template>
        <form class="form-wrapper">
          <TextField
              name="password"
              :type="showPassword ? 'text' : 'password'"
              prepend="fa-solid fa-lock"
              :append="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="New Password"
              label-color="rgba(255,255,255,0.5)"
              icon-color="rgba(255,255,255,0.9)"
              :error="
              v$.password.$errors.length > 0
                ? v$.password.$errors[0].$message
                : null
            "
              @field:input="
              password = $event;
              v$.password.$touch();
            "
              @click:append="showPassword = !showPassword"
          />
          <TextField
              name="confirm-password"
              :type="showPassword ? 'text' : 'password'"
              prepend="fa-solid fa-lock"
              :append="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Confirm New Password"
              label-color="rgba(255,255,255,0.5)"
              icon-color="rgba(255,255,255,0.9)"
              :error="
              v$.confirmPassword.$errors.length > 0
                ? v$.confirmPassword.$errors[0].$message
                : null
            "
              @field:input="
              confirmPassword = $event;
              v$.confirmPassword.$touch();
            "
              @click:append="showPassword = !showPassword"
          />
        </form>
      </ClientOnly>
      <button class="btn-submit" @click="handleRequest">
        Reset Password
      </button>
      <div class="link-wrapper">
        <NuxtLink to="/login" class="link success"
        >Already have an account? Login</NuxtLink
        >
        <NuxtLink to="/create-account" class="link error"
        >Create Account</NuxtLink
        >
      </div>
      <div v-show="notification !== false" class="notification-wrapper">
        <div v-if="notification === 'loading'" class="notification loading">
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
          <span class="">{{ notificationMessage }}!</span>
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
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
import {apiURL, loginState} from "/assets/js/auth";
import axios from "axios";
function samePassword() {
  return this.password === this.confirmPassword;
}
export default {
  name: "ResetPasswordView",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      password: "",
      confirmPassword: "",
      showPassword: false,
      notification: false,
      notificationMessage: "",
    };
  },
  mounted() {
    if (loginState()) this.$router.push("/");
  },
  validations() {
    return {
      password: {
        required: helpers.withMessage("Password is required.", required),
        minLength: helpers.withMessage(
            "Password must be 8 or more chars.",
            minLength(8)
        ),
        maxLength: helpers.withMessage(
            "Password must shorter than 64 chars.",
            maxLength(64)
        ),
      },
      confirmPassword: {
        required: helpers.withMessage("Confirm Password is required.", required),
        sameAs: helpers.withMessage("Passwords must match", samePassword),
      },
    }
  },
  methods: {
    async handleRequest() {
      this.v$.$touch();
      console.log("DEV-LOG | 1. Trying to Reset-Password...");
      if (!this.v$.$invalid) {
        console.log("DEV-LOG | 2. Form Validation successfully");
        const res = axios.post(
            apiURL() + "api/auth/reset-password",
            {
              code: this.$route.params.code,
              password: this.password,
              passwordConfirmation: this.confirmPassword,
            }
        );
        document.querySelector('.auth-container .btn-submit').disabled = true;
        this.notification = "loading";
        // eslint-disable-next-line no-unused-vars
        res.then((response) => {
          this.notification = "success";

          this.notificationMessage = "Your user's password has been reset.";
          console.log("DEV-LOG | 3. Reset Password successfully;");
          setTimeout(() => {
            this.notification = false;
            document.querySelector('.auth-container .btn-submit').disabled = false;
          }, 2500);
        });
        res.catch((response) => {
          console.log("DEV-LOG | 3. Reset Password failed;", response);
          this.notification = "error";
          this.notificationMessage = response.response.data.error.message;
          setTimeout(() => {
            this.notification = false;
            document.querySelector('.auth-container .btn-submit').disabled = false;
          }, 3000);
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
    @apply min-w-min px-14 bg-white bg-opacity-5 py-4 z-20 animate-fadescale
    .title
      @apply text-4xl text-opacity-80 text-white
    .subtitle
      @apply text-lg text-opacity-50 text-white
    .form-wrapper
      @apply my-4
    .btn-submit
      @apply gradient-border py-2.5 text-xl text-white text-opacity-80 max-w-xs w-full cursor-pointer
    .link-wrapper
      @apply mt-2
      .link
        @apply m-2 text-xs text-white text-opacity-75 transition-all ease-in-out duration-300
        &.success:hover
          @apply text-green-500
        &.error:hover
          @apply text-red-500
    .notification-wrapper
      @apply animate-fadescale
      .notification
        @apply rounded-full bg-white gap-3 flex-row flex px-4 pb-1.5 pt-2 place-items-center mt-4
        &.loading
          @apply bg-yellow-500
          box-shadow: 0 2px 15px 0 #EAB308
        &.success
          @apply bg-green-500
          box-shadow: 0 2px 15px 0 #22C55E
        &.error
          @apply bg-red-500
          box-shadow: 0 2px 15px 0 #EF4444

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
