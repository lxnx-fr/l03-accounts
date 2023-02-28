<script setup lang="ts">
import axios from "axios";
import { helpers, required, email } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

const router = useRouter();
onMounted(() => {
  if (loginState()) {
    router.push('/');
  }
})
const state = reactive({
  mail: '',
  notification: {},
})
const rules = {
  mail: {
    email: helpers.withMessage("Please enter a valid E-Mail.", email),
    required: helpers.withMessage("E-Mail is required.", required),
  },
}
const v$ = useVuelidate(rules, state);
async function handleRequest(event: any) {
  v$.value.$touch();
  const btnSubmit: HTMLButtonElement = document.querySelector('.auth-container .submit-btn') as HTMLButtonElement;
  if (!v$.value.$invalid) {
    const res = axios.post(apiURL + "api/auth/forgot-password", {
      email: state.mail,
    });
    btnSubmit.disabled = false;
    state.notification = {type: "loading"};
    res.then((response) => {
      state.notification = {type: "success"};
      setTimeout(() => {
        state.notification = {type: false};
        btnSubmit.disabled = false;
      }, 2500);
    });
    res.catch((response) => {
      state.notification = {type: "error", message: response.response.data.error.message};
      setTimeout(() => {
        state.notification = {type: false};
        btnSubmit.disabled = false;
      }, 2500);
    });
  }
}

// TODO: CLIENT AREA / MULTI PAGE REDIRECTION / client.l03.dev / duplicate project / new sidebar etc. / faster main page
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1 class="title">Forgot Password</h1>
      <h2 class="subtitle">Request a Link</h2>
      <ClientOnly >
        <form class="form-wrapper">
          <TextField
              name="mail"
              type="email"
              prepend="fa-solid fa-envelope"
              label="E-Mail"
              label-color="#FFFFFF7F"
              icon-color="#FFFFFFE5"
              :error="v$.mail.$errors.length > 0 ? v$.mail.$errors[0].$message : null"
              @field:input="state.mail = $event; v$.mail.$touch();"
          />
        </form>
      </ClientOnly>
      <button class="submit-btn" @click="handleRequest($event)">
        Send Request
      </button>
      <div class="link-wrapper">
        <NuxtLink to="/login" class="link success"
        >Already have an account? Login</NuxtLink>
      </div>
      <div v-show="state.notification.type !== false" class="notification-wrapper">
        <div v-if="state.notification.type === 'loading'" class="notification loading">
          <span class="pt-1"><i class="fa-duotone fa-spinner-third fa-spin"/></span>
          <span class="">Loading...</span>
        </div>
        <div v-else-if="state.notification.type === 'success'" class="notification success">
          <span class=""><i class="fa-light fa-cloud-check" /></span>
          <span>If an user with this E-Mail exists,<br />You will receive an E-Mail!</span>
        </div>
        <div v-else-if="state.notification.type === 'error'" class="notification error">
          <span><i class="fa-light fa-circle-exclamation fa-beat-fade"/></span>
          <span>{{ state.notification.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<style lang="sass">
@import "../assets/css/auth.sass"
</style>
