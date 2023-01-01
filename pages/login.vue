<template>
  <div class="fixed left-0 right-0 spotlight z-10"></div>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="title">Login</h1>
      <h2 class="subtitle">Get an new experience</h2>
      <ClientOnly>
        <form class="form-wrapper">
          <TextField
              name="username"
              prepend="fa-solid fa-signature"
              label="Username"
              :error="v$.username.$errors.length > 0 ? v$.username.$errors[0].$message : null"
              label-color="rgba(255,255,255,0.5)"
              icon-color="rgba(255,255,255,0.9)"
              @field:input="username = $event; v$.username.$touch();"
          />
          <TextField
              name="password"
              :type="showPassword ? 'text' : 'password'"
              prepend="fa-solid fa-lock"
              :append="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Password"
              label-color="rgba(255,255,255,0.5)"
              icon-color="rgba(255,255,255,0.9)"
              :error="v$.password.$errors.length > 0 ? v$.password.$errors[0].$message : null"
              @field:input="password = $event; v$.password.$touch();"
              @click:append="showPassword = !showPassword"
          />
          <CheckboxField
              name="device"
              label="Keep this device logged in"
              label-color="rgba(255,255,255,0.8)"
              icon-color="rgba(255,255,255,0.95)"
              @field:input="device = $event"
          />
        </form>
        <button class="btn-submit" @click="handleLogin($event)">
          Sign In
        </button>
        <div class="link-wrapper">
          <NuxtLink to="/create-account" class="link success">Create account</NuxtLink>
          <NuxtLink to="/forgot-password" class="link error">Forgot Password?</NuxtLink>
        </div>
        <div v-show="notification !== false" class="notification-wrapper">
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
  data() {
    return {
      password: "",
      username: "",
      device: false,
      showPassword: false,
      notification: false,
      notificationMessage: "",
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
    if (loginState()) { this.$router.push({ path: "/"}); }
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
        document.querySelector('.auth-container .btn-submit').disabled = true;
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
            document.querySelector('.auth-container .btn-submit').disabled = false;
          }, 2500);
        });
        res.catch((response) => {
          console.log("Nuxt | 3. Login failed;", response);
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