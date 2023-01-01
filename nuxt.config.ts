// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    router: {
        options: {

        }
    },
    app: {
        baseURL: "",
        head: {
            link: [
                { href: 'https://fastdl.l03.dev/js/fontawesome.js', as: "script", crossorigin: "", rel: "preload" }
            ]
        },

    },
    modules: [
        '@nuxtjs/tailwindcss',
        'nuxt-icon',
        '@vueuse/motion/nuxt'
    ],
})
