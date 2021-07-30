const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { spawn } = require('child_process');
const clientConfig = require('../webpack/webpack.client.config');

const PORT = process.env.DEV_CLIENT_PORT;
const HOST = process.env.DEV_CLIENT_HOST;
let count = 0;

// webpack安装clientConfig配置来构造编译器
const compiler = webpack(clientConfig);
// 第一次编译完成，自动运行服务端，服务端代码打包快于客户端代码
compiler.hooks.done.tap('done', function () {
  console.log('\nclient compile done');
  if (count === 0) {
    // spawn开启一个子线程，运行命令nodemon --watch app.js server.js
    // 一旦app.js变化，nodemon重启服务
    spawn('nodemon', ['--watch', './dist/app.js', './bin/server.js'], {
      stdio: 'inherit',
      shell: true,
    });
    count++;
  }
});


// WebpackDevServer：自动重新打包和启动浏览器，刷新页面，转发请求等
const webpackDevServerOptions = {
  host: HOST,
  port: PORT,
  contentBase: path.resolve(__dirname, '../static'), //static作为内容目录
  publicPath: `http://${HOST}:${PORT}/dist`,
  hot: true,  //热更新
  open: false, //自动打开浏览器
  inline: true, //
  quiet: true, //true不会输出compile的详细信息
  clientLogLevel: 'error',
  compress: true, //gzip压缩
  watchOptions: {
    ignored: /node_modules/,
    aggregateTimeout: 500,   // 聚合多个修改一起构建
    poll: 500,    // 轮询检测变更
  },
  // 使用webpack dev server时，生成的文件是放在内存中的。
  // 这里需将必要的文件写入磁盘
  writeToDisk: (filepath) => {
    return filepath.includes(`loadable-stats.json`); //loadable-stats.json这个文件会按照webpack的配置写入磁盘位置
  },
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

WebpackDevServer.addDevServerEntrypoints(clientConfig, webpackDevServerOptions);

//先compiler编译完，再按照webpackDevServerOptions构建服务
const server = new WebpackDevServer(compiler, webpackDevServerOptions);

// 启动webpack dev server
server.listen(PORT, HOST, (err) => {
  if (err) {
    return console.log(err);
  }
  // 启动webpack dev server后，开始启动服务端渲染的node server
  console.log('Starting the development node server,please wait....\n');
});
