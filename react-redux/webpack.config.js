'use strict';

var webpack           = require('webpack');
var path              = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // context: __dirname + 'src/',
    entry: [
         './src/app/index.jsx',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
    ],
    module: {
        loaders: [
            {
                test: /\.(js|jsx|es6)?$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules')
                ],
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, "src"),
                    ],
                query: {
                    plugins: [
                        "react-hot-loader/babel",
                        "transform-runtime"
                    ],
                    presets: ["es2015", "stage-0", "react"],
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader' 
            },
          
        ],
    },
    resolve: {
        root: path.resolve('./src'),
        extenstions: ['', '.js', '.jsx','.ejs'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: path.resolve('dist'),
        hot: true,
        progress: true,
        stats: 'errors-only'
    },
    devtool: 'source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: './src/index.ejs'
        })
    ]
};
