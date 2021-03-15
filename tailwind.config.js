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
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/custom-forms'),
    ],
};