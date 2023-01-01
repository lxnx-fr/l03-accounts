<template>
  <div class="fixed left-0 right-0 spotlight z-10"></div>
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
              label-color="rgba(255,255,255,0.8)"
              icon-color="rgba(255,255,255,0.95)"
              prepend="fa-solid fa-user"
              @field:input="fullName = $event;"
          />
          <TextField
              name="username"
              label="Username"
              prepend="fa-solid fa-signature"
              label-color="rgba(255,255,255,0.8)"
              icon-color="rgba(255,255,255,0.95)"
              :error="v$.username.$errors.length > 0 ? v$.username.$errors[0].$message : null"
              @field:input="username = $event; v$.username.$touch();"
          />
          <TextField
              name="email"
              label="E-Mail"
              label-color="rgba(255,255,255,0.8)"
              icon-color="rgba(255,255,255,0.95)"
              type="email"
              prepend="fa-solid fa-envelope"
              :error="v$.mail.$errors.length > 0 ? v$.mail.$errors[0].$message : null"
              @field:input="mail = $event; v$.mail.$touch();"
          />
          <TextField
              name="password"
              label-color="rgba(255,255,255,0.8)"
              icon-color="rgba(255,255,255,0.95)"
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
              label-color="rgba(255,255,255,0.8)"
              icon-color="rgba(255,255,255,0.95)"
              prepend="fa-solid fa-lock"
              :append="showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
              label="Confirm Password"
              :error="v$.confirmPassword.$errors.length > 0 ? v$.confirmPassword.$errors[0].$message : null"
              @field:input="confirmPassword = $event; v$.confirmPassword.$touch();"
              @click:append="showPassword = !showPassword"
          />
          <CheckboxField
              label-color="rgba(255,255,255,0.8)"
              icon-color="rgba(255,255,255,0.95)"
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
      <div
          v-show="notification !== false"
          class="notification-wrapper"
      >
        <div v-if="notification === 'loading'" class="notification loading">
          <span class="pt-1">
            <i class="fa-duotone fa-spinner-third fa-spin"/>
          </span>
          <span>Loading...</span>
        </div>
        <div v-else-if="notification === 'success'" class="notification success">
          <span>
            <i class="fa-light fa-cloud-check" />
          </span>
          <span>Created account, {{ notificationMessage }}!</span>
        </div>
        <div v-else-if="notification === 'error'" class="notification error">
          <span>
            <i class="fa-light fa-circle-exclamation fa-beat-fade" />
          </span>
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

