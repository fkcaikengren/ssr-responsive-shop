## 一.Promise的基础使用

Promise出现的原因：更优雅的处理异步操作，避免嵌套回调。



### 1.Promise处理异步操作

🌰1 `链式调用` 

+ new一个Promise的时候，传给Promise的函数会立即执行，然后创建一个Promise实例。

+ 当Promise resolve时，then的第一个参数方法可以接受到resolve传过来的值，并执行。

+ 当Promise reject时，then的第二个参数方法可以接受到reject传过来的错误信息，并执行。若then没有第二个参数方法，则错误会抛出，若有catch方法则被catch捕获。

```js
let p = new Promise((resolve,reject)=>{
  //异步操作1
  setTimeout(()=>{
      resolve(1)
  },1000)
})
p.then(data=>{  
  console.log(data) //1
  return  new Promise((resolve,reject)=>{
      //异步操作2
      setTimeout(()=>{
          resolve(data+1) 
      },1000)
  })
}).then(data=>{ 
  console.log(data) //2
}).catch(err=>{
  console.log(err)  
})
```

通过上述的链式调用可以有效避免地狱嵌套回调。



🌰2 `错误处理`

+ **第二个参数函数（失败回调）和.catch的区别：**失败回调处理的是Promise内的错误，.catch可以处理Promise内和then的参数函数里的错误。当然，如果Promise内的错误被失败回调处理了，则错误不会被catch捕获（**就近原则**）。
+ .catch的本质也是失败回调，在下面的例子中，方式一和方式二处理错误的效果是一致的。

```js
let p = new Promise((resolve, reject)=>{
    setTimeout(_=>{
        resolve(1)
    }, 1000)
})
p.then(data=>{
    console.log('result:'+data)
    console.log(a.name)
  
},err=>{
    console.log('ERR callback',err)
})
// .then(null, err=>console.log('catch ERR')) //方式一
.catch(err=>{			//方式二
    console.log('catch ERR')
})

//打印：result:1 catch ERR
```

.catch的处理方式更接近同步（try/catch）的方式，并且捕获错误的范围更广，因此一般来说，建议只使用catch方法，而不使用失败回调来处理错误。



### 2.Promise的的静态方法

> Promise.resolve
>
> Promise.reject
>
> Promise.all
>
> Promise.race

另外还有两个原型上的方法

> Promise.prototype.catch
>
> Promise.prototype.finally



+ Promise.resolve(value) 返回一个状态为`fulfilled`的Promise 

+ Promise.reject(reason) 返回一个状态为`rejected`的Promise 
+ Promise.all(array) 返回一个Promise记为p1，当数组的所有Promise都resolve后才会把p1的状态改为`fulfilled`，即执行then的第一个参数。任意一个reject，则把p1的状态改为`rejected`，执行then的第二个参数或catch方法。

```js
let p1 = new Promise(function(resolve) {
  setTimeout(() => {
    resolve("fulfilled 1");
  }, 2000);
});
let p2 = new Promise(function(resolve, reject) {
  setTimeout(() => {
    resolve("fulfilled 2");
  }, 1000);
});
Promise.all([p1, p2]).then(function (results) {
  //results 是一个数组
  console.log(results);      //打印： ["fulfilled 1","fulfilled 2"]
});

//Promise.all([p1, p2]).catch(function (reason) {
  //最先reject发生传递的reason
  //console.log(reason);      
//});
```



+ Promise.race(array) 返回一个Promise记为p2，数组的任意一个Promise resolve后就把p2的状态改为`fulfilled`，即执行then的第一个参数。所有的都reject后才会把p2的状态改为`rejected`，执行then的第二个参数或catch方法。

```js
let p1 = new Promise(function(resolve) {
  setTimeout(() => {
    resolve("fulfilled 1");
  }, 2000);
});
let p2 = new Promise(function(resolve, reject) {
  setTimeout(() => {
    resolve("fulfilled 2");
  }, 1000);
});
Promise.race([p1, p2]).then(function (result) {
  console.log(result);      //打印： "fulfilled 2"
});
```



+ Promise.prototype.catch(reason) 捕获错误

```js
let p1 = new Promise(function(resolve) {
  setTimeout(() => {
    resolve("fulfilled --");
  }, 2000);
});
let p2 = new Promise(function(resolve, reject) {
  setTimeout(() => {
    reject("rejected --");
  }, 1000);
});
Promise.all([p1, p2]).catch(function (reason) {
  //reason 错误信息
  console.log(reason);      //打印： rejected --
});
```



+ Promise.prototype.finally()

```js
Promise.all([p1, p2]).catch(function (reason) {
  console.log('reason');     
}).finally(()=>{
    console.log('done')
})
//打印： reason done

//Promise.all([p1, p2]).finally(()=>{
    //console.log('done') 
//})
//打印： done

//Promise不管是resolve，还是reject（不管是否处理了错误），都一定会执行finally().
```



## 二. Promise的规范



### 1.术语



> "promise"是一个对象或则函数，必须带有then方法
>
> "thenable"是指then方法
>
> "value"是任意的js值，是promise resolve时的参数
>
> "reason"是promise reject时的参数
>
> "exception"是指通过throw抛出的异常



### 2.规范

#### 2.1.状态

+ `pending` 可以向其他两种两种状态转变

+ `fulfilled` 状态不能变化

+ `rejected` 状态不能变化

resolve能将状态由`pending`变成`fulfilled`，reject能将状态由`pending`变成`rejected`

也就是说当我们在一个Promise里面resolve后，则再reject是无效的。如果已经reject后，则再resolve是无效的。



#### 2.2.then方法

then方法长啥样？看下面：

```js
then(onFulFilled, onRejected)
```

+ **then方法可以多次调用，`onFulFilled`, `onRejected`都是可选的参数，如果没有传这两参数（或传的是非函数）则会被Promise忽略**



+ **成功：在resolve()后，所有的`onFulFulled`函数按照其注册顺序执行**

例如：

```js
let p1 = new Promise((resolve,reject)=>{
    setTimeout(()=>resolve(0))
  })
p1.then(val=>console.log(val+1))
p1.then(val=>console.log(val+2))

//输出：1，2
```





+ **失败：在reject()后，所有的`onRejected`函数按照其注册顺序执行**

例如:   

```js
let p1 = new Promise((resolve,reject)=>{
  setTimeout(()=>reject('err'))
})
p1.then(null,val=>console.log(val+1))
p1.then(null,val=>console.log(val+2))

//输出：err1，err2
```





+ **`onFulFilled`, `onRejected`仅仅作为函数调用，即执行时的this默认 `this` 指向 global/window，严格模式 `undefined`**



+ **then方法必须返回一个Promise**

```js
promise2 = promise1.then(onFulfilled, onRejected);
```



> If either `onFulfilled` or `onRejected` throws an exception `e`, `promise2` must be rejected with `e` as the reason. 

==> **加try catch**



> If `onFulfilled` is not a function and `promise1` is fulfilled, `promise2` must be fulfilled with the same value as `promise1`.

==> **用promise1的value作为promise2的value**



> If `onRejected` is not a function and `promise1` is rejected, `promise2` must be rejected with the same reason as `promise1`. 

==> **用promise1的reason作为promise2的reason**



> If either `onFulfilled` or `onRejected` returns a value `x`, run the Promise Resolution Procedure `[[Resolve]](promise2, x)`. 

==> **调用resolvePromise**





这样做才可以实现Promise有效的链式调用，如下：

```js

let p = new Promise((resolve,reject)=>{
  setTimeout(()=>{
      resolve(1)
  },1000)
})
p.then(data=>{  
  console.log(data)
  return  new Promise((resolve,reject)=>{
      setTimeout(()=>{
          resolve(2) 
      },1000)
  })
}).then(data=>{ 
  console.log(data)
  return 3
}).then(data=>{ 
  console.log(data)
}).then(data=>{
  console.log('end')
})

//输出：1，2，3，end
```







+ **`onFulfilled`, `onRejected`必须在 执行上下文栈（execution context stack） 只包含平台代码（platform code） 后才能执行，平台代码指引擎，环境，Promise实现代码。**

  **说白了就是执行栈中你的同步任务全部完成后，该执行异步任务的回调的时候，才执行onFulfilled**

  **或者说then是异步的，其回调执行时机必须在本次的事件循环的末尾。**

例如：

```js
new Promise((resolve,reject)=>{
  resolve('promise')
}).then((val)=>{
  console.log(val)
})
console.log('script')

//当then是异步的时候，会先输出script，再输出promise.
```

规范的实现可以通过 **macro-task** 机制，比如`setTimeout`，或者 **micro-task** 机制，比如`queueMicrotask`。使用queueMicroTask会更加合理。

```js
queueMicrotask(() => {
      /*微任务中将运行的代码*/
});
```



## 三.Promise的实现

#### 1.基础框架

```js


// 3种状态
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

// TPromise是一个函数/对象
function TPromise(fn){
  // 定义状态，value， reason，成功回调数组，失败回调数组
  this.status = PENDING
  this.value = undefined
  this.reason = undefined
  this.fulfilledCallbacks = []
  this.rejectedCallbacks = [] 

  // 执行传入的函数fn （先确定resolve和reject方法）
  let resolve = function(value){
    if(this.status === PENDING){
      this.status = FULFILLED
      this.value = value
      this.fulfilledCallbacks.forEach(cb => {
        cb(this.value)
      });
    }
  }.bind(this)

  let reject = function(reason){
    if(this.status === PENDING){
      this.status = REJECTED
      this.reason = reason
      this.rejectedCallbacks.forEach(cb => {
        cb(this.reason)
      });
    }
  }.bind(this)

  try {
    fn(resolve, reject)
  } catch (err) {
    reject(err)
  }

  //定义then方法 
  this.then = function(onFulfilled, onRejected){
    // 分状态处理
    if(this.status === PENDING){
      this.fulfilledCallbacks.push(onFulfilled)
      this.rejectedCallbacks.push(onRejected)
    }else if(this.status === FULFILLED){  
      onFulfilled(this.value) //为什么立即执行？因为此时resolve在then之前执行了
    }else{
      onRejected(this.reason)
    }
  }
}

module.exports = TPromise



```

#### 2.完善then方法

```js


// 3种状态
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

// TPromise是一个函数/对象
function TPromise(fn){
  // 定义状态，value， reason，成功回调数组，失败回调数组
  this.status = PENDING
  this.value = undefined
  this.reason = undefined
  this.fulfilledCallbacks = []
  this.rejectedCallbacks = [] 

  // 执行传入的函数fn （先确定resolve和reject方法）
  let resolve = function(value){
    if(this.status === PENDING){
      this.status = FULFILLED
      this.value = value
      this.fulfilledCallbacks.forEach(cb => {
        cb(this.value)
      });
    }
  }.bind(this)

  let reject = function(reason){
    if(this.status === PENDING){
      this.status = REJECTED
      this.reason = reason
      this.rejectedCallbacks.forEach(cb => {
        cb(this.reason)
      });
    }
  }.bind(this)

  try {
    fn(resolve, reject)
  } catch (err) {
    console.log(this.fulfilledCallbacks.length)
    reject(err)
  }
}

//=============把then加在原型上=============
TPromise.prototype.then = function(onFulfilled, onRejected){

  if(this.status === PENDING){
    let p2 
    p2 = new TPromise(function (resolve,reject){
      //收集onFullfilled
      this.fulfilledCallbacks.push(function(){
        //=========处理x：判断onFullfilled是否为函数，对错误进行TPromise2的reject()======
        queueMicrotask(function(){
          try {
            if(typeof onFulfilled !== 'function'){
              resolve(this.value) 
            }else{
              const x = onFulfilled(this.value)
              resolvePromise(p2, x, resolve, reject) //不知道x类型，要进行分析处理
            }
          } catch (err) {
            reject(err)
          }
        }.bind(this))
        
        //=========处理x：end======
      }.bind(this))
      //收集onRejected
      this.rejectedCallbacks.push(function(){
        //=========处理x：判断onRejected是否为函数，对错误进行TPromise2的reject()======
        queueMicrotask(function(){
          try {
            if(typeof onRejected !== 'function'){
              reject(this.reason)
            }else{
              const x = onRejected(this.reason)
              resolvePromise(p2, x, resolve, reject)
            }
          } catch (err) {
            reject(err)
          }
        }.bind(this))
        //=========处理x：end======
      }.bind(this))
    }.bind(this))
    return p2
  }else if(this.status === FULFILLED){
    let p2 
    p2 = new TPromise(function (resolve,reject){
      //=========处理x：判断onFullfilled是否为函数，对错误进行TPromise2的reject()======
      queueMicrotask(function(){
        try {
          if(typeof onFulfilled !== 'function'){
            resolve(this.value) 
          }else{
            const x = onFulfilled(this.value)
            resolvePromise(p2, x, resolve, reject) //不知道x类型，要进行分析处理
          }
        } catch (err) {
          reject(err)
        }
      }.bind(this))
      //=========处理x：end======
    }.bind(this))
    return p2
  }else if(this.status === REJECTED){
    let p2
    p2 = new TPromise(function (resolve,reject){
      //=========处理x：判断onRejected是否为函数，对错误进行TPromise2的reject()======
      queueMicrotask(function(){
        try {
          if(typeof onRejected !== 'function'){
            reject(this.reason)
          }else{
            const x = onRejected(this.reason)
            resolvePromise(p2, x, resolve, reject)
          }
        } catch (err) {
          // console.log(p2)
          reject(err)
        }
      }.bind(this))
      //=========处理x：end======
    }.bind(this))
    return p2
  }
}


/**
 * 简易实现resolvePromise
 * @param {*} promise then新返回TPromise2
 * @param {*} x 执行TPromise1的onFullfilled方法到的返回结果
 * @param {*} resolve then新返回TPromise2的resolve
 * @param {*} reject then新返回TPromise2的reject
 */
 function resolvePromise(promise, x, resolve, reject){
  // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
  // 这是为了防止死循环
  if (promise === x) {
    return reject(new TypeError('The promise and the return value are the same'));
  }


  if(x instanceof TPromise){
    x.then(function(val){
      resolve(val)
    }, reject)
  }else if(typeof x === 'object' || typeof x === 'function'){ 
    if(x === null){ //null是'object'
      resolve(x)
    }
    let then = x.then
    if(typeof then === 'function'){
      // 调用then
      then.call( x,
        // 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
        function (y) {
          // 如果 resolvePromise 和 rejectPromise 均被调用，
          // 或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
          // 实现这条需要前面加一个变量called
          if (called) return;
          called = true;
          resolvePromise(promise, y, resolve, reject);
        },
        // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
        function (r) {
          if (called) return;
          called = true;
          reject(r);
      });
    }else{
      resolve(x)
    }
  }else{
    resolve(x)
  }
}


module.exports = TPromise

```



#### 3.关于promise错误处理值得注意的地方

```js
let p = new Promise((resolve, reject)=>{
    setTimeout(_=>{
        resolve(200)
    }, 1000)
    reject('rejected')
})

p.catch(err=>{
    console.log('catch ERR 1: '+ err)
})
p.catch(err=>{
    console.log('catch ERR 2: '+ err)
}).catch(err=>{
    //此时.catch的调用者是一个新的成功的Promise, 故不会执行此处的代码
    console.log('catch ERR ?: '+ err)
})
p.then(data=>{
    console.log(data)
}).catch(err=>{
    console.log('catch ERR 3: '+ err)
})
// 打印结果：
// catch ERR 1: rejected
// catch ERR 2: rejected
// catch ERR 3: rejected

```

由上述实验可以得出两个结论

1.一个Promise通过.catch处理后返回的是一个新的成功Promise。

2.同一个Promise多次调用.catch, 这会注册多个错误回调，当错误发生，会把同一个error传递给每一个错误回调执行。



```js
let p = new Promise((resolve, reject)=>{
    setTimeout(_=>{
        resolve(200)
    }, 1000)
    reject('rejected')
})
p.catch(err=>{
    console.log('catch ERR 1: '+ err)
})

// 情况一：不加上catch
p.then(data=>{
    console.log(data)
})
// catch ERR 1: rejected
// Uncaught (in promise) rejected  （这里居然出现了一个没有被捕获的错误！）

// 情况二：加上catch
p.then(data=>{
    console.log(data)
}).catch(err=>{
    console.log('catch ERR 2: '+ err)
})
// catch ERR 1: rejected
// catch ERR 2: rejected 
```

得出结论：

1.开发时，一个then链式调用的最后必须以调用.catch结尾！



## 四.Promise与Async/Await比较

### 1.Asyc/Await简介

> Async/Await实际是generator+Promise的一种语法糖。

首先了解一下Async/Await的使用和Promise有什么不同

```js
function getJSON(){
  return new Promise((resolve,reject)=>{
    setTimeout(_=>{
      resolve('{"success":true}')
    },1000)
  })
}

//使用Promise
const makeRequest = () =>{
  getJSON().then(data => {
      console.log(data)
      return "done"
    })
}



//使用await
const makeRequest = async () => {
  console.log(await getJSON())
  return "done"
}

```

- 函数前面多了一个async关键字。await关键字只能用在async定义的函数内。async函数会隐式地返回一个promise，该promise的reosolve值就是函数return的值。(示例中reosolve值就是字符串"done")
- 我们不能在最外层代码中使用await，因为不在async函数内。getJSON内部最终还是要用Promise来封装，所以可以说Async/Await是基于Promise的。





### 2.Async/Await的6个优点

> 1.简洁，可以简化书写方式，更接近同步代码书写方式。
>
> 2.错误处理，async/await采用try/catch处理更高效。
>
> 3.Pomise的then内条件语句，加深嵌套。
>
> 4.中间值导致嵌套，或使代码难以理解。
>
> 5.错误栈，async/await的错误提示更加友好。
>
> 6.调试，async/await更方便调试。

#### 2.1.简洁

由示例可知，使用Async/Await明显节约了不少代码。我们**不需要写.then**，**不需要写匿名函数**处理Promise的resolve值，也不需要定义**多余的data变量**，还避免了**嵌套代码**。这些小的优点会迅速累计起来，这在之后的代码示例中会更加明显。

同时，await的写法更接近同步代码，阅读性更高。

#### 2.2.错误处理

```js
const makeRequest2 = () => {
  try {
    getJSON()
      .then(result => {
        // JSON.parse可能会出错
        const data = JSON.parse(result)
        console.log(data)
      })
      // 取消注释，处理异步代码的错误
      // .catch((err) => {
      //   console.log('then-catch: ', err)
      // })
  } catch (err) {
    console.log('try-catch: ', err)
  }
}
makeRequest2()
```

上述的代码中parse出错时，并不能通过try/catch捕获到，只能通过`.catch`来捕获，这样做就会使代码非常冗余，并且在实际生产代码会更加复杂。（有时你可能忘记catch）

------

**来自OnePiece项目的一个bug**

![image-20210630143543692](/Users/gavin/Library/Application Support/typora-user-images/image-20210630143543692.png)

```js
registerHoolah() {
    const { approveHoolah, cart } = this.props;
    const order = cart.data;

    approveHoolah().then(
      ({
        order_context_token: orderContextToken,
        redirect_url: redirectUrl,
      }) => {
        const CLOSE_URL = `${__BASE_URL__}${getUrl('checkout-payment')}`;
        const RETURN_TO_SHOP_URL = `${__BASE_URL__}${getUrl(
          'checkout-success'
        )}/?orderNumber=${order.number}`;

        window.location = `${redirectUrl}/?ORDER_CONTEXT_TOKEN=${orderContextToken}&CLOSE_URL=${CLOSE_URL}&RETURN_TO_SHOP_URL=${RETURN_TO_SHOP_URL}`;
      }
    )
    // .catch(this.errMsg); //忘记catch了
  }
```

而在代码中的处理是：

```js
//支付检查时
continue = () => {
  ...
    prePayCheck()
      .then(() => this.confirmPayment())
      .then(() => {
        if (paymentMethod === 'credit-card') {
          ...
        } else if (paymentMethod === 'stripe') {
          this.registerStripe();
        } else if (paymentMethod === 'zip') {
          this.registerZip();
        } else if (paymentMethod === 'instalment') {
          this.registerInstalment();
        } else if (paymentMethod === 'hoolah') {
          this.registerHoolah();  //看这里，这个的promise被rejected了
        } else if (paymentMethod === 'affirm') {
          this.registerAffirm();
        }
      })
      .catch((err)=>{ //这个catch并不能捕获所有错误
        ...
        this.errMsg(err)
      });
}
 /* 分析：
 registerHoolah内部请求出错 -> 内部的promise（记为p1）调用reject -> 回调p1的onFulfilled (没有onFulfilled就啥也不做，反正没有把错误throw出去)
 
 这里prePayCheck后的catch无法捕获到registerHoolah内部错误，因为这个错误是被registerHoolah内部消化了。
 */
```

**这里如果有用async/await来实现**，就可以把错误统一放入try/catch中处理

```js
async registerHoolah() {
    const { approveHoolah, cart } = this.props;
    const order = cart.data;
    const {
      order_context_token: orderContextToken,
      redirect_url: redirectUrl,
    } = await approveHoolah();
    const CLOSE_URL = `${__BASE_URL__}${getUrl('checkout-payment')}`;
    const RETURN_TO_SHOP_URL = `${__BASE_URL__}${getUrl(
      'checkout-success'
    )}/?orderNumber=${order.number}`;

    window.location = `${redirectUrl}/?ORDER_CONTEXT_TOKEN=${orderContextToken}&CLOSE_URL=${CLOSE_URL}&RETURN_TO_SHOP_URL=${RETURN_TO_SHOP_URL}`;
}
```

```js
continue = async () => {
  	...
    try{
      await prePayCheck()
      await this.confirmPayment()
      if (paymentMethod === 'credit-card') {
          ...
      } else if (paymentMethod === 'stripe') {
        await this.registerStripe();
      } else if (paymentMethod === 'zip') {
        await this.registerZip();
      } else if (paymentMethod === 'instalment') {
        await this.registerInstalment();
      } else if (paymentMethod === 'hoolah') {
        await this.registerHoolah();
      } else if (paymentMethod === 'affirm') {
        await this.registerAffirm();
      }
    }catch((err)=>{
      this.errMsg(err)
    }) //这里能捕获到registerHoolah reject的错误
}
```





#### 2.3.条件语句

下面示例中，需要获取数据，然后根据返回数据决定是直接返回，还是继续获取更多的数据。（就是加了一层if...else）

```js
const makeRequest = () => {
  return getJSON()
    .then(data => {
      if (data.needsAnotherRequest) {
        return makeAnotherRequest(data)
          .then(moreData => {
            console.log(moreData)
            return moreData
          })
      } else {
        console.log(data)
        return data
      }
    })
}
```

使用Promise的话，嵌套（6层），括号，return语句很容易让人感到迷茫，而它们只是需要将最终结果传递到最外层的Promise。

上面的代码使用async/await编写可以大大地提高可读性:

```js
const makeRequest = async () => {
  const data = await getJSON()
  if (data.success) {
    const moreData = await makeAnotherRequest(data);
    console.log(moreData)
    return moreData
  } else {
    console.log(data)
    return data    
  }
}
```





#### 2.4.中间值

你很可能遇到过这样的场景，调用promise1，使用promise1返回的结果去调用promise2，然后使用两者的结果去调用promise3。此时你的代码可能是这样的：

```js
const makeRequest = () => {
  return promise1()
    .then(value1 => {
      return promise2(value1)
        .then(value2 => {        
          return promise3(value1, value2)
        })
    })
}
```

> 为了让函数扁平化，错误的处理方式：

```js
const makeRequest4Flat = ()=>{
  return promise1()
  .then(value1=>{
    return promise2(value1)
  })
  .then((value2)=>{ //这里是拿不到value1的！！！
    return promise3(value1, value2)
  })
}
```

> 正确的处理方式如下，但是又破坏了语义上的理解

```js
const makeRequest4Flat = ()=>{
  return promise1()
  .then(value1=>{
    return Promise.all([value1, promise2(value1)])
  })
  .then(([value1,value2])=>{
    return promise3(value1, value2)
  })
}
```

我们想要的仅仅是将最后的结果作为Promise传出去，但上面的嵌套代码实在理解难以理解。

使用async/await的话，代码会变得异常简单和直观。

```js
const makeRequest = async () => {
  const value1 = await promise1()
  const value2 = await promise2(value1)
  return promise3(value1, value2)
}
```



#### 2.5.错误栈

```js
function callAPromise(){
  return new Promise((resolve,reject)=>{
    setTimeout(_=>{
      resolve(1)
    },100)
  })
}
const makeRequest5 = () => {
  return callAPromise()
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => callAPromise())
    .then(() => {
      console.log(a.name) //出错
    })
}

makeRequest5()
  .catch(err => {
    console.log(err);
})

```

```js
const makeRequest5Await = async () => {
  await callAPromise()
  await callAPromise()
  await callAPromise()
  await callAPromise()
  await callAPromise()
  console.log(a.name)  //出错
}

makeRequest5Await()
  .catch(err => {
    console.log(err);
})
```

输出结果：

![image-20210630152534977](/Users/gavin/Library/Application Support/typora-user-images/image-20210630152534977.png)

在打印的错误栈信息中，async/await的方式抛出的错误给出了确切出错函数`makeRequest5Await` ，而使用Promise链式调用的方式没有给出错误的具体位置。在生产环境中，当你分析错误日志时，这将非常有用！通过`makeRequest5Await` 的错误线索可以很快定位到错误。



#### 2.6.调试

调试Promise非常痛苦，在.then代码块中设置断点，使用Step Over快捷键，调试器不会跳到下一个.then，因为它会跳过异步代码。

使用await/async时，你不再需要那么多箭头函数，这样你就可以像调试同步代码一样跳过await语句，Step Over快捷键可以跳到下一个await语句。







### 3.Async/Await的缺点

#### 3.1.无法简单实现all()和race()

Async/Await无法简单实现Promise的各种原生方法，比如all()和race()。也可以理解无法简单的实现并行。

关于Async/Await实现并行操作，其实可以通过forEach实现，但达不到Promise.all()的效果，实现如下：

```js
[p1,p2].forEach((async p=>{
	await p()
}))
```

只要await不在同一个函数就可以实现并行。



#### 3.2.必须使用window.onerror来捕获全局错误

Async/Await全局捕获错误必须用window.onerror，而这种会捕获稀奇古怪的错误造成系统浪费，不像Promise可以专用window.addEventListener('unhandledrejection',function)

尽管window.onerror的开销大，但是一个成熟的系统是一定要利用window.onerror做错误监控系统，所以，这也算不上大缺点。



#### 3.3.某些异步操作只用Promise封装

Async/Await是基于Promise的，而Promise是用来解决回调问题的，很多异步操作的回调必须要使用Promise封装后才能交给Async/Await使用。



### 4.总结

+ 需要用到Promise各种便捷的方法（比如.race()之类）的时候，一定用Promise。

+ 并行的请求最好用Promise。

+ 不需要并行的场合，如果要传递参数，最好用Async/Await。

+ 其他ajax场合，看你喜好try...catch...还是.catch()，以决定使用哪一方。









# 五.Event loop



#### 1.背景知识

> 执行上下文。可以理解为代码的作用域

```js
<script>
  var a = 1
	function f1(){
  	var b = 2
  	function f2(){
      var c = 3
    }
	}  
</script>
```

上述代码就包含了三个执行上下文，分别表示了script , f1, f2的信息。



> 执行上下文栈（execution context stack）

执行上下文，会被压入执行栈执行，例如上述代码的执行过程是这样的：

![image-20210623114459704](/Users/gavin/Library/Application Support/typora-user-images/image-20210623114459704.png)



> 事件循环（event loop），核心就是事件+循环。接下来，解释"事件"和"循环" 。

#### 2.什么是事件？

> 事件可以理解成消息，执行上下文（作用域）。

事件会被压入执行栈（execution context stack）中执行。



#### 3.什么是循环？

> 循环是一种安排任务处理时机的机制。

下面从两个角度讲循环机制。第一种是把任务分成同步任务和异步任务，第二种是更细致的划分成(宏)任务和微任务。

##### 3.1.同步任务&异步任务

> 同步任务：进入主线程执行的任务。例如计算，UI渲染。

> 异步任务：可理解为另一个线程执行的任务，不会阻塞主线程。例如图片加载。

![image-20210623111645494](/Users/gavin/Library/Application Support/typora-user-images/image-20210623111645494.png)

同步任务会放入执行栈然后执行，异步任务会放入Event Table，等异步任务有结果后把异步任务的回调函数加入Event Queue。等所有的同步任务执行完毕（执行栈清空）后，再从Event Queue取出事件并执行。



##### 3.2任务队列&微任务队列

> (宏)任务（Macro Task or Task）包括：`script`（即script标签内）｜`setTimeout `|` setInterval` |` xhr`

> 微任务（Micro Task）包括：`Promise` | `Process.nextTick`（Node端）

我们把主线程执行的任务分为宏任务和微任务。

这里所说的(宏)任务和微任务主要指的是异步任务的**回调函数**。

主线程上要么在执行宏任务，要么在执行微任务，不断循环。

![image-20210623112117964](/Users/gavin/Library/Application Support/typora-user-images/image-20210623112117964.png)

事件循环的具体流程如下：

![image-20210623120141375](/Users/gavin/Library/Application Support/typora-user-images/image-20210623120141375.png)

直接上例子！🌰🌰🌰

```js
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})

```

**第一轮循环：**

script作为宏任务进入执行栈

![image-20210623121829156](/Users/gavin/Library/Application Support/typora-user-images/image-20210623121829156.png)



![image-20210625104047085](/Users/gavin/Library/Application Support/typora-user-images/image-20210625104047085.png)

**第二轮循环：**

![image-20210625103059026](/Users/gavin/Library/Application Support/typora-user-images/image-20210625103059026.png)



**第三轮循环：**

![image-20210625103441364](/Users/gavin/Library/Application Support/typora-user-images/image-20210625103441364.png)3



执行结果：1，7，6，8，2，4，3，5，9，11，10，12





