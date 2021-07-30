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
        {/* GTM */}
        <script dangerouslySetInnerHTML={{__html:
          `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WDMXZDJ');`
        }} />
        {/* init gtag */}
        <script dangerouslySetInnerHTML={{__html:
          `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          `
        }}/>
        {/* gtag('js', new Date()); */}
        {/*  UA-201579661-1 */}
        {/* G-8M22ZJLZVS */}
      </head>
      <body>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WDMXZDJ"
          height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
        </noscript>
        
        <Svg />
        <div id='root' dangerouslySetInnerHTML={{__html:children}}/>
      </body>
      <script dangerouslySetInnerHTML={{
        __html: `window.__state=${JSON.stringify(state)}`
      }}/>
    </html>
  )
};

export default Html;
