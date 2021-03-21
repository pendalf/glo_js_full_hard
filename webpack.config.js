const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: './index.js'
    },
    output: {
        filename: 'bundel.[contenthash].js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
    },
    context: path.resolve(__dirname, 'src'),
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html'
        })
    ]
}