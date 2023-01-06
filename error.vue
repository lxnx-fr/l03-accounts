
<script setup lang="ts">
defineProps( {
  error: {}
})
</script>

<template>
  <div class="bg-spotlight" />
  <div class="bg-spotlight" />
  <div class="animate-fadescale font-sans antialiased bg-black text-white grid min-h-screen place-content-center overflow-hidden">
    <div class="max-w-520px text-center z-20 ">
        <h1 class="text-8xl sm:text-10xl font-medium mb-8">{{error.statusCode}}</h1>
        <p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight">
          Page not found: {{ error.url }}
        </p>
        <div class="w-full flex items-center justify-center">
          <NuxtLink to="/" class="gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer">
            Go back Home
          </NuxtLink>
        </div>
    </div>
  </div>
</template>


<style lang="sass" scoped>
.bg-spotlight
  background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%)
  height: 40vh
  bottom: -30vh
  @apply fixed left-0 right-0 blur-[20vh] z-10
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
</style>