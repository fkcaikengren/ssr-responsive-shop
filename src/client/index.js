/*
    这个文件会被打包成client.js, 和server.js在同一目录下，需要在发送给客户端的html中利用script标签引入client.js
*/

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { Provider } from 'react-redux';
import App from 'App';
import getClientStore from '../store/clientStore';
import '../sass/base.scss'; // client.js里引入的css会被打包为main.css

// hydrate的作用：不同于render方法，它主要是完成事件注入
/*
    loadableReady: 在加载component后再hydrate, 否则会导致服务端和客户端渲染不一致
*/

const content = (
  <Provider store={getClientStore()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

loadableReady((_) => {
  ReactDOM.hydrate(content, document.querySelector('#root'));
});
