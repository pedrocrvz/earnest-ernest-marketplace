module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['prettier', 'plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  plugins: ['prettier'],
  rules: {
    'no-console': 0,
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },

  parserOptions: {
    parser: 'babel-eslint',
  },
}
