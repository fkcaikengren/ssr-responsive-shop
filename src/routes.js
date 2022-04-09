import React from 'react';
import loadable from '@loadable/component';

/* 一定要注意：
    import()语法中到webpackChunkName:'xx'并非是注释，而是设置代码分割后到chunkName, 
    这个名字能在webpack配置到output.chunkFilename中拿到，作用于输出到包名。
*/

const Layout = loadable(() =>
  import(/* webpackChunkName:'layout' */ './containers/Layout').then((c) => {
    Layout.loadData = c.default.loadData;
    return c;
  })
);

const Home = loadable(() =>
  import(/* webpackChunkName:'home' */ './containers/Home').then((c) => {
    Home.loadData = c.default.loadData;
    return c;
  })
);

const Introduce = loadable(() =>
  import(/* webpackChunkName:'introduce' */ './containers/Introduce').then(
    (c) => {
      Introduce.loadData = c.default.loadData;
      return c;
    }
  )
);

const routes = [
  // {
  //     path: '/login',
  //     key: 'login',
  //     exact: true,
  //     component: Login,
  // },
  {
    path: '/',
    component: <Layout />,
    // 子路由
    children: [
      {
        index: true,
        component: <Home />,
      },
      {
        path: '/introduce',
        component: <Introduce />,
      },
    ],
  },
];
export default routes;
