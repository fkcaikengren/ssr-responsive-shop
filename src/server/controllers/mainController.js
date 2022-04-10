import React from 'react';
import { matchRoutes } from 'react-router';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import getServerStore from 'store/serverStore';
import App from 'App';
import HtmlEngine from 'server/utils/HtmlEngine';
import routes from '../../routes';

function renderMain(req, res) {
  const engine = new HtmlEngine({ namespace: null });
  const store = getServerStore(); // 保证每次重新创建store，防止共享一个store
  console.log('req.path: ', req.url);
  const matchers = matchRoutes(routes, req.url);
  if (!matchers) {
    res.status(404).send('not found');
    return;
  }
  const promises = [];
  matchers.forEach((matcher) => {
    if (matcher.route.element.loadData) {
      promises.push(matcher.route.element.loadData(store));
    }
  });
  const routerContext = {};
  // StaticRouter只负责生成静态页面（不会注册事件，注册事件只能在浏览器中Dom树生成后才能执行）
  const component = (
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
        res.send(engine.render(component));
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

export default renderMain;
