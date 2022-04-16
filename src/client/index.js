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

const content = (
  <Provider store={getClientStore()}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

loadableReady(() => {
  ReactDOM.hydrate(content, document.querySelector('#root'));
});
