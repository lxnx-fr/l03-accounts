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
              @field:input="fullName = $event;"
          />
          <TextField
              name="username"
              label="Username"
              prepend="fa-solid fa-signature"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              :error="v$.username.$errors.length > 0 ? v$.username.$errors[0].$message : null"
              @field:input="username = $event; v$.username.$touch();"
          />
          <TextField
              name="email"
              label="E-Mail"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              type="email"
              prepend="fa-solid fa-envelope"
              :error="v$.mail.$errors.length > 0 ? v$.mail.$errors[0].$message : null"
              @field:input="mail = $event; v$.mail.$touch();"
          />
          <TextField
              name="password"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              :type="showPassword ? 'text' : 'password'"
              prepend="fa-solid fa-lock"
              :append="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Password"
              :error="v$.password.$errors.length > 0 ? v$.password.$errors[0].$message : null"
              @field:input="password = $event; v$.password.$touch();"
              @click:append="showPassword = !showPassword"
          />
          <TextField
              name="confirm-password"
              :type="showPassword ? 'text' : 'password'"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              prepend="fa-solid fa-lock"
              :append="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Confirm Password"
              :error="v$.confirmPassword.$errors.length > 0 ? v$.confirmPassword.$errors[0].$message : null"
              @field:input="confirmPassword = $event; v$.confirmPassword.$touch();"
              @click:append="showPassword = !showPassword"
          />
          <CheckboxField
              label-color="#FFFFFFD9"
              icon-color="#FFFFFFE5"
              name="terms"
              label="Accept Terms of Services"
              :error="v$.termsBox.$errors.length > 0 ? v$.termsBox.$errors[0].$message : null"
              @field:input="termsBox = $event; v$.termsBox.$touch();"
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
      <div v-show="notification !== false" class="notification-wrapper">
        <div v-if="notification === 'loading'" class="notification loading">
          <span class="pt-1"><i class="fa-duotone fa-spinner-third fa-spin"/></span>
          <span>Loading...</span>
        </div>
        <div v-else-if="notification === 'success'" class="notification success">
          <span><i class="fa-light fa-cloud-check" /></span>
          <span>Created account, {{ notificationMessage }}!</span>
        </div>
        <div v-else-if="notification === 'error'" class="notification error">
          <span><i class="fa-light fa-circle-exclamation fa-beat-fade" /></span>
          <span>{{ notificationMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  maxLength,
  helpers,
} from "@vuelidate/validators";
import { loginState, apiURL } from "/assets/js/auth";
import axios from "axios";
function samePassword() {
  return this.password === this.confirmPassword;
}
function isChecked() {
  return this.termsBox === true;
}
export default {
  name: "create-account",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  mounted() {
    if (loginState()) { this.$router.push({ path: "/"}); }
  },
  data() {
    return {
      fullName: "",
      username: "",
      mail: "",
      password: "",
      confirmPassword: "",
      termsBox: "",
      showPassword: false,
      notification: false,
      notificationMessage: "",
    };
  },
  validations() {
    return {
      username: {
        required: helpers.withMessage("Username is required.", required),
        minLength: helpers.withMessage(
            "Username must 3 or more characters",
            minLength(3)
        ),
        maxLength: helpers.withMessage(
            "Username must shorter than 20 characters",
            maxLength(20)
        ),
      },
      mail: {
        email: helpers.withMessage("Please enter a valid E-Mail.", email),
        required: helpers.withMessage("E-Mail is required.", required),
      },
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
      termsBox: {
        checked: helpers.withMessage(
            "You must accept our Terms of Services",
            isChecked
        ),
      },
    }
  },
  methods: {
    async handleRegister() {
      this.v$.$touch();
      console.log("DEV-LOG | 1. Trying Registering Account...");
      if (!this.v$.$invalid) {
        console.log("DEV-LOG | 2. Form Validation successfully");
        const res = axios.post(apiURL() + "api/auth/local/register",
            {
              email: this.mail,
              password: this.password,
              username: this.username,
              fullname: this.fullName,
            }
        );
        document.querySelector('.auth-container .btn-submit').disabled = true;
        this.notification = "loading";
        res.then((response) => {
          console.log(
              "DEV-LOG | 3. Registration successfully;",
              response.data
          );
          this.notification = "success";
          this.notificationMessage = response.data.user.username;
          setTimeout(() => {
            this.notification = false;
            this.$router.push("/login");
            document.querySelector('.auth-container .btn-submit').disabled = false;
          }, 2500);
        });
        res.catch((response) => {
          console.log("DEV-LOG | 3. Registration failed;", response);
          this.notification = "error";
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
<style lang="sass">
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

