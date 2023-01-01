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



.auth-page
  @apply text-center mx-auto h-screen max-h-screen flex items-center justify-center
  .auth-container
    @apply min-w-min px-14 bg-white bg-opacity-5 py-4 z-20 animate-fadescale
    .title
      @apply text-4xl text-opacity-80 text-white
    .subtitle
      @apply text-lg text-opacity-50 text-white
    .form-wrapper
      @apply my-4
    .btn-submit
      @apply gradient-border py-2.5 text-xl text-white text-opacity-80 max-w-xs w-full cursor-pointer
    .link-wrapper
      @apply mt-2
      .link
        @apply m-2 text-xs text-white text-opacity-75 transition-all ease-in-out duration-300
        &.success:hover
          @apply text-green-500
        &.error:hover
          @apply text-red-500
    .notification-wrapper
      @apply animate-fadescale
      .notification
        @apply rounded-full bg-white gap-3 flex-row flex px-4 pb-1.5 pt-2 place-items-center mt-4
        &.loading
          @apply bg-yellow-500
          box-shadow: 0 2px 15px 0 #EAB308
        &.success
          @apply bg-green-500
          box-shadow: 0 2px 15px 0 #22C55E
        &.error
          @apply bg-red-500
          box-shadow: 0 2px 15px 0 #EF4444

.spotlight
  background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%)
  height: 40vh
  bottom: -30vh
  @apply blur-[20vh]
.gradient-border
  -webkit-backdrop-filter: blur(10px)
  backdrop-filter: blur(10px)
  @apply relative
.gradient-border
  background-color: rgba(20, 20, 20, 0.3)
.gradient-border::before
  background: linear-gradient(90deg,#303030 0%,#303030 25%,#00dc82 50%,#36e4da 75%,#0047e1 100%)
.gradient-border::before
  @apply content-[''] absolute top-0 left-0 right-0 bottom-0 w-full opacity-50 p-[2px]
  padding: 2px
  background-size: 400% auto
  transition: background-position 0.4s ease-in-out, opacity 0.5s ease-in-out
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)
  -webkit-mask-composite: xor
  mask-composite: exclude
.gradient-border:hover::before
  background-position: -50% 0
  opacity: 1
</style>
