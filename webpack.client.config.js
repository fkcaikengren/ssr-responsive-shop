const path = require('path');
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { merge } = require('webpack-merge');
const LoadablePlugin = require('@loadable/webpack-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const base = require('./webpack.base.config');


module.exports = merge(base, {
    target: 'web',
    entry: './src/client/index.js',
    output: {
        path: path.resolve('dist/public'), //build的文件存放目录
        filename: 'client.js',      //入口文件打包后的名字
        chunkFilename: '[name]-[contenthash:8].js', //code splitting后的包名
        publicPath: `http://${process.env.DEV_CLIENT_HOST}:${process.env.DEV_CLIENT_PORT}/dist/`, //资源公开访问路径(资源引用root路径)
    },
    module: {
        rules: [
            {
                test: /\.[s]?css$/,
                use: [
                    // 'style-loader', //用MiniCssExtractPlugin.loader替换，实现外部引入样式
                    MiniCssExtractPlugin.loader,
                    // https://github.com/webpack-contrib/css-loader
                    {
                        loader: 'css-loader',
                        //启动css模块化
                        options: {
                            importLoaders: 2, // 0 => no loaders (default);  1 => postcss-loader;  2 => postcss-loader, sass-loader
                            modules: {
                                mode: 'global',  //默认local
                                // auto: undefined, //默认undefined，auto:true则表示matching /\.module\.\w+$/i.test(filename) and /\.icss\.\w+$/i.test(filename) regexp.
                                localIdentName: '[hash:base64:6]-[local]', //scope处理后的命名
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
        // define global constants 定义全局常量
        new webpack.DefinePlugin({
            __CLIENT__: true,
            __SERVER__: false,
            __DEVELOPMENT__: true,
        }),
        //  extract css
        new MiniCssExtractPlugin({
            // 所有选项都是可选的
            filename: '[name]-[contenthash:8].css',
            chunkFilename: '[name]-[contenthash:8].css',
        }),
        new LoadablePlugin(),     //code spliting 懒加载
        new ReactRefreshPlugin(), //热更新
        new webpack.HotModuleReplacementPlugin() //HotModuleReplacementPlugin必须加上否则ReactRefreshPlugin运行编译时会报错
    ],
});