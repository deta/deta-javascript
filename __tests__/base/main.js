const dotenv = require('dotenv');

beforeAll(() => {
  dotenv.config({ path: '.env.test' });
});

describe('test suite', () => {
  test('can load PROJECT_KEY', () => {
    expect(process.env.PROJECT_KEY).toBeDefined();
    expect(process.env.PROJECT_KEY.trim()).not.toEqual('');
  });
});
