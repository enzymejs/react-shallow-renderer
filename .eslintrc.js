'use strict';

const restrictedGlobals = require('confusing-browser-globals');

const OFF = 'off';
const ERROR = 'error';

// Files that are transformed and can use ES6/JSX.
const esNextPaths = [
  // Internal forwarding modules
  './index.js',
  // Source files
  'src/**/*.js',
  // Jest
  'scripts/jest/setupTests.js',
];

// Files that we distribute on npm that should be ES5-only.
const es5Paths = ['npm/**/*.js'];

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script',
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-console': ERROR,
    'no-empty': OFF,
    'no-restricted-globals': [ERROR, ...restrictedGlobals],
    'no-unsafe-finally': OFF,
    'no-unused-vars': [ERROR, {args: 'none'}],
    'no-useless-escape': OFF,

    // We apply these settings to files that should run on Node.
    // They can't use JSX or ES6 modules, and must be in strict mode.
    // They can, however, use other ES6 features.
    // (Note these rules are overridden later for source files.)
    'no-var': ERROR,
    strict: ERROR,
  },
  overrides: [
    {
      // We apply these settings to files that we ship through npm.
      // They must be ES5.
      files: es5Paths,
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 5,
        sourceType: 'script',
      },
      rules: {
        'no-var': OFF,
        strict: ERROR,
      },
      overrides: [
        {
          // These files are ES5 but with ESM support.
          files: ['npm/esm/**/*.js'],
          parserOptions: {
            // Although this is supposed to be 5, ESLint doesn't allow sourceType 'module' when ecmaVersion < 2015.
            // See https://github.com/eslint/eslint/issues/9687#issuecomment-508448526
            ecmaVersion: 2015,
            sourceType: 'module',
          },
        },
      ],
    },
    {
      // We apply these settings to the source files that get compiled.
      // They can use all features including JSX (but shouldn't use `var`).
      files: esNextPaths,
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      rules: {
        'no-var': ERROR,
        strict: OFF,
      },
    },
    {
      // Rollup understands ESM
      files: ['rollup.config.js'],
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
    },
    {
      files: ['**/__tests__/**/*.js', 'scripts/jest/setupTests.js'],
      env: {
        'jest/globals': true,
      },
      plugins: ['jest'],
      rules: {
        // https://github.com/jest-community/eslint-plugin-jest
        'jest/no-focused-tests': ERROR,
        'jest/valid-expect': ERROR,
        'jest/valid-expect-in-promise': ERROR,

        // React & JSX
        // This isn't useful in our test code
        'react/display-name': OFF,
        'react/jsx-key': OFF,
        'react/no-deprecated': OFF,
        'react/no-string-refs': OFF,
        'react/prop-types': OFF,
      },
    },
    {
      files: ['scripts/**/*.js', 'npm/**/*.js'],
      rules: {
        'no-console': OFF,
      },
    },
  ],
};
