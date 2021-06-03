import { Deta } from '../../src/index.node';

const projectKey = process.env.PROJECT_KEY || '';
const dbName = process.env.DB_NAME || '';

const db = Deta(projectKey).Base(dbName);

describe('Base#get', () => {
  beforeAll(async () => {
    const inputs = [
      [
        { name: 'alex', age: 77, key: 'get_one' },
        { name: 'alex', age: 77, key: 'get_one' },
      ],
    ];

    const promises = inputs.map(async (input) => {
      const [value, expected] = input;
      const data = await db.put(value);
      expect(data).toEqual(expected);
    });

    await Promise.all(promises);
  });

  afterAll(async () => {
    const inputs = [['get_one']];

    const promises = inputs.map(async (input) => {
      const [key] = input;
      const data = await db.delete(key);
      expect(data).toBeNull();
    });

    await Promise.all(promises);
  });

  it.each([
    ['get_one', { name: 'alex', age: 77, key: 'get_one' }],
    ['this is some random key', null],
  ])('get data by using key `get("%s")`', async (key, expected) => {
    const data = await db.get(key);
    expect(data).toEqual(expected);
  });

  it.each([
    ['   ', new Error('Key is empty')],
    ['', new Error('Key is empty')],
  ])('get data by using invalid key `get("%s")`', async (key, expected) => {
    try {
      const data = await db.get(key);
      expect(data).toBeNull();
    } catch (err) {
      expect(err).toEqual(expected);
    }
  });
});
