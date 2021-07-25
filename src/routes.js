import React from 'react'
import loadable from '@loadable/component'
/*一定要注意：
    import()语法中到webpackChunkName:'xx'并非是注释，而是设置代码分割后到chunkName, 
    这个名字能在webpack配置到output.chunkFilename中拿到，作用于输出到包名。
*/

const App = loadable(
    () => import(/*webpackChunkName:'layout'*/"./containers/App").then(c => {
        App.loadData = c.default.loadData
        return c
    })
)

const Home = loadable(
    () => import(/*webpackChunkName:'home'*/"./containers/Home").then(c => {
        Home.loadData = c.default.loadData
        return c
    })
)




export default [
    // {
    //     path: '/login',
    //     key: 'login',
    //     exact: true,
    //     component: Login,
    // },
    {
        path: '/',
        key: 'app',
        component: App,
        // 子路由
        routes: [
            {
                path: '/',
                key: 'home',
                exact: true,
                component: Home,
            },
        ]
    }
]

