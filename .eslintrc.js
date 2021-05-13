module.exports = {
  extends: ['airbnb-typescript/base', 'plugin:prettier/recommended'],
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  rules: {
    'import/prefer-default-export': 0,
    'class-methods-use-this': 0,
    'no-await-in-loop': 0,
    'no-constant-condition': 0,
  },
};
