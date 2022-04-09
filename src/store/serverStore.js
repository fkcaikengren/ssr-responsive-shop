import { applyMiddleware, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducer from './reducer';
import { request as serverReq } from '../server/utils/http';

// const loggerMiddleware = createLogger()

export default function getServerStore() {
  return createStore(
    reducer,
    {},
    applyMiddleware(thunk.withExtraArgument(serverReq))
  );
}
