<template>
  <div class="tw-screen">
    <span class="sm:hidden rounded px-1 bg-yellow-400 p-1">XS less 640</span>
    <span class="hidden sm:inline-block md:hidden rounded px-1 bg-yellow-400"
      >SM more 640</span
    >
    <span
      class="hidden sm:hidden md:inline-block lg:hidden rounded px-1 bg-yellow-400"
      >MD more 768</span
    >
    <span class="hidden lg:inline-block xl:hidden rounded px-1 bg-yellow-400"
      >LG more 1024</span
    >
    <span class="hidden 2xl:hidden xl:inline-block rounded px-1 bg-yellow-400"
      >XL more 1280</span
    >
    <span class="hidden 2xl:inline-block rounded px-1 bg-yellow-400"
      >2XL more 1536</span
    >
  </div>
</template>

<script>
export default {
  name: "TWScreen",
};
</script>
<style lang="sass">
.tw-screen
  @apply fixed text-2xl font-bold text-black p-2 z-[999]
</style>
