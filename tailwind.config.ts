module.exports = {
    theme: {
        extend: {

            keyframes: {
                fadescale: {
                    "0%": {
                        opacity: "0%",
                        //transform: "scale(0%)",
                    },
                    "80%": {
                        //transform: "scale(105%)",
                        opacity: "80%",
                    },
                    "100%": {
                        transform: "scale(100%)",
                        //opacity: "100%",
                    },
                },
                rotateicon: {
                    "0%": {
                        transform: "rotate(90deg)",
                    },
                    "50%": {
                        transform: "rotate(0deg)",
                    },
                    "100%": {
                        transform: "rotate(90deg)",
                    },
                }
            },
            animation: {
                fadescale: "fadescale .5s ease-in-out",
                rotateicon: "rotateicon .25s ease-in-out"
            },
        },
    },
    plugins: [],
};
