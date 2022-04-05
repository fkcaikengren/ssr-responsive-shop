var presets = [];
presets.push('@babel/preset-env');
presets.push('@babel/preset-react');

var plugins = [
  "@babel/plugin-transform-runtime", //编译ES6的api，例如includes
  "@babel/plugin-proposal-class-properties", //可以在class上使用static定义静态属性
  "@loadable/babel-plugin",  //处理code spliting 懒加载
]

module.exports = {
  presets: presets,
  plugins: plugins,
};
