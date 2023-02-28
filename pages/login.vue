<script setup lang="ts">
import axios from "axios";
import { helpers, maxLength, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const router = useRouter();
const state = reactive({
  password: '',
  username: '',
  device: false,
  showPassword: false,
  notification: {}
})
const rules = {
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
  }
}
const v$ = useVuelidate(rules, state);
onMounted(() => {
  if (loginState()) router.push('/');
})
async function handleLogin(event: any) {
  v$.value.$touch();
  const submitBtn: HTMLButtonElement = document.querySelector('.auth-container .submit-btn') as HTMLButtonElement;
  if (!v$.value.$invalid) {
    const res = axios.post(apiURL + "api/auth/local", {
      identifier: state.username,
      password: state.password,
    });
    state.notification = {
      type: "loading"
    };
    submitBtn.disabled = true;
    res.then((response) => {
      const { jwt, user } = response.data;
      let futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + (state.device ? 30 : 1));
      setData("user.token", jwt);
      setData("user.loginDate", futureDate.getTime());
      state.notification = {
        type: "success",
        message: user.username
      };
      setTimeout(() => {
        router.push('/');
      }, 2500);
    });
    res.catch((response) => {
      state.notification = { type: "error", message: response.response.data.error.message };
      setTimeout(() => {
        state.notification = {
          type: false
        };
        submitBtn.disabled = false;
      }, 3000);
    });
  }
}
</script>
<template>
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
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              @field:input="state.username = $event; v$.username.$touch();"
          />
          <TextField
              name="password"
              :type="state.showPassword ? 'text' : 'password'"
              prepend="fa-solid fa-lock"
              :append="state.showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Password"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              :error="v$.password.$errors.length > 0 ? v$.password.$errors[0].$message : null"
              @field:input="state.password = $event; v$.password.$touch();"
              @click:append="state.showPassword = !state.showPassword"
          />
          <CheckboxField
              name="device"
              label="Keep this device logged in"
              label-color="#FFFFFFD9"
              icon-color="#FFFFFFE5"
              @field:input="state.device = $event"
          />
        </form>
        <button class="submit-btn" @click="handleLogin($event)">
          Sign In
        </button>
        <div class="link-wrapper">
          <NuxtLink to="/create-account" class="link success">Create account</NuxtLink>
          <NuxtLink to="/forgot-password" class="link error">Forgot Password?</NuxtLink>
        </div>
        <div v-show="state.notification !== false" class="notification-wrapper">
          <div v-if="state.notification.type === 'loading'" class="notification loading">
            <span class="pt-1"> <i class="fa-duotone fa-spinner-third fa-spin"/> </span>
            <span>Loading...</span>
          </div>
          <div v-else-if="state.notification.type === 'success'" class="notification success">
            <span><i class="fa-light fa-cloud-check" /></span>
            <span>Welcome back, {{ state.notification.message }}!</span>
          </div>
          <div v-else-if="state.notification.type === 'error'" class="notification error">
            <span> <i class="fa-light fa-circle-exclamation fa-beat-fade"/></span>
            <span>{{ state.notification.message }}</span>
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>
<style lang="sass">
@import "../assets/css/auth"
</style>