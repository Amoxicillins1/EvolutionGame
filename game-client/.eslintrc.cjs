module.exports = {
  root: true,
  extends: ['taro'],
  ignorePatterns: ['dist/', 'node_modules/', '*.config.js'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
  },
};
