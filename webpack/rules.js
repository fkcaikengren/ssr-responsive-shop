const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const jsRules = (env, isDev = true) => {
  return {
    test: /\.js[x]?$/,
    exclude: /node_modules\//,
    use: [
      {
        loader: require.resolve("babel-loader"),
        options: {
          // cacheDirectory: true, //?
          plugins: [
            env === "client" && isDev && "react-refresh/babel",
            env === "server" && "@babel/transform-modules-commonjs", // 把ES Module转换为CommonJS
          ].filter(Boolean),
        },
      },
    ],
  };
};

const cssRules = (env, isDev = true) => {
  return {
    test: /\.[s]?css$/,
    exclude: /node_modules\//,
    use: [
      // 剥离CSS (server模式下不生成css)
      env === "client" &&
      (isDev
        ? { loader: "style-loader" } // 开发环境下不剥离css, 有利于HMR. (如果采用extract css的方式, 会导致修改css后不会热更新)
        : {
          loader: MiniCssExtractPlugin.loader,
        }),
      {
        loader: "css-loader",
        // 启动css模块化
        options: {
          importLoaders: 2, // 0 => no loaders (default);  1 => postcss-loader;  2 => postcss-loader, sass-loader
          modules: {
            mode: "global", // 默认local
            // auto: undefined, //默认undefined，auto:true则表示matching /\.module\.\w+$/i.test(filename) and /\.icss\.\w+$/i.test(filename) regexp.
            localIdentName: "[hash:base64:6]-[local]", // scope处理后的命名
            exportOnlyLocals: env !== "client", // server模式下，import得到的style只导出locals对象
          },
        },
      },
      { loader: "postcss-loader" },
      {
        loader: "sass-loader",
        options: {
          // 默认是sass，建议首选`dart-sass` （如果是选择sass包则可能存在一些sass语法没办法解析）
          implementation: require("node-sass"),
        },
      },
    ].filter(Boolean),
  };
};

const resourceRules = (env, isDev = true) => {
  return {
    test: /\.(jp[e]?g|png|gif|woff|woff2|ttf|eot|svg|ico)(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: "file-loader",
        options: {
          name: "[name]-[contenthash:8].[ext]",
        },
      },
    ],
  };
};

const rulesConfig = (env, isDev) => [
  jsRules(env, isDev),
  cssRules(env, isDev),
  resourceRules(env, isDev),
];

module.exports = rulesConfig;
