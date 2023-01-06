<script setup>
import axios from "axios";
import { helpers, maxLength, minLength, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const router = useRouter();
onMounted(() => {
  if (loginState()) router.push('/');
})
const state = reactive({
  password: '',
  username: '',
  device: false,
  showPassword: false,
  notification: false
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
async function handleLogin(event) {
  v$.value.$touch();
  const submitBtn = document.querySelector('.auth-container .btn-submit')
  if (!v$.value.$invalid) {
    const res = axios.post(apiURL() + "api/auth/local", {
      identifier: state.username,
      password: state.password,
    })
    state.notification = {
      type: "loading"
    }
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
      }
      setTimeout(() => {
        router.push('/');
        submitBtn.disabled = false;
      }, 2500);
    });
    res.catch((response) => {
      state.notification = { type: "error", message: response.response.data.error.message };
      setTimeout(() => {
        state.notification = false;
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
        <button class="btn-submit" @click="handleLogin($event)">
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
<style lang="sass" scoped>
.gradient-border
  -webkit-backdrop-filter: blur(10px)
  backdrop-filter: blur(10px)
  @apply relative bg-[rgba(20,20,20,0.3)]
  &::before
    background: linear-gradient(90deg,#303030 0%,#303030 25%,#00dc82 50%,#36e4da 75%,#0047e1 100%)
    background-size: 400% auto
    transition: background-position 0.3s ease-in-out, opacity 0.2s ease-in-out
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)
    -webkit-mask-composite: xor
    mask-composite: exclude
    @apply absolute content-[''] top-0 left-0 right-0 bottom-0 p-[2px] w-full opacity-50
  &:hover::before
    background-position: -50% 0
    opacity: 1
.auth-page
  @apply text-center mx-auto h-screen max-h-screen flex items-center justify-center
  .auth-container
    @apply min-w-min px-14 bg-white bg-opacity-5 py-4 z-20 animate-fadescale
    .title
      @apply text-4xl text-opacity-80 text-white
    .subtitle
      @apply text-lg text-opacity-50 text-white
    .form-wrapper
      @apply my-4
    .btn-submit
      @apply py-2.5 text-xl text-white text-opacity-80 max-w-xs w-full cursor-pointer gradient-border
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
</style>