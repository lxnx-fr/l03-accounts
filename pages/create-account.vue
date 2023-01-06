

<script setup lang="ts">
import useVuelidate from "@vuelidate/core";
import axios from "axios";
import { email, helpers, maxLength, minLength, required } from "@vuelidate/validators";
const router = useRouter();

onMounted(() => {
  if (loginState()) { router.push('/'); }
})

const state = reactive({
  fullName: "",
  username: "",
  mail: "",
  password: "",
  confirmPassword: "",
  termsBox: false,
  showPassword: false,
  notification: {},
})

const rules = {
  username: {
    required: helpers.withMessage("Username is required.", required),
    minLength: helpers.withMessage("Username must 3 or more characters", minLength(3)),
    maxLength: helpers.withMessage("Username must shorter than 20 characters", maxLength(20)),
  },
  mail: {
    email: helpers.withMessage("Please enter a valid E-Mail.", email),
    required: helpers.withMessage("E-Mail is required.", required),
  },
  password: {
    required: helpers.withMessage("Password is required.", required),
    minLength: helpers.withMessage("Password must be 8 or more chars.", minLength(8)),
    maxLength: helpers.withMessage("Password must shorter than 64 chars.",  maxLength(64)),
  },
  confirmPassword: {
    required: helpers.withMessage("Confirm Password is required.", required),
    sameAs: helpers.withMessage("Passwords must match", samePassword),
  },
  termsBox: {
    checked: helpers.withMessage("You must accept our Terms of Services", isChecked),
  },
}

const v$ = useVuelidate(rules, state);
function isChecked() {
  return state.termsBox === true;
}
function samePassword() {
  return state.password === state.confirmPassword;
}

async function handleRegister() {
  v$.value.$touch();
  const btnSubmit: HTMLButtonElement  = document.querySelector('.auth-container .btn-submit') as HTMLButtonElement;
  if (!v$.value.$invalid) {
    const res = axios.post(apiURL + "api/auth/local/register", {
      email: state.mail,
      password: state.password,
      username: state.username,
      fullname: state.fullName,
    });
    btnSubmit.disabled = true;
    state.notification = {
      type: "loading"
    };
    res.then((response) => {
      state.notification = {
        type: "success",
        message: response.data.user.username
      };
      setTimeout(() => {
        state.notification = {
          type: false
        };
        router.push('/login');
      }, 2500);
    });
    res.catch((response) => {
      state.notification = {
        type: "error",
        message: response.response.data.error.message
      };
      setTimeout(() => {
        state.notification = {
          type: false
        };
        btnSubmit.disabled = false;
      }, 2500);
    });
  }
}
</script>
<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="title">Register</h1>
      <h2 class="subtitle">Get an all new experience</h2>
      <ClientOnly>
        <form class="form-wrapper">
          <TextField
              name="full-name"
              label="Full Name"
              label-addon=" (Optional)"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              prepend="fa-solid fa-user"
              @field:input="state.fullName = $event;"
          />
          <TextField
              name="username"
              label="Username"
              prepend="fa-solid fa-signature"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              :error="v$.username.$errors.length > 0 ? v$.username.$errors[0].$message : null"
              @field:input="state.username = $event; v$.username.$touch();"
          />
          <TextField
              name="email"
              label="E-Mail"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              type="email"
              prepend="fa-solid fa-envelope"
              :error="v$.mail.$errors.length > 0 ? v$.mail.$errors[0].$message : null"
              @field:input="state.mail = $event; v$.mail.$touch();"
          />
          <TextField
              name="password"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              :type="state.showPassword ? 'text' : 'password'"
              prepend="fa-solid fa-lock"
              :append="state.showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Password"
              :error="v$.password.$errors.length > 0 ? v$.password.$errors[0].$message : null"
              @field:input="state.password = $event; v$.password.$touch();"
              @click:append="state.showPassword = !state.showPassword"
          />
          <TextField
              name="confirm-password"
              :type="state.showPassword ? 'text' : 'password'"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              prepend="fa-solid fa-lock"
              :append="state.showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Confirm Password"
              :error="v$.confirmPassword.$errors.length > 0 ? v$.confirmPassword.$errors[0].$message : null"
              @field:input="state.confirmPassword = $event; v$.confirmPassword.$touch();"
              @click:append="state.showPassword = !state.showPassword"
          />
          <CheckboxField
              label-color="#FFFFFFD9"
              icon-color="#FFFFFFE5"
              name="terms"
              label="Accept Terms of Services"
              :error="v$.termsBox.$errors.length > 0 ? v$.termsBox.$errors[0].$message : null"
              @field:input="state.termsBox = $event; v$.termsBox.$touch();"
          />
        </form>
      </ClientOnly>
      <button class="btn-submit" @click.prevent="handleRegister">
        Sign Up
      </button>
      <div class="link-wrapper">
        <NuxtLink to="/login" class="link success">
          Already have an account? Login
        </NuxtLink>
      </div>
      <div v-show="state.notification.type !== false" class="notification-wrapper">
        <div v-if="state.notification.type === 'loading'" class="notification loading">
          <span class="pt-1"><i class="fa-duotone fa-spinner-third fa-spin"/></span>
          <span>Loading...</span>
        </div>
        <div v-else-if="state.notification.type === 'success'" class="notification success">
          <span><i class="fa-light fa-cloud-check" /></span>
          <span>Created account, {{ state.notification.message }}!</span>
        </div>
        <div v-else-if="state.notification.type === 'error'" class="notification error">
          <span><i class="fa-light fa-circle-exclamation fa-beat-fade" /></span>
          <span>{{ state.notification.message }}</span>
        </div>
      </div>
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

