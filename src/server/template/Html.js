import React from "react";
import Svg from './Svg'
// https://zh.javascript.info/script-async-defer
// 为了减少首屏渲染时间，将script标签放在开头，并使用async属性





const Html = ({ children, links = [], scripts = [], state={} }) => {

  return(
    <html lang="zh">
      <head >
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My React SSR</title>
        {links}
        {scripts}
      </head>
      <body>
        
        <Svg />
        <div id='root' dangerouslySetInnerHTML={{__html:children }}/>
      </body>
      <script dangerouslySetInnerHTML={{
        __html: `window.__state=${JSON.stringify(state)}`
      }}/>
    </html>
  )
};

export default Html;
