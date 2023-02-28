<template>
  <TWScreen />
  <div class="bg-spotlight" />
  <div class="bg-spotlight" />
  <NuxtPage />
</template>
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
.bg-spotlight
  background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%)
  height: 40vh
  bottom: -30vh
  @apply fixed left-0 right-0 blur-[20vh] z-10
</style>