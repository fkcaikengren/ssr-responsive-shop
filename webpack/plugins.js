
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');


const pluginsConfig = (env, isDev = true) =>{
  return [
    new CleanWebpackPlugin(), // 会删除上次构建的文件，然后重新构建

    // define global constants 定义全局常量
    new webpack.DefinePlugin({
      __CLIENT__: env === 'client',
      __SERVER__: env === 'server',
      __DEVELOPMENT__: isDev,
    }),
     //  extract css
     env === 'client' && new MiniCssExtractPlugin({
      // 所有选项都是可选的
      filename: '[name]-[contenthash:8].css',
      chunkFilename: '[name]-[contenthash:8].css',
    }),
    env === 'client' && new LoadablePlugin(),     //code spliting 懒加载
    env === 'client' && isDev && new webpack.HotModuleReplacementPlugin(), //
    env === 'client' && isDev && new ReactRefreshPlugin(), //热更新
  ].filter(Boolean)
}

module.exports = pluginsConfig