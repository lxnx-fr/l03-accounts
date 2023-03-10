<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import {required, helpers, minLength, maxLength } from "@vuelidate/validators";
import axios from "axios";

const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (loginState()) {
    router.push('/')
  }
})
const state = reactive({
  password: "",
  confirmPassword: "",
  showPassword: false,
  notification: {},
})
const rules = {
  password: {
    required: helpers.withMessage("Password is required.", required),
    minLength: helpers.withMessage("Password must be 8 or more chars.", minLength(8)),
    maxLength: helpers.withMessage("Password must shorter than 64 chars.", maxLength(64)),
  },
  confirmPassword: {
    required: helpers.withMessage("Confirm Password is required.", required),
    sameAs: helpers.withMessage("Passwords must match", samePassword),
  },
}
const v$ = useVuelidate(rules, state);

function samePassword() {
  return state.password === state.confirmPassword;
}

async function handleRequest() {
  v$.value.$touch();
  console.log("DEV-LOG | 1. Trying to Reset-Password...");
  const btnSubmit: HTMLButtonElement = document.querySelector('.auth-container .submit-btn') as HTMLButtonElement;
  if (!v$.value.$invalid) {
    console.log("DEV-LOG | 2. Form Validation successfully");
    const res = axios.post(apiURL + "api/auth/reset-password", {
      code: route.params.code,
      password: state.password,
      passwordConfirmation: state.confirmPassword,
    });
    btnSubmit.disabled = true;
    state.notification = {
      type: "loading"
    };
    res.then(() => {
      state.notification = {
        type: "success",
        message: "Your user's password has been reset."
      };
      setTimeout(() => {
        state.notification = false;
        btnSubmit.disabled = false;
      }, 2500);
    });
    res.catch((response) => {
      state.notification = {
        type: "error",
        message: response.response.data.error.message
      };
      setTimeout(() => {
        state.notification = {
          type: false,
        };
        btnSubmit.disabled = false;
      }, 3000);
    });
  }
}
</script>
<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="title">Reset Password</h1>
      <h2 class="subtitle">Set a new password</h2>
      <ClientOnly>
        <form class="form-wrapper">
          <TextField
              name="password"
              :type="state.showPassword ? 'text' : 'password'"
              prepend="fa-solid fa-lock"
              :append="state.showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="New Password"
              label-color="rgba(255,255,255,0.5)"
              icon-color="rgba(255,255,255,0.9)"
              :error="v$.password.$errors.length > 0 ? v$.password.$errors[0].$message : null"
              @field:input="state.password = $event; v$.password.$touch();"
              @click:append="state.showPassword = !state.showPassword"
          />
          <TextField
              name="confirm-password"
              :type="state.showPassword ? 'text' : 'password'"
              prepend="fa-solid fa-lock"
              :append="state.showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Confirm New Password"
              label-color="rgba(255,255,255,0.5)"
              icon-color="rgba(255,255,255,0.9)"
              :error="v$.confirmPassword.$errors.length > 0 ? v$.confirmPassword.$errors[0].$message : null"
              @field:input="state.confirmPassword = $event; v$.confirmPassword.$touch();"
              @click:append="() => { state.showPassword = !state.showPassword }"
          />
        </form>
      </ClientOnly>
      <button class="submit-btn" @click="handleRequest">
        Reset Password
      </button>
      <div class="link-wrapper">
        <NuxtLink to="/login" class="link success">
          Already have an account? Login
        </NuxtLink>
        <NuxtLink to="/create-account" class="link error">
          Create Account
        </NuxtLink>
      </div>
      <div v-show="state.notification !== false" class="notification-wrapper">
        <div v-if="state.notification.type === 'loading'" class="notification loading">
          <span class="pt-1">
            <i class="fa-duotone fa-spinner-third fa-spin"/>
          </span>
          <span>Loading...</span>
        </div>
        <div v-else-if="state.notification.type === 'success'" class="notification success">
          <span>
            <i class="fa-light fa-cloud-check" />
          </span>
          <span>{{ state.notification.message }}!</span>
        </div>
        <div v-else-if="state.notification.type === 'error'" class="notification error">
          <span>
            <i class="fa-light fa-circle-exclamation fa-beat-fade"/>
          </span>
          <span>{{ state.notification.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="sass">
@import "../assets/css/auth"
</style>