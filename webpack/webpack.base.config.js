const path = require('path');
const commonConfig = require('./common');

const baseConfig = (env) => {
  const common = commonConfig(env);
  return {
    ...common,
    resolve: {
      //到指定目录搜索’引入的模块‘,可以缩短引入路径
      modules: [path.resolve(__dirname, '../src'), 'node_modules'], //对于src下的模块可以这样引入 import xx from 'xx'
      //目录别名
      alias: {
        '~': path.resolve(__dirname, '../'), //对于项目下的模块可以这样引入 import xx from '~/xx'
      },
      //import导入时可省略后缀
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
  };
};
module.exports = baseConfig;
