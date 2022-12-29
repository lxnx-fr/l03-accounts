<template>
  <div class="auth-page">
    <div class="auth-container animate-fadescale">
      <h1>Forgot Password</h1>
      <ClientOnly>
        <form class="auth-form">
          <TextField
              name="mail"
              type="email"
              prepend="fa-solid fa-envelope"
              label="E-Mail"
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
      <button class="auth-btn-submit" @click="handleRequest">
        Send Request
      </button>
      <div>
        <router-link to="/login" class="auth-link success"
        >Already have an account? Login</router-link
        >
      </div>
      <div
          v-show="notification !== false"
          class="notification-wrapper animate-fadescale"
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
          >If an user with this E-Mail exits, <br />Your user will receive an
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
    if (loginState()) this.$router.push("/");
  },
  validations: {
    mail: {
      email: helpers.withMessage("Please enter a valid E-Mail.", email),
      required: helpers.withMessage("E-Mail is required.", required),
    },
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
