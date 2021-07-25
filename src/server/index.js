
/*
    这个文件会被打包成server.js, 并运行在node环境，相当于服务端。
*/

const proxy = require('express-http-proxy')
const express = require('express');
import renderSSR from './middlewares/renderSSR'
const app = express();

app.use(express.static('dist/public'));

/*以api开头的url 会交给localhost:4000进行代理 */
// app.use('/api', proxy('https://localhost:4000/',{
//     //开启https
//     https:true,
//     //修改请求路径
//     proxyReqPathResolver(req) {
//         // console.log(req.url)   //例如 '/login'
//         // console.log(req.query) //?后接的参数，例如：{id:1}
//         return `/api${req.url}`;
//     }
// }))

app.get('*', renderSSR)


app.listen(5001, ()=>{
    console.log('visit: localhost:5001')
})