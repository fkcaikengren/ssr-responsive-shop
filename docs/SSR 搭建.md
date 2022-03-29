# SSR



## 搭建项目结构

### 安装依赖

1.安装express

```bash
#express (express4包含body-parse)
yarn add express
#代理服务
yarn add express-http-proxy
#支持session
yarn add express-session
#支持CORS
yarn add cors
```



2.安装webpack和babel

```bash
#
yarn add  npm-run-all -D

#babel 核心
yarn add  @babel/core -D
#提案，用于识别class到静态属性 （plugin-proposal-* 用于处理提案阶段的语法，替换了之前的stage-x）
yarn add  @babel/plugin-proposal-class-properties -D
#预设，babel预设其实是@babel/preset-env-x插件的组合, 用于转换es6,7
yarn add  @babel/preset-env -D
#预设，处理jsx语法
yarn add  @babel/preset-react -D

#模块打包工具
yarn add  webpack -D
#webpack命令工具 （例：webpack init [初始化一个新的webpack配置]；webpack build; webpack dev）
yarn add  webpack-cli -D
#合并配置，使得分离webpack配置文件
yarn add  webpack-merge -D
#允许在webpack中使用externals，让模块通过cdn引入而不是打包
yarn add  webpack-node-externals -D
#webpack在打包时，调用babel转换ES6等
yarn add  babel-loader -D


#loader
yarn add style-loader -D
yarn add css-loader -D

```



3.安装React

```bash
yarn add react
yarn add react-dom
yarn add react-helmet
yarn add react-redux
yarn add react-router-config
yarn add react-router-dom
yarn add redux
yarn add redux-logger
yarn add redux-thunk
```



### 结构目录





### 配置webpack



webpack.base.js

webpack.client.js

webpack.server.js



package.js的脚本

```
"scripts": {
    "dev": "npm-run-all --parallel dev:**",
    "dev:start": "nodemon build/server.js",
    "dev:build:client": "webpack --config webpack.client.js --watch",
    "dev:build:server": "webpack --config webpack.server.js --watch"
  },
```





## 搭建基础服务



### server/index.js

提供node服务









### routes.js











### server/render.js

相当于node服务端的controller，负责处理不同路由请求





### 外部资源引入



1）剥离

```
yarn add mini-css-extract-plugin -D
```



2）





### 路由匹配

服务端渲染时，匹配路由然后发送请求







### 搭建redux



> 加载的数据放在store，需要clientStore和serverStore
>
> 服务端：请求的数据放在server store中，并挂在window上
>
> 客户端：从window拿数据初始化client store。这里需要判断store的state数据是否已被服务端加载，如果被加载了，则不做重复数据请求。



## 前置知识

#### 1.thunk.withExtraArgument()

源码： (在执行dispatch的action时，可以拿到其他的参数)

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    // 如果action是一个function，就返回action(dispatch, getState, extraArgument)，否则返回next(action)。
    if (typeof action === 'function') {
      return action(dispatch, getState, extraArgument)
    }
    // next为之前传入的store.dispatch，即改写前的dispatch
    return next(action)
  }
}

const thunk = createThunkMiddleware()
// 给thunk设置一个变量withExtraArgument，并且将createThunkMiddleware整个函数赋给它
thunk.withExtraArgument = createThunkMiddleware

export default thunk
```





#### 2.ReactDOM.hydrate





#### 3.StaticRouter



无状态（stateless）的路由，也就是不会运行js代码，不同于BrowserRouter可以检测地址栏的变化并渲染对应的组件。

1.控制StaticRouter显示哪个组件，需要传入location参数来控制

```jsx
<StaticRouter location='/login'>
  {renderRoutes(routes)}
</StaticRouter>
```

上述代码，会匹配到`/login`这个路由，从而只渲染对应的Login组件



2.此外，你还可以传入context。例如你想把获取各个组件的样式

```jsx
const context = {cssArr:[]}
<StaticRouter location='/login' context={context}>
  {renderRoutes(routes)}
</StaticRouter>
```



```jsx
//用来包裹App
export default function withStyles(OriginComponent, style){
		
    return class ProxyComponent extends Component{
      UNSAFE_componentWillMount(){
        console.log('will mount ------ 服务端会运行')
        //在StaticRouter传入的context，客户端是拿不到staticContext到
        if(this.props.staticContext){ 
          //StaticRouter内部执行时，会执行这段代码
          this.props.staticContext.cssArr.push(style._getCss())
        }
      }
      componentDidMount(){
        console.log('服务端不会运行这个钩子') 
        //如果这个组件被服务端渲染后，hydrate在处理时也不会运行这个钩子。
      }
    
      render(){
        console.log('render ------ 服务端会运行')
        return <OriginComponent {...this.props}></OriginComponent>
      }
    }
    
}
```



**注意：**服务的渲染的组件（即在StaticRouter下的Route）不会调用`componentDidMount`, 但是会调用`componentWillMount` `render`。

服务的渲染后的组件，ReactDom.hydrate()方法并不会重新在客户端渲染组件？

不会渲染但会判断是否和客户端渲染是否一致，并且注入事件

 **如果使用的是Hooks, 服务端渲染不会掉用useEffect钩子**







#### 4.react-router-config



##### 1）渲染路由

renderRoutes



##### 2）匹配路由，请求处理

matchedRoutes

拿到loadData







#### 5.style-loader和isomorphic-style-loader

在client端：

css的两个loader

`css-loader` 处理样式之间的引用

`style-loader` 在html中创建<style>标签，并把css-loader处理过的css插入style标签中



在server端：

网上多数说要使用*isomorphic-style-loader*这个loader 来获取css并手动插入到<style>中

其实这种做法是很没必要的，并且会导致其他问题

实际上，经过查看打包后的client.js，可以发现client.js其实已经帮你创建了style并插入css样式。

##### issue

**css模块化时，className在Server和client端渲染不一致**

当我在web pack.server.js中使用isomorphic-style-loader，出现如下错误

![image-20210527160333685](/Users/gavin/Library/Application Support/typora-user-images/image-20210527160333685.png)



```js
import style from './xxx.css'
console.log(style)
```

server端打印的style:

![image-20210527161625773](/Users/gavin/Library/Application Support/typora-user-images/image-20210527161625773.png)

client端打印的style:

![image-20210527161722378](/Users/gavin/Library/Application Support/typora-user-images/image-20210527161722378.png)

取掉isomorphic-style-loader后，server端打印：

![image-20210527163014446](/Users/gavin/Library/Application Support/typora-user-images/image-20210527163014446.png)

如何要保证server端和client端关于这个style的打印结果一致，那么需要配置css-loader时加上`exportOnlyLocals: true`

如下：

Webpack.client.js

```json

{
    test: /\.css$/,
    use: [
        'style-loader',
        {
            loader: 'css-loader',
          //启动css模块化
            options: {
                modules: {
                    localIdentName: '[local]__[hash:base64:5]'
                } 
            }
        }
    ]
}

```

Webpack.server.js

```json
{
    test: /\.css$/,
    use: [

        {
            loader: 'css-loader',
            //启动css模块化
            options: {
                modules: {
                    localIdentName: '[local]__[hash:base64:5]',
                    exportOnlyLocals: true  //关键，import得到的style只导出locals对象
                } 
            }
        }
    ]
}
```





#### 6.预处理器（其他css loader ）

##### postcss

[PostCSS](https://github.com/postcss/postcss)是一个利用JS插件来对CSS进行转换的工具，这些插件非常强大，强大到无所不能。其中，[Autoprefixer](https://github.com/postcss/autoprefixer)就是众多PostCSS插件中最流行的一个。

```bash
yarn add postcss-loader autoprefixer -D
```



新建postcss.config.js 配置文件





##### Sass-loader

sass-loader是css-loader的一种，sass是依赖，sass-loader会调用sass来编译scss文件

```bash
yarn add sass-loader sass -D
```



##### Less-loader





#### 7.代码分割

##### import()



```
import(/*webpackChunkName:'app'*/'./xx.js')
```

*webpackChunkName* 决定了chunk打包后的名称



##### React Loadable

服务端懒加载

基于组件代码分割

```
yarn add react-loadable
```

使用

```jsx

const Login = Loadable({
    loader:() => import("./containers/Login"),
    loading:()=><div>loading...</div>,
    modules: ['login']
})
```

打包后，代码自动拆包

<img src="/Users/gavin/Library/Application Support/typora-user-images/image-20210529182051310.png" alt="image-20210529182051310" style="zoom:50%;" />



```

```



Client.js 在负责下载chunck.js 和 chunck.css，当禁止javascript后：

![image-20210529185348274](/Users/gavin/Library/Application Support/typora-user-images/image-20210529185348274.png)

client.js没有被下载，只出现了Header组件，Home组件正在loading...

这说明client.js 负责下载LoadableComponent的chunck.js 和 chunck.css



##### issue

```
compiler.plugin is not a function at ReactLoadablePlugin.apply
```

在使用如下插件时会报上述错误

```js
const  { ReactLoadablePlugin } = require('react-loadable/webpack');

new ReactLoadablePlugin({
            filename: '/public/react-loadable.json'
})
```

添加这个插件是为了生成modules -> bundles映射文件，从而利用下面代码通过modules获取bundles 

```jsx
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack'
import stats from './dist/react-loadable.json';

app.get('/', (req, res) => {
  let modules = [];

  let html = ReactDOMServer.renderToString(
    <Loadable.Capture report={moduleName => modules.push(moduleName)}>
      <App/>
    </Loadable.Capture>
  );

  let bundles = getBundles(stats, modules);

  // ...
});
```

**原因是：插件不支持webpack5.x，此时要么升级插件，要么找替换方案**



实际情况是无法升级，只能找替换方案

使用插件`react-loadable-ssr-addon`，不能devDependences安装

```
yarn add react-loadable-ssr-addon
```



client加载的

![image-20210530000036166](/Users/gavin/Library/Application Support/typora-user-images/image-20210530000036166.png)



插入的script标签加载的

![image-20210530000140844](/Users/gavin/Library/Application Support/typora-user-images/image-20210530000140844.png)

再禁止js的时候也能拿到完整页面，应为可以拿到样式







#### 8.browserlist字段的解释

```js
//browserslist 使用 Can I Use 网站的数据来查询浏览器版本范围

"browserslist": [
    "> 0.6%",  //浏览器的市场占有率>0.6%
    "last 2 versions", //浏览器的最近两个版本
    "dead" //全球使用率低于0.5%并且官方声明不在维护或者事实上已经两年没有再更新的版本。"not dead"则表示相反
  ]
```





#### 9.文件资源打包

```bash
yarn add file-loader -D
```



webpack.server也必须配置 js css file相关loader



为何webpack.server也会 拆分和打包js

用作服务端渲染（并不会发送给客户端）







#### 10.文件压缩



----



#### 11.首次请求，渲染不一致

React-loadable导致

不一致导致重新渲染的问题

```
Text content did not match.
```



解决方法：Loadable高阶组件中，loading返回null而不其他元素，即`loading:()=>null `





#### 12.css模块化处理

我希望css-loader可以对.css模块化处理时不加hash字符串，对.module.css模块化处理事加上hash字符串，则需在webpack做如下处理

```json
[{
    test: /\.module\.[s]?css$/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            //启动css模块化
            options: {
                modules: {
                    localIdentName: '[local]__[hash:base64:5]',
                } 
            }
        },
        {loader:'postcss-loader'},
        {loader:'sass-loader'}
    ]
},
{
    test: /\.[s]?css$/,
    exclude: /module/,
    use: [
        MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            //启动css模块化
            options: {
                modules: {
                    localIdentName: '[local]',
                } 
            }
        },
        {loader:'postcss-loader'},
        {loader:'sass-loader'}
    ]
}]
```

一定要在第二个test匹配中，加上`exclude: /module/`，否则会出现如下错误：

Error: Didn't get a result from child compiler. 这是由于test匹配到两个相同的regex规则冲突导致的。



#### 13自动刷新

```
yarn add react-refresh @pmmmwh/react-refresh-webpack-plugin -D
```







#### 14使用loadable















