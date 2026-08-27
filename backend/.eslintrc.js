module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  env: {
    es2021: true,
    node: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'node', 'plugin:jest/recommended'],
  parserOptions: {
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
    ecmaVersion: 12,
    requireConfigFile: false,
  },
  plugins: ['jest'],
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'import/no-commonjs': 0,
    'import/no-nodejs-modules': 0,
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-console': 1,
    'no-process-exit': 0,
    'no-unused-expressions': 0,
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'object-shorthand': 0,
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: true,
      },
    ],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
};
