module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true
  },
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  plugins: ['import'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js']
      }
    }
  },
  rules: {
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }
    ],
    'no-console': 'warn'
  }
};
