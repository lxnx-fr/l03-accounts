// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

    modules: [
        '@nuxtjs/robots',
        '@nuxtjs/tailwindcss',
    ],
    ssr: false,
    app: {
        baseURL: "",
        head: {
            htmlAttrs: {
                lang: 'en'
            },
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' },
                { name: 'description', content: 'Account Management for l03.dev User to manage Websites, Statistics and other important Settings.' }
            ],
            title: 'Accounts | lxms',
            script: [
                { src: 'https://fastdl.l03.dev/js/fontawesome.js', defer: true, async: true }
            ]
        },

    },

})
