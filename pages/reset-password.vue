<template>
  <div class="auth-page">
    <div
        v-if="$route.name !== 'empty-reset-password'"
        class="auth-container animate-fadescale"
    >
      <h1>Reset Password</h1>
      <h3>Only works with the provided code in the E-Mail</h3>
      <form class="auth-form">
        <TextField
            name="password"
            :type="showPassword ? 'text' : 'password'"
            prepend="fa-solid fa-lock"
            :append="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
            label="Password"
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
            label="Confirm Password"
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
      <button class="auth-btn-submit" @click="handleRequest">
        Reset Password
      </button>
      <div>
        <router-link to="/login" class="auth-link success"
        >Already have an account? Login</router-link
        >
        <router-link to="/create-account" class="auth-link error"
        >Create Account</router-link
        >
      </div>
      <div
          v-show="notification !== false"
          v-motion-pop-visible
          class="notification-wrapper"
      >
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
    <div v-else class="auth-container">
      <h1>Reset Password</h1>
      <h3>Couldn't verify E-Mail Code</h3>
      <div>
        <router-link to="/forgot-password" class="auth-link success"
        >Forgot your password? Request link
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// TODO: CLIENT AREA / MULTI PAGE REDIRECTION / client.l03.dev / duplicate project / new sidebar etc. / faster main page
import useVuelidate from "@vuelidate/core";
import { required, helpers, minLength, maxLength } from "@vuelidate/validators";
import {apiURL, loginState} from "/assets/js/auth";
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
    console.log("DEV-LOG | 0. Route data:", this.$route);
  },
  validations: {
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
  },
  methods: {
    async handleRequest() {
      this.v$.$touch();
      console.log("DEV-LOG | 1. Trying to Reset-Password...");
      if (!this.v$.$invalid) {
        console.log("DEV-LOG | 2. Form Validation successfully");
        const res = this.axios.post(
            apiURL() + "api/auth/reset-password",
            {
              code: this.$route.params.code,
              password: this.password,
              passwordConfirmation: this.confirmPassword,
            }
        );

        this.notification = "loading";
        // eslint-disable-next-line no-unused-vars
        res.then((response) => {
          this.notification = "success";

          this.notificationMessage = "Your user's password has been reset.";
          console.log("DEV-LOG | 3. Reset Password successfully;");
          setTimeout(() => {
            this.notification = false;
          }, 3500);
        });
        res.catch((response) => {
          console.log("DEV-LOG | 3. Reset Password failed;", response);
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
  @apply min-w-max bg-white px-14 py-4 rounded-xl
  h1
    @apply text-4xl
.auth-form
  @apply my-4
.auth-btn-submit
  @apply w-[90%] bg-violet-700 text-white transition-all duration-500 ease-in-out py-2 rounded-full
  &:hover
    box-shadow: 0 2px 20px 0 rgba(90,43,225,0.70)
    @apply scale-90

.auth-link
  &.success:hover
    @apply text-green-500
  &.error:hover
    @apply text-red-500
  @apply m-2 text-xs hover:text-green-500 transition-all ease-in-out duration-300
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
</style>
