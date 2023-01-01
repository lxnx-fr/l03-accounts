// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    app: {
        baseURL: "",
        head: {
            script: [
                { src: 'https://fastdl.l03.dev/js/fontawesome.js', defer: true, async: true }
            ]
        },

    },
    modules: [
        '@nuxtjs/robots',
        '@nuxtjs/tailwindcss',
        'nuxt-icon',
        '@vueuse/motion/nuxt'
    ],
})
