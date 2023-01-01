// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    router: {
        options: {

        }
    },
    app: {
        baseURL: "",
        head: {
            script: [
                { src: 'https://fastdl.l03.dev/js/fontawesome.js', async: true, defer: true}
            ]
        },

    },
    modules: [
        '@nuxtjs/tailwindcss',
        'nuxt-icon',
        '@vueuse/motion/nuxt'
    ],
})
