<template>
  <div class="fixed left-0 right-0 spotlight z-10"></div>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="title">Reset Password</h1>
      <h3 class="subtitle">Set a new password</h3>
      <ClientOnly>
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

</style>
