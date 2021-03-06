module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  parser: '@babel/eslint-parser', // Specifies the ESLint parser
  parserOptions: {
    ecmaVersion: 2020, // specify the version of ECMAScript syntax you want
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // enable JSX
      impliedStrict: true, // enable global strict mode
    },
  },
  extends: [
    // Uses airbnb, it including the react plugins (eslint-plugin-react & eslint-plugin-jsx-a11y)
    'airbnb',
    // Use eslint-plugin-promise as recommended
    'plugin:promise/recommended',
    // Use eslint-config-prettier. 只是禁止里那些不符合prettier风格的eslint rules.
    'prettier', // 这不会调用prettier插件进行格式化，除非你手动安装开启了vscode prettier插件
    // 'plugin:prettier/recommended', //use eslint-config-prettier & eslint-plugin-prettier (在eslint层面开启prettier插件，会在保存时格式化，在一些方面容易和eslint冲突)
  ],
  settings: {
    'import/resolver': {
      // This config is used by eslint-import-resolver-webpack
      webpack: {
        config: './webpack/webpack.base.config.js',
      },
    },
  },
  // declare plugins then you can use the rules of them.
  plugins: ['import', 'promise'],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    'import/prefer-default-export': 'off',
    'import/no-unresolved': ['error', { commonjs: true }],
    'promise/always-return': 'off',
    semi: ['warn', 'always'],
    'max-len': ['warn', { code: 100, comments: 150 }],
    indent: 'off',
    'implicit-arrow-linebreak': ['error', 'beside'],
    'arrow-body-style': ['warn', 'as-needed'],
    'prefer-arrow-callback': 'off',
    'no-console': 'off',
    'max-classes-per-file': 'off',
    'func-names': ['warn', 'as-needed'],
    'no-unused-vars': ['warn'],
    'no-underscore-dangle': ['warn', { allow: ['__state'] }],
    camelcase: 'warn',
    'default-param-last': 'warn',
    'no-use-before-define': 'warn',
    'no-bitwise': 'warn',
    'no-shadow': 'warn',
    'no-undef': 'warn',

    'jsx-quotes': ['warn', 'prefer-double'],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/interactive-supports-focus': 'off',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'react/no-danger': 'off',
    'react/jsx-no-constructed-context-values': 'off',
    'react/state-in-constructor': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'react/prop-types': 'warn',
    'react/no-array-index-key': 'warn',
    'react/button-has-type': 'warn',
    'react/destructuring-assignment': 'warn',
  },
};
