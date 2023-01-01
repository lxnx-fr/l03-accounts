<template>
  <div class="fixed left-0 right-0 spotlight z-10"></div>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="title">Forgot Password</h1>
      <ClientOnly >
        <form class="form-wrapper">
          <TextField
              name="mail"
              type="email"
              prepend="fa-solid fa-envelope"
              label="E-Mail"
              label-color="rgba(255,255,255,0.5)"
              icon-color="rgba(255,255,255,0.9)"
              :error="
              v$.mail.$errors.length > 0 ? v$.mail.$errors[0].$message : null
            "
              @field:input="
              mail = $event;
              v$.mail.$touch();
            "
          />
        </form>
      </ClientOnly>
      <button class="btn-submit" @click="handleRequest">
        Send Request
      </button>
      <div class="link-wrapper">
        <NuxtLink to="/login" class="link success"
        >Already have an account? Login</NuxtLink>
      </div>
      <div
          v-show="notification !== false"
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
          <span class=""
          >If an user with this E-Mail exists,<br />You will receive an
            E-Mail!</span
          >
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
import { required, email, helpers } from "@vuelidate/validators";
import {apiURL, loginState} from "assets/js/auth";
import axios from "axios";


export default {
  name: "ForgotPasswordView",
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      mail: "",
      notification: false,
      notificationMessage: "",
    };
  },
  mounted() {
    if (loginState()) { this.$router.push({ path: "/"}); }
  },
  validations() {
    return {
      mail: {
        email: helpers.withMessage("Please enter a valid E-Mail.", email),
        required: helpers.withMessage("E-Mail is required.", required),
      },
    }
  },
  methods: {
    async handleRequest() {
      this.v$.$touch();
      console.log("DEV-LOG | 1. Trying to Request a Reset-Password link...");
      if (!this.v$.$invalid) {
        console.log("DEV-LOG | 2. Form Validation successfully");
        const res = axios.post(
            apiURL() + "api/auth/forgot-password",
            {
              email: this.mail,
            }
        );

        this.notification = "loading";
        // eslint-disable-next-line no-unused-vars
        res.then((response) => {
          this.notification = "success";
          console.log("DEV-LOG | 3. Reset Password Request successfully;");
          setTimeout(() => {
            this.notification = false;
          }, 3500);
        });
        res.catch((response) => {
          console.log("DEV-LOG | 3. Reset Password Request failed;", response);
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
</style>
