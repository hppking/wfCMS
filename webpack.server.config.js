const path = require('path')

const nodeExternals = require('webpack-node-externals')
const isDev = process.env.NODE_ENV === 'development'
const webpack = require('webpack')

module.exports = {
    name: 'art-server',
    target: 'node',
    node: {
        __dirname: true,
    },
    externals: [
        nodeExternals({
            whitelist: [],
        })
    ],
    mode: 'development',
    //devtool: 'cheap-eval-source-map',
    entry: {
        art: [path.join(__dirname, 'src', 'art-server.js')],
    },
    stats: true,
    output: {
        path: path.resolve(__dirname, './bin'),
        filename: '[name].server',
        libraryTarget: 'commonjs2'
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
                test: /\.art$/,
                use: [
                    {
                        loader: "art-template-loader",
                        options: {
                            htmlResourceRoot: __dirname,
                            root: path.resolve(__dirname)
                        }
                    },
                    {
                        loader: 'string-replace-loader',
                        options: {
                            multiple: [
                                {
                                    search: '__LAYOUT__',
                                    replace: isDev ? "'./layout.art'" : "'./__ignore/minLayout.art'",
                                    flags: 'g'
                                },
                                {
                                    search: '__../LAYOUT__',
                                    replace: isDev ? "'../layout.art'" : "'../__ignore/minLayout.art'",
                                    flags: 'g'
                                },
                                {
                                    search: '__DEV_BUNDLE__',
                                    replace: isDev ? "<script src='/assets/__dist/home.bundle.js'></script>" : "",
                                    flags: 'g'
                                }
                            ]

                        }
                    },
                ]
            },
            {
                test: /\.css/,
                use: ['ignore-loader'],
            }
        ],
    },
    plugins: [
        /*new webpack.IgnorePlugin({
            checkResource(resource) {
                if (/bundle.js$/.test(resource)) {
                    console.log(resource)
                    return true
                }
                //return true | false;
                return false
            }
        }),/
        /*new webpack.DefinePlugin({
            '__OKOK__': "'./layout.art'"
        })*/
    ]
}