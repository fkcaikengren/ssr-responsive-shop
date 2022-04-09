import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducer';
import { request as clientReq } from '../client/request';

// const loggerMiddleware = createLogger()

export default function getClientStore() {
  /*  服务端：渲染时会把请求的数据放到服务端仓库，并挂在window上给到浏览器
        客户端：为了避免重新请求数据，客户端会把window中的数据加载到客户端到数据仓库中
        俗称：数据注水
     */
  const initState = window.__state || {};
  return createStore(
    reducer,
    initState,
    applyMiddleware(thunk.withExtraArgument(clientReq))
  );
}
