<template>
  <div>
    <NuxtPage />
  </div>

</template>
<script>
export default {
}
</script>
<style lang="sass">
@font-face
  font-family: 'NexaLight'
  src: url('assets/fonts/NexaLight/NexaLight.woff2') format('woff2')
  font-weight: normal
  font-style: normal
  font-display: swap
@font-face
  font-family: 'NexaBold'
  src: url('assets/fonts/NexaBold/NexaBold.woff2') format('woff2')
  font-weight: normal
  font-style: normal
  font-display: swap
body, html, #app
  font-family: NexaBold, NexaLight, sans-serif
  @apply bg-black max-w-full overflow-x-hidden

</style>
