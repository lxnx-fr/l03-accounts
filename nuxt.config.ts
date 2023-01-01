// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        baseURL: "",
        head: {
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=1' }
            ],
            title: 'Accounts | lxms',
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
