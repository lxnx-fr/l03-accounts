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
.page-enter-active,
.page-leave-active
  transition: all 0.2s

.page-enter-from,
.page-leave-to
  opacity: 0
  filter: blur(1rem)
@keyframes fadescale
  0%
    opacity: 0
    transform: scale(0%)
  100%
    transform: scale(100%)
    opacity: 100%
.animate-fadescale
  animation: fadescale 0.3s ease-in-out
</style>
