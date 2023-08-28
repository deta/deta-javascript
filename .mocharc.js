module.exports = {
  require: 'ts-node/register',
  'watch-extensions': 'ts',
  recursive: true,
  spec: ['./test/**/*.spec.ts'],
  timeout: '30000',
};
