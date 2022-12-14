module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: 'google',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-console': ['warn', {allow: ['warn', 'error', 'info']}],
    'comma-dangle': 'off',
    'new-cap': ['error', {'capIsNewExceptions': ['Router', 'ObjectId']}]
  }
};
