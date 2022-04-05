module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  parser: "@babel/eslint-parser", // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // specify the version of ECMAScript syntax you want
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // enable JSX
      impliedStrict: true, // enable global strict mode
    },
  },
  extends: [
    "airbnb", // Uses airbnb, it including the react plugins (eslint-plugin-react & eslint-plugin-jsx-a11y)
    "plugin:promise/recommended", // Use eslint-plugin-promise as recommended
    // "prettier",
    "plugin:prettier/recommended", // Use eslint-config-prettier, it can disable all rules which conflict with prettier.
  ],
  settings: {
    "import/resolver": {
      // This config is used by eslint-import-resolver-webpack
      node: {
        path: ["src"],
      },
      webpack: {
        config: {
          resolve: {
            modules: ["src", "node_modules"],
            extensions: [".json", ".js", ".jsx", ".ts", ".tsx"],
          },
        },
      },
    },
  },
  plugins: ["prettier", "import"], // declare plugins then you can use the rules of them.
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // rules will override the config of extends
    "prettier/prettier": "error", // use prettier to format
    "arrow-body-style": "off",
    "prefer-arrow-callback": "off",
    // "react-hooks/rules-of-hooks": "error",
    // "react/jsx-one-expression-per-line": 0,
    "max-len": ["error", { code: 180 }],

    "jsx-quotes": ["error", "prefer-double"],
    "import/prefer-default-export": "warn",
    "import/no-unresolved": ["error", { commonjs: true }],
  },
};
