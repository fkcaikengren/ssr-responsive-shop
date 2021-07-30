
const path = require('path')

const outputConfig = (env, isDev = true) => {
  if(env === 'client'){
    return {
      path: path.resolve('dist/public'), //build的文件存放目录
      filename: 'client.js',      //入口文件打包后的名字
      chunkFilename: '[name]-[contenthash:8].js', //code splitting后的包名
      publicPath: `http://${process.env.DEV_CLIENT_HOST}:${process.env.DEV_CLIENT_PORT}/dist/`, //资源公开访问路径(资源引用root路径)
    }
  }else{
    return {
      path: path.resolve('dist'),
      filename: 'app.js',
      chunkFilename: '[name]-[contenthash:8].js', //code splitting后的包名
      publicPath: `http://${process.env.DEV_CLIENT_HOST}:${process.env.DEV_CLIENT_PORT}/dist/`, //资源公开访问路径(资源引用root路径)
    }
  }
}

module.exports = outputConfig