<template>
  <div class="bg-spotlight" />
  <div class="bg-spotlight" />
  <div class="animate-fadescale font-sans antialiased bg-black text-white grid min-h-screen place-content-center overflow-hidden">
    <div class="max-w-520px text-center z-20 ">
      <h1 class="text-8xl sm:text-10xl font-medium mb-8" v-text="'Reset Password'" />
      <p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight">
        No Code Provided
      </p>
      <div class="w-full flex items-center justify-center">
        <NuxtLink to="/" class="gradient-border-1 sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer">
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
</style>