<template>
  <div class="auth-page">
    <div v-motion-pop-visible class="auth-container">
      <h1 class="auth-title">Login</h1>
      <h3 class="auth-subtitle">Get an all new experience</h3>
      <ClientOnly>
        <template #fallback>
          <!-- this will be rendered on server side -->
          <p>Loading...</p>
        </template>
        <form class="auth-form-wrapper">
          <TextField
              name="username"
              prepend="fa-solid fa-signature"
              label="Username"
              :error="v$.username.$errors.length > 0 ? v$.username.$errors[0].$message : null"
              @field:input="username = $event; v$.username.$touch();"
          />
          <TextField
              name="password"
              :type="showPassword ? 'text' : 'password'"
              prepend="fa-solid fa-lock"
              :append="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Password"
              :error="v$.password.$errors.length > 0 ? v$.password.$errors[0].$message : null"
              @field:input="password = $event; v$.password.$touch();"
              @click:append="showPassword = !showPassword"
          />
          <CheckboxField
              name="device"
              label="Keep this device logged in"
              @field:input="device = $event"
          />
        </form>
        <button class="auth-btn-submit" @click="handleLogin($event)">
          Sign In
        </button>

        <div class="auth-link-wrapper">
          <NuxtLink to="/create-account" class="auth-link success">Create account</NuxtLink>
          <NuxtLink to="/forgot-password" class="auth-link error">Forgot Password?</NuxtLink>
        </div>
        <div v-show="notification !== false" v-motion-pop-visible class="notification-wrapper">
          <div v-if="notification === 'loading'" class="notification loading">
            <span class="pt-1">
              <i class="fa-duotone fa-spinner-third fa-spin"/>
            </span>
            <span>Loading...</span>
          </div>
          <div v-else-if="notification === 'success'" class="notification success">
            <span class=""><i class="fa-light fa-cloud-check" /></span>
            <span class="">Welcome back, {{ notificationMessage }}!</span>
          </div>
          <div v-else-if="notification === 'error'" class="notification error">
            <span class="">
              <i class="fa-light fa-circle-exclamation fa-beat-fade"/>
            </span>
            <span class="">{{ notificationMessage }}</span>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script>

import { required, minLength, maxLength, helpers } from "@vuelidate/validators";
import {apiURL, loginState, setData} from "assets/js/auth";
import useVuelidate from "@vuelidate/core";
import axios from "axios";

export default {
  name: "login",
  setup () {
    return {
      v$: useVuelidate()
    }
  },
  created() {

  },
  data() {
    return {
      password: "",
      username: "",
      device: false,
      showPassword: false,
      notification: false,
      notificationMessage: "",

      notificationThread: false,
    };
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
            "Password must be 64 or less chars.",
            maxLength(64)
        ),
      },
      username: {
        required: helpers.withMessage("Username is required.", required),
        minLength: helpers.withMessage(
            "Username must be 3 or more chars.",
            minLength(3)
        ),
        maxLength: helpers.withMessage(
            "Username must 20 or less chars.",
            maxLength(20)
        ),
      },
    }
  },
  mounted() {
    if (loginState()) { this.$router.push("/"); }
  },
  methods: {
    async handleLogin(event) {
      //createRipple(event, "normal", "rgba(0, 0, 0, .3)");
      this.v$.$touch();
      console.log("Nuxt | 1. Trying to Login...");
      if (!this.v$.$invalid) {
        console.log("Nuxt | 2. Form Validation successfully");
        const res = axios.post(apiURL() + "api/auth/local", {
          identifier: this.username,
          password: this.password,
        })
        this.notification = "loading";
        document.querySelector('.auth-btn-submit').disabled = true;
        res.then((response) => {
          const { jwt, user } = response.data;
          let futureDate = new Date();
          futureDate.setDate(futureDate.getDate() + (this.device ? 30 : 1));
          setData("user.token", jwt);
          setData("user.loginDate", futureDate.getTime());
          this.notification = "success";
          this.notificationMessage = user.username;
          console.log("Nuxt | 3. Login successfully;", jwt);
          setTimeout(() => {
            this.$router.push("/");
            document.querySelector('.auth-btn-submit').disabled = false;
          }, 3000);
        });
        res.catch((response) => {
          console.log("Nuxt | 3. Login failed;", response);
          this.notification = "error";
          this.notificationMessage = response.response.data.error.message;
          setTimeout(() => {
            this.notification = false;
            document.querySelector('.auth-btn-submit').disabled = false;
          }, 3000);
        });
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.auth-page
  @apply text-center mx-auto h-screen max-h-screen flex items-center justify-center
  .auth-container
    @apply min-w-min px-14 bg-white py-4 z-20
    .auth-title
      @apply text-4xl text-opacity-80
    .auth-subtitle
      @apply text-lg text-opacity-50
    .auth-form-wrapper
      @apply my-4
    .auth-btn-submit
      @apply relative overflow-hidden bg-indigo-500 w-[90%] rounded-full transition-all duration-500 ease-in-out py-2 text-white
      &:hover
        box-shadow: 0 2px 2rem 0 rgba(0, 0, 0, 0.4)
        @apply scale-90
    .auth-link-wrapper .auth-link
      @apply m-2 text-xs hover:text-green-500 transition-all ease-in-out duration-300
      &.success:hover
        @apply text-green-500
      &.error:hover
        @apply text-red-500
    .notification-wrapper .notification
      @apply rounded-full bg-white gap-3 flex-row flex px-4 pb-1.5 pt-2 place-items-center
      &.loading
        @apply bg-yellow-500
        box-shadow: 0 2px 15px 0 #EAB308
      &.success
        @apply bg-green-500
        box-shadow: 0 2px 15px 0 #22C55E
      &.error
        @apply bg-red-500
        box-shadow: 0 2px 15px 0 #EF4444
</style>
