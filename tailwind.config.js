module.exports = {
    purge: {
        enabled: true,
        content: [
            './**/*.html',
            './src/**/*.js',
            './src/modules/**/*.js'
        ]
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
        screens: {
            'smm': '320px',
            'sm': '640px',
            // => @media (min-width: 640px) { ... }

            'md': '768px',
            // => @media (min-width: 768px) { ... }

            'lg': '1024px',
            // => @media (min-width: 1024px) { ... }

            'xl': '1280px',
            // => @media (min-width: 1280px) { ... }

            '2xl': '1536px',
            '3xl': '1980px',
        }
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/custom-forms')
    ],
};