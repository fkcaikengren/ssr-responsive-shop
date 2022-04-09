import React from 'react';
import { renderToString } from 'react-dom/server';
import { matchRoutes } from 'react-router';
import { StaticRouter } from 'react-router-dom/server';
import { ChunkExtractor } from '@loadable/server';
import { Provider } from 'react-redux';
import getServerStore from 'store/serverStore';
import App from 'App';
import Html from '../template/Html';
import routes from '../../routes';

const path = require('path');

function renderSSR(req, res) {
  const store = getServerStore(); // 保证每次重新创建store，防止共享一个store
  console.log('req.path: ', req.url);
  // match route and request
  const matchers = matchRoutes(routes, req.url);
  // console.log('matchers: =', matchers)
  if (!matchers) {
    res.status(404).send('not found');
    return;
  }
  const promises = [];
  matchers.forEach((matcher) => {
    if (matcher.route.component.loadData) {
      promises.push(matcher.route.component.loadData(store));
    }
  });
  const routerContext = {};
  // StaticRouter只负责生成静态页面（不会注册事件，注册事件只能在浏览器中Dom树生成后才能执行）
  const app = (
    <Provider store={store}>
      <StaticRouter location={req.url} context={routerContext}>
        <App />
      </StaticRouter>
    </Provider>
  );

  if (routerContext.url) {
    res.redirect(301, routerContext.url);
  } else {
    Promise.all(promises)
      .then(() => {
        // extract js and css and other resources
        const extractor = new ChunkExtractor({
          statsFile: path.resolve(__dirname, './public/loadable-stats.json'),
        });
        const jsx = extractor.collectChunks(app);
        const body = renderToString(jsx); // 这里千万不要省略，否则会导致extractor.getXXXEelments不正确
        const styleTags = extractor.getStyleElements();
        const scriptTags = extractor.getScriptElements();
        // const linkTags = extractor.getLinkTags()
        // console.log(linkTags)

        res.send(
          `<!doctype html>${renderToString(
            <Html
              links={styleTags}
              scripts={scriptTags}
              state={store.getState()}
            >
              {body}
            </Html>
          )}`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

export default renderSSR;
