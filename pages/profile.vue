<template>
  <div class="grid grid-cols 1 place-items-center place-content-center">
    <input type="file" @change="uploadAvatar" accept="image/*">
    <div v-if="state.avatarUrl">
      <img :src="state.avatarUrl" alt="Avatar">
      <span>{{state.avatarUrl}}</span>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";

const router = useRouter();
onMounted(() => {
  if (!loginState()) {
    router.push("/login")
  }
})
const state = reactive({
  avatarUrl: null,
});

async function uploadAvatar(event) {
  const file = event.target.files[0];
  const formData = new FormData();
  formData.append('files', file, file.name);
  try {
    const response = await axios.post(apiURL + 'api/upload', formData);
    const avatarId = response.data[0].id;
    const avatarUrl = apiURL + `api/uploads/${avatarId}`;
    this.avatarUrl = avatarUrl;
    console.log("url: " + avatarUrl)


    // Now you can store the avatar ID in your user object in Strapi
    // using the Strapi REST API or GraphQL API.
  } catch (error) {
    console.error(error);
  }
}
</script>

<style lang="sass" scoped>

</style>