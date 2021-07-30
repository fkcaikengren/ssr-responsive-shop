const webpack = require('webpack');
const config = require('../webpack/webpack.server.config');

const compiler = webpack(config);

compiler.watch(
  {
    aggregateTimeout: 800, // 聚合多个修改一起构建
    ignored: /node_modules/, // 排除文件
    poll: 5000, // 轮询检测变更
    'info-verbosity': 'verbose', //在增量构建的开始和结束时，向控制台发送消息
  },
  (err, stats) => {
    let json = stats.toJson('minimal');
    if (json.errors) {
      json.errors.forEach(console.log);
    }
    if (json.warnings) {
      json.warnings.forEach(console.log);
    }
  }
);

compiler.hooks.done.tap('done', function () {
  console.log('\n server compile done');
});

process.stdin.on('data', function (data) {
  if (data.toString() === 'exit') {
    process.exit();
  }
});
