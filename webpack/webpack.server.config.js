const path = require('path');
const webpack = require('webpack');
const nodeExternal = require('webpack-node-externals');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const outputConfig = require('./output');
const rulesConfig = require('./rules');
const pluginsConfig = require('./plugins');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = merge(baseConfig('server'), {
  entry: './src/server/app.js',
  output: outputConfig('server', isDev),
  module: {
    rules: rulesConfig('server', isDev),
  },
  plugins: pluginsConfig('server', isDev),
  externals: [nodeExternal()],
});
