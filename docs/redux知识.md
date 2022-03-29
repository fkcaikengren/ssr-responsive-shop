

```
Hoolah Pay V2 Initiate Order Failed: We Are Unable To Send The Verification Code To Your Phone. Please Ensure That You Have Entered The Correct Phone Number Or Contact Consumer Support For If You Require Assistance.
```



关于中间件 start succeed fail 三种状态



居然可以catch到

-----





中间件

```js
({ dispatch, getState })=> next => (action)=>{
	if function
		excute action
	else 
		excute action.promise
	return promise
}


//应用中间件后：

dispatch((dispatch)=>...);
//执行
this.props.doAction() {
  
  		dispatch(requestWrapper());
  即执行该函数：
  		dispatch(load());
  即执行该函数：
  		const loadPromise = dispatch({
        types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
        promise: (client) =>
          client.get('/users/me/current_order', { auth: 'strict' }),
      });
  		loadPromise.then()
  
  
}

//最终
//返回一个promise
```



Dispatch({})





------

### 解析中间件apiMiddleware



预备知识

store.dispatch(action)返回的是action这个对象



redux-thunk的实现

```js
function createThunkMiddleware(extraArgument) {
  return ({ dispatch, getState }) => next => action => {
    
    if (typeof action === 'function') {
      // 这个dispatch已经不是原生的dispatch了，applyMiddleware后，引用发生改变，dispatch会变成最后改装的dispatch方法。
      return action(dispatch, getState, extraArgument) 
    }
    // next为之前传入的store.dispatch
    return next(action) //返回的是action
  }
}
/*

	action=>{} 是一个修改后的新dispatch函数，该dispatch函数返回值：
	1. Promise/action: 执行action()会返回一个Promise (Promise里面有我们想要的action对象数据)
	2. action: 执行next()会返回action对象（这个action不是函数）

*/
```



apiMiddleware的实现

```js

/*
	dispatch已经不是原生的dispatch了，applyMiddleware后，引用发生改变，dispatch会变成最后改装的dispatch方法。
	next是上一个中间件包装的dispatch （这里是thunk的dispatch）
*/

export default function clientMiddleware(client) {
  //返回的这个函数才是中间件
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === 'function') {
      //return 1.执行action => Promise/action
      // 这个dispatch已经不是原生的dispatch了，applyMiddleware后，引用发生改变，dispatch会变成最后改装的dispatch方法。
      return action(dispatch, getState); 
    }

    const { promise, types, ...rest } = action;
    if (!promise) {
      //return 2.执行来自thunk的next => Promise/action
      return next(action); 
    }

    const [REQUEST, SUCCESS, FAILURE] = types; //dipatch异步请求的三种状态
    
    next({ ...rest, type: REQUEST }); //开始请求
		
    //执行promise函数并处理结果
    const actionPromise = promise(client);
    actionPromise
      .then(
        (result) => next({ ...rest, result, type: SUCCESS }), //请求成功
        (error) => next({ ...rest, error, type: FAILURE })    //请求失败
      )
      .catch((error) => {
      	//意外错误
        console.error('MIDDLEWARE ERROR:', error); 
        next({ ...rest, error, type: FAILURE });
      });
		//return 3
    return actionPromise; //返回异步请求的promise
  };
}


/*
action=>{} 是一个修改后的新dispatch函数，该dispatch函数返回值
1. Promise 或 action对象
2. Promise
*/
```





applyMiddleware的实现

```js
// 警告：这只是一种“单纯”的实现方式！
// 这 并不是 Redux 的 API.
function applyMiddleware(store, middlewares) {
  middlewares = middlewares.slice()
  middlewares.reverse()
  let dispatch = store.dispatch
  middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))
  return Object.assign({}, store, { dispatch })
}
```



加上中间件后，dispatch的使用

```js
dispatch({
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) =>
      client.get('/users/me', {
        auth: 'strict',
      }),
})

```

会派发2次plain object的action对象，

1 dispatch({..., type: LOAD})

2 dispatch({..., type: LOAD_SUCCESS}) 或则 dispatch({..., type: LOAD_FAIL})





### 关于Promise



1.同一个Promise多次then() 或 catch()会把回调函数放到回调数组中，根据Promise状态依次执行

```js

let p = new Promise((resolve, reject)=>{
    setTimeout(_=>{
        resolve(1+1)
        console.log('resolve后继续..')
    }, 2000)
     //reject的本质是把状态改成rejected,并抛出一个错误
    // setTimeout(_=>reject('rejected'),1000)
})

p.then(data=>{
    console.log('first:'+data)
},err=>{
    console.log('err callback',err)
})

p.then(data=>{
    console.log('second:'+data)
},err=>{
    console.log('catch ERR 2')
})

/*结果：
	resolve后继续..
  first:2
  second:2
*/
```



2.then()的回调函数的返回值

静态方法 `Promise.resolve`返回一个解析过的`Promise`对象。 `Promise.reject`返回一个带拒绝原因的Promise对象。

then(success, failure), success函数中:

​	返回值returnValue如果是一个非Promise的普通对象/值，那么相当于Promise.resolve(returnValue)

failure函数中:

```js
Promise.reject(new Error('fail')).then(function() {
  // not called
}, function(error) {
  console.error(error); // Stacktrace
});
```





3.then()的第二个参数和catch的回调的区别

1）then的第一个参数只能捕获到Promise内部的错误，而catch能捕获到之前的所有错误（包括Promise内部和之前的then参数函数）

2）就近原则：如果then有第二个参数，那么Promise内部的错误会被第二个参数函数处理，而不会被catch到

​	原因：catch本身是then()到一种语法糖，如下：

```js
let p = new Promise((resolve, reject)=>{
    setTimeout(_=>{
        resolve(1+1)
        console.log('resolve后继续..')
    }, 2000)
    // setTimeout(_=>reject('rejected'),1000)
   
})


p.then(data=>{
    console.log('first:'+data)
    console.log(a.name)
},err=>{
    console.log('ERR callback',err)
    // console.log(a.name)
})
// .then(null, err=>console.log('catch ERR')) //效果和catch是一样的
.catch(err=>{
    console.log('catch ERR')
})
```





promise的then().catch()

每一个then()都必须对应有一个catch() （或则then的第二个错误回调参数），否则在reject后没有函数来处理
