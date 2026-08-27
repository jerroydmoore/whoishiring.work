module.exports = {
  parser: '@babel/eslint-parser',
  env: {
    browser: true,
    es2021: true,
    'jest/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:jest/recommended'],
  parserOptions: {
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
  },
  plugins: ['jest', 'react-hooks', 'react'],
  settings: {
    react: 'detect',
  },
  ignorePatterns: ['public/'],
  rules: {
    'import/no-commonjs': 0,
    'import/no-nodejs-modules': 0,
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-console': 0,
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
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    semi: ['error', 'always'],
    'react/prop-types': 'off', // TODO add prop-types later
  },
};
