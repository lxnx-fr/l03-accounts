// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            script: [
                { src: 'https://fastdl.l03.dev/js/fontawesome.js', async: true, defer: true}
            ]
        },
        pageTransition: { name: 'page', mode: 'out-in' },
    },
    modules: [
        '@nuxtjs/tailwindcss',
        'nuxt-icon',
        '@vueuse/motion/nuxt'
    ],
})
