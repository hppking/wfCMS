const path = require('path')
const fs = require('fs')

const nodeExternals = require('webpack-node-externals')
const isDev = process.env.NODE_ENV === 'development'
const webpack = require('webpack')
const hotConf = 'webpack-hot-middleware/client?path=/__webpack_hmr'
const ETextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    name: 'fed',
    mode: 'development',
    //devtool: 'cheap-eval-source-map',
    entry: {
        home: (() => {
            const c = [path.join(__dirname, 'src', 'pages/topic/index.js')]
            if (isDev) {
                c.push(hotConf)
            }
            return c
        })(),
    },
    stats: true,
    output: {
        path: path.resolve(__dirname, './public/__dist'),
        filename: isDev ? '[name].bundle.js' : '[name].[hash].bundle.js',
        publicPath: 'http://127.0.0.1:3000/assets/__dist/',
        libraryTarget: 'umd',
        library: 'nkBundle'
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: [
                    /node_modules/,
                ],
                use: [
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.css$/,
                use: isDev ? ['style-loader', 'css-loader'] : ETextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader' //自动加前缀
                    ]
                })
                /*
                */
            },
            {
                test: /\.art$/,
                loader: "art-template-loader",
                options: {

                }
            },
        ],
    },
    plugins: (() => {
        const plugins = []

        if (!isDev) {
            plugins.push(new CleanWebpackPlugin())
            plugins.push(new HtmlWebpackPlugin({
                templateContent: fs.readFileSync('./src/pages/layout.art', 'utf-8'), filename: "../../src/pages/__ignore/minLayout.art",
                inject: 'body',
                //minify: false,
            }))
            plugins.push(new ETextPlugin("[name].[hash].css"))
        }
        if (isDev) {
            plugins.push(new webpack.HotModuleReplacementPlugin())
        }
        plugins.push(new webpack.NoEmitOnErrorsPlugin())

        return plugins
    })()
}