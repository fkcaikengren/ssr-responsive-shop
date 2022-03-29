## SSR

### 实现SSR

#### 目录-功能

```
container
	页面
routes
	loadData ：返回一个执行异步任务的Promise
store
	
server
	代替简单的静态资源服务器，使用Express匹配服务的路由返回填充后的index.html
	设置代理服务器(express-http-proxy), 处理/api开头的uri，利用node请求数据后返回给client
	
client
```





#### 生成html 和css 字符串

react-dom/server

```jsx
import {renderToString} from 'react-dom/server';
let html = renderToString(
            <Provider store={store}>
                <StaticRouter context={context} location={req.path}>
                    {renderRoutes(routes)}
                </StaticRouter>
            </Provider>
        );
```





### next框架



## TS





## 装饰器



参考[https://juejin.cn/post/6844903733566898183]

ES7的装饰器本质是一个函数，按使用对象分为两种装饰器
装饰类函数：

接受三个参数

```js
class A {
    @sayB
    sayA() {
        console.log('a');
    }
}
function sayB(target, name, descriptor) {
    target = function(){
    	...
      target()
    }
}
```

装饰类：

接受一个参数。

```js
@APlus
class A {
  state = {}
	render(){
    
  }
}
export default A

function APlus(target) {
    target.state = {...} //add new value here
    render(){ //overide render
      ...
    }               
}
```

@APlus的作用和下面代码相同

```js
class A {
  state = {}
	render(){
    
  }
}
APlus(A)
export default A
```

*装饰器也可以传参数

```js
@attach2Prop({ name: 'A' })
class A {

}

@attach2Prop({ name: 'B' })
class B {

}

function attach2Prop(obj) {
    return function(target) {
        target.prototype.$data = obj;
    }
}

console.log((new A()).$data.name);
console.log((new B()).$data.name);


```









## React-router

### react-router-config

用来配置静态路由

参考[https://segmentfault.com/a/1190000015282620]



异步价值数据 loadData 





## Express

### 常用API



**express的API**

路由和静态资源管理

const router = express.Router()

 	router.get(path, handler)

​	 router.post(path,handler)

express.static(dirPath)





**app上的API**

const app = express()

app.use()

app.get('/path', handler)

app.post('/path', handler)

app.listen(port, success)



**request和response的API**

handler(req, res)

req :{url, body, query, route, get()}

res :{append(), set(), send(),  json(), render(), sendFile}

*render(view.ejs), sendFile(.html/.js/.css)







### express-http-proxy

代理服务器

//如何访问路径是/api开头的，会交给代理服务器处理

*// /api/users => http://127.0.0.1:4000/api/users*

app.use('/api', proxy('http://127.0.0.1:4000', {

​    proxyReqPathResolver(*req*) {

​        return `/api${*req*.url}`;

​    }

}));



### body-parser

对post请求对请求体进行解析

app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended: false }));

**它做了什么？**

1. 处理不同类型的请求体：比如`text`、`json`、`urlencoded`等，对应的报文主体的格式不同。
2. 处理不同的编码：比如`utf8`、`gbk`等。
3. 处理不同的压缩类型：比如`gzip`、`deflare`等。
4. 其他边界、异常的处理。



### mogan

日志记录











## 其他

#### 数组的.some()





##### Promise.all()

```js
let p1 = new Promise((resolve, reject) => {
  resolve('成功了')
})

let p2 = new Promise((resolve, reject) => {
  resolve('success')
})

let p3 = Promse.reject('失败')

Promise.all([p1, p2]).then((result) => {
  console.log(result)               //['成功了', 'success']
}).catch((error) => {
  console.log(error)
})

Promise.all([p1,p3,p2]).then((result) => {
  console.log(result)
}).catch((error) => {
  console.log(error)      // 失败了，打出 '失败'
})
```



##### React属性差异

参考[https://zh-hans.reactjs.org/docs/dom-elements.html]

dangerouslySetInnerHTML

可以用在div标签上，也可以用在script标签上



## React-router

 

### Route嵌套

```jsx
<Router>
  <Route path="/" component={PrimaryLayout}>
    <Route path="accounts" component={Accounts}/>
    <Route path="statements" component={Statements}/>
  </Route>
</Router>
```

当访问/，只显示PrimaryLayout,并不会显示任何子组件



```jsx
<Router>
  <Route path="/" component={PrimaryLayout}>
    <IndexRoute component={Home}/>
    <Route path="accounts" component={Accounts}/>
    <Route path="statements" component={Statements}/>
  </Route>
</Router>
```

当访问/，除了显示PrimaryLayout,还会显示Home（这是因为IndexRoute默认是输出显示的）



**react-router4已经移除了IndexRoute， 采用exact属性来替代**

**react-router4已经不支持嵌套路由**

同样效果写法如下：

```jsx
import { BrowserRouter , Route } from 'react-router-dom'

const PrimaryLayout = () => (
  <div className="primary-layout">
    <header/>
    <main>
      <Route path="/" exact component={HomePage} />
      <Route path="/accounts" component={Accounts}/>
    	<Route path="/statements" component={Statements}/>
    </main>
  </div>
)


const App = () => (
  <BrowserRouter>
    <PrimaryLayout />
  </BrowserRouter>
)

render(<App />, document.getElementById('root'))
```













### React路由懒加载

#### import语法

静态导入（从用法上来看，是同步导入的）

```js
import React from 'react'
```

动态导入：import().then() （异步导入）

```jsx
const main = document.querySelector("main");
for (const link of document.querySelectorAll("nav > a")) {
  link.addEventListener("click", e => {
    e.preventDefault();
		//当点击都时候才会加载js模块
    import('/modules/my-module.js')
      .then(module => {
        module.loadPageInto(main);
      })
      .catch(err => {
        main.textContent = err.message;
      });
  });
}
```



#### 代码分割，路由懒加载

```jsx
import React, { Suspense, lazy } from 'react';

const Home = lazy(()=>import('./Home'))
const About = lazy(()=>import('./About'))

const MyComponent = ()=>(
  return <Router>
    <Suspense fallBack={<div>loading...</div>}>
      	<Route path='/' exact component={Home}></Route>
        <Route path='/about' component={About}></Route>
    </Suspense>
    
  </Router>
)
```

当进入/，React才开始加载Home组件

当进入/about，React才开始加载About组件



#### 服务渲染时懒加载

`React-loader`

参考 [https://github.com/jamiebuilds/react-loadable]



Loadable 高阶组件

```js
const Bar = Loadable({
  loader: () =>
    import('./Bar'),
  loading: () => null,
  modules: ['bar'],
});

//路由
<Route
    path='/bar'
    name='bar'
    getComponent={getComponent}
/>
          
//getComponent的处理逻辑
function getComponent(){
    if (typeof window !== 'undefined') { //客户端
      return component;
    } else {													//服务端
      //服务端进行组件的预加载
      return component.preload().then(() => component);
    }
}

```



onEnter

onLeave



### 路由的两个钩子









### 服务端渲染的路由

异步的服务端渲染，参考[https://react-guide.github.io/react-router-cn/docs/guides/advanced/ServerRendering.html]

```js
import { match, RoutingContext } from 'react-router'
```











服务的路由懒加载

React-loadable







## Redux

### connect的用法

```js
const mapStateToProps = state => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
```

```js
const mapDispatchToProps = dispatch => {
  return {
    onTodoClick: id => {
      dispatch(toggleTodo(id))
    }
  }
}
// 这里也可以简写成对象(和上述一样的效果)
const mapDispatchToProps = {
  onTodoClick:toggleTodo
}
```



```js
import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```







### Redux hooks

useSelector 和 useDispatch代替 connect

获取状态：

```jsx
import React from 'react'
import { useSelector } from 'react-redux'

export const CounterComponent = () => {
  const counter = useSelector(state => state.counter)
  return <div>{counter}</div>
}

```

发布action:

```jsx
import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()
  const incrementCounter = useCallback(
    () => dispatch({ type: 'increment-counter' }),
    [dispatch]
  )

  return (
    <div>
      <span>{value}</span>
      <MyIncrementButton onIncrement={incrementCounter} />
    </div>
  )
}

export const MyIncrementButton = React.memo(({ onIncrement }) => (
  <button onClick={onIncrement}>Increment counter</button>
))


```



## css模块化



css模块化的本质是加上唯一标识（hash字符串），保证class是全局唯一的

在create-react-app脚手架中，只有加了module中缀，例如{name}.module.[css|scss|less] 才会被css-loader进行模块化处理。

### :gloable的作用

当css-loader配置如下：（create-react-app配置的css-loader的mode是'local'）

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.[s]?css$/i,
        loader: "css-loader",
        options: {
          modules: {
            compileType: "module",
            mode: "local",
            auto: true,
            exportGlobals: true,
            localIdentName: "[name]_[local]__[hash:base64:5]",
            //[name]表示文件名，[local]表示类名，[hash:base64:5]表示5个字符的hash字符串
          },
        },
      },
    ],
  },
};

```

**一方面**

styles.xxx本质是字符串变量，如下，css-loader给类名加了hash字符串前缀

```
className={styles.main}  -> class='app-main___3AbjJ'
className={styles.main+'_breadcrumbs'} -> class='app-main___3AbjJ__breadcrumbs'


```

**另一方面**

加载css/scss文件，

app.scss 

```scss
.main {
  position: relative;
  z-index: 9;
  background-color: #ddd;
  &__breadcrumbs {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
  }
}


```

-> .css （css-loader配置的模式'local'，默认使得css文件中的样式加上了hash字符串）

```css
.app-main___3AbjJ{
    position: relative;
    z-index: 9;
  	background-color: #ddd;
}
.app-main___3AbjJ__breadcrumbs{
		position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}

```

可以通过添加:global将类名改为全局模式，则不会按css-loader的策略生成hash字符串，即：

```scss
:global(.main) {
  position: relative;
  z-index: 9;
  background-color: #ddd;
  &__breadcrumbs {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
  }
}
```

->

```css
.main{
    position: relative;
    z-index: 9;
  	background-color: #ddd;
}
.main__breadcrumbs{
		position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}
```



### :local的作用

当上述css-loader的配置中，mode修改如下：

```
mode: "gloable"
```

此时默认是样式是global的，需要加上:local来形成局部样式（模块化），即

app.scss 

```scss
:local(.main) {
  position: relative;
  z-index: 9;
  background-color: #ddd;
  &__breadcrumbs {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
  }
}


```

-> .css （**因为对.main加上了:local()，使其加上了hash字符串）**

```css
.app-main___3AbjJ{
    position: relative;
    z-index: 9;
  	background-color: #ddd;
}
.app-main___3AbjJ__breadcrumbs{
		position: absolute;
    left: 0;
    top: 0;
    width: 100%;
}

```











## Render方法

[render方法]https://react.docschina.org/docs/react-component.html

1）render返回值为String或Number类型，则渲染文本

2）render返回值为null 或Bool类型，什么都不渲染

3）render返回数组，相当于Fragments，可返回多个React元素

```jsx
render() {
  return (
    [<ChildA />,
      <ChildB />,
      <ChildC />]
  );
}
//等同于
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

