const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const outputConfig = require('./output')
const rulesConfig = require('./rules')
const pluginsConfig = require('./plugins')


const isDev = process.env.NODE_ENV !== "production";


module.exports = merge(baseConfig('client'), {
    entry: './src/client/index.js',
    output: outputConfig('client', isDev),
    module: {
        rules: rulesConfig('client', isDev)
    },
    plugins: pluginsConfig('client', isDev),
});