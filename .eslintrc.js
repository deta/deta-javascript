module.exports = {
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    'no-await-in-loop': 0,
  },
};
