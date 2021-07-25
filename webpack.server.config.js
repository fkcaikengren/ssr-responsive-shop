const path = require('path');
const webpack = require('webpack')
const nodeExternal = require('webpack-node-externals');
const { merge } = require('webpack-merge');
const base = require('./webpack.base.config');


module.exports = merge(base, {
    // 注意这个值
    target: 'node',
    entry: './src/server/index.js',
    output: {
        path: path.resolve('dist'),
        filename: 'app.js',
        chunkFilename: '[name]-[contenthash:8].js', //code splitting后的包名
        publicPath: `http://${process.env.DEV_CLIENT_HOST}:${process.env.DEV_CLIENT_PORT}/dist/`, //资源公开访问路径(资源引用root路径)
    },
    externals: [nodeExternal()],

    module: {
        rules: [
            { //服务端并不会生成css
                test: /\.[s]?css$/,
                use: [
                    {
                        loader: 'css-loader',
                        //启动css模块化
                        options: {
                            importLoaders: 2,
                            modules: {
                                mode: 'global',
                                localIdentName: '[hash:base64:6]-[local]',
                                exportOnlyLocals: true,   //import得到的style只导出locals对象
                            }
                        }
                    },
                    { loader: 'postcss-loader' },
                    { loader: 'sass-loader' }
                ]
            },
            {
                test: /\.(jp[e]?g|png|gif|woff|woff2|ttf|eot|svg|ico)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[contenthash:8].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // DefinePlugin定义全局变量
        new webpack.DefinePlugin({
            __CLIENT__: false,
            __SERVER__: true,
            __DEVELOPMENT__: true,
        }),
    ],
});