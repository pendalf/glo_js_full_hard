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
        environment: {
            arrowFunction: false
        }
    },
    context: path.resolve(__dirname, 'src'),
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html'
        })
    ],
    module: {
        rules: [

            {
                test: /\.js$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.css$/i,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i,
                exclude: /node_modules/,
                use: ["file-loader"]
            },
            {
                test: /\.(woff|woff2)$/i,
                exclude: /node_modules/,
                use: ["file-loader"]
            }

        ]
    },
    devServer: {
        contentBase: './build',
        open: true
    }
}